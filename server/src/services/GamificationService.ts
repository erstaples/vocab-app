import {
  LEVEL_THRESHOLDS,
  MODE_XP_MULTIPLIERS,
  BASE_XP_PER_REVIEW,
  LearningMode,
  Badge,
} from '@vocab-builder/shared';
import { query, queryOne, execute } from '../db/pool';

export class GamificationService {
  /**
   * Calculate XP earned for a review based on rating and mode
   */
  static calculateXP(rating: number, mode: LearningMode, responseTimeMs: number): number {
    // Base XP from rating (0-5)
    const ratingMultiplier = (rating + 1) / 6; // 0.17 to 1.0

    // Mode multiplier
    const modeMultiplier = MODE_XP_MULTIPLIERS[mode] || 1.0;

    // Speed bonus (max 20% for responses under 3 seconds)
    const speedBonus = responseTimeMs < 3000 ? 1 + (3000 - responseTimeMs) / 15000 : 1;

    const xp = Math.round(BASE_XP_PER_REVIEW * ratingMultiplier * modeMultiplier * speedBonus);

    return Math.max(1, xp); // Minimum 1 XP
  }

  /**
   * Calculate level from total XP
   */
  static calculateLevel(totalXp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Update user stats after a review
   */
  static async updateUserStats(
    userId: number,
    xpEarned: number,
    wordStatus: string
  ): Promise<{ newLevel?: number }> {
    // Get current stats
    const currentStats = await queryOne<{
      totalXp: number;
      level: number;
      wordsLearned: number;
      wordsMastered: number;
      currentStreak: number;
      lastActivityDate: string | null;
    }>(
      `SELECT total_xp as "totalXp", level, words_learned as "wordsLearned",
              words_mastered as "wordsMastered", current_streak as "currentStreak",
              last_activity_date as "lastActivityDate"
       FROM user_stats WHERE user_id = $1`,
      [userId]
    );

    if (!currentStats) {
      // Initialize stats if they don't exist
      await execute(
        `INSERT INTO user_stats (user_id, total_xp, level, current_streak, words_learned, words_mastered, total_reviews, last_activity_date)
         VALUES ($1, $2, 1, 1, 0, 0, 1, CURRENT_DATE)`,
        [userId, xpEarned]
      );
      return {};
    }

    const newTotalXp = currentStats.totalXp + xpEarned;
    const newLevel = this.calculateLevel(newTotalXp);
    const leveledUp = newLevel > currentStats.level;

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = currentStats.lastActivityDate;
    let newStreak = currentStats.currentStreak;

    if (!lastActivity) {
      newStreak = 1;
    } else if (lastActivity === today) {
      // Same day, streak unchanged
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        newStreak = currentStats.currentStreak + 1;
      } else {
        newStreak = 1; // Streak broken
      }
    }

    // Update stats
    await execute(
      `UPDATE user_stats SET
        total_xp = $1,
        level = $2,
        current_streak = $3,
        longest_streak = GREATEST(longest_streak, $3),
        total_reviews = total_reviews + 1,
        last_activity_date = CURRENT_DATE
       WHERE user_id = $4`,
      [newTotalXp, newLevel, newStreak, userId]
    );

    return leveledUp ? { newLevel } : {};
  }

  /**
   * Update words learned/mastered counts
   */
  static async updateWordCounts(userId: number): Promise<void> {
    await execute(
      `UPDATE user_stats SET
        words_learned = (SELECT COUNT(*) FROM user_word_progress WHERE user_id = $1 AND status != 'new'),
        words_mastered = (SELECT COUNT(*) FROM user_word_progress WHERE user_id = $1 AND status = 'mastered')
       WHERE user_id = $1`,
      [userId]
    );
  }

  /**
   * Check and award any new badges
   */
  static async checkBadges(userId: number): Promise<Badge[]> {
    const stats = await queryOne<{
      wordsLearned: number;
      wordsMastered: number;
      currentStreak: number;
      totalReviews: number;
    }>(
      `SELECT words_learned as "wordsLearned", words_mastered as "wordsMastered",
              current_streak as "currentStreak", total_reviews as "totalReviews"
       FROM user_stats WHERE user_id = $1`,
      [userId]
    );

    if (!stats) return [];

    const earnedBadges: Badge[] = [];

    // Check words_learned badges
    const wordsLearnedThresholds = [1, 10, 50, 100];
    for (const threshold of wordsLearnedThresholds) {
      if (stats.wordsLearned >= threshold) {
        const badge = await this.tryAwardBadge(userId, `words_learned >= ${threshold}`);
        if (badge) earnedBadges.push(badge);
      }
    }

    // Check streak badges
    const streakThresholds = [7, 30];
    for (const threshold of streakThresholds) {
      if (stats.currentStreak >= threshold) {
        const badge = await this.tryAwardBadge(userId, `current_streak >= ${threshold}`);
        if (badge) earnedBadges.push(badge);
      }
    }

    return earnedBadges;
  }

  /**
   * Try to award a badge if not already earned
   */
  private static async tryAwardBadge(userId: number, requirement: string): Promise<Badge | null> {
    const badge = await queryOne<Badge>(
      `SELECT * FROM badges WHERE requirement = $1`,
      [requirement]
    );

    if (!badge) return null;

    // Check if already earned
    const existing = await queryOne(
      `SELECT 1 FROM user_badges WHERE user_id = $1 AND badge_id = $2`,
      [userId, badge.id]
    );

    if (existing) return null;

    // Award the badge
    await execute(
      `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2)`,
      [userId, badge.id]
    );

    // Award XP bonus
    if (badge.xpBonus > 0) {
      await execute(
        `UPDATE user_stats SET total_xp = total_xp + $1 WHERE user_id = $2`,
        [badge.xpBonus, userId]
      );
    }

    return badge;
  }
}
