# Vocabulary Learning App - Development Specification

## Executive Summary
A gamified vocabulary learning application built with TypeScript and React that uses spaced repetition and multiple interactive learning modes to help users master literary words. The app breaks down words into morphemes (roots, prefixes, suffixes) to deepen understanding and includes an admin panel for content management.

## Core Technologies
- **Frontend**: React with TypeScript
- **Styling**: CSS with custom variables, Tailwind CSS for admin panel
- **State Management**: React Context API + hooks
- **Routing**: React Router
- **Database**: PostgreSQL (schema provided)
- **API**: RESTful backend (Node.js/Express recommended)
- **LLM Integration**: OpenAI or Anthropic Claude API for sentence evaluation

## Application Architecture

### User-Facing Application

#### 1. Main Pages
- **Dashboard** (`/dashboard`) - User's home showing daily stats, due reviews, streak, level progress, word of the day
- **Learn** (`/learn`) - Interface for learning new words with initial exposure
- **Review** (`/review`) - Spaced repetition review session for due words
- **Profile** (`/profile`) - User statistics, badges, achievements, activity history
- **Settings** (`/settings`) - User preferences, daily goals, learning mode selection
- **Word Lab** (`/word-lab/:wordId`) - Deep dive into word construction/morphemes

#### 2. Learning Modes (Components in `/components/learning-modes/`)
All modes accept: `word: Word, onComplete: (score: 0-5, timeSpent: number) => void`

- **FlashcardMode** - Traditional front/back card (XP multiplier: 1.0)
- **ContextGuessMode** - Fill-in-blank sentences (XP multiplier: 1.2)
- **WordConnectionsMode** - Identify related words/synonyms (XP multiplier: 1.3)
- **SentenceFormationMode** - Create sentences with LLM evaluation (XP multiplier: 1.5)
- **EtymologyExplorer** - Interactive word origin visualization (XP multiplier: 1.2)
- **MorphemeBuilder** - Construct words from components (XP multiplier: 1.4)

#### 3. Core Services (`/services/`)

**SpacedRepetitionService** - Implements SM-2 algorithm
- `processReview(wordProgress, score, timeSpent, mode)` - Updates intervals, ease factor
- `initializeWordProgress(wordId)` - Creates new progress object
- `getDueWords(words, limit?)` - Returns words due for review
- Algorithm: Initial intervals 1→3→7→14→30→60+ days based on performance

**WordService** - Manages vocabulary database
- `getAllWords()`, `getWordById(id)`, `getWordsByDifficulty(level)`
- `getNewWords(count, excludeIds, maxDifficulty)` - Recommends new words based on user level
- `searchWords(query)`, `getRelatedWords(wordId, count)`

**UserProgressService** - Tracks learning journey
- `getCurrentUser()`, `updateUser(data)`, `updatePreferences(prefs)`
- `getDueWords(limit)`, `getNewWords(count)`
- `addWordToLearning(wordId)`, `recordReview(wordId, score, timeSpent, mode)`
- Persists to localStorage (for demo) or backend API
- Updates streak on each interaction

**GamificationService** - Handles XP, levels, badges
- `addExperience(user, score, mode)` - Awards XP with mode multipliers
- `updateStreak(user)` - Manages daily streaks
- `checkForBadges(user)` - Awards achievements
- `calculateUserStats(user)` - Aggregates statistics
- XP per level: [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000+]

#### 4. Data Models (`/models/`)

```typescript
interface Word {
  id: string; text: string; definition: string;
  partOfSpeech: string; pronunciation: string;
  example: string; synonyms: string[];
  difficulty: 1|2|3|4|5; etymology?: string;
}

interface UserWordProgress {
  wordId: string; easeFactor: number; interval: number;
  repetitions: number; nextReviewDate: Date; lastReviewDate: Date;
  reviewHistory: Review[];
}

interface Review {
  date: Date; score: 0|1|2|3|4|5;
  timeSpent: number; learningMode: LearningMode;
}

interface User {
  id: string; username: string;
  progress: {
    words: UserWordProgress[]; streak: number;
    lastActivity: Date; level: number;
    experience: number; badges: Badge[];
  };
  preferences: {
    dailyGoal: number; newWordsPerDay: number;
    learningModes: LearningMode[];
  };
}

enum LearningMode {
  FLASHCARD, CONTEXT_GUESS, WORD_CONNECTIONS,
  SENTENCE_FORMATION, SYNONYM_ANTONYM, DEFINITION_MATCH
}
```

