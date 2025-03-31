import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dbService from '../database';
import { User, Badge } from '../../models';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Type assertion for JWT secret
const jwtSecretKey = JWT_SECRET as string;

// Password hashing configuration
const SALT_ROUNDS = 10;

/**
 * Authentication service for user management
 */
class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get the authentication service instance (Singleton pattern)
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   * @param email User email
   * @param password User password
   * @param username User display name
   * @returns Created user object
   */
  public async signup(
    email: string,
    password: string,
    username: string
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await dbService.queryOne<{ id: string }>(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate a unique ID
    const userId = uuidv4();

    // Create the user within a transaction
    return await dbService.transaction(async (client) => {
      // Insert user
      await client.query(
        'INSERT INTO users (id, email, username, password_hash) VALUES ($1, $2, $3, $4)',
        [userId, email, username, passwordHash]
      );

      // Initialize user progress
      await client.query(
        'INSERT INTO user_progress (user_id, streak, last_activity, level, experience) VALUES ($1, 0, NOW(), 1, 0)',
        [userId]
      );

      // Initialize user preferences
      await client.query(
        'INSERT INTO user_preferences (user_id, daily_goal, new_words_per_day, learning_modes) VALUES ($1, 10, 5, ARRAY[$2, $3, $4])',
        [userId, 'FLASHCARD', 'CONTEXT_GUESS', 'WORD_CONNECTIONS']
      );

      // Fetch and return the created user
      const userResult = await client.query(
        `SELECT 
          u.id, u.username, 
          up.streak, up.last_activity, up.level, up.experience,
          upref.daily_goal, upref.new_words_per_day, upref.learning_modes
        FROM users u
        JOIN user_progress up ON u.id = up.user_id
        JOIN user_preferences upref ON u.id = upref.user_id
        WHERE u.id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('Failed to create user');
      }

      const userData = userResult.rows[0];
      
      // Fetch user badges (if any)
      const badgesResult = await client.query(
        'SELECT b.badge_id, b.date_earned, bg.name, bg.description, bg.icon FROM user_badges b LEFT JOIN badges bg ON b.badge_id = bg.id WHERE b.user_id = $1',
        [userId]
      );

      // Construct the user object from the database results
      return {
        id: userData.id,
        username: userData.username,
        progress: {
          words: [],
          streak: userData.streak,
          lastActivity: new Date(userData.last_activity),
          level: userData.level,
          experience: userData.experience,
          badges: badgesResult.rows.map((row) => ({
            id: row.badge_id,
            name: row.name || 'Badge',
            description: row.description || 'A badge',
            icon: row.icon || 'default-badge',
            dateEarned: new Date(row.date_earned)
          }))
        },
        preferences: {
          dailyGoal: userData.daily_goal,
          newWordsPerDay: userData.new_words_per_day,
          learningModes: userData.learning_modes
        }
      };
    });
  }

  /**
   * Log in a user
   * @param email User email
   * @param password User password
   * @returns User object and JWT token
   */
  public async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Find the user
    const userResult = await dbService.queryOne<{
      id: string;
      password_hash: string;
    }>(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (!userResult) {
      throw new Error('Invalid email or password');
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(
      password,
      userResult.password_hash
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Get the user data
    const user = await this.getUserById(userResult.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id }, 
      jwtSecretKey, 
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    return { user, token };
  }

  /**
   * Verify a JWT token and get the user
   * @param token JWT token
   * @returns User object
   */
  public async verifyToken(token: string): Promise<User> {
    try {
      // Verify the token
      const decoded = jwt.verify(token, jwtSecretKey, {}) as { userId: string };
      
      // Get the user data
      return await this.getUserById(decoded.userId);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get a user by ID
   * @param userId User ID
   * @returns User object
   */
  public async getUserById(userId: string): Promise<User> {
    // Fetch user data
    const userResult = await dbService.queryOne<any>(
      `SELECT 
        u.id, u.username, 
        up.streak, up.last_activity, up.level, up.experience,
        upref.daily_goal, upref.new_words_per_day, upref.learning_modes
      FROM users u
      JOIN user_progress up ON u.id = up.user_id
      JOIN user_preferences upref ON u.id = upref.user_id
      WHERE u.id = $1`,
      [userId]
    );

    if (!userResult) {
      throw new Error('User not found');
    }

    // Fetch user badges
    const badgesResult = await dbService.query<Array<{ badge_id: string; date_earned: Date; name: string; description: string; icon: string }>>(
      'SELECT b.badge_id, b.date_earned, bg.name, bg.description, bg.icon FROM user_badges b LEFT JOIN badges bg ON b.badge_id = bg.id WHERE b.user_id = $1',
      [userId]
    );

    // Fetch user word progress
    interface WordProgressRecord {
      id: string;
      word_id: string;
      ease_factor: number;
      interval: number;
      repetitions: number;
      next_review_date: string;
      last_review_date: string;
    }

    // Fetch user word progress
    const wordProgressResult = await dbService.query<WordProgressRecord[]>(
      `SELECT 
        wp.id, wp.word_id, wp.ease_factor, wp.interval, wp.repetitions,
        wp.next_review_date, wp.last_review_date
      FROM word_progress wp
      WHERE wp.user_id = $1`,
      [userId]
    );

    // Fetch review history for each word
    const wordsProgress = await Promise.all(
      wordProgressResult.map(async (wp: WordProgressRecord) => {
        const reviewHistory = await dbService.query<any>(
          `SELECT 
            date, score, time_spent, learning_mode
          FROM review_history
          WHERE word_progress_id = $1
          ORDER BY date ASC`,
          [wp.id]
        );

        interface ReviewRecord {
          date: string;
          score: 0 | 1 | 2 | 3 | 4 | 5;
          time_spent: number;
          learning_mode: string;
        }

        return {
          wordId: wp.word_id,
          easeFactor: wp.ease_factor,
          interval: wp.interval,
          repetitions: wp.repetitions,
          nextReviewDate: new Date(wp.next_review_date),
          lastReviewDate: new Date(wp.last_review_date),
          reviewHistory: reviewHistory.map((review: ReviewRecord) => ({
            date: new Date(review.date),
            score: review.score,
            timeSpent: review.time_spent,
            learningMode: review.learning_mode
          }))
        };
      })
    );

    // Construct and return the user object
    return {
      id: userResult.id,
      username: userResult.username,
      progress: {
        words: wordsProgress,
        streak: userResult.streak,
        lastActivity: new Date(userResult.last_activity),
        level: userResult.level,
        experience: userResult.experience,
        badges: badgesResult.map((badge) => ({
          id: badge.badge_id,
          name: badge.name || 'Badge',
          description: badge.description || 'A badge',
          icon: badge.icon || 'default-badge',
          dateEarned: new Date(badge.date_earned)
        }))
      },
      preferences: {
        dailyGoal: userResult.daily_goal,
        newWordsPerDay: userResult.new_words_per_day,
        learningModes: userResult.learning_modes
      }
    };
  }

  /**
   * Update user password
   * @param userId User ID
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Success status
   */
  public async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Get current password hash
    const userResult = await dbService.queryOne<{ password_hash: string }>(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (!userResult) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userResult.password_hash
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update the password
    await dbService.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    return true;
  }
}

// Export a singleton instance
const authService = AuthService.getInstance();
export default authService;
