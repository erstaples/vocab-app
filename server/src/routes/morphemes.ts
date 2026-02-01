import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { Morpheme } from '@vocab-builder/shared';

export const morphemesRouter = Router();

// GET /api/morphemes
morphemesRouter.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const type = req.query.type as string;

    let whereClause = '';
    const params: unknown[] = [];

    if (type) {
      whereClause = 'WHERE type = $1';
      params.push(type);
    }

    const morphemes = await query<Morpheme>(
      `SELECT id, morpheme, type, meaning, origin, created_at as "createdAt"
       FROM morphemes ${whereClause}
       ORDER BY type, morpheme`,
      params
    );

    res.json(morphemes);
  } catch (error) {
    next(error);
  }
});

// GET /api/morphemes/families - Get word families grouped by root
// NOTE: This route MUST come before /:id to avoid matching "families" as an id
morphemesRouter.get('/families', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const minWords = parseInt(req.query.minWords as string) || 2;

    const families = await query<{
      morphemeId: number;
      morpheme: string;
      meaning: string;
      origin: string | null;
      wordCount: number;
    }>(
      `SELECT m.id as "morphemeId", m.morpheme, m.meaning, m.origin,
              COUNT(DISTINCT wm.word_id) as "wordCount"
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE m.type = 'root'
       GROUP BY m.id, m.morpheme, m.meaning, m.origin
       HAVING COUNT(DISTINCT wm.word_id) >= $1
       ORDER BY COUNT(DISTINCT wm.word_id) DESC, m.morpheme`,
      [minWords]
    );

    // Get words for each family, including all their morphemes
    const familiesWithWords = await Promise.all(
      families.map(async (family) => {
        // Get words in this family
        const words = await query<{
          id: number;
          word: string;
          partOfSpeech: string;
          definition: string;
        }>(
          `SELECT DISTINCT w.id, w.word, w.part_of_speech as "partOfSpeech",
                  (SELECT definition FROM definitions d WHERE d.word_id = w.id AND d.is_primary LIMIT 1) as definition
           FROM words w
           JOIN word_morphemes wm ON w.id = wm.word_id
           WHERE wm.morpheme_id = $1
           ORDER BY w.word`,
          [family.morphemeId]
        );

        // Get all morphemes for each word
        const wordIds = words.map(w => w.id);
        const allMorphemes = wordIds.length > 0
          ? await query<{
              wordId: number;
              morpheme: string;
              meaning: string;
              type: string;
              position: number;
            }>(
              `SELECT wm.word_id as "wordId", m.morpheme, m.meaning, m.type, wm.position
               FROM word_morphemes wm
               JOIN morphemes m ON wm.morpheme_id = m.id
               WHERE wm.word_id = ANY($1)
               ORDER BY wm.word_id, wm.position`,
              [wordIds]
            )
          : [];

        // Attach morphemes to each word
        const wordsWithMorphemes = words.map(word => ({
          ...word,
          morphemes: allMorphemes
            .filter(m => m.wordId === word.id)
            .map(m => ({
              morpheme: m.morpheme,
              meaning: m.meaning,
              type: m.type as 'prefix' | 'root' | 'suffix',
            })),
        }));

        return {
          root: {
            id: family.morphemeId,
            morpheme: family.morpheme,
            meaning: family.meaning,
            origin: family.origin,
          },
          words: wordsWithMorphemes,
          wordCount: parseInt(String(family.wordCount)),
        };
      })
    );

    res.json(familiesWithWords);
  } catch (error) {
    next(error);
  }
});

// GET /api/morphemes/:id
morphemesRouter.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const morphemeId = parseInt(req.params.id);

    const morpheme = await queryOne<Morpheme>(
      `SELECT id, morpheme, type, meaning, origin, created_at as "createdAt"
       FROM morphemes WHERE id = $1`,
      [morphemeId]
    );

    if (!morpheme) {
      throw createError('Morpheme not found', 404);
    }

    res.json(morpheme);
  } catch (error) {
    next(error);
  }
});

