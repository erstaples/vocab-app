import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'vocab_app',
  max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: 30000
};

/**
 * Database service for handling PostgreSQL operations
 */
class DatabaseService {
  private pool: Pool;
  private static instance: DatabaseService;

  private constructor() {
    this.pool = new Pool(dbConfig);
    
    // Error handling for the pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  /**
   * Get the database service instance (Singleton pattern)
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Execute a query on the database
   * @param text SQL query text
   * @param params Query parameters
   * @returns Query result
   */
  public async query<T>(text: string, params?: any[]): Promise<T> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows as T;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a query and return a single row
   * @param text SQL query text
   * @param params Query parameters
   * @returns Single row or null if not found
   */
  public async queryOne<T>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T[]>(text, params);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Execute queries within a transaction
   * @param callback Function that executes queries
   * @returns Result of the callback
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
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
   * Close all database connections
   */
  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Export a singleton instance
const dbService = DatabaseService.getInstance();
export default dbService;
