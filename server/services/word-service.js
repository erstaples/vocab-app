const { v4: uuidv4 } = require('uuid');
const db = require('./database');

/**
 * Service to handle word-related operations
 */
class WordService {
  /**
   * Get all words with optional filtering
   * @param {Object} options Query options
   * @param {number} options.limit Maximum number of words to return
   * @param {number} options.offset Number of words to skip
   * @param {number} options.difficulty Difficulty level (1-5)
   * @returns {Promise<Array>} Array of words
   */
  async getAllWords(options = {}) {
    const { limit, offset, difficulty } = options;
    
    let query = 'SELECT * FROM words';
    const params = [];
    
    // Add difficulty filter if provided
    if (difficulty) {
      query += ' WHERE difficulty = $1';
      params.push(difficulty);
    }
    
    // Add order by
    query += ' ORDER BY value ASC';
    
    // Add pagination
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }
    
    const result = await db.query(query, params);
    return result.rows;
  }
  
  /**
   * Get a word by ID
   * @param {string} id Word ID
   * @returns {Promise<Object|null>} Word object or null if not found
   */
  async getWordById(id) {
    const result = await db.query('SELECT * FROM words WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
  
  /**
   * Get words by difficulty level
   * @param {number} level Difficulty level (1-5)
   * @param {number} limit Maximum number of words to return
   * @returns {Promise<Array>} Array of words matching the difficulty
   */
  async getWordsByDifficulty(level, limit = null) {
    let query = 'SELECT * FROM words WHERE difficulty = $1 ORDER BY value ASC';
    const params = [level];
    
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    const result = await db.query(query, params);
    return result.rows;
  }
  
  /**
   * Get new words for the user to learn
   * @param {string} userId User ID
   * @param {number} count Number of words to return
   * @param {number} maxDifficulty Maximum difficulty level
   * @returns {Promise<Array>} Array of words
   */
  async getNewWords(userId, count = 5, maxDifficulty = 5) {
    // Get the IDs of words the user already knows
    const knownWordsQuery = `
      SELECT word_id 
      FROM word_progress 
      WHERE user_id = $1
    `;
    
    const knownWordsResult = await db.query(knownWordsQuery, [userId]);
    const knownWordIds = knownWordsResult.rows.map(row => row.word_id);
    
    // Build the query to get new words
    let query = 'SELECT * FROM words WHERE difficulty <= $1';
    const params = [maxDifficulty];
    
    // Exclude known words if there are any
    if (knownWordIds.length > 0) {
      const placeholders = knownWordIds.map((_, i) => `$${i + 2}`).join(', ');
      query += ` AND id NOT IN (${placeholders})`;
      params.push(...knownWordIds);
    }
    
    // Order by random to get a diverse set of words
    query += ' ORDER BY RANDOM()';
    
    // Limit the number of words
    if (count) {
      query += ` LIMIT ${count}`;
    }
    
    const result = await db.query(query, params);
    return result.rows;
  }
  
  /**
   * Search for words
   * @param {string} query Search query
   * @param {number} limit Maximum number of results
   * @returns {Promise<Array>} Array of matching words
   */
  async searchWords(query, limit = 20) {
    const searchQuery = `
      SELECT * FROM words 
      WHERE 
        value ILIKE $1 OR 
        definition ILIKE $1 OR 
        synonyms::text ILIKE $1
      ORDER BY 
        CASE 
          WHEN value ILIKE $1 THEN 0
          WHEN definition ILIKE $1 THEN 1
          ELSE 2
        END,
        difficulty ASC,
        value ASC
      LIMIT $2
    `;
    
    const result = await db.query(searchQuery, [`%${query}%`, limit]);
    return result.rows;
  }
  
  /**
   * Get related words based on similarity
   * @param {string} wordId ID of the word to find relations for
   * @param {number} count Maximum number of related words to return
   * @returns {Promise<Array>} Array of related words
   */
  async getRelatedWords(wordId, count = 5) {
    // Get the target word first
    const wordResult = await this.getWordById(wordId);
    
    if (!wordResult) {
      return [];
    }
    
    const word = wordResult;
    
    // Get words with similar difficulty, part of speech, or synonyms
    const relatedQuery = `
      SELECT * FROM words
      WHERE id != $1
      ORDER BY
        CASE
          WHEN difficulty = $2 THEN 0
          WHEN part_of_speech = $3 THEN 1
          ELSE 2
        END,
        RANDOM()
      LIMIT $4
    `;
    
    const result = await db.query(relatedQuery, [
      wordId,
      word.difficulty,
      word.part_of_speech,
      count
    ]);
    
    return result.rows;
  }
  
  /**
   * Add a new word to the database
   * @param {Object} wordData Word data
   * @returns {Promise<Object>} Created word
   */
  async addWord(wordData) {
    // Generate ID if not provided
    const id = wordData.id || uuidv4();
    
    const columns = Object.keys(wordData)
      .filter(key => key !== 'id') // ID is handled separately
      .map(key => {
        // Convert camelCase to snake_case for PostgreSQL
        return key.replace(/([A-Z])/g, '_$1').toLowerCase();
      });
    
    const values = Object.keys(wordData)
      .filter(key => key !== 'id')
      .map(key => wordData[key]);
    
    // Create placeholders for the SQL query
    const placeholders = values.map((_, i) => `$${i + 2}`).join(', ');
    
    const query = `
      INSERT INTO words (id, ${columns.join(', ')})
      VALUES ($1, ${placeholders})
      RETURNING *
    `;
    
    const result = await db.query(query, [id, ...values]);
    return result.rows[0];
  }
  
  /**
   * Update an existing word
   * @param {string} id Word ID
   * @param {Object} wordData Updated word data
   * @returns {Promise<Object|null>} Updated word or null if not found
   */
  async updateWord(id, wordData) {
    // Check if word exists
    const existingWord = await this.getWordById(id);
    if (!existingWord) {
      return null;
    }
    
    // Prepare update fields
    const updates = Object.keys(wordData).map((key, i) => {
      // Convert camelCase to snake_case for PostgreSQL
      const column = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      return `${column} = $${i + 2}`;
    });
    
    const values = Object.values(wordData);
    
    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const query = `
      UPDATE words
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id, ...values]);
    return result.rows[0];
  }
  
  /**
   * Delete a word
   * @param {string} id Word ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteWord(id) {
    const result = await db.query('DELETE FROM words WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
  
  /**
   * Import words from a dataset
   * @param {Array<Object>} words Array of word objects
   * @returns {Promise<number>} Number of words imported
   */
  async importWords(words) {
    let importedCount = 0;
    
    await db.transaction(async (client) => {
      for (const word of words) {
        // Check if word already exists
        const existingResult = await client.query(
          'SELECT id FROM words WHERE id = $1 OR value = $2',
          [word.id, word.value]
        );
        
        if (existingResult.rows.length === 0) {
          // Convert synonyms array to PostgreSQL array if needed
          let synonyms = word.synonyms;
          if (typeof synonyms === 'string') {
            synonyms = synonyms.split(',').map(s => s.trim());
          }
          
          // Insert new word
          const columns = ['id', 'value', 'definition', 'part_of_speech', 'pronunciation', 
            'example', 'synonyms', 'difficulty', 'etymology'];
          
          const values = [
            word.id,
            word.value,
            word.definition,
            word.partOfSpeech,
            word.pronunciation,
            word.example,
            synonyms,
            word.difficulty,
            word.etymology
          ];
          
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          
          await client.query(
            `INSERT INTO words (${columns.join(', ')}) VALUES (${placeholders})`,
            values
          );
          
          importedCount++;
        }
      }
    });
    
    return importedCount;
  }
}

// Export a singleton instance
const wordService = new WordService();
module.exports = wordService;