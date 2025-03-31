import { User, UserWordProgress, LearningMode, UserStats, Badge } from '../../models';
import wordService from '../word-service';
import spacedRepetitionService from '../spaced-repitition';
import gamificationService from '../gamification-service';
import postgresUserProgressService from '../postgres/index';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if the app should use Postgres
// This would typically come from an environment variable or config file
const USE_POSTGRES = process.env.USE_POSTGRES === 'true';

// In a real app, this would interact with a backend API
// For this example, we'll use localStorage for persistence if Postgres is not enabled
const STORAGE_KEY = 'vocab_app_user_data';

/**
 * Service to handle user progress and learning data
 */
export class UserProgressService {
  private currentUser: User | null = null;

  constructor() {
    if (!USE_POSTGRES) {
      this.loadUserFromStorage();
    }
  }

  /**
   * Load user data from localStorage (only used when Postgres is disabled)
   */
  private loadUserFromStorage(): void {
    if (USE_POSTGRES) return;

    try {
      const userData = localStorage.getItem(STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData) as User;

        // Parse date strings back to Date objects
        parsedUser.progress.lastActivity = new Date(parsedUser.progress.lastActivity);
        parsedUser.progress.words.forEach((word: UserWordProgress) => {
          word.nextReviewDate = new Date(word.nextReviewDate);
          word.lastReviewDate = new Date(word.lastReviewDate);
          word.reviewHistory.forEach((review: any) => {
            review.date = new Date(review.date);
          });
        });
        parsedUser.progress.badges.forEach((badge: any) => {
          badge.dateEarned = new Date(badge.dateEarned);
        });

        this.currentUser = parsedUser;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If there's an error, we'll create a new user when needed
    }
  }

