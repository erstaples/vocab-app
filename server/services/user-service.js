const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./database');
const spacedRepetitionService = require('./spaced-repetition-service');
const gamificationService = require('./gamification-service');

/**
 * Service to handle user-related operations
 */
class UserService {
  /**
   * Get user by ID with all associated data
   * @param {string} userId User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async getUserById(userId) {
    try {
      // Get user basic info
      const userResult = await db.query(
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
        return null;
      }

      // Get user badges
      const badgesResult = await db.query(
        `SELECT b.badge_id, b.date_earned, bg.name, bg.description, bg.icon 
         FROM user_badges b 
         JOIN badges bg ON b.badge_id = bg.id 
         WHERE b.user_id = $1`,
        [userId]
      );

      // Get user word progress
      const wordProgressResult = await db.query(
        `SELECT 
          wp.id, wp.word_id, wp.ease_factor, wp.interval, wp.repetitions,
          wp.next_review_date, wp.last_review_date
        FROM word_progress wp
        WHERE wp.user_id = $1`,
        [userId]
      );

      // Get review history for each word
      const wordsProgress = await Promise.all(
        wordProgressResult.rows.map(async (wp) => {
          const reviewHistory = await db.query(
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
            nextReviewDate: wp.next_review_date,
            lastReviewDate: wp.last_review_date,
            reviewHistory: reviewHistory.rows.map((review) => ({
              date: review.date,
              score: review.score,
              timeSpent: review.time_spent,
              learningMode: review.learning_mode
            }))
          };
        })
      );

      // Construct and return the user object
      const userData = userResult.rows[0];
      const user = {
        id: userData.id,
        username: userData.username,
        progress: {
          words: wordsProgress,
          streak: userData.streak,
          lastActivity: userData.last_activity,
          level: userData.level,
          experience: userData.experience,
          badges: badgesResult.rows.map((badge) => ({
            id: badge.badge_id,
            name: badge.name || 'Badge',
            description: badge.description || 'A badge',
            icon: badge.icon || 'default-badge',
            dateEarned: badge.date_earned
          }))
        },
        preferences: {
          dailyGoal: userData.daily_goal,
          newWordsPerDay: userData.new_words_per_day,
          learningModes: userData.learning_modes
        }
      };

      return user;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a demo user if it doesn't exist
   * @returns {Promise<Object>} Demo user information
   */
  async createDemoUser() {
    try {
      // Check if demo user exists
      const demoUserCheck = await db.query(
        "SELECT id FROM users WHERE email = 'demo@example.com' OR username = 'Demo_User'"
      );
      
      if (demoUserCheck.rows.length > 0) {
        // Demo user already exists
        return {
          id: demoUserCheck.rows[0].id,
          message: 'Demo user already exists'
        };
      }
      
      // Create new demo user
      const userId = uuidv4();
      const passwordHash = await bcrypt.hash('password123', 10);
      
      return await db.transaction(async (client) => {
        // Insert user
        await client.query(
          'INSERT INTO users (id, email, username, password_hash) VALUES ($1, $2, $3, $4)',
          [userId, 'demo@example.com', 'Demo_User', passwordHash]
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
        
        return {
          id: userId,
          message: 'Demo user created successfully'
        };
      });
    } catch (error) {
      console.error('Error creating demo user:', error);
      throw error;
    }
  }

  /**
   * Update user data
   * @param {string} userId User ID
   * @param {Object} userData User data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, userData) {
    try {
      return await db.transaction(async (client) => {
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
          
          // Get current progress for default values
          const currentProgress = await client.query(
            'SELECT streak, level, experience, last_activity FROM user_progress WHERE user_id = $1',
            [userId]
          );
          
          if (currentProgress.rows.length === 0) {
            throw new Error('User progress not found');
          }
          
          const currentValues = currentProgress.rows[0];
          
          // Update basic progress fields
          const streak = progress.streak !== undefined ? progress.streak : currentValues.streak;
          const level = progress.level !== undefined ? progress.level : currentValues.level;
          const experience = progress.experience !== undefined ? progress.experience : currentValues.experience;
          const lastActivity = progress.lastActivity || new Date();
          
          await client.query(
            'UPDATE user_progress SET streak = $1, level = $2, experience = $3, last_activity = $4 WHERE user_id = $5',
            [streak, level, experience, lastActivity, userId]
          );
        }

        // Update preferences if provided
        if (userData.preferences) {
          const prefs = userData.preferences;
          
          // Get current preferences for default values
          const currentPrefs = await client.query(
            'SELECT daily_goal, new_words_per_day, learning_modes FROM user_preferences WHERE user_id = $1',
            [userId]
          );
          
          if (currentPrefs.rows.length === 0) {
            throw new Error('User preferences not found');
          }
          
          const currentValues = currentPrefs.rows[0];
          
          const dailyGoal = prefs.dailyGoal !== undefined ? prefs.dailyGoal : currentValues.daily_goal;
          const newWordsPerDay = prefs.newWordsPerDay !== undefined ? prefs.newWordsPerDay : currentValues.new_words_per_day;
          const learningModes = prefs.learningModes || currentValues.learning_modes;
          
          await client.query(
            'UPDATE user_preferences SET daily_goal = $1, new_words_per_day = $2, learning_modes = $3 WHERE user_id = $4',
            [dailyGoal, newWordsPerDay, learningModes, userId]
          );
        }
        
        // Get and return the updated user
        return await this.getUserById(userId);
      });
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {string} userId User ID
   * @param {Object} preferences User preferences to update
   * @returns {Promise<Object>} Updated user data
   */
  async updatePreferences(userId, preferences) {
    return this.updateUser(userId, { preferences });
  }

  /**
   * Record a review and update user accordingly
   * @param {string} userId User ID
   * @param {string} wordId Word ID
   * @param {number} score Score from the review (0-5)
   * @param {number} timeSpent Time spent on the review in ms
   * @param {string} learningMode Learning mode used
   * @returns {Promise<Object>} Updated user data
   */
  async recordReview(userId, wordId, score, timeSpent, learningMode) {
    try {
      // Process the review with spaced repetition service
      await spacedRepetitionService.processReview(
        userId,
        wordId,
        score,
        timeSpent,
        learningMode
      );
      
      // Update streak
      await gamificationService.updateStreak(userId);
      
      // Add experience points
      await gamificationService.addExperience(userId, score, learningMode);
      
      // Check for new badges
      await gamificationService.checkForBadges(userId);
      
      // Return updated user data
      return await this.getUserById(userId);
    } catch (error) {
      console.error(`Error recording review for user ${userId}, word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Reset user progress
   * @param {string} userId User ID
   * @returns {Promise<Object>} Updated user data
   */
  async resetProgress(userId) {
    try {
      return await db.transaction(async (client) => {
        // Delete user badges
        await client.query(
          'DELETE FROM user_badges WHERE user_id = $1',
          [userId]
        );
        
        // Delete word progress (review history will be deleted via cascade)
        await client.query(
          'DELETE FROM word_progress WHERE user_id = $1',
          [userId]
        );
        
        // Reset user progress
        await client.query(
          'UPDATE user_progress SET streak = 0, level = 1, experience = 0, last_activity = NOW() WHERE user_id = $1',
          [userId]
        );
        
        // Return updated user data
        return await this.getUserById(userId);
      });
    } catch (error) {
      console.error(`Error resetting progress for user ${userId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
const userService = new UserService();
module.exports = userService;