### Admin Panel (`/admin`)

#### Layout Structure
- **Header**: Title, Settings button, Logout
- **Tabs**: Words | Morphemes | Etymologies | Examples | Relationships
- **Action Bar**: Search input, Filters (collapsible), View toggle (List/Grid), Add button
- **Content Area**: Table (list view) or Cards (grid view)
- **Pagination**: Previous/Next, result count

#### Words Management
**List View Features**:
- Sortable columns: Word, Part of Speech, Difficulty
- Actions: Edit (pencil icon), Delete (trash icon)
- Click-to-sort with ascending/descending indicators

**Filter Options**:
- Part of Speech: noun, verb, adjective, adverb
- Difficulty: 1-5 levels
- Origin: Latin, Greek, French, Germanic, Other

**Add/Edit Form** (Modal or separate page):
```
Basic Info:
- Word (text input)
- Part of Speech (dropdown)
- Definition (textarea)
- Pronunciation (text input, e.g., "in-SIP-id")

Etymology Section:
- Origin Language (dropdown)
- Time Period (dropdown)
- Etymology Notes (textarea)

Morphemes Section:
- List existing morphemes with color-coded type badges
- Add new morpheme: Text, Type (prefix/root/suffix/infix), Meaning, Example Words
- Remove button (×) for each morpheme

Actions: Cancel, Save Word
```

#### Morphemes Management
Similar CRUD interface for standalone morpheme management:
- List all morphemes with type, meaning, usage count
- Add/edit form: Text, Type, Meaning, Origin Language, Example words
- Show which words use each morpheme

#### Examples Management
- Associate example sentences with words
- Fields: Word (dropdown/search), Example text, Domain, Complexity level
- Mark as featured example

#### Etymologies Management
- Link etymology records to words
- Fields: Origin language, Origin word, Time period, Pathway, Notes

#### Relationships Management
- Create connections between words
- Types: synonym, antonym, hypernym, hyponym, derived_from, cognate
- Interface: Source word → Relationship type → Target word

## Visual Design System

### Color Palette
```css
--primary: #4361ee;        /* Blue - main actions */
--primary-light: #6d8aff;
--primary-dark: #2940b3;
--secondary: #7209b7;      /* Purple - secondary actions */
--success: #4caf50;        /* Green - positive feedback */
--warning: #ff9800;        /* Orange - cautions */
--danger: #f44336;         /* Red - destructive actions */

/* Morpheme Type Colors */
--prefix-color: #4285F4;   /* Blue */
--root-color: #34A853;     /* Green */
--suffix-color: #A142F4;   /* Purple */
--infix-color: #F4B400;    /* Amber */
```

### Typography
- Headings: Georgia or serif font
- Body: Segoe UI, Roboto, sans-serif
- Code/Pronunciation: Monospace
- Sizes: Base 16px, scale from 0.875rem to 2rem

### Components
- Cards: White background, border-radius 8-16px, shadow
- Buttons: Rounded 6-8px, hover states with transform/shadow
- Inputs: Border radius 6px, focus ring blue with 3px shadow
- Spacing: Consistent 0.25rem increments (4px, 8px, 16px, 24px, 48px)

## Key User Flows

### First-Time User
1. Dashboard shows 0 words, prompts to "Learn Your First Words"
2. Click Learn → Introduces 5 new words via Flashcard mode
3. After learning, prompted to review tomorrow
4. Earn "First Steps" badge

### Daily Review Flow
1. Dashboard shows X words due for review
2. Click "Start Review" → Random learning mode selected from preferences
3. Complete review → Rate recall (0-5 with tooltips)
4. Earn XP, update streak, check for new badges
5. See completion stats, return to dashboard

