import { v4 as uuidv4 } from 'uuid';
import { LearningMode, User, UserWordProgress, Review, UserStats, Badge } from '../../models';
import dbService from '../database';
import wordService from '../word-service';
import spacedRepetitionService from '../spaced-repitition';
import gamificationService from '../gamification-service';
// Import polyfills for browser environment
import fsPolyfill from '../../polyfills/fs';
import pathPolyfill from '../../polyfills/path';

// Store SQL migration content as a string for browser environments
const MIGRATION_SQL = `
-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create badges reference table
CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255) NOT NULL
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    streak INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_goal INTEGER DEFAULT 10,
    new_words_per_day INTEGER DEFAULT 5,
    learning_modes TEXT[] DEFAULT ARRAY['FLASHCARD', 'CONTEXT_GUESS', 'WORD_CONNECTIONS']
);

-- Create word progress table
CREATE TABLE IF NOT EXISTS word_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word_id VARCHAR(255) NOT NULL,
    ease_factor DECIMAL DEFAULT 2.5,
    interval INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE,
    last_review_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, word_id)
);

-- Create review history table
CREATE TABLE IF NOT EXISTS review_history (
    id UUID PRIMARY KEY,
    word_progress_id UUID REFERENCES word_progress(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score SMALLINT CHECK (score >= 0 AND score <= 5),
    time_spent INTEGER,
    learning_mode VARCHAR(50)
);

-- Create user badges table (many-to-many)
CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) REFERENCES badges(id) ON DELETE CASCADE,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_word_progress_user_id ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_next_review ON word_progress(next_review_date);
CREATE INDEX IF NOT EXISTS idx_review_history_word_progress_id ON review_history(word_progress_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
`;

// Check if we're in a Node.js environment
const isNodeEnvironment = typeof window === 'undefined';

/**
 * PostgreSQL-based user progress service
 */
class PostgresUserProgressService {
  private static instance: PostgresUserProgressService;
  private currentUser: User | null = null;

  private constructor() {
    this.initializeDatabase();
  }

  /**
   * Get the PostgreSQL user progress service instance (Singleton pattern)
   */
  public static getInstance(): PostgresUserProgressService {
    if (!PostgresUserProgressService.instance) {
      PostgresUserProgressService.instance = new PostgresUserProgressService();
    }
    return PostgresUserProgressService.instance;
  }

  /**
   * Initialize the database with the schema
   */
  private async initializeDatabase(): Promise<void> {
    try {
      // Check if tables exist
      const result = await dbService.query<Array<{ exists: boolean }>>(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
      );

      if (!result || !result[0] || !result[0].exists) {
        // If tables don't exist, run the migration
        console.log('Initializing database schema...');
        
        // In browser environments, we always use the hardcoded SQL
        // In production, this should be replaced with a proper backend solution
        const migrationSql = MIGRATION_SQL;
        
        await dbService.query(migrationSql);
        console.log('Database schema initialized');
        
        // Insert default badges
        await this.insertDefaultBadges();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  /**
   * Insert default badges into the database
   */
  private async insertDefaultBadges(): Promise<void> {
    const defaultBadges = [
      {
        id: 'first_word',
        name: 'First Word',
        description: 'Learned your first word',
        icon: 'star'
      },
      {
        id: 'streak_7',
        name: 'Week Streak',
        description: 'Maintained a 7-day learning streak',
        icon: 'fire'
      },
      {
        id: 'words_10',
        name: 'Word Collector',
        description: 'Learned 10 words',
        icon: 'book'
      },
      {
        id: 'perfect_score',
        name: 'Perfect Recall',
        description: 'Got a perfect score on a review',
        icon: 'medal'
      },
      {
        id: 'level_5',
        name: 'Novice Learner',
        description: 'Reached level 5',
        icon: 'graduate'
      }
    ];

    try {
      // Insert badges in a transaction
      await dbService.transaction(async (client) => {
        for (const badge of defaultBadges) {
          await client.query(
            'INSERT INTO badges (id, name, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
            [badge.id, badge.name, badge.description, badge.icon]
          );
        }
      });
    } catch (error) {
      console.error('Failed to insert default badges:', error);
    }
  }

  /**
   * Get the current user, creating a new one if none exists
   * @param userId User ID
   * @returns Current user
   */
  public async getCurrentUser(userId: string): Promise<User> {
    if (this.currentUser && this.currentUser.id === userId) {
      return this.currentUser;
    }

    try {
      const user = await this.getUserById(userId);
      this.currentUser = user;
      return user;
    } catch (error) {
      // If user doesn't exist or there's an error, create a new user
      throw new Error('User not found: ' + userId);
    }
  }

  /**
   * Get a user by ID
   * @param userId User ID
   * @returns User object
   */
  public async getUserById(userId: string): Promise<User> {
    try {
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
        `SELECT b.badge_id, b.date_earned, bg.name, bg.description, bg.icon 
         FROM user_badges b 
         JOIN badges bg ON b.badge_id = bg.id 
         WHERE b.user_id = $1`,
        [userId]
      );

      // Fetch user word progress
      const wordProgressResult = await dbService.query<any>(
        `SELECT 
          wp.id, wp.word_id, wp.ease_factor, wp.interval, wp.repetitions,
          wp.next_review_date, wp.last_review_date
        FROM word_progress wp
        WHERE wp.user_id = $1`,
        [userId]
      );

      // Fetch review history for each word
      const wordsProgress: UserWordProgress[] = await Promise.all(
        wordProgressResult.map(async (wp: any) => {
          const reviewHistory = await dbService.query<any>(
            `SELECT 
              date, score, time_spent, learning_mode
            FROM review_history
            WHERE word_progress_id = $1
            ORDER BY date ASC`,
            [wp.id]
          );

          return {
            wordId: wp.word_id,
            easeFactor: parseFloat(wp.ease_factor),
            interval: wp.interval,
            repetitions: wp.repetitions,
            nextReviewDate: new Date(wp.next_review_date),
            lastReviewDate: new Date(wp.last_review_date),
            reviewHistory: reviewHistory.map((review: any) => ({
              date: new Date(review.date),
              score: review.score,
              timeSpent: review.time_spent,
              learningMode: review.learning_mode as LearningMode
            }))
          };
        })
      );

      // Construct and return the user object
      const user: User = {
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
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            dateEarned: new Date(badge.date_earned)
          }))
        },
        preferences: {
          dailyGoal: userResult.daily_goal,
          newWordsPerDay: userResult.new_words_per_day,
          learningModes: userResult.learning_modes
        }
      };

      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user data
   * @param userData User data to update
   * @returns Updated user object
   */
  public async updateUser(userData: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user is currently logged in');
    }

