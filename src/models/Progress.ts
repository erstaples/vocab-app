import { LearningMode } from './LearningMode';

export interface UserWordProgress {
  wordId: string;
  easeFactor: number; // SM-2 algorithm parameter
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews in a row
  nextReviewDate: Date;
  lastReviewDate: Date;
  reviewHistory: Review[];
}

export interface Review {
  date: Date;
  score: 0 | 1 | 2 | 3 | 4 | 5; // 0-5 scale, 0 being complete failure, 5 being perfect recall
  timeSpent: number; // Time in ms spent on this review
  learningMode: LearningMode;
}

export interface UserStats {
  wordsLearned: number;
  wordsReviewed: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  level: number;
  experienceToNextLevel: number;
  totalExperience: number;
}