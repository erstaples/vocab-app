#!/usr/bin/env node

/**
 * Script to create a demo user in the database to test the application
 */

const { Client } = require('pg');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

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

async function createDemoUser() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to the database...');
    await client.connect();
    
    // Check if tables exist
    const tablesExist = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    if (!tablesExist.rows[0].exists) {
      console.error('Database tables do not exist. Please initialize the database schema first.');
      process.exit(1);
    }
    
    // Check if demo user already exists
    const demoUserExists = await client.query(
      "SELECT id FROM users WHERE email = 'demo@example.com' OR username = 'Demo_User'"
    );
    
    if (demoUserExists.rows.length > 0) {
      console.log(`Demo user already exists with ID: ${demoUserExists.rows[0].id}`);
      console.log('You can use this ID in localStorage: localStorage.setItem("demo_user_id", "' + demoUserExists.rows[0].id + '")');
      return;
    }
    
    // Start a transaction
    await client.query('BEGIN');
    
    // Create demo user
    const userId = randomUUID();
    const passwordHash = await bcrypt.hash('password123', 10);
    
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
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log(`Demo user created successfully with ID: ${userId}`);
    console.log('Add the ID to localStorage with: localStorage.setItem("demo_user_id", "' + userId + '")');
    
  } catch (error) {
    // Rollback in case of error
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError);
    }
    
    console.error('Error creating demo user:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await client.end();
  }
}

createDemoUser();
