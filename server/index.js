const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Services
const db = require('./services/database');
const migrationService = require('./services/migrations');
const wordService = require('./services/word-service');
const spacedRepetitionService = require('./services/spaced-repetition-service');
const gamificationService = require('./services/gamification-service');
const userService = require('./services/user-service');

// Routes
const wordRoutes = require('./routes/words');
const reviewRoutes = require('./routes/reviews');
const gamificationRoutes = require('./routes/gamification');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize database and start server
async function initializeApp() {
  try {
    // Run migrations
    await migrationService.runMigrations();
    
    // Define default badges
    const defaultBadges = [
      {
        id: 'first_word',
        name: 'First Word',
        description: 'Learned your first word',
        icon: 'star'
      },
      {
        id: 'words_10',
        name: 'Word Collector',
        description: 'Learned 10 words',
        icon: 'book'
      },
      {
        id: 'words_50',
        name: 'Vocabulary Builder',
        description: 'Learned 50 words',
        icon: 'dictionary'
      },
      {
        id: 'words_100',
        name: 'Lexicon Master',
        description: 'Learned 100 words',
        icon: 'scroll'
      },
      {
        id: 'streak_7',
        name: 'Week Streak',
        description: 'Maintained a 7-day learning streak',
        icon: 'fire'
      },
      {
        id: 'streak_30',
        name: 'Month Streak',
        description: 'Maintained a 30-day learning streak',
        icon: 'calendar'
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
      },
      {
        id: 'all_modes',
        name: 'Learning Explorer',
        description: 'Used all learning modes',
        icon: 'compass'
      }
    ];
    
    // Ensure badges exist
    await db.transaction(async (client) => {
      for (const badge of defaultBadges) {
        await client.query(
          'INSERT INTO badges (id, name, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [badge.id, badge.name, badge.description, badge.icon]
        );
      }
    });
    
    console.log('Database initialized successfully');
    
    // Start server
    app.listen(port, () => {
      console.log(`>> API server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register route groups
app.use('/api/users', reviewRoutes);
app.use('/api/users', gamificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/words', wordRoutes);

// Demo user endpoint (direct path for easy access)
app.post('/api/demo-user', async (req, res) => {
  try {
    const demoUser = await userService.createDemoUser();
    res.json(demoUser);
  } catch (error) {
    console.error('Error creating demo user:', error);
    res.status(500).json({ error: 'Failed to create demo user' });
  }
});

// Start the application
initializeApp();