    const userId = this.currentUser.id;

    try {
      await dbService.transaction(async (client) => {
        // Update username if provided
        if (userData.username) {
          await client.query(
            'UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2',
            [userData.username, userId]
          );
        }

        // Update progress if provided
        if (userData.progress) {
          const progress = userData.progress;
          
          // Update basic progress fields
          if (progress.streak !== undefined || progress.level !== undefined || 
              progress.experience !== undefined || progress.lastActivity !== undefined) {
            
            const streak = progress.streak !== undefined ? progress.streak : this.currentUser?.progress.streak || 0;
            const level = progress.level !== undefined ? progress.level : this.currentUser?.progress.level || 1;
            const experience = progress.experience !== undefined ? progress.experience : this.currentUser?.progress.experience || 0;
            const lastActivity = progress.lastActivity || new Date();
            
            await client.query(
              'UPDATE user_progress SET streak = $1, level = $2, experience = $3, last_activity = $4 WHERE user_id = $5',
              [streak, level, experience, lastActivity, userId]
            );
          }
        }

        // Update preferences if provided
        if (userData.preferences) {
          const prefs = userData.preferences;
          
          // Safe access to preferences with defaults
          const currentPrefs = this.currentUser?.preferences || {
            dailyGoal: 10,
            newWordsPerDay: 5,
            learningModes: [LearningMode.FLASHCARD, LearningMode.CONTEXT_GUESS, LearningMode.WORD_CONNECTIONS]
          };
          
          const dailyGoal = prefs.dailyGoal !== undefined ? prefs.dailyGoal : currentPrefs.dailyGoal;
          const newWordsPerDay = prefs.newWordsPerDay !== undefined ? prefs.newWordsPerDay : currentPrefs.newWordsPerDay;
          const learningModes = prefs.learningModes || currentPrefs.learningModes;
          
          await client.query(
            'UPDATE user_preferences SET daily_goal = $1, new_words_per_day = $2, learning_modes = $3 WHERE user_id = $4',
            [dailyGoal, newWordsPerDay, learningModes, userId]
          );
        }
      });

      // Get the updated user
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param preferences New preference values
   * @returns Updated user object
   */
  public async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user is currently logged in');
    }

    const userId = this.currentUser.id;