  /**
   * Save user data to localStorage (only used when Postgres is disabled)
   */
  private saveUserToStorage(): void {
    if (USE_POSTGRES) return;

    if (this.currentUser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  }

  /**
   * Get the current user, creating a new one if none exists
   * @returns Current user
   */
  public async getCurrentUser(): Promise<User> {
    if (USE_POSTGRES) {
      try {
        // Try to get the demo user (in a real app, this would be the logged-in user)
        const demoUserId = localStorage.getItem('demo_user_id');
        if (demoUserId) {
          return await postgresUserProgressService.getCurrentUser(demoUserId);
        } else {
          // Create a demo user if none exists
          const newUser = await this.createDemoUser();
          localStorage.setItem('demo_user_id', newUser.id);
          return newUser;
        }
      } catch (error) {
        console.error('Error getting current user from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalCurrentUser();
      }
    } else {
      return this.getLocalCurrentUser();
    }
  }

  /**
   * Get the current user from localStorage, creating a new one if none exists
   * @returns Current user from localStorage
   */
  private getLocalCurrentUser(): User {
    if (!this.currentUser) {
      this.currentUser = this.createNewUser();
      this.saveUserToStorage();
    }
    return this.currentUser;
  }

  /**
   * Create a new demo user in the database
   * @returns Newly created user
   */
  private async createDemoUser(): Promise<User> {
    // This would typically call the auth service to create a user,
    // but for the demo we'll just create a user directly in the database
    // In a real app, this would involve proper authentication flow
    try {
      // For a real app, you would use the auth service:
      // return await authService.signup('demo@example.com', 'password', 'Demo User');
      
      // Instead, we'll create a basic user record manually
      // This is for demo purposes only
      const userId = crypto.randomUUID();
      await postgresUserProgressService.getCurrentUser(userId)
        .catch(async () => {
          // User doesn't exist, so we need to create it
          await fetch('/api/demo-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: userId,
              username: 'Demo_' + Math.floor(Math.random() * 10000),
              email: `demo_${userId}@example.com`,
              password: 'demo_password'
            })
          });
        });
      
      return await postgresUserProgressService.getCurrentUser(userId);
    } catch (error) {
      console.error('Error creating demo user:', error);
      // Fallback to local storage user if database fails
      return this.createNewUser();
    }
  }

  /**
   * Create a new user with default values (for localStorage)
   * @returns New user object
   */
  private createNewUser(): User {
    return {
      id: crypto.randomUUID(),
      username: 'User_' + Math.floor(Math.random() * 10000),
      progress: {
        words: [],
        streak: 0,
        lastActivity: new Date(),
        level: 1,
        experience: 0,
        badges: []
      },
      preferences: {
        dailyGoal: 10,
        newWordsPerDay: 5,
        learningModes: [
          LearningMode.FLASHCARD,
          LearningMode.CONTEXT_GUESS,
          LearningMode.WORD_CONNECTIONS
        ]
      }
    };
  }

  /**
   * Update user data and save
   * @param userData User data to update
   * @returns Updated user object
   */
  public async updateUser(userData: Partial<User>): Promise<User> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.updateUser(userData);
      } catch (error) {
        console.error('Error updating user in database:', error);
        // Fallback to local storage if database fails
        return this.updateLocalUser(userData);
      }
    } else {
      return this.updateLocalUser(userData);
    }
  }

  /**
   * Update user data in localStorage
   * @param userData User data to update
   * @returns Updated user object
   */
  private updateLocalUser(userData: Partial<User>): User {
    this.currentUser = {
      ...this.getLocalCurrentUser(),
      ...userData
    };
    this.saveUserToStorage();
    return this.currentUser;
  }

  /**
   * Update user preferences
   * @param preferences New preference values
   * @returns Updated user object
   */
  public async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.updatePreferences(preferences);
      } catch (error) {
        console.error('Error updating preferences in database:', error);
        // Fallback to local storage if database fails
        return this.updateLocalPreferences(preferences);
      }
    } else {
      return this.updateLocalPreferences(preferences);
    }
  }

  /**
   * Update user preferences in localStorage
   * @param preferences New preference values
   * @returns Updated user object
   */
  private updateLocalPreferences(preferences: Partial<User['preferences']>): User {
    const user = this.getLocalCurrentUser();
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };
    this.currentUser = updatedUser;
    this.saveUserToStorage();
    return updatedUser;
  }

  /**
   * Get words due for review today
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  public async getDueWords(limit?: number): Promise<{ progress: UserWordProgress, word: any }[]> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.getDueWords(demoUserId, limit);
      } catch (error) {
        console.error('Error getting due words from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalDueWords(limit);
      }
    } else {
      return this.getLocalDueWords(limit);
    }
  }

  /**
   * Get words due for review from localStorage
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  private getLocalDueWords(limit?: number): { progress: UserWordProgress, word: any }[] {
    const user = this.getLocalCurrentUser();
    const dueWordProgress = spacedRepetitionService.getDueWords(user.progress.words, limit);

    // Fetch the full word data for each progress entry
    return dueWordProgress
      .map(progress => ({
        progress,
        word: wordService.getWordById(progress.wordId)
      }))
      .filter(item => item.word !== undefined); // Filter out any words that might be missing
  }

  /**
   * Get new words for the user to learn (that they haven't seen before)
   * @param count Number of new words to fetch
   * @returns Array of word objects
   */
  public async getNewWords(count: number = 5): Promise<any[]> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.getNewWords(demoUserId, count);
      } catch (error) {
        console.error('Error getting new words from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalNewWords(count);
      }
    } else {
      return this.getLocalNewWords(count);
    }
  }

  /**
   * Get new words from localStorage
   * @param count Number of new words to fetch
   * @returns Array of word objects
   */
  private getLocalNewWords(count: number = 5): any[] {
    const user = this.getLocalCurrentUser();
    const knownWordIds = user.progress.words.map((word: UserWordProgress) => word.wordId);
    
    // Get difficulty based on user level (higher level = higher difficulty allowed)
    const maxDifficulty = Math.min(5, Math.ceil(user.progress.level / 4)) as 1 | 2 | 3 | 4 | 5;

    return wordService.getNewWords(count, knownWordIds, maxDifficulty);
  }

  /**
   * Add a new word to the user's learning queue
   * @param wordId ID of the word to add
   * @returns Updated user object
   */
  public async addWordToLearning(wordId: string): Promise<User> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.addWordToLearning(demoUserId, wordId);
      } catch (error) {
        console.error('Error adding word to learning in database:', error);
        // Fallback to local storage if database fails
        return this.addLocalWordToLearning(wordId);
      }
    } else {
      return this.addLocalWordToLearning(wordId);
    }
  }

  /**
   * Add a new word to the user's learning queue in localStorage
   * @param wordId ID of the word to add
   * @returns Updated user object
   */
  private addLocalWordToLearning(wordId: string): User {
    const user = this.getLocalCurrentUser();

    // Check if the word is already in the user's list
    if (user.progress.words.some((word: UserWordProgress) => word.wordId === wordId)) {
      return user; // Word already exists
    }

    // Initialize progress for this word
    const wordProgress = spacedRepetitionService.initializeWordProgress(wordId);

    // Add to the user's words
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        words: [...user.progress.words, wordProgress]
      }
    };

    this.currentUser = updatedUser;
    this.saveUserToStorage();
    return updatedUser;
  }

  /**
   * Record a review of a word
   * @param wordId ID of the word reviewed
   * @param score Score from the review (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode Learning mode used
   * @returns Updated user object
   */
  public async recordReview(
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): Promise<User> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.recordReview(demoUserId, wordId, score, timeSpent, learningMode);
      } catch (error) {
        console.error('Error recording review in database:', error);
        // Fallback to local storage if database fails
        return this.recordLocalReview(wordId, score, timeSpent, learningMode);
      }
    } else {
      return this.recordLocalReview(wordId, score, timeSpent, learningMode);
    }
  }

  /**
   * Record a review of a word in localStorage
   * @param wordId ID of the word reviewed
   * @param score Score from the review (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode Learning mode used
   * @returns Updated user object
   */
  private recordLocalReview(
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): User {
    let user = this.getLocalCurrentUser();

    // Find the word progress object
    const wordIndex = user.progress.words.findIndex((w: UserWordProgress) => w.wordId === wordId);

    if (wordIndex === -1) {
      // Word doesn't exist in the user's list, add it
      user = this.addLocalWordToLearning(wordId);
      return this.recordLocalReview(wordId, score, timeSpent, learningMode);
    }

    // Update the word progress using the spaced repetition algorithm
    const updatedProgress = spacedRepetitionService.processReview(
      user.progress.words[wordIndex],
      score,
      timeSpent,
      learningMode
    );

    // Update the user's word progress
    const updatedWords = [...user.progress.words];
    updatedWords[wordIndex] = updatedProgress;

    let updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        words: updatedWords
      }
    };

    // Update streak and add experience
    updatedUser = gamificationService.updateStreak(updatedUser);
    updatedUser = gamificationService.addExperience(updatedUser, score, learningMode);

    // Check for new badges
    updatedUser = gamificationService.checkForBadges(updatedUser);

    this.currentUser = updatedUser;
    this.saveUserToStorage();
    return updatedUser;
  }

  /**
   * Get the most recently reviewed words
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  public async getRecentlyReviewedWords(limit: number = 10): Promise<{ progress: UserWordProgress, word: any }[]> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.getRecentlyReviewedWords(demoUserId, limit);
      } catch (error) {
        console.error('Error getting recently reviewed words from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalRecentlyReviewedWords(limit);
      }
    } else {
      return this.getLocalRecentlyReviewedWords(limit);
    }
  }

  /**
   * Get the most recently reviewed words from localStorage
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  private getLocalRecentlyReviewedWords(limit: number = 10): { progress: UserWordProgress, word: any }[] {
    const user = this.getLocalCurrentUser();

    // Sort words by last review date (most recent first)
    const sortedWords = [...user.progress.words]
      .sort((a, b) => b.lastReviewDate.getTime() - a.lastReviewDate.getTime())
      .slice(0, limit);

    // Fetch the full word data for each progress entry
    return sortedWords
      .map((progress: UserWordProgress) => ({
        progress,
        word: wordService.getWordById(progress.wordId)
      }))
      .filter((item: any) => item.word !== undefined);
  }

  /**
   * Get statistics about the user's learning
   * @returns User statistics
   */
  public async getUserStats(): Promise<UserStats> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.getUserStats(demoUserId);
      } catch (error) {
        console.error('Error getting user stats from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalUserStats();
      }
    } else {
      return this.getLocalUserStats();
    }
  }

  /**
   * Get statistics about the user's learning from localStorage
   * @returns User statistics
   */
  private getLocalUserStats(): UserStats {
    const user = this.getLocalCurrentUser();
    return gamificationService.calculateUserStats(user);
  }

  /**
   * Get badges earned by the user and available badges
   * @returns Array of badges with earned status
   */
  public async getBadges(): Promise<any[]> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.getBadges(demoUserId);
      } catch (error) {
        console.error('Error getting badges from database:', error);
        // Fallback to local storage if database fails
        return this.getLocalBadges();
      }
    } else {
      return this.getLocalBadges();
    }
  }

  /**
   * Get badges earned by the user and available badges from localStorage
   * @returns Array of badges with earned status
   */
  private getLocalBadges(): (Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[] {
    const user = this.getLocalCurrentUser();
    return gamificationService.getAvailableBadges(user);
  }

  /**
   * Reset user progress (for testing or when requested by user)
   * @returns New user object
   */
  public async resetProgress(): Promise<User> {
    if (USE_POSTGRES) {
      try {
        const demoUserId = localStorage.getItem('demo_user_id');
        if (!demoUserId) {
          throw new Error('No demo user found');
        }
        return await postgresUserProgressService.resetProgress(demoUserId);
      } catch (error) {
        console.error('Error resetting progress in database:', error);
        // Fallback to local storage if database fails
        return this.resetLocalProgress();
      }
    } else {
      return this.resetLocalProgress();
    }
  }

  /**
   * Reset user progress in localStorage
   * @returns New user object
   */
  private resetLocalProgress(): User {
    this.currentUser = this.createNewUser();
    this.saveUserToStorage();
    return this.currentUser;
  }

  /**
   * Export user data (for backup or transfer)
   * @returns JSON string of user data
   */
  public async exportUserData(): Promise<string> {
    const user = await this.getCurrentUser();
    return JSON.stringify(user);
  }

  /**
   * Import user data (from backup or transfer)
   * @param userData JSON string of user data
   * @returns Imported user object
   */
  public async importUserData(userData: string): Promise<User> {
    try {
      const parsedUser = JSON.parse(userData) as User;

      // Validate the user data structure (basic validation)
      if (!parsedUser.id || !parsedUser.progress || !Array.isArray(parsedUser.progress.words)) {
        throw new Error('Invalid user data format');
      }

      // Convert string dates back to Date objects
      parsedUser.progress.lastActivity = new Date(parsedUser.progress.lastActivity);
      parsedUser.progress.words.forEach((word: UserWordProgress) => {
        word.nextReviewDate = new Date(word.nextReviewDate);
        word.lastReviewDate = new Date(word.lastReviewDate);
        word.reviewHistory.forEach((review: any) => {
          review.date = new Date(review.date);
        });
      });

      if (parsedUser.progress.badges) {
        parsedUser.progress.badges.forEach((badge: any) => {
          badge.dateEarned = new Date(badge.dateEarned);
        });
      }

      if (USE_POSTGRES) {
        try {
          // This would need to be implemented on the server side
          // For now, we'll just store it in localStorage
          this.currentUser = parsedUser;
          this.saveUserToStorage();
          return parsedUser;
        } catch (error) {
          console.error('Error importing user data to database:', error);
          // Fallback to local storage
          this.currentUser = parsedUser;
          this.saveUserToStorage();
          return parsedUser;
        }
      } else {
        this.currentUser = parsedUser;
        this.saveUserToStorage();
        return parsedUser;
      }
    } catch (error) {
      console.error('Error importing user data:', error);
      throw new Error('Failed to import user data. The format may be invalid.');
    }
  }
}

// Export a singleton instance
const userProgressService = new UserProgressService();
export default userProgressService;
