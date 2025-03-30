import { UserWordProgress, Review } from '../../models';

/**
 * Implementation of the SuperMemo SM-2 algorithm for spaced repetition
 * https://en.wikipedia.org/wiki/SuperMemo#Algorithm_SM-2
 */
export class SpacedRepetitionService {
  // Constants used in the SM-2 algorithm
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly INITIAL_EASE_FACTOR = 2.5;

  /**
   * Calculate the next review date and update the word progress
   * @param wordProgress Current progress of the word
   * @param score Score from the user's response (0-5)
   * @param learningMode The learning mode used for this review
   * @returns Updated word progress
   */
  public processReview(
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

  /**
   * Initialize a new word progress object
   * @param wordId ID of the word
   * @returns New word progress object
   */
  public initializeWordProgress(wordId: string): UserWordProgress {
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
   * Get words due for review
   * @param words Array of user word progress
   * @param limit Maximum number of words to return
   * @returns Array of word progress objects due for review
   */
  public getDueWords(words: UserWordProgress[], limit?: number): UserWordProgress[] {
    const now = new Date();

    // Filter words due for review (next review date is today or earlier)
    const dueWords = words.filter(word => word.nextReviewDate <= now)
      // Sort by urgency (oldest first)
      .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());

    // Return all due words or limit if specified
    return limit ? dueWords.slice(0, limit) : dueWords;
  }
}

export default new SpacedRepetitionService();
