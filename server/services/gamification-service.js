const { v4: uuidv4 } = require('uuid');
const db = require('./database');

// Experience points needed per level (increases with each level)
const XP_PER_LEVEL = [
  0,      // Level 0 -> 1
  100,    // Level 1 -> 2
  250,    // Level 2 -> 3
  500,    // Level 3 -> 4
  1000,   // Level 4 -> 5
  1750,   // Level 5 -> 6
  2750,   // Level 6 -> 7
  4000,   // Level 7 -> 8
  5500,   // Level 8 -> 9
  7500,   // Level 9 -> 10
  10000,  // Level 10 -> 11
  13000,  // And so on...
  16500,
  20500,
  25000,
  30000,
  35500,
  41500,
  48000,
  55000,
];

/**
 * Service to handle gamification features
 */
class GamificationService {
  /**
   * Calculate user level based on total experience
   * @param {number} totalXp Total experience points
   * @returns {number} Current level
   */
  calculateLevel(totalXp) {
    let xpRequired = 0;
    for (let level = 0; level < XP_PER_LEVEL.length; level++) {
      xpRequired += XP_PER_LEVEL[level];
      if (totalXp < xpRequired) {
        return level;
      }
    }

    // For very high levels beyond the predefined table
    const lastDefinedLevel = XP_PER_LEVEL.length;
    const lastXpRequirement = XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
    const additionalLevels = Math.floor(
      (totalXp - xpRequired) / (lastXpRequirement * 1.2)
    );

    return lastDefinedLevel + additionalLevels;
  }

  /**
   * Calculate XP required for the next level
   * @param {number} currentLevel Current user level
   * @param {number} currentXp Current experience points
   * @returns {number} XP required to reach the next level
   */
  getXpToNextLevel(currentLevel, currentXp) {
    // Calculate total XP for current level
    let totalXpForCurrentLevel = 0;
    for (let i = 0; i < currentLevel; i++) {
      totalXpForCurrentLevel += XP_PER_LEVEL[i];
    }

    const xpForNextLevel = currentLevel < XP_PER_LEVEL.length
      ? XP_PER_LEVEL[currentLevel]
      : Math.floor(XP_PER_LEVEL[XP_PER_LEVEL.length - 1] * 1.2);

    return totalXpForCurrentLevel + xpForNextLevel - currentXp;
  }

  /**
   * Get XP multiplier for different learning modes
   * Encourages using different modes by giving slightly higher XP
   * @param {string} mode Learning mode
   * @returns {number} XP multiplier
   */
  getLearningModeMultiplier(mode) {
    switch (mode) {
      case 'FLASHCARD':
        return 1.0; // Base multiplier
      case 'CONTEXT_GUESS':
        return 1.2; // 20% bonus
      case 'WORD_CONNECTIONS':
        return 1.3; // 30% bonus
      case 'SENTENCE_FORMATION':
        return 1.5; // 50% bonus
      case 'SYNONYM_ANTONYM':
        return 1.2; // 20% bonus
      case 'DEFINITION_MATCH':
        return 1.1; // 10% bonus
      default:
        return 1.0;
    }
  }

