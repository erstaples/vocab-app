import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { UserStats, UserPreferences, UserBadge } from '@vocab-builder/shared';

export const usersRouter = Router();

// GET /api/users/stats
usersRouter.get('/stats', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;

    const stats = await queryOne<UserStats>(
      `SELECT user_id as "userId", total_xp as "totalXp", level, current_streak as "currentStreak",
              longest_streak as "longestStreak", words_learned as "wordsLearned",
              words_mastered as "wordsMastered", total_reviews as "totalReviews",
              last_activity_date as "lastActivityDate"
       FROM user_stats WHERE user_id = $1`,
      [userId]
    );

    if (!stats) {
      // Create default stats
      await execute(
        `INSERT INTO user_stats (user_id) VALUES ($1)`,
        [userId]
      );

      return res.json({
        userId,
        totalXp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        wordsLearned: 0,
        wordsMastered: 0,
        totalReviews: 0,
        lastActivityDate: null,
      });
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/preferences
usersRouter.get('/preferences', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;

    const preferences = await queryOne<UserPreferences>(
      `SELECT user_id as "userId", daily_goal as "dailyGoal",
              preferred_learning_mode as "preferredLearningMode",
              notifications_enabled as "notificationsEnabled",
              sound_enabled as "soundEnabled"
       FROM user_preferences WHERE user_id = $1`,
      [userId]
    );

    if (!preferences) {
      // Create default preferences
      await execute(
        `INSERT INTO user_preferences (user_id) VALUES ($1)`,
        [userId]
      );

      return res.json({
        userId,
        dailyGoal: 10,
        preferredLearningMode: 'flashcard',
        notificationsEnabled: true,
        soundEnabled: true,
      });
    }

    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/preferences
usersRouter.put('/preferences', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { dailyGoal, preferredLearningMode, notificationsEnabled, soundEnabled } = req.body;

    const updatedPreferences = await queryOne<UserPreferences>(
      `UPDATE user_preferences
       SET daily_goal = COALESCE($1, daily_goal),
           preferred_learning_mode = COALESCE($2, preferred_learning_mode),
           notifications_enabled = COALESCE($3, notifications_enabled),
           sound_enabled = COALESCE($4, sound_enabled)
       WHERE user_id = $5
       RETURNING user_id as "userId", daily_goal as "dailyGoal",
                 preferred_learning_mode as "preferredLearningMode",
                 notifications_enabled as "notificationsEnabled",
                 sound_enabled as "soundEnabled"`,
      [dailyGoal, preferredLearningMode, notificationsEnabled, soundEnabled, userId]
    );

    if (!updatedPreferences) {
      // Create with provided values
      const newPreferences = await queryOne<UserPreferences>(
        `INSERT INTO user_preferences (user_id, daily_goal, preferred_learning_mode, notifications_enabled, sound_enabled)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING user_id as "userId", daily_goal as "dailyGoal",
                   preferred_learning_mode as "preferredLearningMode",
                   notifications_enabled as "notificationsEnabled",
                   sound_enabled as "soundEnabled"`,
        [userId, dailyGoal || 10, preferredLearningMode || 'flashcard', notificationsEnabled ?? true, soundEnabled ?? true]
      );
      return res.json(newPreferences);
    }

    res.json(updatedPreferences);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/badges
usersRouter.get('/badges', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;

    const badges = await query<UserBadge>(
      `SELECT user_id as "userId", badge_id as "badgeId", earned_at as "earnedAt"
       FROM user_badges WHERE user_id = $1`,
      [userId]
    );

    res.json(badges);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/activity - Get recent activity
usersRouter.get('/activity', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const days = Math.min(parseInt(req.query.days as string) || 30, 90);

    const activity = await query<{ date: string; reviewCount: number; xpEarned: number }>(
      `SELECT DATE(created_at) as date, COUNT(*) as "reviewCount", SUM(xp_earned) as "xpEarned"
       FROM reviews
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [userId]
    );

    res.json(activity);
  } catch (error) {
    next(error);
  }
});
