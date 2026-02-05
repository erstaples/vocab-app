import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { Definition, MorphemeWithRelation, PartOfSpeech, MorphemeType } from '@vocab-builder/shared';

export const wordsRouter = Router();

interface DbWord {
  id: number;
  word: string;
  partOfSpeech: string;
  pronunciation: string | null;
  etymology: string | null;
  difficulty: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/words
wordsRouter.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const search = req.query.search as string;
    const partOfSpeech = req.query.partOfSpeech as string;
    const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : undefined;

    let whereClause = '';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += `${whereClause ? ' AND' : 'WHERE'} word ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (partOfSpeech) {
      whereClause += `${whereClause ? ' AND' : 'WHERE'} part_of_speech = $${paramIndex}`;
      params.push(partOfSpeech);
      paramIndex++;
    }

    if (difficulty !== undefined) {
      whereClause += `${whereClause ? ' AND' : 'WHERE'} difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    // Get total count
    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM words ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0');

    // Get words
    const offset = (page - 1) * pageSize;
    const words = await query<DbWord>(
      `SELECT id, word, part_of_speech as "partOfSpeech", pronunciation, etymology,
              difficulty, created_at as "createdAt", updated_at as "updatedAt"
       FROM words ${whereClause}
       ORDER BY word ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, pageSize, offset]
    );

    // Get definitions for all words
    const wordIds = words.map(w => w.id);
    const definitions = wordIds.length > 0
      ? await query<Definition & { wordId: number }>(
          `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
           FROM definitions WHERE word_id = ANY($1)`,
          [wordIds]
        )
      : [];

    // Get morphemes for all words
    const morphemes = wordIds.length > 0
      ? await query<MorphemeWithRelation & { wordId: number }>(
          `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, m.canonical_id as "canonicalId", m.created_at as "createdAt",
                  wm.word_id as "wordId", wm.position
           FROM morphemes m
           JOIN word_morphemes wm ON m.id = wm.morpheme_id
           WHERE wm.word_id = ANY($1)
           ORDER BY wm.position`,
          [wordIds]
        )
      : [];

    // Combine data
    const wordsWithDetails = words.map(word => ({
      ...word,
      partOfSpeech: word.partOfSpeech as PartOfSpeech,
      definitions: definitions.filter(d => d.wordId === word.id),
      morphemes: morphemes.filter(m => m.wordId === word.id).map(m => ({
        ...m,
        type: m.type as MorphemeType,
      })),
    }));

    res.json({
      items: wordsWithDetails,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/words/:id
wordsRouter.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const wordId = parseInt(req.params.id);

    const word = await queryOne<{
      id: number;
      word: string;
      partOfSpeech: string;
      pronunciation: string | null;
      etymology: string | null;
      difficulty: number;
      createdAt: Date;
      updatedAt: Date;
    }>(
      `SELECT id, word, part_of_speech as "partOfSpeech", pronunciation, etymology,
              difficulty, created_at as "createdAt", updated_at as "updatedAt"
       FROM words WHERE id = $1`,
      [wordId]
    );

    if (!word) {
      throw createError('Word not found', 404);
    }

    const definitions = await query<Definition>(
      `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
       FROM definitions WHERE word_id = $1`,
      [wordId]
    );

    const morphemes = await query<MorphemeWithRelation>(
      `SELECT m.id, m.morpheme, m.type, m.meaning, m.origin, m.canonical_id as "canonicalId", m.created_at as "createdAt", wm.position
       FROM morphemes m
       JOIN word_morphemes wm ON m.id = wm.morpheme_id
       WHERE wm.word_id = $1
       ORDER BY wm.position`,
      [wordId]
    );

    res.json({
      ...word,
      definitions,
      morphemes,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/words (admin only)
wordsRouter.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const { word, partOfSpeech, pronunciation, etymology, difficulty, definitions, morphemeIds } = req.body;

    if (!word || !partOfSpeech || !definitions?.length) {
      throw createError('Word, part of speech, and at least one definition are required', 400);
    }

    // Create word
    const newWord = await queryOne<{ id: number }>(
      `INSERT INTO words (word, part_of_speech, pronunciation, etymology, difficulty)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [word, partOfSpeech, pronunciation || null, etymology || null, difficulty || 2]
    );

    if (!newWord) {
      throw createError('Failed to create word', 500);
    }

    // Add definitions
    for (const def of definitions) {
      await execute(
        `INSERT INTO definitions (word_id, definition, example_sentence, is_primary)
         VALUES ($1, $2, $3, $4)`,
        [newWord.id, def.definition, def.exampleSentence || null, def.isPrimary || false]
      );
    }

    // Add morpheme associations
    if (morphemeIds?.length) {
      for (let i = 0; i < morphemeIds.length; i++) {
        await execute(
          `INSERT INTO word_morphemes (word_id, morpheme_id, position)
           VALUES ($1, $2, $3)`,
          [newWord.id, morphemeIds[i], i]
        );
      }
    }

    // Fetch and return complete word
    const createdWord = await queryOne<DbWord>(
      `SELECT id, word, part_of_speech as "partOfSpeech", pronunciation, etymology,
              difficulty, created_at as "createdAt", updated_at as "updatedAt"
       FROM words WHERE id = $1`,
      [newWord.id]
    );

    const createdDefs = await query<Definition>(
      `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
       FROM definitions WHERE word_id = $1`,
      [newWord.id]
    );

    res.status(201).json({
      ...createdWord,
      partOfSpeech: createdWord?.partOfSpeech as PartOfSpeech,
      definitions: createdDefs,
      morphemes: [],
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/words/:id (admin only)
wordsRouter.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const wordId = parseInt(req.params.id);
    const { word, partOfSpeech, pronunciation, etymology, difficulty, definitions } = req.body;

    // Update word
    await execute(
      `UPDATE words SET word = COALESCE($1, word), part_of_speech = COALESCE($2, part_of_speech),
       pronunciation = $3, etymology = $4, difficulty = COALESCE($5, difficulty)
       WHERE id = $6`,
      [word, partOfSpeech, pronunciation || null, etymology || null, difficulty, wordId]
    );

    // Update definitions if provided
    if (definitions?.length) {
      await execute('DELETE FROM definitions WHERE word_id = $1', [wordId]);
      for (const def of definitions) {
        await execute(
          `INSERT INTO definitions (word_id, definition, example_sentence, is_primary)
           VALUES ($1, $2, $3, $4)`,
          [wordId, def.definition, def.exampleSentence || null, def.isPrimary || false]
        );
      }
    }

    // Fetch and return updated word
    const updatedWord = await queryOne<DbWord>(
      `SELECT id, word, part_of_speech as "partOfSpeech", pronunciation, etymology,
              difficulty, created_at as "createdAt", updated_at as "updatedAt"
       FROM words WHERE id = $1`,
      [wordId]
    );

    const updatedDefs = await query<Definition>(
      `SELECT id, word_id as "wordId", definition, example_sentence as "exampleSentence", is_primary as "isPrimary"
       FROM definitions WHERE word_id = $1`,
      [wordId]
    );

    res.json({
      ...updatedWord,
      partOfSpeech: updatedWord?.partOfSpeech as PartOfSpeech,
      definitions: updatedDefs,
      morphemes: [],
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/words/:id (admin only)
wordsRouter.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next) => {
  try {
    const wordId = parseInt(req.params.id);

    const result = await execute('DELETE FROM words WHERE id = $1', [wordId]);

    if (result === 0) {
      throw createError('Word not found', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