// POST /api/morphemes (admin only)
morphemesRouter.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const { morpheme, type, meaning, origin } = req.body;

    if (!morpheme || !type || !meaning) {
      throw createError('Morpheme, type, and meaning are required', 400);
    }

    if (!['prefix', 'root', 'suffix'].includes(type)) {
      throw createError('Type must be prefix, root, or suffix', 400);
    }

    const newMorpheme = await queryOne<Morpheme>(
      `INSERT INTO morphemes (morpheme, type, meaning, origin)
       VALUES ($1, $2, $3, $4)
       RETURNING id, morpheme, type, meaning, origin, created_at as "createdAt"`,
      [morpheme, type, meaning, origin || null]
    );

    res.status(201).json(newMorpheme);
  } catch (error) {
    next(error);
  }
});

// PUT /api/morphemes/:id (admin only)
morphemesRouter.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const morphemeId = parseInt(req.params.id);
    const { morpheme, type, meaning, origin } = req.body;

    if (type && !['prefix', 'root', 'suffix'].includes(type)) {
      throw createError('Type must be prefix, root, or suffix', 400);
    }

    const updatedMorpheme = await queryOne<Morpheme>(
      `UPDATE morphemes
       SET morpheme = COALESCE($1, morpheme),
           type = COALESCE($2, type),
           meaning = COALESCE($3, meaning),
           origin = $4
       WHERE id = $5
       RETURNING id, morpheme, type, meaning, origin, created_at as "createdAt"`,
      [morpheme, type, meaning, origin || null, morphemeId]
    );

    if (!updatedMorpheme) {
      throw createError('Morpheme not found', 404);
    }

    res.json(updatedMorpheme);
  } catch (error) {
    next(error);
  }
});

// GET /api/morphemes/:id/family - Get word family for a specific morpheme
morphemesRouter.get('/:id/family', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const morphemeId = parseInt(req.params.id);

    const morpheme = await queryOne<Morpheme>(
      `SELECT id, morpheme, type, meaning, origin, created_at as "createdAt"
       FROM morphemes WHERE id = $1`,
      [morphemeId]
    );

    if (!morpheme) {
      throw createError('Morpheme not found', 404);
    }

    // Get all words containing this morpheme
    const words = await query<{
      id: number;
      word: string;
      partOfSpeech: string;
      pronunciation: string | null;
      definition: string;
      morphemes: string;
    }>(
      `SELECT w.id, w.word, w.part_of_speech as "partOfSpeech", w.pronunciation,
              (SELECT definition FROM definitions d WHERE d.word_id = w.id AND d.is_primary LIMIT 1) as definition,
              (SELECT string_agg(m2.morpheme, ' + ' ORDER BY wm2.position)
               FROM word_morphemes wm2
               JOIN morphemes m2 ON wm2.morpheme_id = m2.id
               WHERE wm2.word_id = w.id) as morphemes
       FROM words w
       JOIN word_morphemes wm ON w.id = wm.word_id
       WHERE wm.morpheme_id = $1
       ORDER BY w.word`,
      [morphemeId]
    );

    // Get related morphemes (prefixes/suffixes commonly paired with this root)
    const relatedMorphemes = await query<{
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
      frequency: number;
    }>(
      `SELECT m.id, m.morpheme, m.type, m.meaning, COUNT(*) as frequency
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id IN (
         SELECT word_id FROM word_morphemes WHERE morpheme_id = $1
       )
       AND m.id != $1
       GROUP BY m.id, m.morpheme, m.type, m.meaning
       ORDER BY frequency DESC, m.type`,
      [morphemeId]
    );

    res.json({
      morpheme,
      words,
      relatedMorphemes,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/morphemes/:id (admin only)
morphemesRouter.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const morphemeId = parseInt(req.params.id);

    const result = await execute('DELETE FROM morphemes WHERE id = $1', [morphemeId]);

    if (result === 0) {
      throw createError('Morpheme not found', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
