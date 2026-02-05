// User types
export interface User {
  id: number;
  email: string;
  username: string;
  passwordHash?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  userId: number;
  dailyGoal: number;
  preferredLearningMode: LearningMode;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface UserStats {
  userId: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  wordsMastered: number;
  totalReviews: number;
  lastActivityDate: string | null;
}

// Word types
export interface Word {
  id: number;
  word: string;
  partOfSpeech: PartOfSpeech;
  pronunciation?: string;
  etymology?: string;
  difficulty: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordWithDetails extends Word {
  definitions: Definition[];
  morphemes: MorphemeWithRelation[];
}

export interface Definition {
  id: number;
  wordId: number;
  definition: string;
  exampleSentence?: string;
  isPrimary: boolean;
}

export interface Morpheme {
  id: number;
  morpheme: string;
  type: MorphemeType;
  meaning: string;
  origin?: string;
  canonicalId?: number | null;
  createdAt: Date;
}

// Morpheme with its variants loaded (for admin display)
export interface MorphemeWithVariants extends Morpheme {
  variants?: Morpheme[];
  canonical?: Morpheme; // If this is a variant, the canonical morpheme
}

export interface MorphemeWithRelation extends Morpheme {
  position: number;
}

export interface WordMorpheme {
  wordId: number;
  morphemeId: number;
  position: number;
}

// Word Family types
export interface WordFamily {
  root: {
    id: number;
    morpheme: string;
    meaning: string;
    origin: string | null;
  };
  words: WordFamilyMember[];
  wordCount: number;
}

export interface WordFamilyMember {
  id: number;
  word: string;
  partOfSpeech: string;
  definition: string;
  morphemes?: {
    morpheme: string;
    meaning: string;
    type: MorphemeType;
  }[];
}

export interface WordFamilyDetail {
  morpheme: Morpheme;
  words: {
    id: number;
    word: string;
    partOfSpeech: string;
    pronunciation: string | null;
    definition: string;
    morphemes: string;
  }[];
  relatedMorphemes: {
    id: number;
    morpheme: string;
    type: MorphemeType;
    meaning: string;
    frequency: number;
  }[];
}

// Learning progress types
export interface UserWordProgress {
  id: number;
  userId: number;
  wordId: number;
  status: WordStatus;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  lastReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  userId: number;
  wordId: number;
  rating: number; // 0-5
  responseTimeMs: number;
  learningMode: LearningMode;
  xpEarned: number;
  createdAt: Date;
}

// Gamification types
export interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  requirement: string;
  xpBonus: number;
}

export interface UserBadge {
  userId: number;
  badgeId: number;
  earnedAt: Date;
}

// Enums
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'interjection';

export type MorphemeType = 'prefix' | 'root' | 'suffix';

export type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export type LearningMode =
  | 'flashcard'
  | 'multiple_choice'
  | 'typing'
  | 'word_construction';

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

// Progress API types
export interface ReviewRequest {
  wordId: number;
  rating: number;
  responseTimeMs: number;
  learningMode: LearningMode;
}

export interface ReviewResponse {
  progress: UserWordProgress;
  xpEarned: number;
  newLevel?: number;
  newBadges?: Badge[];
}

export interface DueWordsResponse {
  words: WordWithDetails[];
  totalDue: number;
}

export interface LearnWordsResponse {
  words: WordWithDetails[];
  recommended: number;
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  10000,  // Level 11
  13000,  // Level 12
  16500,  // Level 13
  20500,  // Level 14
  25000,  // Level 15
] as const;

// XP multipliers by learning mode
export const MODE_XP_MULTIPLIERS: Record<LearningMode, number> = {
  flashcard: 1.0,
  multiple_choice: 1.2,
  typing: 1.5,
  word_construction: 2.0,
};

// Base XP for reviews
export const BASE_XP_PER_REVIEW = 10;

// Admin Dashboard Types
export interface DashboardStats {
  totalWords: number;
  totalMorphemes: number;
  totalUsers: number;
  wordsWithMorphemes: number;
  morphemeCoverage: number;
}

export interface UnlinkedWord {
  id: number;
  word: string;
  partOfSpeech: PartOfSpeech;
  difficulty: number;
  definition: string;
  createdAt: Date;
}

// AI Types
export type AIProvider = 'anthropic' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  configured: boolean;
}

export interface MorphemeBreakdown {
  word: string;
  morphemes: Array<{
    text: string;
    type: MorphemeType;
    meaning: string;
    origin?: string;
    existingId?: number;
  }>;
  etymology?: string;
}

export interface WordSuggestion {
  word: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  etymology: string;
  morphemes: Array<{
    text: string;
    type: MorphemeType;
    meaning: string;
    origin?: string;
  }>;
  exists: boolean;
}

export interface DefinitionData {
  definition: string;
  exampleSentence: string;
  etymology: string;
}

export interface WordFamilyData {
  root: {
    morpheme: string;
    meaning: string;
    origin: string;
  };
  words: Array<{
    word: string;
    partOfSpeech: PartOfSpeech;
    definition: string;
    morphemes: string[];
    exists: boolean;
  }>;
}

export interface AIGenerationLog {
  id: number;
  adminUserId: number | null;
  operationType: string;
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown> | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tokensUsed: number | null;
  provider: string | null;
  model: string | null;
  errorMessage: string | null;
  createdAt: Date;
  processedAt: Date | null;
}

// AI Preview Types (for frontend)
export interface AIPreview {
  type: 'morpheme-breakdown' | 'word-suggestions' | 'definition' | 'word-family';
  data: MorphemeBreakdown | WordSuggestion[] | DefinitionData | WordFamilyData;
  originalInput: Record<string, unknown>;
}

// Word-Morpheme Association Types
export interface WordMorphemeUpdate {
  wordId: number;
  morphemeIds: number[];
}

// Morpheme Audit Types
export interface MorphemeAuditSuggestion {
  text: string;
  type: MorphemeType;
  meaning: string;
  origin?: string;
  canonicalForm?: string;
  isVariant: boolean;
}

export interface WordAuditResult {
  wordId: number;
  word: string;
  currentMorphemes: Array<{
    id: number;
    morpheme: string;
    type: string;
    meaning: string;
    canonicalId?: number | null;
  }>;
  suggestedMorphemes: MorphemeAuditSuggestion[];
  hasDiscrepancy: boolean;
  discrepancyType?: 'missing' | 'incorrect' | 'extra' | 'order' | 'variant';
  notes?: string;
}

export interface AuditResponse {
  results: WordAuditResult[];
  total: number;
  discrepancyCount: number;
}
