import { UserWordProgress } from '@vocab-builder/shared';

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Rating scale:
 * 0 - Complete blackout
 * 1 - Incorrect, but remembered upon seeing answer
 * 2 - Incorrect, but answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response
 */
export class SpacedRepetitionService {
  /**
   * Calculate the next review date and update progress based on user rating
   */
  static calculateNextReview(
    currentProgress: Partial<UserWordProgress>,
    rating: number
  ): { easeFactor: number; interval: number; repetitions: number; nextReviewDate: Date } {
    let easeFactor = currentProgress.easeFactor || 2.5;
    let interval = currentProgress.interval || 0;
    let repetitions = currentProgress.repetitions || 0;

    // Calculate new ease factor
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    );

    // Calculate new interval based on rating
    if (rating < 3) {
      // Failed - reset repetitions
      repetitions = 0;
      interval = 1;
    } else {
      // Passed
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
      easeFactor: Math.round(easeFactor * 100) / 100,
      interval,
      repetitions,
      nextReviewDate,
    };
  }

  /**
   * Determine word status based on repetitions and ease factor
   */
  static determineStatus(repetitions: number, easeFactor: number): 'new' | 'learning' | 'reviewing' | 'mastered' {
    if (repetitions === 0) {
      return 'new';
    } else if (repetitions < 3) {
      return 'learning';
    } else if (repetitions >= 3 && easeFactor >= 2.5) {
      return 'mastered';
    } else {
      return 'reviewing';
    }
  }
}
