const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env') });

/**
 * Database service for handling PostgreSQL operations
 */
class DatabaseService {
  constructor() {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'vocab_app',
      max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
      idleTimeoutMillis: 30000
    });
    
    // Error handling for the pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    // Test database connection
    this.testConnection();
  }

  /**
   * Test the database connection
   */
  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('Database service connected to PostgreSQL');
    } catch (err) {
      console.error('Error connecting to PostgreSQL database:', err);
    }
  }

  /**
   * Execute a query on the database
   * @param {string} text SQL query text
   * @param {Array} params Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(text, params) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a query and return only the rows
   * @param {string} text SQL query text
   * @param {Array} params Query parameters
   * @returns {Promise<Array>} Query result rows
   */
  async queryRows(text, params) {
    const result = await this.query(text, params);
    return result.rows;
  }

  /**
   * Execute a query and return a single row
   * @param {string} text SQL query text
   * @param {Array} params Query parameters
   * @returns {Promise<Object|null>} Single row or null if not found
   */
  async queryRow(text, params) {
    const result = await this.query(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Execute queries within a transaction
   * @param {Function} callback Function that executes queries
   * @returns {Promise<any>} Result of the callback
   */
  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Close the database connection pool
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }
}

// Export a singleton instance
const dbService = new DatabaseService();
module.exports = dbService;