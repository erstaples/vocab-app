#!/usr/bin/env node

/**
 * Script to initialize the database schema
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// PostgreSQL connection config
const config = {
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'vocab_app'
};

async function initializeDatabase() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to the database...');
    await client.connect();
    
    // Check if tables already exist
    const tablesExist = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    if (tablesExist.rows[0].exists) {
      console.log('Database schema already exists.');
      return;
    }
    
    console.log('Initializing database schema...');
    
    // Read the migration SQL file
    const migrationFilePath = path.join(__dirname, '..', 'src', 'services', 'postgres', 'migrations', '001_init.sql');
    const migrationSql = fs.readFileSync(migrationFilePath, 'utf8');
    
    // Execute the migration SQL
    await client.query(migrationSql);
    
    console.log('Database schema initialized successfully.');
    
    // Insert default badges
    console.log('Inserting default badges...');
    
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
    
    // Begin transaction for badge insertion
    await client.query('BEGIN');
    
    for (const badge of defaultBadges) {
      await client.query(
        'INSERT INTO badges (id, name, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [badge.id, badge.name, badge.description, badge.icon]
      );
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('Default badges inserted successfully.');
    
  } catch (error) {
    // Rollback in case of error
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError);
    }
    
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await client.end();
  }
}

initializeDatabase();
