const { v4: uuidv4 } = require('uuid');
const db = require('./database');

/**
 * Implementation of the SuperMemo SM-2 algorithm for spaced repetition
 * https://en.wikipedia.org/wiki/SuperMemo#Algorithm_SM-2
 */
class SpacedRepetitionService {
  // Constants used in the SM-2 algorithm
  static MIN_EASE_FACTOR = 1.3;
  static INITIAL_EASE_FACTOR = 2.5;

  /**
   * Get words due for review for a user
   * @param {string} userId User ID
   * @param {number} limit Maximum number of words to return
   * @returns {Promise<Array>} Array of word progress objects due for review with word details
   */
  async getDueWords(userId, limit = null) {
    const now = new Date();
    
    // Query to get word progress entries due for review with word details
    let query = `
      SELECT 
        wp.id as progress_id, 
        wp.user_id, 
        wp.word_id, 
        wp.ease_factor, 
        wp.interval, 
        wp.repetitions,
        wp.next_review_date, 
        wp.last_review_date,
        w.value, 
        w.definition, 
        w.part_of_speech, 
        w.pronunciation,
        w.example, 
        w.synonyms, 
        w.difficulty, 
        w.etymology
      FROM word_progress wp
      JOIN words w ON wp.word_id = w.id
      WHERE wp.user_id = $1 AND wp.next_review_date <= $2
      ORDER BY wp.next_review_date ASC
    `;
    
    const params = [userId, now];
    
    // Add limit if specified
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    // Execute query
    const result = await db.query(query, params);
    
    // Transform results to match expected format
    return result.rows.map(row => {
      // Separate word data from progress data
      const { 
        progress_id, user_id, word_id, ease_factor, interval, 
        repetitions, next_review_date, last_review_date,
        ...wordData
      } = row;
      
      return {
        progress: {
          id: progress_id,
          userId: user_id,
          wordId: word_id,
          easeFactor: parseFloat(ease_factor),
          interval,
          repetitions,
          nextReviewDate: next_review_date,
          lastReviewDate: last_review_date
        },
        word: wordData
      };
    });
  }

  /**
   * Initialize a new word progress object
   * @param {string} userId User ID
   * @param {string} wordId Word ID
   * @returns {Promise<Object>} New word progress object
   */
  async initializeWordProgress(userId, wordId) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const id = uuidv4();
    
    const query = `
      INSERT INTO word_progress (
        id, user_id, word_id, ease_factor, interval, 
        repetitions, next_review_date, last_review_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, word_id) DO NOTHING
      RETURNING *
    `;
    
    const params = [
      id,
      userId,
      wordId,
      SpacedRepetitionService.INITIAL_EASE_FACTOR,
      0,
      0,
      tomorrow,
      now
    ];
    
    const result = await db.query(query, params);
    
    // If there was a conflict (word already exists), get the existing record
    if (result.rows.length === 0) {
      const existingResult = await db.query(
        'SELECT * FROM word_progress WHERE user_id = $1 AND word_id = $2',
        [userId, wordId]
      );
      
      return existingResult.rows[0];
    }
    