  /**
   * Update user experience points based on learning activity
   * @param {string} userId User ID
   * @param {number} score Score from the review (0-5)
   * @param {string} mode Learning mode used
   * @returns {Promise<Object>} Updated user progress
   */
  async addExperience(userId, score, mode) {
    try {
      return await db.transaction(async (client) => {
        // Get current user progress
        const progressResult = await client.query(
          'SELECT level, experience FROM user_progress WHERE user_id = $1',
          [userId]
        );

        if (progressResult.rows.length === 0) {
          throw new Error(`User progress not found for user ${userId}`);
        }

        const { level, experience } = progressResult.rows[0];

        // Base XP for attempting a word
        let xpGained = 5;

        // Bonus XP based on score (0-15 bonus)
        xpGained += score * 3;

        // Bonus for using different learning modes (encourages variety)
        const modeMultiplier = this.getLearningModeMultiplier(mode);
        xpGained = Math.floor(xpGained * modeMultiplier);

        // Add XP to user
        const newExperience = experience + xpGained;

        // Check for level up
        const newLevel = this.calculateLevel(newExperience);

        // Update user progress
        await client.query(
          'UPDATE user_progress SET experience = $1, level = $2 WHERE user_id = $3',
          [newExperience, newLevel, userId]
        );

        // Get updated user progress
        const updatedProgress = await client.query(
          'SELECT level, experience FROM user_progress WHERE user_id = $1',
          [userId]
        );

        return {
          level: updatedProgress.rows[0].level,
          experience: updatedProgress.rows[0].experience,
          xpGained
        };
      });
    } catch (error) {
      console.error(`Error adding experience for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user streak based on last activity
   * @param {string} userId User ID
   * @returns {Promise<Object>} Updated user progress with streak information
   */
  async updateStreak(userId) {
    try {
      return await db.transaction(async (client) => {
        // Get current user progress
        const progressResult = await client.query(
          'SELECT streak, last_activity FROM user_progress WHERE user_id = $1',
          [userId]
        );

        if (progressResult.rows.length === 0) {
          throw new Error(`User progress not found for user ${userId}`);
        }

        const { streak, last_activity } = progressResult.rows[0];
        const now = new Date();
        const lastActivity = new Date(last_activity);

        // Calculate days between last activity and now
        const daysBetween = Math.floor(
          (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        let newStreak = streak;

        if (daysBetween === 0) {
          // Same day, no streak change
        } else if (daysBetween === 1) {
          // Next consecutive day, increase streak
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }

        // Update user progress
        await client.query(
          'UPDATE user_progress SET streak = $1, last_activity = $2 WHERE user_id = $3',
          [newStreak, now, userId]
        );

        return {
          streak: newStreak,
          lastActivity: now
        };
      });
    } catch (error) {
      console.error(`Error updating streak for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check for new badges earned and add them to the user
   * @param {string} userId User ID
   * @returns {Promise<Array>} Array of newly earned badges
   */
  async checkForBadges(userId) {
    try {
      return await db.transaction(async (client) => {
        // Get user's earned badges
        const badgesResult = await client.query(
          'SELECT badge_id FROM user_badges WHERE user_id = $1',
          [userId]
        );

        const earnedBadgeIds = badgesResult.rows.map(row => row.badge_id);
        const newBadges = [];

        // Helper function to check if user has a badge
        const hasBadge = (badgeId) => earnedBadgeIds.includes(badgeId);

        // Get unique words the user has learned (with score of 3 or higher)
        const learnedWordsQuery = `
          SELECT DISTINCT wp.word_id
          FROM word_progress wp
          JOIN review_history rh ON rh.word_progress_id = wp.id
          WHERE wp.user_id = $1 AND rh.score >= 3
        `;
        const learnedWordsResult = await client.query(learnedWordsQuery, [userId]);
        const uniqueWordsLearned = learnedWordsResult.rows.length;

        // Get unique learning modes used
        const usedModesQuery = `
          SELECT DISTINCT rh.learning_mode
          FROM review_history rh
          JOIN word_progress wp ON rh.word_progress_id = wp.id
          WHERE wp.user_id = $1
        `;
        const usedModesResult = await client.query(usedModesQuery, [userId]);
        const uniqueModesUsed = usedModesResult.rows.length;

        // Get user's streak
        const streakResult = await client.query(
          'SELECT streak FROM user_progress WHERE user_id = $1',
          [userId]
        );
        const userStreak = streakResult.rows[0]?.streak || 0;

        // Check for word count badges
        if (uniqueWordsLearned >= 1 && !hasBadge('first_word')) {
          await this.awardBadge(client, userId, 'first_word');
          const badgeDetails = await this.getBadgeDetails(client, 'first_word');
          newBadges.push(badgeDetails);
        }

        if (uniqueWordsLearned >= 10 && !hasBadge('words_10')) {
          await this.awardBadge(client, userId, 'words_10');
          const badgeDetails = await this.getBadgeDetails(client, 'words_10');
          newBadges.push(badgeDetails);
        }

        if (uniqueWordsLearned >= 50 && !hasBadge('words_50')) {
          await this.awardBadge(client, userId, 'words_50');
          const badgeDetails = await this.getBadgeDetails(client, 'words_50');
          newBadges.push(badgeDetails);
        }

        if (uniqueWordsLearned >= 100 && !hasBadge('words_100')) {
          await this.awardBadge(client, userId, 'words_100');
          const badgeDetails = await this.getBadgeDetails(client, 'words_100');
          newBadges.push(badgeDetails);
        }

        // Check for streak badges
        if (userStreak >= 7 && !hasBadge('streak_7')) {
          await this.awardBadge(client, userId, 'streak_7');
          const badgeDetails = await this.getBadgeDetails(client, 'streak_7');
          newBadges.push(badgeDetails);
        }

        if (userStreak >= 30 && !hasBadge('streak_30')) {
          await this.awardBadge(client, userId, 'streak_30');
          const badgeDetails = await this.getBadgeDetails(client, 'streak_30');
          newBadges.push(badgeDetails);
        }

        // Check for learning modes badge
        if (uniqueModesUsed >= 3 && !hasBadge('all_modes')) {
          await this.awardBadge(client, userId, 'all_modes');
          const badgeDetails = await this.getBadgeDetails(client, 'all_modes');
          newBadges.push(badgeDetails);
        }

        // Check for perfect score badge using most recent review
        const perfectScoreQuery = `
          SELECT COUNT(*) as perfect_reviews
          FROM review_history rh
          JOIN word_progress wp ON rh.word_progress_id = wp.id
          WHERE wp.user_id = $1 AND rh.score = 5
          AND rh.date >= CURRENT_DATE
        `;
        const perfectScoreResult = await client.query(perfectScoreQuery, [userId]);
        const perfectReviews = parseInt(perfectScoreResult.rows[0].perfect_reviews);

        if (perfectReviews > 0 && !hasBadge('perfect_score')) {
          await this.awardBadge(client, userId, 'perfect_score');
          const badgeDetails = await this.getBadgeDetails(client, 'perfect_score');
          newBadges.push(badgeDetails);
        }

        // Check for level badges
        const levelResult = await client.query(
          'SELECT level FROM user_progress WHERE user_id = $1',
          [userId]
        );
        const userLevel = levelResult.rows[0]?.level || 1;

        if (userLevel >= 5 && !hasBadge('level_5')) {
          await this.awardBadge(client, userId, 'level_5');
          const badgeDetails = await this.getBadgeDetails(client, 'level_5');
          newBadges.push(badgeDetails);
        }

        return newBadges;
      });
    } catch (error) {
      console.error(`Error checking badges for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Award a badge to a user
   * @param {Object} client Database client (for transaction)
   * @param {string} userId User ID
   * @param {string} badgeId Badge ID
   * @returns {Promise<void>}
   */
  async awardBadge(client, userId, badgeId) {
    await client.query(
      'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, badgeId]
    );
  }

  /**
   * Get badge details
   * @param {Object} client Database client (for transaction)
   * @param {string} badgeId Badge ID
   * @returns {Promise<Object>} Badge details
   */
  async getBadgeDetails(client, badgeId) {
    const result = await client.query(
      'SELECT id, name, description, icon FROM badges WHERE id = $1',
      [badgeId]
    );
    return result.rows[0];
  }

  /**
   * Get all available badges with earned status for a user
   * @param {string} userId User ID
   * @returns {Promise<Array>} Array of badges with earned status
   */
  async getUserBadges(userId) {
    try {
      // Get all available badges
      const allBadgesResult = await db.query('SELECT * FROM badges');
      const allBadges = allBadgesResult.rows;

      // Get user's earned badges
      const userBadgesResult = await db.query(
        'SELECT badge_id, date_earned FROM user_badges WHERE user_id = $1',
        [userId]
      );
      
      const userBadgesMap = {};
      userBadgesResult.rows.forEach(row => {
        userBadgesMap[row.badge_id] = row.date_earned;
      });

      // Combine the data
      return allBadges.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        earned: !!userBadgesMap[badge.id],
        dateEarned: userBadgesMap[badge.id] || null
      }));
    } catch (error) {
      console.error(`Error getting user badges for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate user statistics
   * @param {string} userId User ID
   * @returns {Promise<Object>} User statistics
   */
  async calculateUserStats(userId) {
    try {
      // Get user progress
      const progressResult = await db.query(
        'SELECT level, experience, streak, last_activity FROM user_progress WHERE user_id = $1',
        [userId]
      );

      if (progressResult.rows.length === 0) {
        throw new Error(`User progress not found for user ${userId}`);
      }

      const progress = progressResult.rows[0];

      // Get words learned count (words with at least one review with score >= 3)
      const learnedWordsQuery = `
        SELECT COUNT(DISTINCT wp.word_id) as learned_count
        FROM word_progress wp
        JOIN review_history rh ON rh.word_progress_id = wp.id
        WHERE wp.user_id = $1 AND rh.score >= 3
      `;
      const learnedWordsResult = await db.query(learnedWordsQuery, [userId]);
      const wordsLearned = parseInt(learnedWordsResult.rows[0].learned_count);

      // Get total words reviewed (words with any review)
      const reviewedWordsQuery = `
        SELECT COUNT(DISTINCT wp.word_id) as reviewed_count
        FROM word_progress wp
        JOIN review_history rh ON rh.word_progress_id = wp.id
        WHERE wp.user_id = $1
      `;
      const reviewedWordsResult = await db.query(reviewedWordsQuery, [userId]);
      const wordsReviewed = parseInt(reviewedWordsResult.rows[0].reviewed_count);

      // Get average score
      const averageScoreQuery = `
        SELECT AVG(rh.score) as average_score
        FROM review_history rh
        JOIN word_progress wp ON rh.word_progress_id = wp.id
        WHERE wp.user_id = $1
      `;
      const averageScoreResult = await db.query(averageScoreQuery, [userId]);
      const averageScore = parseFloat(averageScoreResult.rows[0].average_score) || 0;

      // Get total time spent (in minutes)
      const timeSpentQuery = `
        SELECT SUM(rh.time_spent) as total_time
        FROM review_history rh
        JOIN word_progress wp ON rh.word_progress_id = wp.id
        WHERE wp.user_id = $1
      `;
      const timeSpentResult = await db.query(timeSpentQuery, [userId]);
      const totalTimeMs = parseInt(timeSpentResult.rows[0].total_time) || 0;
      const totalTimeMinutes = Math.round(totalTimeMs / (1000 * 60));

      return {
        wordsLearned,
        wordsReviewed,
        currentStreak: progress.streak,
        // In a real app, you'd track the longest streak separately
        longestStreak: progress.streak,
        averageScore,
        totalTimeSpent: totalTimeMinutes,
        level: progress.level,
        experienceToNextLevel: this.getXpToNextLevel(progress.level, progress.experience),
        totalExperience: progress.experience
      };
    } catch (error) {
      console.error(`Error calculating user stats for user ${userId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
const gamificationService = new GamificationService();
module.exports = gamificationService;