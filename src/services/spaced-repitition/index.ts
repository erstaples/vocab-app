import { UserWordProgress, Review, LearningMode } from '../../models';
import apiService from '../api';

/**
 * Client for the spaced repetition algorithm API
 * The actual algorithm implementation is now on the backend
 */
export class SpacedRepetitionService {
  // Constants used in the SM-2 algorithm (kept for reference)
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly INITIAL_EASE_FACTOR = 2.5;

  /**
   * Legacy method: Calculate the next review date and update the word progress locally
   * @param wordProgress Current progress of the word
   * @param score Score from the user's response (0-5)
   * @param timeSpent Time spent on the review in ms
   * @param learningMode The learning mode used for this review
   * @returns Updated word progress
   */
  public processReview(
    wordProgress: UserWordProgress,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: string
  ): UserWordProgress;

  /**
   * API method: Record a review and update word progress via backend API
   * @param userId User ID
   * @param wordId Word ID
   * @param score Score from the user's response (0-5)
   * @param timeSpent Time spent on review in ms
   * @param learningMode Learning mode used
   * @returns Promise with updated word progress
   */
  public processReview(
    userId: string,
    wordId: number,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): Promise<UserWordProgress>;

  /**
   * Implementation for both legacy and API versions of processReview
   */
  public processReview(
    wordProgressOrUserId: UserWordProgress | string,
    scoreOrWordId: 0 | 1 | 2 | 3 | 4 | 5 | number,
    timeSpentOrScore: number,
    learningModeOrTimeSpent: string | number | LearningMode,
    apiLearningMode?: LearningMode
  ): UserWordProgress | Promise<UserWordProgress> {
    // If the first parameter is a UserWordProgress object, use the legacy implementation
    if (typeof wordProgressOrUserId !== 'string') {
      console.warn('Using deprecated processReview method - update to use API version');
      
      const wordProgress = wordProgressOrUserId;
      const score = scoreOrWordId as 0 | 1 | 2 | 3 | 4 | 5;
      
      return this.processReviewLocal(
        wordProgress,
        score,
        timeSpentOrScore,
        learningModeOrTimeSpent as string
      );
    }
    // Otherwise, use the API implementation
    else {
      const userId = wordProgressOrUserId;
      const wordId = scoreOrWordId as number;
      const score = timeSpentOrScore as 0 | 1 | 2 | 3 | 4 | 5;
      const apiTimeSpent = learningModeOrTimeSpent as number;
      const mode = apiLearningMode!;
      
      return this.processReviewApi(userId, wordId, score, apiTimeSpent, mode);
    }
  }

  /**
   * Local implementation of SM-2 algorithm (for backward compatibility)
   */
  private processReviewLocal(
    wordProgress: UserWordProgress,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: string
  ): UserWordProgress {
    const now = new Date();

    // Create a copy of the word progress to avoid mutating the original
    const updatedProgress = { ...wordProgress };
    const { easeFactor, interval, repetitions } = wordProgress;

    // Create a new review entry
    const review: Review = {
      date: now,
      score,
      timeSpent,
      learningMode: learningMode as any,
    };

    // Add the review to the history
    updatedProgress.reviewHistory = [
      ...updatedProgress.reviewHistory,
      review
    ];

    // Update last review date
    updatedProgress.lastReviewDate = now;

    // If the score is less than 3, we consider it a failure and reset the intervals
    if (score < 3) {
      updatedProgress.repetitions = 0;
      updatedProgress.interval = 1;
    } else {
      // Calculate the new interval based on the algorithm
      const newInterval = this.calculateNewInterval(interval, repetitions);
      updatedProgress.repetitions = repetitions + 1;
      updatedProgress.interval = newInterval;
    }

    // Calculate the new ease factor
    const newEaseFactor = this.calculateNewEaseFactor(easeFactor, score);
    updatedProgress.easeFactor = newEaseFactor;

    // Calculate the next review date
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + updatedProgress.interval);
    updatedProgress.nextReviewDate = nextReviewDate;

