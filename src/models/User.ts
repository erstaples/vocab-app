import { UserWordProgress } from './Progress';
import { Badge } from './Badge';
import { LearningMode } from './LearningMode';

export interface User {
  id: string;
  username: string;
  progress: {
    words: UserWordProgress[];
    streak: number; // Days in a row with activity
    lastActivity: Date;
    level: number;
    experience: number;
    badges: Badge[];
  };
  preferences: {
    dailyGoal: number; // Number of words to review daily
    newWordsPerDay: number;
    learningModes: LearningMode[];
  };
}