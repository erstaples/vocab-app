const { pool } = require('./database');

/**
 * Service to handle morpheme-related operations
 */
class MorphemeService {
  /**
   * Get all morphemes
   * @returns {Promise<Array>} Array of morphemes
   */
  async getAllMorphemes() {
    try {
      const result = await pool.query(
        'SELECT * FROM morphemes ORDER BY value'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching morphemes:', error);
      throw error;
    }
  }

  /**
   * Get morphemes by type
   * @param {string} type - The type of morphemes to fetch
   * @returns {Promise<Array>} Array of morphemes of the specified type
   */
  async getMorphemesByType(type) {
    try {
      const result = await pool.query(
        'SELECT * FROM morphemes WHERE type = $1 ORDER BY value',
        [type]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching morphemes of type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Get morphemes for a specific word
   * @param {string} wordId - The ID of the word
   * @returns {Promise<Array>} Array of morphemes associated with the word
   */
  async getMorphemesForWord(wordId) {
    try {
      const result = await pool.query(
        `SELECT m.*, wm.position 
         FROM morphemes m
         JOIN word_morphemes wm ON m.id = wm.morpheme_id
         WHERE wm.word_id = $1
         ORDER BY wm.position`,
        [wordId]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching morphemes for word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Add a new morpheme
   * @param {Object} morpheme - The morpheme data
   * @returns {Promise<Object>} The created morpheme
   */
  async addMorpheme(morpheme) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO morphemes 
         (value, type, meaning, language_origin, examples)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          morpheme.value,
          morpheme.type,
          morpheme.meaning,
          morpheme.languageOrigin,
          morpheme.examples
        ]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding morpheme:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Add morphemes to a word
   * @param {string} wordId - The ID of the word
   * @param {Array} morphemes - Array of morpheme IDs and positions
   * @returns {Promise<void>}
   */
  async addMorphemesToWord(wordId, morphemes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Remove existing morpheme associations
      await client.query(
        'DELETE FROM word_morphemes WHERE word_id = $1',
        [wordId]
      );

      // Add new morpheme associations
      for (const morpheme of morphemes) {
        await client.query(
          `INSERT INTO word_morphemes 
           (word_id, morpheme_id, position)
           VALUES ($1, $2, $3)`,
          [wordId, morpheme.morphemeId, morpheme.position]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Error adding morphemes to word ${wordId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Search morphemes by value or meaning
   * @param {string} query - The search query
   * @returns {Promise<Array>} Array of matching morphemes
   */
  async searchMorphemes(query) {
    try {
      const result = await pool.query(
        `SELECT * FROM morphemes 
         WHERE value ILIKE $1 OR meaning ILIKE $1
         ORDER BY value`,
        [`%${query}%`]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error searching morphemes with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get word families for a word
   * @param {string} wordId - The ID of the word
   * @returns {Promise<Array>} Array of related words and their relationship types
   */
  async getWordFamilies(wordId) {
    try {
      const result = await pool.query(
        `SELECT w.*, wf.relationship_type
         FROM words w
         JOIN word_families wf ON w.id = wf.related_word_id
         WHERE wf.base_word_id = $1
         UNION
         SELECT w.*, wf.relationship_type
         FROM words w
         JOIN word_families wf ON w.id = wf.base_word_id
         WHERE wf.related_word_id = $1
         ORDER BY value`,
        [wordId]
      );
      return result.rows;
    } catch (error) {
      console.error(`Error fetching word families for word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Add a word family relationship
   * @param {string} baseWordId - The ID of the base word
   * @param {string} relatedWordId - The ID of the related word
   * @param {string} relationshipType - The type of relationship
   * @returns {Promise<void>}
   */
  async addWordFamilyRelationship(baseWordId, relatedWordId, relationshipType) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO word_families 
         (base_word_id, related_word_id, relationship_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (base_word_id, related_word_id) 
         DO UPDATE SET relationship_type = $3`,
        [baseWordId, relatedWordId, relationshipType]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding word family relationship:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Export a singleton instance
const morphemeService = new MorphemeService();
module.exports = morphemeService;