    return updatedProgress;
  }

  /**
   * API implementation of process review
   */
  private async processReviewApi(
    userId: string,
    wordId: number,
    score: 0 | 1 | 2 | 3 | 4 | 5,
    timeSpent: number,
    learningMode: LearningMode
  ): Promise<UserWordProgress> {
    try {
      const response = await apiService.recordReview(
        userId,
        wordId,
        score,
        timeSpent,
        learningMode as string
      );
      
      // The API returns the full user object with the updated word progress
      // We need to find the specific word progress that was updated
      const wordProgress = response.progress.words.find((w: any) => w.wordId === Number(wordId));
      
      return wordProgress || this.createEmptyWordProgress(wordId);
    } catch (error) {
      console.error(`Error processing review for word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Legacy method: Initialize a new word progress object locally
   * @param wordId ID of the word
   * @returns New word progress object
   */
  public initializeWordProgress(wordId: number): UserWordProgress;

  /**
   * API method: Initialize a new word progress via backend API
   * @param userId User ID
   * @param wordId Word ID
   * @returns Promise with new word progress
   */
  public initializeWordProgress(userId: string, wordId: number): Promise<UserWordProgress>;

  /**
   * Implementation of both versions of initializeWordProgress
   */
  public initializeWordProgress(param1: string | number, param2?: number): UserWordProgress | Promise<UserWordProgress> {
    // If there's only one parameter, it's the wordId for the legacy version
    if (!param2) {
      console.warn('Using deprecated initializeWordProgress method - update to use API version');
      return this.createEmptyWordProgress(param1 as number);
    }
    // Otherwise, it's the API version
    else {
      const userId = param1 as string;
      const wordId = param2 as number;
      return this.initializeWordProgressApi(userId, wordId);
    }
  }

  /**
   * API implementation of initialize word progress
   */
  private async initializeWordProgressApi(userId: string, wordId: number): Promise<UserWordProgress> {
    try {
      // Use the API to add a word to the user's learning queue
      const response = await apiService.addWordToLearning(userId, wordId);
      
      // Find the newly added word progress
      const wordProgress = response.progress.words.find((w: any) => w.wordId === Number(wordId));
      
      return wordProgress || this.createEmptyWordProgress(wordId);
    } catch (error) {
      console.error(`Error initializing word progress for word ${wordId}:`, error);
      throw error;
    }
  }

  /**
   * Legacy method: Get words due for review from a local array
   * @param words Array of user word progress
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects due for review
   */
  public getDueWords(words: UserWordProgress[], limit?: number): UserWordProgress[];

  /**
   * API method: Get words due for review from the backend
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Promise with array of word progress objects and words
   */
  public getDueWords(userId: string, limit?: number): Promise<{ progress: UserWordProgress, word: any }[]>;

  /**
   * Implementation of both versions of getDueWords
   */
  public getDueWords(
    userIdOrWords: string | UserWordProgress[],
    limit?: number
  ): UserWordProgress[] | Promise<{ progress: UserWordProgress, word: any }[]> {
    // If the first parameter is an array, use the legacy implementation
    if (Array.isArray(userIdOrWords)) {
      console.warn('Using deprecated getDueWords method - update to use API version');
      return this.getDueWordsLocal(userIdOrWords, limit);
    } 
    // Otherwise, use the API implementation
    else {
      const userId = userIdOrWords;
      return this.getDueWordsApi(userId, limit);
    }
  }

  /**
   * Local implementation of get due words
   */
  private getDueWordsLocal(words: UserWordProgress[], limit?: number): UserWordProgress[] {
    const now = new Date();

    // Filter words due for review (next review date is today or earlier)
    const dueWords = words.filter(word => word.nextReviewDate <= now)
      // Sort by urgency (oldest first)
      .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());

    // Return all due words or limit if specified
    return limit ? dueWords.slice(0, limit) : dueWords;
  }

  /**
   * API implementation of get due words
   */
  private async getDueWordsApi(userId: string, limit?: number): Promise<{ progress: UserWordProgress, word: any }[]> {
    try {
      return await apiService.getDueWords(userId, limit);
    } catch (error) {
      console.error('Error getting due words:', error);
      return [];
    }
  }

  /**
   * Creates an empty word progress object
   * @param wordId Word ID
   * @returns Empty word progress object
   */
  private createEmptyWordProgress(wordId: number): UserWordProgress {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      wordId,
      easeFactor: SpacedRepetitionService.INITIAL_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReviewDate: tomorrow,
      lastReviewDate: now,
      reviewHistory: []
    };
  }

  /**
   * Calculate the new interval based on the algorithm
   * @param currentInterval Current interval in days
   * @param repetitions Number of successful reviews
   * @returns New interval in days
   */
  private calculateNewInterval(currentInterval: number, repetitions: number): number {
    if (repetitions === 0) {
      return 1; // First successful review - 1 day
    } else if (repetitions === 1) {
      return 6; // Second successful review - 6 days
    } else {
      // For subsequent successful reviews, multiply the current interval by the ease factor
      return Math.round(currentInterval * 1.5);
    }
  }

  /**
   * Calculate the new ease factor based on the quality of the response
   * @param currentEaseFactor Current ease factor
   * @param score Quality of the response (0-5)
   * @returns New ease factor
   */
  private calculateNewEaseFactor(currentEaseFactor: number, score: number): number {
    // SM-2 algorithm formula for ease factor adjustment
    const newEaseFactor = currentEaseFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));

    // Ensure ease factor doesn't go below the minimum
    return Math.max(SpacedRepetitionService.MIN_EASE_FACTOR, newEaseFactor);
  }
}

// Export a singleton instance
const spacedRepetitionService = new SpacedRepetitionService();
export default spacedRepetitionService;
