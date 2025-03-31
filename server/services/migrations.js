const fs = require('fs');
const path = require('path');
const db = require('./database');

/**
 * Database migration service
 */
class MigrationService {
  /**
   * Run all database migrations in order
   */
  async runMigrations() {
    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();
      
      // Get all migration files
      const migrationsDir = path.join(__dirname, '..', 'migrations');
      const frontendMigrationsDir = path.join(__dirname, '..', '..', 'src', 'services', 'postgres', 'migrations');
      
      // Combine migrations from both directories
      const migrationFiles = [];
      
      // Get migrations from server directory
      if (fs.existsSync(migrationsDir)) {
        const serverMigrations = fs.readdirSync(migrationsDir)
          .filter(file => file.endsWith('.sql'))
          .map(file => ({
            file,
            path: path.join(migrationsDir, file)
          }));
        migrationFiles.push(...serverMigrations);
      }
      
      // Get migrations from frontend directory (for backward compatibility)
      if (fs.existsSync(frontendMigrationsDir)) {
        const frontendMigrations = fs.readdirSync(frontendMigrationsDir)
          .filter(file => file.endsWith('.sql'))
          .map(file => ({
            file,
            path: path.join(frontendMigrationsDir, file)
          }));
        migrationFiles.push(...frontendMigrations);
      }
      
      // Sort migration files by name
      migrationFiles.sort((a, b) => a.file.localeCompare(b.file));
      
      // Get already executed migrations
      const executedMigrations = await this.getExecutedMigrations();
      
      // Run pending migrations
      for (const migration of migrationFiles) {
        if (!executedMigrations.includes(migration.file)) {
          console.log(`Running migration: ${migration.file}`);
          const sql = fs.readFileSync(migration.path, 'utf8');
          await db.query(sql);
          
          // Record migration
          await this.recordMigration(migration.file);
          console.log(`Migration completed: ${migration.file}`);
        } else {
          console.log(`Migration already executed: ${migration.file}`);
        }
      }
      
      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }
  
  /**
   * Create migrations table if it doesn't exist
   */
  async createMigrationsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await db.query(sql);
  }
  
  /**
   * Get list of already executed migrations
   */
  async getExecutedMigrations() {
    const result = await db.query('SELECT name FROM migrations ORDER BY id');
    return result.rows.map(row => row.name);
  }
  
  /**
   * Record a migration as executed
   */
  async recordMigration(name) {
    await db.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
  }
}

// Export a singleton instance
const migrationService = new MigrationService();
module.exports = migrationService;