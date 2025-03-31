/**
 * API service for communicating with the backend server
 * This handles all the communication with the PostgreSQL database
 * via the API server instead of trying to use the pg module directly
 * in the browser environment.
 */

import { User, LearningMode } from '../../models';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * API service for handling backend server requests
 */
class ApiService {
  private static instance: ApiService;

  private constructor() {}

  /**
   * Get the API service instance (Singleton pattern)
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Helper method to make fetch requests
   * @param url API endpoint URL
   * @param options Fetch options
   * @returns Fetch response data
   */
  /**
   * Helper method to make fetch requests
   * @param url API endpoint URL
   * @param options Fetch options
   * @returns Fetch response data
   */
  public async fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  /**
   * Check API health
   * @returns Health status
   */
  public async checkHealth(): Promise<{ status: string }> {
    return this.fetchJSON<{ status: string }>('/health');
  }

  /**
   * Create or get a demo user for testing
   * @returns Demo user data
   */
  public async createDemoUser(): Promise<{ id: string; message: string }> {
    return this.fetchJSON<{ id: string; message: string }>('/demo-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns User object
   */
  public async getUserById(userId: string): Promise<User> {
    return this.fetchJSON<User>(`/users/${userId}`);
  }

  /**
   * Update user data
   * @param userId User ID
   * @param userData User data to update
   * @returns Updated user data
   */
  public async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return this.fetchJSON<User>(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  }

  /**
   * Update user preferences
   * @param userId User ID
   * @param preferences User preferences to update
   * @returns Updated user data
   */
  public async updatePreferences(userId: string, preferences: Partial<User['preferences']>): Promise<User> {
    // Need to pass preferences as a property of an object that conforms to Partial<User>
    return this.updateUser(userId, { preferences: preferences as any });
  }

  /**
   * Get words due for review
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects and corresponding word data
   */
  public async getDueWords(userId: string, limit?: number): Promise<any[]> {
    try {
      const queryParams = limit ? `?limit=${limit}` : '';
      return this.fetchJSON<any[]>(`/users/${userId}/due-words${queryParams}`);
    } catch (error) {
      console.error('Error getting due words:', error);
      throw error;
    }
  }

  /**
   * Get new words for the user to learn
   * @param userId User ID
   * @param count Number of new words to fetch
   * @returns Array of word objects
   */
  public async getNewWords(userId: string, count: number = 5, maxDifficulty?: number): Promise<any[]> {
    try {
      let queryParams = `?count=${count}`;
      if (maxDifficulty) {
        queryParams += `&maxDifficulty=${maxDifficulty}`;
      }
      return this.fetchJSON<any[]>(`/users/${userId}/new-words${queryParams}`);
    } catch (error) {
      console.error('Error getting new words:', error);
      throw error;
    }
  }

  /**
   * Add a word to the user's learning queue
   * @param userId User ID
   * @param wordId ID of the word to add
   * @returns Updated user object
   */
  public async addWordToLearning(userId: string, wordId: string): Promise<any> {
    try {
      return this.fetchJSON<any>(`/users/${userId}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wordId })
      });
    } catch (error) {
      console.error('Error adding word to learning:', error);
      throw error;
    }
  }

  /**
   * Record a review of a word
   * @param userId User ID
   * @param wordId ID of the word reviewed
   * @param score Score from the review (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode Learning mode used
   * @returns Updated user object
   */
  public async recordReview(
    userId: string,
    wordId: string,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: string
  ): Promise<any> {
    try {
      return this.fetchJSON<any>(`/users/${userId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wordId,
          score,
          timeSpent,
          learningMode
        })
      });
    } catch (error) {
      console.error('Error recording review:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @param userId User ID
   * @returns User statistics
   */
  public async getUserStats(userId: string): Promise<any> {
    return this.fetchJSON<any>(`/users/${userId}/stats`);
  }

  /**
   * Get badges earned by the user
   * @param userId User ID
   * @returns Array of badges with earned status
   */
  public async getBadges(userId: string): Promise<any[]> {
    return this.fetchJSON<any[]>(`/users/${userId}/badges`);
  }

  /**
   * Reset user progress
   * @param userId User ID
   * @returns Updated user object
   */
  public async resetProgress(userId: string): Promise<User> {
    return this.fetchJSON<User>(`/users/${userId}/reset-progress`, {
      method: 'POST'
    });
  }
}

// Export a singleton instance
const apiService = ApiService.getInstance();
export default apiService;
