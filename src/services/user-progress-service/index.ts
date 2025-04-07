import { User, UserWordProgress, LearningMode, UserStats } from '../../models';
import apiService from '../api';

/**
 * Service to handle user progress and learning data
 * Uses API service to fetch data from backend
 */
export class UserProgressService {
  /**
   * Get the current user, creating a demo user if none exists
   * @returns Promise with current user
   */
  public async getCurrentUser(): Promise<User> {
    try {
      // Try to get the demo user (in a real app, this would be the logged-in user)
      const demoUserId = localStorage.getItem('demo_user_id');
      
      if (demoUserId) {
        return await apiService.getUserById(demoUserId);
      } else {
        // Create a demo user if none exists
        const newUser = await this.createDemoUser();
        localStorage.setItem('demo_user_id', newUser.id);
        return newUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Create a new demo user
   * @returns Promise with newly created user
   */
  private async createDemoUser(): Promise<User> {
    try {
      const response = await apiService.createDemoUser();
      const demoUserId = response.id;
      
      // Get the full user data
      const user = await apiService.getUserById(demoUserId);
      
      // Save demo user ID in localStorage for future use
      localStorage.setItem('demo_user_id', demoUserId);
      
      return user;
    } catch (error) {
      console.error('Error creating demo user:', error);
      throw error;
    }
  }

  /**
   * Update user data
   * @param userData User data to update
   * @returns Promise with updated user
   */
  public async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      const updatedUser = await apiService.updateUser(demoUserId, userData);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param preferences New preference values
   * @returns Promise with updated user
   */
  public async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      const updatedUser = await apiService.updatePreferences(demoUserId, preferences);
      return updatedUser;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Get words due for review today
   * @param limit Maximum number of words to return
   * @returns Promise with array of word progress objects and corresponding word data
   */
  public async getDueWords(limit?: number): Promise<{ progress: UserWordProgress, word: any }[]> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.getDueWords(demoUserId, limit);
    } catch (error) {
      console.error('Error getting due words:', error);
      return [];
    }
  }

  /**
   * Get new words for the user to learn (that they haven't seen before)
   * @param count Number of new words to fetch
   * @returns Promise with array of word objects
   */
  public async getNewWords(count: number = 5): Promise<any[]> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.getNewWords(demoUserId, count);
    } catch (error) {
      console.error('Error getting new words:', error);
      return [];
    }
  }

  /**
   * Add a new word to the user's learning queue
   * @param wordId ID of the word to add
   * @returns Promise with updated user object
   */
  public async addWordToLearning(wordId: number): Promise<User> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.addWordToLearning(demoUserId, wordId);
    } catch (error) {
      console.error('Error adding word to learning:', error);
      throw error;
    }
  }

  /**
   * Record a review of a word
   * @param wordId ID of the word reviewed
   * @param score Score from the review (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode Learning mode used
   * @returns Promise with updated user object
   */
  public async recordReview(
    wordId: number,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): Promise<User> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.recordReview(
        demoUserId,
        wordId,
        score,
        timeSpent,
        learningMode
      );
    } catch (error) {
      console.error('Error recording review:', error);
      throw error;
    }
  }

  /**
   * Get the most recently reviewed words
   * @param limit Maximum number of words to return
   * @returns Promise with array of word progress objects and corresponding word data
   */
  public async getRecentlyReviewedWords(limit: number = 10): Promise<{ progress: UserWordProgress, word: any }[]> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      // Since we don't have a specific API endpoint for recently reviewed words,
      // we'll fetch the user and extract the most recently reviewed words
      const user = await apiService.getUserById(demoUserId);
      
      // Sort words by last review date (most recent first)
      const sortedWords = [...user.progress.words]
        .filter(wp => wp.lastReviewDate)
        .sort((a, b) => {
          const dateA = new Date(a.lastReviewDate).getTime();
          const dateB = new Date(b.lastReviewDate).getTime();
          return dateB - dateA;
        })
        .slice(0, limit);
      
      // Fetch full word data for each progress entry
      const result = await Promise.all(
        sortedWords.map(async (progress) => {
          const word = await apiService.fetchJSON(`/words/${progress.wordId.toString()}`);
          return { progress, word };
        })
      );
      
      return result;
    } catch (error) {
      console.error('Error getting recently reviewed words:', error);
      return [];
    }
  }

  /**
   * Get user statistics
   * @returns Promise with user statistics
   */
  public async getUserStats(): Promise<UserStats> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.getUserStats(demoUserId);
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get badges with earned status
   * @returns Promise with array of badges
   */
  public async getBadges(): Promise<any[]> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.getBadges(demoUserId);
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  }

  /**
   * Reset user progress
   * @returns Promise with updated user
   */
  public async resetProgress(): Promise<User> {
    try {
      const demoUserId = localStorage.getItem('demo_user_id');
      if (!demoUserId) {
        throw new Error('No user found');
      }
      
      return await apiService.resetProgress(demoUserId);
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }

  /**
   * Export user data as JSON string
   * @returns Promise with JSON string of user data
   */
  public async exportUserData(): Promise<string> {
    try {
      const user = await this.getCurrentUser();
      return JSON.stringify(user);
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Import user data from JSON string
   * @param userData JSON string of user data
   * @returns Promise with updated user
   */
  public async importUserData(userData: string): Promise<User> {
    try {
      const data = JSON.parse(userData) as User;
      return await this.updateUser(data);
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const userProgressService = new UserProgressService();
export default userProgressService;
