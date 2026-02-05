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
    const includeVariants = req.query.includeVariants === 'true';
    const canonicalOnly = req.query.canonicalOnly === 'true';

    let whereClause = '';
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (type) {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (canonicalOnly) {
      conditions.push('canonical_id IS NULL');
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const morphemes = await query<Morpheme & { canonicalId: number | null }>(
      `SELECT id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"
       FROM morphemes ${whereClause}
       ORDER BY COALESCE(canonical_id, id), canonical_id NULLS FIRST, morpheme`,
      params
    );

    // If includeVariants, group canonical morphemes with their variants
    if (includeVariants) {
      const canonicalMorphemes = morphemes.filter(m => m.canonicalId === null);
      const variants = morphemes.filter(m => m.canonicalId !== null);

      const result = canonicalMorphemes.map(canonical => ({
        ...canonical,
        variants: variants.filter(v => v.canonicalId === canonical.id),
      }));

      res.json(result);
    } else {
      res.json(morphemes);
    }
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
      `SELECT id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"
       FROM morphemes WHERE id = $1`,
      [morphemeId]
    );

    if (!morpheme) {
      throw createError('Morpheme not found', 404);
    }

    // Get variants if this is a canonical morpheme
    const variants = await query<Morpheme>(
      `SELECT id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"
       FROM morphemes WHERE canonical_id = $1
       ORDER BY morpheme`,
      [morphemeId]
    );

    // Get canonical if this is a variant
    let canonical = null;
    if ((morpheme as Morpheme & { canonicalId: number | null }).canonicalId) {
      canonical = await queryOne<Morpheme>(
        `SELECT id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"
         FROM morphemes WHERE id = $1`,
        [(morpheme as Morpheme & { canonicalId: number | null }).canonicalId]
      );
    }

    res.json({
      ...morpheme,
      variants: variants.length > 0 ? variants : undefined,
      canonical: canonical || undefined,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/morphemes (admin only)
morphemesRouter.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const { morpheme, type, meaning, origin, canonicalId } = req.body;

    if (!morpheme || !type || !meaning) {
      throw createError('Morpheme, type, and meaning are required', 400);
    }

    if (!['prefix', 'root', 'suffix'].includes(type)) {
      throw createError('Type must be prefix, root, or suffix', 400);
    }

    // Verify canonical morpheme exists if provided
    if (canonicalId) {
      const canonical = await queryOne<{ id: number }>('SELECT id FROM morphemes WHERE id = $1', [canonicalId]);
      if (!canonical) {
        throw createError('Canonical morpheme not found', 404);
      }
    }

    const newMorpheme = await queryOne<Morpheme>(
      `INSERT INTO morphemes (morpheme, type, meaning, origin, canonical_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"`,
      [morpheme, type, meaning, origin || null, canonicalId || null]
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
    const { morpheme, type, meaning, origin, canonicalId } = req.body;

    if (type && !['prefix', 'root', 'suffix'].includes(type)) {
      throw createError('Type must be prefix, root, or suffix', 400);
    }

    // Verify canonical morpheme exists if provided
    if (canonicalId) {
      const canonical = await queryOne<{ id: number }>('SELECT id FROM morphemes WHERE id = $1', [canonicalId]);
      if (!canonical) {
        throw createError('Canonical morpheme not found', 404);
      }
      // Prevent circular reference
      if (canonicalId === morphemeId) {
        throw createError('A morpheme cannot be its own canonical form', 400);
      }
    }

    const updatedMorpheme = await queryOne<Morpheme>(
      `UPDATE morphemes
       SET morpheme = COALESCE($1, morpheme),
           type = COALESCE($2, type),
           meaning = COALESCE($3, meaning),
           origin = $4,
           canonical_id = $5
       WHERE id = $6
       RETURNING id, morpheme, type, meaning, origin, canonical_id as "canonicalId", created_at as "createdAt"`,
      [morpheme, type, meaning, origin || null, canonicalId !== undefined ? canonicalId : null, morphemeId]
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
