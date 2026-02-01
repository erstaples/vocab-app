import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import type { DashboardStats, UnlinkedWord, PartOfSpeech } from '@vocab-builder/shared';

export const adminRouter = Router();

// All admin routes require authentication and admin privileges
adminRouter.use(authenticate, requireAdmin);

// GET /api/admin/stats - Dashboard statistics
adminRouter.get('/stats', async (req: AuthRequest, res: Response, next) => {
  try {
    // Get total words count
    const wordsCount = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM words'
    );

    // Get total morphemes count
    const morphemesCount = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM morphemes'
    );

    // Get total users count
    const usersCount = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM users'
    );

    // Get words with morpheme associations count
    const wordsWithMorphemes = await queryOne<{ count: string }>(
      'SELECT COUNT(DISTINCT word_id) as count FROM word_morphemes'
    );

    const totalWords = parseInt(wordsCount?.count || '0');
    const linkedWords = parseInt(wordsWithMorphemes?.count || '0');
    const coverage = totalWords > 0 ? Math.round((linkedWords / totalWords) * 100) : 0;

    const stats: DashboardStats = {
      totalWords,
      totalMorphemes: parseInt(morphemesCount?.count || '0'),
      totalUsers: parseInt(usersCount?.count || '0'),
      wordsWithMorphemes: linkedWords,
      morphemeCoverage: coverage,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/unlinked-words - Words without morpheme associations
adminRouter.get('/unlinked-words', async (req: AuthRequest, res: Response, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const search = req.query.search as string;
    const offset = (page - 1) * pageSize;

    let whereClause = `WHERE w.id NOT IN (SELECT DISTINCT word_id FROM word_morphemes)`;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND w.word ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM words w ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0');

    // Get unlinked words with their primary definition
    const words = await query<{
      id: number;
      word: string;
      partOfSpeech: string;
      difficulty: number;
      definition: string;
      createdAt: Date;
    }>(
      `SELECT
        w.id,
        w.word,
        w.part_of_speech as "partOfSpeech",
        w.difficulty,
        COALESCE(d.definition, '') as definition,
        w.created_at as "createdAt"
       FROM words w
       LEFT JOIN definitions d ON w.id = d.word_id AND d.is_primary = true
       ${whereClause}
       ORDER BY w.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, pageSize, offset]
    );

    const unlinkedWords: UnlinkedWord[] = words.map(w => ({
      ...w,
      partOfSpeech: w.partOfSpeech as PartOfSpeech,
    }));

    res.json({
      items: unlinkedWords,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/word-morphemes - Create/update word-morpheme links
adminRouter.post('/word-morphemes', async (req: AuthRequest, res: Response, next) => {
  try {
    const { wordId, morphemeIds } = req.body;

    if (!wordId || !Array.isArray(morphemeIds)) {
      throw createError('wordId and morphemeIds array are required', 400);
    }

    // Verify word exists
    const word = await queryOne<{ id: number }>('SELECT id FROM words WHERE id = $1', [wordId]);
    if (!word) {
      throw createError('Word not found', 404);
    }

    // Verify all morphemes exist
    if (morphemeIds.length > 0) {
      const morphemes = await query<{ id: number }>(
        'SELECT id FROM morphemes WHERE id = ANY($1)',
        [morphemeIds]
      );
      if (morphemes.length !== morphemeIds.length) {
        throw createError('One or more morphemes not found', 404);
      }
    }

    // Delete existing associations
    await execute('DELETE FROM word_morphemes WHERE word_id = $1', [wordId]);

    // Create new associations with positions
    for (let i = 0; i < morphemeIds.length; i++) {
      await execute(
        'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
        [wordId, morphemeIds[i], i]
      );
    }

    // Return updated word with morphemes
    const morphemes = await query<{
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
      origin: string | null;
      position: number;
    }>(
      `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, wm.position
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id = $1
       ORDER BY wm.position`,
      [wordId]
    );

    res.json({
      wordId,
      morphemes,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/word-morphemes/:wordId - Remove all morpheme links for a word
adminRouter.delete('/word-morphemes/:wordId', async (req: AuthRequest, res: Response, next) => {
  try {
    const wordId = parseInt(req.params.wordId);

    if (isNaN(wordId)) {
      throw createError('Invalid word ID', 400);
    }

    const deleted = await execute('DELETE FROM word_morphemes WHERE word_id = $1', [wordId]);

    res.json({
      success: true,
      deletedCount: deleted,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/word-morphemes/:wordId - Get morpheme links for a word
adminRouter.get('/word-morphemes/:wordId', async (req: AuthRequest, res: Response, next) => {
  try {
    const wordId = parseInt(req.params.wordId);

    if (isNaN(wordId)) {
      throw createError('Invalid word ID', 400);
    }

    const morphemes = await query<{
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
      origin: string | null;
      position: number;
    }>(
      `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, wm.position
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id = $1
       ORDER BY wm.position`,
      [wordId]
    );

    res.json({
      wordId,
      morphemes,
    });
  } catch (error) {
    next(error);
  }
});
