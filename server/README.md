# Vocabulary App Backend

This is the backend server for the Vocabulary App. It provides API endpoints for word management, user progress tracking, spaced repetition, and gamification features.

## Architecture

The backend follows a service-oriented architecture with clean separation of concerns:

- **API Layer**: Express.js routes that handle HTTP requests
- **Service Layer**: Business logic for each domain (words, users, spaced repetition, gamification)
- **Data Layer**: Database access using PostgreSQL

## Folder Structure

```
server/
├── migrations/         # Database schema migrations
├── routes/             # API route definitions
├── scripts/            # Utility scripts
├── services/           # Business logic services
├── index.js            # Main application entry point
├── package.json        # Dependencies
└── README.md           # This file
```

## Services

- **Database Service**: Provides database connection and query utilities
- **Word Service**: Manages vocabulary words (CRUD operations)
- **User Service**: Handles user data and preferences
- **Spaced Repetition Service**: Implements the SM-2 algorithm for learning
- **Gamification Service**: Manages badges, levels, and other gamification elements

## API Endpoints

### Word API
- `GET /api/words` - Get all words
- `GET /api/words/:id` - Get word by ID
- `GET /api/words/search` - Search words
- `GET /api/words/:id/related` - Get related words
- `POST /api/words` - Add new word
- `POST /api/words/import` - Import multiple words

### User API
- `GET /api/users/:userId` - Get user data
- `PUT /api/users/:userId` - Update user data
- `PUT /api/users/:userId/preferences` - Update preferences
- `POST /api/demo-user` - Create/get demo user

### Review API
- `GET /api/users/:userId/due-words` - Get words due for review
- `POST /api/users/:userId/reviews` - Record a review
- `GET /api/users/:userId/new-words` - Get new words to learn
- `POST /api/users/:userId/words` - Add word to learning

### Gamification API
- `GET /api/users/:userId/badges` - Get user badges
- `GET /api/users/:userId/stats` - Get user stats
- `POST /api/users/:userId/check-badges` - Check for new badges
- `POST /api/users/:userId/update-streak` - Update user streak
- `POST /api/users/:userId/reset-progress` - Reset progress

## Getting Started

1. Make sure PostgreSQL is running
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=vocab_app
   API_PORT=3001
   ```
4. Run the server:
   ```
   npm run dev
   ```
5. Import initial word data:
   ```
   node scripts/import-words.js
   ```

## Development

When adding new features:

1. Add migrations in the `migrations` folder if needed
2. Implement business logic in services
3. Create API routes that use the services
4. Register the routes in `index.js`

## Testing

Coming soon...