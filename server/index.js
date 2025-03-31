const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'vocab_app'
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Utility function to check if tables exist
async function checkTablesExist() {
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Utility function to initialize the database schema
async function initializeDatabase() {
  try {
    const tablesExist = await checkTablesExist();
    
    if (!tablesExist) {
      console.log('Initializing database schema...');
      
      // Read the migration SQL file
      const migrationFilePath = path.join(__dirname, '..', 'src', 'services', 'postgres', 'migrations', '001_init.sql');
      const migrationSql = fs.readFileSync(migrationFilePath, 'utf8');
      
      // Execute the migration SQL
      await pool.query(migrationSql);
      
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
      const client = await pool.connect();
      try {
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
        await client.query('ROLLBACK');
        console.error('Error inserting default badges:', error);
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize the database when the server starts
initializeDatabase();

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// User API

// Create a demo user if not exists
app.post('/api/demo-user', async (req, res) => {
  try {
    // Check if demo user exists
    const demoUserCheck = await pool.query(
      "SELECT id FROM users WHERE email = 'demo@example.com' OR username = 'Demo_User'"
    );
    
    if (demoUserCheck.rows.length > 0) {
      // Demo user already exists
      return res.json({
        id: demoUserCheck.rows[0].id,
        message: 'Demo user already exists'
      });
    }
    
    // Create new demo user
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
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
      
      await client.query('COMMIT');
      
      res.json({
        id: userId,
        message: 'Demo user created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating demo user:', error);
      res.status(500).json({ error: 'Failed to create demo user' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
    res.status(500).json({ error: 'Failed to create demo user' });
  }
});

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch user data
    const userResult = await pool.query(
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
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch user badges
    const badgesResult = await pool.query(
      `SELECT b.badge_id, b.date_earned, bg.name, bg.description, bg.icon 
       FROM user_badges b 
       JOIN badges bg ON b.badge_id = bg.id 
       WHERE b.user_id = $1`,
      [userId]
    );

    // Fetch user word progress
    const wordProgressResult = await pool.query(
      `SELECT 
        wp.id, wp.word_id, wp.ease_factor, wp.interval, wp.repetitions,
        wp.next_review_date, wp.last_review_date
      FROM word_progress wp
      WHERE wp.user_id = $1`,
      [userId]
    );

    // Fetch review history for each word
    const wordsProgress = await Promise.all(
      wordProgressResult.rows.map(async (wp) => {
        const reviewHistory = await pool.query(
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

    res.json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user
app.put('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
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
      
      await client.query('COMMIT');
      
      // Get and return the updated user
      const updatedUser = await pool.query(
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
      
      res.json(updatedUser.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