    try {
      const currentPrefs = this.currentUser?.preferences || {
        dailyGoal: 10,
        newWordsPerDay: 5,
        learningModes: [LearningMode.FLASHCARD, LearningMode.CONTEXT_GUESS, LearningMode.WORD_CONNECTIONS]
      };
      
      const dailyGoal = preferences.dailyGoal !== undefined ? preferences.dailyGoal : currentPrefs.dailyGoal;
      const newWordsPerDay = preferences.newWordsPerDay !== undefined ? preferences.newWordsPerDay : currentPrefs.newWordsPerDay;
      const learningModes = preferences.learningModes || currentPrefs.learningModes;
      
      await dbService.query(
        'UPDATE user_preferences SET daily_goal = $1, new_words_per_day = $2, learning_modes = $3 WHERE user_id = $4',
        [dailyGoal, newWordsPerDay, learningModes, userId]
      );

      // Get the updated user
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Get words due for review today
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  public async getDueWords(userId: string, limit?: number): Promise<{ progress: UserWordProgress, word: any }[]> {
    try {
      const user = await this.getCurrentUser(userId);
      const dueWordProgress = spacedRepetitionService.getDueWords(user.progress.words, limit);

      // Fetch the full word data for each progress entry
      return dueWordProgress
        .map(progress => ({
          progress,
          word: wordService.getWordById(progress.wordId)
        }))
        .filter(item => item.word !== undefined); // Filter out any words that might be missing
    } catch (error) {
      console.error('Error getting due words:', error);
      throw error;
    }
  }

  /**
   * Get new words for the user to learn (that they haven't seen before)
   * @param userId User ID
   * @param count Number of new words to fetch
   * @returns Array of word objects
   */
  public async getNewWords(userId: string, count: number = 5): Promise<any[]> {
    try {
      const user = await this.getCurrentUser(userId);
      const knownWordIds = user.progress.words.map(word => word.wordId);
      
      // Get difficulty based on user level (higher level = higher difficulty allowed)
      const maxDifficulty = Math.min(5, Math.ceil(user.progress.level / 4)) as 1 | 2 | 3 | 4 | 5;

      return wordService.getNewWords(count, knownWordIds, maxDifficulty);
    } catch (error) {
      console.error('Error getting new words:', error);
      throw error;
    }
  }

  /**
   * Add a new word to the user's learning queue
   * @param userId User ID
   * @param wordId ID of the word to add
   * @returns Updated user object
   */
  public async addWordToLearning(userId: string, wordId: string): Promise<User> {
    try {
      const user = await this.getCurrentUser(userId);

      // Check if the word is already in the user's list
      if (user.progress.words.some(word => word.wordId === wordId)) {
        return user; // Word already exists
      }

      // Initialize progress for this word
      const wordProgress = spacedRepetitionService.initializeWordProgress(wordId);
      const wordProgressId = uuidv4();

      // Add to the database
      await dbService.query(
        `INSERT INTO word_progress 
          (id, user_id, word_id, ease_factor, interval, repetitions, next_review_date, last_review_date) 
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          wordProgressId,
          userId,
          wordId,
          wordProgress.easeFactor,
          wordProgress.interval,
          wordProgress.repetitions,
          wordProgress.nextReviewDate,
          wordProgress.lastReviewDate
        ]
      );

      // Get the updated user
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error adding word to learning:', error);
      throw error;
    }
  }

  /**
   * Record a review of a word
   * @param userId User ID
   * @param wordId ID of the word reviewed
   * @param score Score from the review (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode Learning mode used
   * @returns Updated user object
   */
  public async recordReview(
    userId: string,
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): Promise<User> {
    try {
      let user = await this.getCurrentUser(userId);

      // Find the word progress object
      const wordProgressIndex = user.progress.words.findIndex(w => w.wordId === wordId);

      if (wordProgressIndex === -1) {
        // Word doesn't exist in the user's list, add it
        user = await this.addWordToLearning(userId, wordId);
        return this.recordReview(userId, wordId, score, timeSpent, learningMode);
      }

      // Get the current word progress
      const currentWordProgress = user.progress.words[wordProgressIndex];

      // Update the word progress using the spaced repetition algorithm
      const updatedProgress = spacedRepetitionService.processReview(
        currentWordProgress,
        score,
        timeSpent,
        learningMode
      );

      // Start a transaction to ensure all updates are atomic
      await dbService.transaction(async (client) => {
        // Get the database ID for this word progress
        const wpResult = await client.query<{ id: string }>(
          'SELECT id FROM word_progress WHERE user_id = $1 AND word_id = $2',
          [userId, wordId]
        );

        if (wpResult.rows.length === 0) {
          throw new Error(`Word progress not found for word: ${wordId}`);
        }

        const wordProgressId = wpResult.rows[0].id;

        // Update the word progress
        await client.query(
          `UPDATE word_progress 
          SET ease_factor = $1, interval = $2, repetitions = $3, next_review_date = $4, last_review_date = $5
          WHERE id = $6`,
          [
            updatedProgress.easeFactor,
            updatedProgress.interval,
            updatedProgress.repetitions,
            updatedProgress.nextReviewDate,
            updatedProgress.lastReviewDate,
            wordProgressId
          ]
        );

        // Add the review record
        const reviewId = uuidv4();
        await client.query(
          `INSERT INTO review_history (id, word_progress_id, date, score, time_spent, learning_mode)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [reviewId, wordProgressId, new Date(), score, timeSpent, learningMode]
        );

        // Update streak and add experience
        const updatedUser = gamificationService.updateStreak(user);
        const userWithExp = gamificationService.addExperience(updatedUser, score, learningMode);

        // Update user progress
        await client.query(
          `UPDATE user_progress 
          SET streak = $1, level = $2, experience = $3, last_activity = $4
          WHERE user_id = $5`,
          [
            userWithExp.progress.streak,
            userWithExp.progress.level,
            userWithExp.progress.experience,
            userWithExp.progress.lastActivity,
            userId
          ]
        );

        // Check for new badges
        const userWithBadges = gamificationService.checkForBadges(userWithExp);
        
        // Add any new badges
        const newBadges = userWithBadges.progress.badges.filter(
          newBadge => !user.progress.badges.some(existingBadge => existingBadge.id === newBadge.id)
        );

        for (const badge of newBadges) {
          await client.query(
            'INSERT INTO user_badges (user_id, badge_id, date_earned) VALUES ($1, $2, $3)',
            [userId, badge.id, badge.dateEarned]
          );
        }
      });

      // Get the updated user with all changes
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error recording review:', error);
      throw error;
    }
  }

  /**
   * Get the most recently reviewed words
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  public async getRecentlyReviewedWords(
    userId: string,
    limit: number = 10
  ): Promise<{ progress: UserWordProgress, word: any }[]> {
    try {
      const user = await this.getCurrentUser(userId);

      // Sort words by last review date (most recent first)
      const sortedWords = [...user.progress.words]
        .sort((a, b) => b.lastReviewDate.getTime() - a.lastReviewDate.getTime())
        .slice(0, limit);

      // Fetch the full word data for each progress entry
      return sortedWords
        .map(progress => ({
          progress,
          word: wordService.getWordById(progress.wordId)
        }))
        .filter(item => item.word !== undefined);
    } catch (error) {
      console.error('Error getting recently reviewed words:', error);
      throw error;
    }
  }

  /**
   * Get statistics about the user's learning
   * @param userId User ID
   * @returns User statistics
   */
  public async getUserStats(userId: string): Promise<UserStats> {
    try {
      const user = await this.getCurrentUser(userId);
      return gamificationService.calculateUserStats(user);
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get badges earned by the user and available badges
   * @param userId User ID
   * @returns Array of badges with earned status
   */
  public async getBadges(userId: string): Promise<Badge[]> {
    try {
      const user = await this.getCurrentUser(userId);
      // Convert the available badges to the Badge format
      const availableBadges = gamificationService.getAvailableBadges(user);
      
      // Convert to proper Badge format (ensuring dateEarned exists)
      return availableBadges.map(badge => {
        if ('earned' in badge) {
          // This is an available badge that hasn't been earned yet
          // We need to convert it to a Badge format
          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            dateEarned: new Date(0) // Use a default date for unearned badges
          } as Badge;
        }
        // This is already a Badge
        return badge as Badge;
      });
    } catch (error) {
      console.error('Error getting badges:', error);
      throw error;
    }
  }

  /**
   * Reset user progress (for testing or when requested by user)
   * @param userId User ID
   * @returns Updated user object
   */
  public async resetProgress(userId: string): Promise<User> {
    try {
      await dbService.transaction(async (client) => {
        // Delete all word progress and review history
        await client.query('DELETE FROM word_progress WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM user_badges WHERE user_id = $1', [userId]);
        
        // Reset user progress
        await client.query(
          `UPDATE user_progress 
          SET streak = 0, level = 1, experience = 0, last_activity = NOW()
          WHERE user_id = $1`,
          [userId]
        );
      });

      // Get the updated user
      return await this.getUserById(userId);
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const postgresUserProgressService = PostgresUserProgressService.getInstance();
export default postgresUserProgressService;
