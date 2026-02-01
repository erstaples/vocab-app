import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { SpacedRepetitionService } from '../services/SpacedRepetitionService';
import { GamificationService } from '../services/GamificationService';
import { WordWithDetails, UserWordProgress, LearningMode } from '@vocab-builder/shared';

export const progressRouter = Router();

// GET /api/progress/due - Get words due for review
progressRouter.get('/due', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    // Get words that are due for review
    const dueProgress = await query<{ wordId: number }>(
      `SELECT word_id as "wordId"
       FROM user_word_progress
       WHERE user_id = $1 AND next_review_date <= CURRENT_TIMESTAMP AND status != 'new'
       ORDER BY next_review_date ASC
       LIMIT $2`,
      [userId, limit]
    );

    const wordIds = dueProgress.map(p => p.wordId);

    if (wordIds.length === 0) {
      return res.json({ words: [], totalDue: 0 });
    }

    // Get word details
    const words = await query<WordWithDetails>(
      `SELECT w.id, w.word, w.part_of_speech as "partOfSpeech", w.pronunciation,
              w.etymology, w.difficulty, w.created_at as "createdAt", w.updated_at as "updatedAt"
       FROM words w
       WHERE w.id = ANY($1)`,
      [wordIds]
    );

    // Get definitions
    const definitions = await query(
      `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
       FROM definitions WHERE word_id = ANY($1)`,
      [wordIds]
    );

    // Get morphemes
    const morphemes = await query(
      `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, wm.word_id as "wordId", wm.position
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id = ANY($1)`,
      [wordIds]
    );

    // Combine data
    const wordsWithDetails = words.map(word => ({
      ...word,
      definitions: definitions.filter((d: any) => d.wordId === word.id),
      morphemes: morphemes.filter((m: any) => m.wordId === word.id),
    }));

    // Get total due count
    const totalDue = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM user_word_progress
       WHERE user_id = $1 AND next_review_date <= CURRENT_TIMESTAMP AND status != 'new'`,
      [userId]
    );

    res.json({
      words: wordsWithDetails,
      totalDue: parseInt(totalDue?.count || '0'),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/progress/new - Get new words to learn
progressRouter.get('/new', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const count = Math.min(parseInt(req.query.count as string) || 10, 20);

    // Get words the user hasn't started learning yet
    const words = await query<WordWithDetails>(
      `SELECT w.id, w.word, w.part_of_speech as "partOfSpeech", w.pronunciation,
              w.etymology, w.difficulty, w.created_at as "createdAt", w.updated_at as "updatedAt"
       FROM words w
       WHERE w.id NOT IN (
         SELECT word_id FROM user_word_progress WHERE user_id = $1
       )
       ORDER BY w.difficulty ASC, RANDOM()
       LIMIT $2`,
      [userId, count]
    );

    if (words.length === 0) {
      return res.json({ words: [], recommended: 0 });
    }

    const wordIds = words.map(w => w.id);

    // Get definitions
    const definitions = await query(
      `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
       FROM definitions WHERE word_id = ANY($1)`,
      [wordIds]
    );

    // Get morphemes
    const morphemes = await query(
      `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, wm.word_id as "wordId", wm.position
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id = ANY($1)`,
      [wordIds]
    );

    const wordsWithDetails = words.map(word => ({
      ...word,
      definitions: definitions.filter((d: any) => d.wordId === word.id),
      morphemes: morphemes.filter((m: any) => m.wordId === word.id),
    }));

    res.json({
      words: wordsWithDetails,
      recommended: count,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/progress/learn - Mark a word as being learned
progressRouter.post('/learn', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { wordId } = req.body;

    if (!wordId) {
      throw createError('Word ID is required', 400);
    }

    // Check if word exists
    const word = await queryOne('SELECT id FROM words WHERE id = $1', [wordId]);
    if (!word) {
      throw createError('Word not found', 404);
    }

    // Check if progress already exists
    const existing = await queryOne(
      'SELECT id FROM user_word_progress WHERE user_id = $1 AND word_id = $2',
      [userId, wordId]
    );

    if (existing) {
      throw createError('Word already in learning', 400);
    }

    // Create initial progress
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1); // Review tomorrow

    const progress = await queryOne<UserWordProgress>(
      `INSERT INTO user_word_progress (user_id, word_id, status, ease_factor, interval, repetitions, next_review_date)
       VALUES ($1, $2, 'learning', 2.5, 1, 1, $3)
       RETURNING id, user_id as "userId", word_id as "wordId", status, ease_factor as "easeFactor",
                 interval, repetitions, next_review_date as "nextReviewDate",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [userId, wordId, nextReview]
    );

    // Update word counts
    await GamificationService.updateWordCounts(userId);

    res.status(201).json(progress);
  } catch (error) {
    next(error);
  }
});

// POST /api/progress/review - Record a review result
progressRouter.post('/review', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { wordId, rating, responseTimeMs, learningMode } = req.body;

    if (wordId === undefined || rating === undefined) {
      throw createError('Word ID and rating are required', 400);
    }

    if (rating < 0 || rating > 5) {
      throw createError('Rating must be between 0 and 5', 400);
    }

    // Get current progress
    const currentProgress = await queryOne<UserWordProgress>(
      `SELECT id, ease_factor as "easeFactor", interval, repetitions
       FROM user_word_progress
       WHERE user_id = $1 AND word_id = $2`,
      [userId, wordId]
    );

    if (!currentProgress) {
      throw createError('Word not in learning progress', 404);
    }

    // Calculate next review using SM-2 algorithm
    const { easeFactor, interval, repetitions, nextReviewDate } =
      SpacedRepetitionService.calculateNextReview(currentProgress, rating);

    // Determine new status
    const status = SpacedRepetitionService.determineStatus(repetitions, easeFactor);

    // Update progress
    const updatedProgress = await queryOne<UserWordProgress>(
      `UPDATE user_word_progress
       SET ease_factor = $1, interval = $2, repetitions = $3, next_review_date = $4,
           status = $5, last_review_date = CURRENT_TIMESTAMP
       WHERE user_id = $6 AND word_id = $7
       RETURNING id, user_id as "userId", word_id as "wordId", status, ease_factor as "easeFactor",
                 interval, repetitions, next_review_date as "nextReviewDate",
                 last_review_date as "lastReviewDate", created_at as "createdAt", updated_at as "updatedAt"`,
      [easeFactor, interval, repetitions, nextReviewDate, status, userId, wordId]
    );

    // Calculate XP
    const mode = (learningMode || 'flashcard') as LearningMode;
    const xpEarned = GamificationService.calculateXP(rating, mode, responseTimeMs || 5000);

    // Record the review
    await execute(
      `INSERT INTO reviews (user_id, word_id, rating, response_time_ms, learning_mode, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, wordId, rating, responseTimeMs || 0, mode, xpEarned]
    );

    // Update user stats
    const { newLevel } = await GamificationService.updateUserStats(userId, xpEarned, status);
    await GamificationService.updateWordCounts(userId);

    // Check for new badges
    const newBadges = await GamificationService.checkBadges(userId);

    res.json({
      progress: updatedProgress,
      xpEarned,
      newLevel,
      newBadges: newBadges.length > 0 ? newBadges : undefined,
    });
  } catch (error) {
    next(error);
  }
});