### Word Construction Lab
1. Click "Word Construction Lab" button on flashcard or word card
2. See word broken into morpheme blocks with color coding
3. Tap morpheme → Card slides up with details, etymology, related words
4. Interactive meaning builder shows morpheme combination
5. Word family network graph (interactive nodes)
6. Context examples carousel
7. Memory hook creation tool

## LLM Integration

### Sentence Evaluation API
```typescript
interface SentenceEvaluation {
  isCorrectUsage: boolean;
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
  contextAppropriatenessScore: number;
  grammaticalAccuracyScore: number;
  creativityScore: number;
  examples: { better: string[]; similar: string[]; }
}

// Prompt template:
Word: {word.value}
Definition: {word.definition}
User sentence: "{userSentence}"

Evaluate: correctness, grammar, appropriateness, fluency
Provide: score (0-100), detailed feedback, suggestions, examples
```

### Implementation Notes
- Cache common evaluations
- Rate limit: 10 evaluations per user per day (free tier)
- Fallback to basic evaluation if API fails
- Convert 0-100 score to 0-5 for spaced repetition

## Database Schema Summary

### Core Tables
- `words` - Vocabulary entries with pronunciation, difficulty, frequency rank
- `definitions` - Multiple definitions per word with domain/etymology links
- `morphemes` - Reusable word components with type, meaning, origin
- `word_morphemes` - Junction linking words to constituent morphemes
- `examples` - Example sentences with complexity level
- `etymologies` - Origin information with language, period, pathway

### Relationship Tables
- `word_relationships` - Links between words (synonym, antonym, etc.)
- `relationship_types` - Defines types with bidirectional flag

### User Progress Tables
- `users` - Account info with preferences JSONB
- `user_word_progress` - SRS data per word (ease factor, interval, next review)
- `user_morpheme_progress` - Familiarity level with morphemes
- `reviews` - Individual review records with score, time, mode
- `user_stats` - Aggregated statistics
- `badges`, `user_badges` - Achievement system

### Supporting Tables
- `morpheme_types` - Prefix, root, suffix, infix definitions
- `languages` - For etymological data
- `domains` - Scientific, medical, legal, etc.
- `registers` - Formal, colloquial, technical, etc.
- `concept_tags`, `morpheme_concepts` - Semantic associations

## Implementation Priorities

### Phase 1: MVP
1. Basic word database with 50-100 literary words
2. User authentication and profile
3. Flashcard learning mode
4. Basic spaced repetition (SM-2)
5. Simple dashboard with due words count
6. Admin panel for adding words

### Phase 2: Core Features
7. Additional learning modes (Context Guess, Word Connections)
8. Gamification (XP, levels, basic badges)
9. Word Construction Lab (morpheme breakdown)
10. Profile page with statistics

### Phase 3: Advanced Features
11. LLM sentence evaluation
12. Complete admin panel with all CRUD operations
13. Full badge/achievement system
14. Etymology explorer
15. Memory hook system

### Phase 4: Polish
16. Mobile responsive design
17. Animations and micro-interactions
18. Performance optimization
19. Comprehensive testing
20. Documentation

## File Structure
```
/src
  /components
    /common - Button, Card, ProgressBar, Badge, WordCard
    /learning-modes - All mode components + factory function
    /gamification - LevelProgress, Streak, BadgeCollection, Achievements
  /models - All TypeScript interfaces
  /services - Business logic services
  /pages - Main application pages
  /hooks - Custom React hooks (useSpacedRepetition, useUserProgress)
  /utils - Helper functions
  /styles - CSS files (globals.css, learning.css, dashboard.css)
  App.tsx - Main app with routing and context
  index.tsx - Entry point
```

## Testing Strategy
- Unit tests for spaced repetition algorithm
- Integration tests for user flows
- E2E tests for critical paths (learn → review → dashboard)
- Manual testing of all learning modes
- LLM evaluation testing with sample sentences

## Deployment
- Frontend: Vercel or Netlify
- Backend: Heroku, Railway, or AWS
- Database: PostgreSQL on Supabase or Railway
- Environment variables for API keys (LLM service)
