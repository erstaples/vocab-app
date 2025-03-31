# Persistent Layer for Vocab App

This document describes the implementation of a persistent storage layer for the vocabulary application, adding PostgreSQL database support alongside the existing localStorage implementation.

## Architecture

The system follows a hybrid approach:

1. **Dual Storage Support**: The application can use either PostgreSQL or localStorage for data persistence, controlled by an environment variable.
2. **Database Schema**: PostgreSQL tables are designed to efficiently store user information, word progress, learning history, and achievements.
3. **Authentication**: JWT-based authentication for secure user management.
4. **Fallback System**: Automatic fallback to localStorage if database operations fail.

## Components

### 1. Database Service (`src/services/database/index.ts`)

A singleton service that handles database connections and operations:
- Connection pooling for efficient database resource management
- Transaction support for atomicity
- Error handling and query helpers

### 2. Authentication Service (`src/services/auth/index.ts`) 

Manages user authentication and security:
- User registration and login
- JWT token generation and verification
- Password encryption using bcrypt
- User profile management

### 3. PostgreSQL User Progress Service (`src/services/postgres/index.ts`)

PostgreSQL-specific implementation:
- User data management (word progress, preferences, etc.)
- Badge and achievement tracking
- Learning statistics and history
- Database schema initialization

### 4. User Progress Service (`src/services/user-progress-service/index.ts`)

Facade service that abstracts the storage implementation:
- Decides whether to use PostgreSQL or localStorage based on configuration
- Provides consistent API regardless of the underlying storage
- Implements fallback to localStorage if PostgreSQL operations fail
- Handles data synchronization between systems

## Database Schema

The PostgreSQL schema includes these tables:

1. **users**: Core user information and authentication details
2. **user_progress**: User learning progress and achievements
3. **user_preferences**: User application preferences
4. **word_progress**: Progress tracking for individual words
5. **review_history**: Detailed history of learning sessions
6. **badges**: Available badges in the system
7. **user_badges**: Many-to-many relationship between users and earned badges

## Usage

### Configuration

Environment variables control the system behavior:

```
# .env file
USE_POSTGRES=true    # Use PostgreSQL (false for localStorage)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=vocab_app
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Code Example

```typescript
// The service automatically uses the right storage method
import userProgressService from '../services/user-progress-service';

// Usage is the same regardless of storage backend
async function reviewWord(wordId, score) {
  const user = await userProgressService.recordReview(
    wordId, 
    score, 
    timeSpent, 
    LearningMode.FLASHCARD
  );
  
  return user;
}
```

## Future Improvements

1. **Data Migration Tool**: Add a tool to migrate data from localStorage to PostgreSQL
2. **Multi-device Sync**: Implement sync between devices via the database
3. **Advanced Caching**: Add more sophisticated caching for frequently accessed data
4. **Offline Support**: Enhance offline capabilities with service workers and local-first data approach