    return result.rows[0];
  }

  /**
   * Process a review and update word progress
   * @param {string} userId User ID
   * @param {string} wordId Word ID
   * @param {number} score Score from the review (0-5)
   * @param {number} timeSpent Time spent on the review in ms
   * @param {string} learningMode Learning mode used
   * @returns {Promise<Object>} Updated word progress
   */
  async processReview(userId, wordId, score, timeSpent, learningMode) {
    // Validate score
    if (score < 0 || score > 5) {
      throw new Error('Score must be between 0 and 5');
    }
    
    // Ensure timeSpent is a number
    timeSpent = parseInt(timeSpent) || 0;
    
    return await db.transaction(async (client) => {
      // Get current word progress or initialize if it doesn't exist
      let wordProgress = await client.query(
        'SELECT * FROM word_progress WHERE user_id = $1 AND word_id = $2',
        [userId, wordId]
      );
      
      let progressId;
      
      // If word progress doesn't exist, initialize it
      if (wordProgress.rows.length === 0) {
        const newProgress = await this.initializeWordProgress(userId, wordId);
        progressId = newProgress.id;
        wordProgress = await client.query(
          'SELECT * FROM word_progress WHERE id = $1',
          [progressId]
        );
      } else {
        progressId = wordProgress.rows[0].id;
      }
      
      const progress = wordProgress.rows[0];
      const now = new Date();
      
      // Create a new review entry
      const reviewId = uuidv4();
      await client.query(
        `INSERT INTO review_history 
          (id, word_progress_id, date, score, time_spent, learning_mode) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reviewId, progressId, now, score, timeSpent, learningMode]
      );
      
      // Update the word progress based on the algorithm
      let newInterval = progress.interval;
      let newRepetitions = progress.repetitions;
      let newEaseFactor = parseFloat(progress.ease_factor);
      
      // Update last review date
      await client.query(
        'UPDATE word_progress SET last_review_date = $1 WHERE id = $2',
        [now, progressId]
      );
      
      // If the score is less than 3, we consider it a failure and reset the intervals
      if (score < 3) {
        newRepetitions = 0;
        newInterval = 1;
      } else {
        // Calculate the new interval based on the algorithm
        newInterval = this.calculateNewInterval(newInterval, newRepetitions);
        newRepetitions = newRepetitions + 1;
      }
      
      // Calculate the new ease factor
      newEaseFactor = this.calculateNewEaseFactor(newEaseFactor, score);
      
      // Calculate the next review date
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
      
      // Update the word progress
      await client.query(
        `UPDATE word_progress 
         SET ease_factor = $1, interval = $2, repetitions = $3, next_review_date = $4 
         WHERE id = $5`,
        [newEaseFactor, newInterval, newRepetitions, nextReviewDate, progressId]
      );
      
      // Get the updated word progress
      const updatedProgress = await client.query(
        'SELECT * FROM word_progress WHERE id = $1',
        [progressId]
      );
      
      return updatedProgress.rows[0];
    });
  }

  /**
   * Calculate the new interval based on the algorithm
   * @param {number} currentInterval Current interval in days
   * @param {number} repetitions Number of successful reviews
   * @returns {number} New interval in days
   */
  calculateNewInterval(currentInterval, repetitions) {
    if (repetitions === 0) {
      return 1; // First successful review - 1 day
    } else if (repetitions === 1) {
      return 6; // Second successful review - 6 days
    } else {
      // For subsequent successful reviews, multiply the current interval by the ease factor
      return Math.round(currentInterval * 1.5);
    }
  }

  /**
   * Calculate the new ease factor based on the quality of the response
   * @param {number} currentEaseFactor Current ease factor
   * @param {number} score Quality of the response (0-5)
   * @returns {number} New ease factor
   */
  calculateNewEaseFactor(currentEaseFactor, score) {
    // SM-2 algorithm formula for ease factor adjustment
    const newEaseFactor = currentEaseFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    
    // Ensure ease factor doesn't go below the minimum
    return Math.max(SpacedRepetitionService.MIN_EASE_FACTOR, newEaseFactor);
  }

  /**
   * Get review history for a word
   * @param {string} userId User ID
   * @param {string} wordId Word ID
   * @returns {Promise<Array>} Review history
   */
  async getWordReviewHistory(userId, wordId) {
    const query = `
      SELECT rh.date, rh.score, rh.time_spent, rh.learning_mode
      FROM review_history rh
      JOIN word_progress wp ON rh.word_progress_id = wp.id
      WHERE wp.user_id = $1 AND wp.word_id = $2
      ORDER BY rh.date ASC
    `;
    
    const result = await db.query(query, [userId, wordId]);
    
    return result.rows.map(row => ({
      date: row.date,
      score: row.score,
      timeSpent: row.time_spent,
      learningMode: row.learning_mode
    }));
  }

  /**
   * Get word progress for a specific word and user
   * @param {string} userId User ID
   * @param {string} wordId Word ID
   * @returns {Promise<Object|null>} Word progress or null if not found
   */
  async getWordProgress(userId, wordId) {
    const query = `
      SELECT * FROM word_progress
      WHERE user_id = $1 AND word_id = $2
    `;
    
    const result = await db.query(query, [userId, wordId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

// Export a singleton instance
const spacedRepetitionService = new SpacedRepetitionService();
module.exports = spacedRepetitionService;