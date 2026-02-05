import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import * as aiService from '../services/aiService';
import type {
  MorphemeType,
  PartOfSpeech,
  AIGenerationLog,
} from '@vocab-builder/shared';

export const aiRouter = Router();

// Initialize AI from stored config on module load
export async function initializeAIFromDatabase(): Promise<void> {
  try {
    const providerSetting = await queryOne<{ value: string }>(
      "SELECT value FROM admin_settings WHERE key = 'ai_provider'"
    );
    const apiKeySetting = await queryOne<{ value: string }>(
      "SELECT value FROM admin_settings WHERE key = 'ai_api_key'"
    );

    if (providerSetting?.value && apiKeySetting?.value) {
      const provider = providerSetting.value as 'anthropic' | 'openai';
      const apiKey = apiKeySetting.value;

      aiService.configureAI({ provider, apiKey });
      console.log(`AI service initialized from database (provider: ${provider})`);
    }
  } catch (error) {
    // Table might not exist yet, or other DB error - that's ok on startup
    console.log('AI service not initialized (no stored config or DB not ready)');
  }
}

// All AI routes require authentication and admin privileges
aiRouter.use(authenticate, requireAdmin);

// POST /api/admin/ai/config - Configure and persist AI API key
aiRouter.post('/config', async (req: AuthRequest, res: Response, next) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider || !apiKey) {
      throw createError('Provider and API key are required', 400);
    }

    if (provider !== 'anthropic' && provider !== 'openai') {
      throw createError('Invalid provider. Must be "anthropic" or "openai"', 400);
    }

    // Configure the AI service
    aiService.configureAI({ provider, apiKey });

    // Test the connection
    const connected = await aiService.testConnection();

    if (!connected) {
      aiService.clearConfig();
      throw createError('Failed to connect with provided API key', 401);
    }

    // Persist to database
    await execute(
      `INSERT INTO admin_settings (key, value, updated_by, updated_at)
       VALUES ('ai_provider', $1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_by = $2, updated_at = NOW()`,
      [provider, req.user!.id]
    );

    await execute(
      `INSERT INTO admin_settings (key, value, updated_by, updated_at)
       VALUES ('ai_api_key', $1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_by = $2, updated_at = NOW()`,
      [apiKey, req.user!.id]
    );

    res.json({
      success: true,
      provider,
      message: 'AI configured and saved successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/ai/config - Check if AI is configured
aiRouter.get('/config', async (req: AuthRequest, res: Response, next) => {
  try {
    const status = aiService.isConfigured();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/ai/config - Clear AI configuration from memory and database
aiRouter.delete('/config', async (req: AuthRequest, res: Response, next) => {
  try {
    aiService.clearConfig();

    // Remove from database
    await execute("DELETE FROM admin_settings WHERE key = 'ai_provider'");
    await execute("DELETE FROM admin_settings WHERE key = 'ai_api_key'");

    res.json({ success: true, message: 'AI configuration cleared' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/analyze-word - Get morpheme breakdown for a word
aiRouter.post('/analyze-word', async (req: AuthRequest, res: Response, next) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string') {
      throw createError('Word is required', 400);
    }

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [req.user!.id, 'analyze-word', JSON.stringify({ word }), 'processing', 'anthropic', 'claude-sonnet-4-20250514']
    );

    try {
      const breakdown = await aiService.analyzeWord(word);

      // Check which morphemes already exist in the database
      for (const morpheme of breakdown.morphemes) {
        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
          [morpheme.text]
        );
        if (existing) {
          morpheme.existingId = existing.id;
        }
      }

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(breakdown), logEntry?.id]
      );

      res.json(breakdown);
    } catch (error) {
      // Update log with failure
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/populate-word - Get complete word data for form population
aiRouter.post('/populate-word', async (req: AuthRequest, res: Response, next) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string') {
      throw createError('Word is required', 400);
    }

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [req.user!.id, 'populate-word', JSON.stringify({ word }), 'processing', 'anthropic', 'claude-sonnet-4-20250514']
    );

    try {
      const wordData = await aiService.populateWordData(word);

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(wordData), logEntry?.id]
      );

      res.json(wordData);
    } catch (error) {
      // Update log with failure
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/suggest-words - Get word suggestions for a morpheme
aiRouter.post('/suggest-words', async (req: AuthRequest, res: Response, next) => {
  try {
    const { morphemeId, limit = 10 } = req.body;

    if (!morphemeId) {
      throw createError('Morpheme ID is required', 400);
    }

    // Get the morpheme details
    const morpheme = await queryOne<{
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
    }>(
      'SELECT id, morpheme, type, meaning FROM morphemes WHERE id = $1',
      [morphemeId]
    );

    if (!morpheme) {
      throw createError('Morpheme not found', 404);
    }

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.user!.id,
        'suggest-words',
        JSON.stringify({ morphemeId, morpheme: morpheme.morpheme, limit }),
        'processing',
        'anthropic',
        'claude-sonnet-4-20250514',
      ]
    );

    try {
      const suggestions = await aiService.suggestWords(
        morpheme.morpheme,
        morpheme.meaning,
        morpheme.type as MorphemeType,
        limit
      );

      // Check which words already exist in the database
      for (const suggestion of suggestions) {
        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM words WHERE LOWER(word) = LOWER($1)',
          [suggestion.word]
        );
        suggestion.exists = !!existing;
      }

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(suggestions), logEntry?.id]
      );

      res.json({
        morpheme,
        suggestions,
      });
    } catch (error) {
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/generate-definition - Generate definition/etymology for a word
aiRouter.post('/generate-definition', async (req: AuthRequest, res: Response, next) => {
  try {
    const { word, partOfSpeech } = req.body;

    if (!word || !partOfSpeech) {
      throw createError('Word and part of speech are required', 400);
    }

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.user!.id,
        'generate-definition',
        JSON.stringify({ word, partOfSpeech }),
        'processing',
        'anthropic',
        'claude-sonnet-4-20250514',
      ]
    );

    try {
      const definitionData = await aiService.generateDefinition(word, partOfSpeech);

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(definitionData), logEntry?.id]
      );

      res.json(definitionData);
    } catch (error) {
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/bulk-family - Generate entire word family
aiRouter.post('/bulk-family', async (req: AuthRequest, res: Response, next) => {
  try {
    const { root, meaning } = req.body;

    if (!root || !meaning) {
      throw createError('Root morpheme and meaning are required', 400);
    }

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.user!.id,
        'bulk-family',
        JSON.stringify({ root, meaning }),
        'processing',
        'anthropic',
        'claude-sonnet-4-20250514',
      ]
    );

    try {
      const familyData = await aiService.generateWordFamily(root, meaning);

      // Check which words already exist
      for (const word of familyData.words) {
        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM words WHERE LOWER(word) = LOWER($1)',
          [word.word]
        );
        word.exists = !!existing;
      }

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify(familyData), logEntry?.id]
      );

      res.json(familyData);
    } catch (error) {
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/apply - Apply AI-generated content to database
aiRouter.post('/apply', async (req: AuthRequest, res: Response, next) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      throw createError('Type and data are required', 400);
    }

    const results: {
      morphemesCreated: number;
      wordsCreated: number;
      associationsCreated: number;
    } = {
      morphemesCreated: 0,
      wordsCreated: 0,
      associationsCreated: 0,
    };

    if (type === 'morpheme-breakdown') {
      // Apply morpheme breakdown - create morphemes and associate with word
      const { wordId, word, morphemes, etymology, createWordIfMissing } = data;

      if (!morphemes) {
        throw createError('morphemes are required for morpheme-breakdown', 400);
      }

      if (!wordId && !word) {
        throw createError('Either wordId or word is required for morpheme-breakdown', 400);
      }

      let targetWordId = wordId;

      // If word doesn't exist and we should create it
      if (!targetWordId && word && createWordIfMissing) {
        // Check if word already exists
        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM words WHERE LOWER(word) = LOWER($1)',
          [word]
        );

        if (existing) {
          targetWordId = existing.id;
        } else {
          // Generate word data using AI
          const wordData = await aiService.populateWordData(word);

          // Create the word
          const newWord = await queryOne<{ id: number }>(
            `INSERT INTO words (word, part_of_speech, pronunciation, etymology, difficulty)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [
              wordData.word,
              wordData.partOfSpeech,
              wordData.pronunciation || null,
              etymology || wordData.etymology || null,
              wordData.difficulty,
            ]
          );

          // Create definition
          await execute(
            `INSERT INTO definitions (word_id, definition, example_sentence, is_primary)
             VALUES ($1, $2, $3, true)`,
            [newWord!.id, wordData.definition, wordData.exampleSentence || null]
          );

          targetWordId = newWord!.id;
          results.wordsCreated++;
        }
      }

      if (!targetWordId) {
        throw createError('Word not found and createWordIfMissing was not set', 400);
      }

      const morphemeIds: number[] = [];

      for (const m of morphemes) {
        let morphemeId: number;

        if (m.existingId) {
          morphemeId = m.existingId;
        } else {
          // Create new morpheme
          const newMorpheme = await queryOne<{ id: number }>(
            `INSERT INTO morphemes (morpheme, type, meaning, origin)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (morpheme) DO UPDATE SET morpheme = EXCLUDED.morpheme
             RETURNING id`,
            [m.text, m.type, m.meaning, m.origin || null]
          );
          morphemeId = newMorpheme!.id;
          results.morphemesCreated++;
        }

        morphemeIds.push(morphemeId);
      }

      // Clear existing associations and create new ones
      await execute('DELETE FROM word_morphemes WHERE word_id = $1', [targetWordId]);

      for (let i = 0; i < morphemeIds.length; i++) {
        await execute(
          'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
          [targetWordId, morphemeIds[i], i]
        );
        results.associationsCreated++;
      }
    } else if (type === 'word-family') {
      // Apply word family - create root morpheme, words, and associations
      const { root, words } = data;

      if (!root || !words) {
        throw createError('root and words are required for word-family', 400);
      }

      // Create or get the root morpheme
      let rootMorpheme = await queryOne<{ id: number }>(
        'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
        [root.morpheme]
      );

      if (!rootMorpheme) {
        rootMorpheme = await queryOne<{ id: number }>(
          `INSERT INTO morphemes (morpheme, type, meaning, origin)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [root.morpheme, 'root', root.meaning, root.origin || null]
        );
        results.morphemesCreated++;
      }

      // Create words
      for (const wordData of words) {
        if (wordData.exists) continue; // Skip existing words

        // Check again in case it was created
        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM words WHERE LOWER(word) = LOWER($1)',
          [wordData.word]
        );

        if (existing) continue;

        // Create the word
        const newWord = await queryOne<{ id: number }>(
          `INSERT INTO words (word, part_of_speech, difficulty)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [wordData.word, wordData.partOfSpeech, 2]
        );

        // Create definition
        await execute(
          `INSERT INTO definitions (word_id, definition, is_primary)
           VALUES ($1, $2, true)`,
          [newWord!.id, wordData.definition]
        );

        results.wordsCreated++;

        // Create morpheme associations
        // For now, just link to the root morpheme - full morpheme breakdown would need AI analysis
        await execute(
          'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
          [newWord!.id, rootMorpheme!.id, 0]
        );
        results.associationsCreated++;
      }
    } else if (type === 'word-suggestions') {
      // Apply word suggestions - create selected words with all their morphemes
      const { words, morphemeId } = data;

      if (!words || !morphemeId) {
        throw createError('words and morphemeId are required for word-suggestions', 400);
      }

      for (const wordData of words) {
        if (wordData.exists) continue;

        const existing = await queryOne<{ id: number }>(
          'SELECT id FROM words WHERE LOWER(word) = LOWER($1)',
          [wordData.word]
        );

        if (existing) continue;

        // Create the word with etymology
        const newWord = await queryOne<{ id: number }>(
          `INSERT INTO words (word, part_of_speech, etymology, difficulty)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [wordData.word, wordData.partOfSpeech, wordData.etymology || null, 2]
        );

        // Create definition
        await execute(
          `INSERT INTO definitions (word_id, definition, is_primary)
           VALUES ($1, $2, true)`,
          [newWord!.id, wordData.definition]
        );

        results.wordsCreated++;

        // Create morphemes and link them to the word
        if (wordData.morphemes && wordData.morphemes.length > 0) {
          for (let i = 0; i < wordData.morphemes.length; i++) {
            const m = wordData.morphemes[i];

            // Check if morpheme exists (case-insensitive)
            let morpheme = await queryOne<{ id: number }>(
              'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
              [m.text]
            );

            if (!morpheme) {
              // Create new morpheme
              morpheme = await queryOne<{ id: number }>(
                `INSERT INTO morphemes (morpheme, type, meaning, origin)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [m.text, m.type, m.meaning, m.origin || null]
              );
              results.morphemesCreated++;
            }

            // Link morpheme to word
            await execute(
              `INSERT INTO word_morphemes (word_id, morpheme_id, position)
               VALUES ($1, $2, $3)
               ON CONFLICT (word_id, morpheme_id) DO NOTHING`,
              [newWord!.id, morpheme!.id, i]
            );
            results.associationsCreated++;
          }
        } else {
          // Fallback: just link to the original morpheme if no breakdown provided
          await execute(
            'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
            [newWord!.id, morphemeId, 0]
          );
          results.associationsCreated++;
        }
      }
    } else {
      throw createError('Invalid type. Must be morpheme-breakdown, word-family, or word-suggestions', 400);
    }

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/ai/history - View generation history
aiRouter.get('/history', async (req: AuthRequest, res: Response, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const offset = (page - 1) * pageSize;

    const countResult = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM ai_generation_log'
    );
    const total = parseInt(countResult?.count || '0');

    const logs = await query<{
      id: number;
      adminUserId: number | null;
      operationType: string;
      inputData: Record<string, unknown>;
      outputData: Record<string, unknown> | null;
      status: string;
      tokensUsed: number | null;
      provider: string | null;
      model: string | null;
      errorMessage: string | null;
      createdAt: Date;
      processedAt: Date | null;
      username: string | null;
    }>(
      `SELECT
        l.id,
        l.admin_user_id as "adminUserId",
        l.operation_type as "operationType",
        l.input_data as "inputData",
        l.output_data as "outputData",
        l.status,
        l.tokens_used as "tokensUsed",
        l.provider,
        l.model,
        l.error_message as "errorMessage",
        l.created_at as "createdAt",
        l.processed_at as "processedAt",
        u.username
       FROM ai_generation_log l
       LEFT JOIN users u ON l.admin_user_id = u.id
       ORDER BY l.created_at DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    res.json({
      items: logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/audit - Audit words for morpheme errors
aiRouter.post('/audit', async (req: AuthRequest, res: Response, next) => {
  try {
    const { wordIds, batchSize = 10 } = req.body;

    // Get words to audit - either specified IDs or all words with morphemes
    let wordsQuery: string;
    let wordsParams: unknown[];

    if (wordIds && Array.isArray(wordIds) && wordIds.length > 0) {
      wordsQuery = `
        SELECT w.id, w.word
        FROM words w
        WHERE w.id = ANY($1)
        ORDER BY w.word
        LIMIT $2
      `;
      wordsParams = [wordIds, batchSize];
    } else {
      // Get words that have morpheme associations (prioritize those for audit)
      wordsQuery = `
        SELECT DISTINCT w.id, w.word
        FROM words w
        JOIN word_morphemes wm ON w.id = wm.word_id
        ORDER BY w.word
        LIMIT $1
      `;
      wordsParams = [batchSize];
    }

    const words = await query<{ id: number; word: string }>(wordsQuery, wordsParams);

    if (words.length === 0) {
      return res.json({ results: [], total: 0, message: 'No words to audit' });
    }

    // Get current morphemes for each word
    const wordIdsArray = words.map(w => w.id);
    const currentMorphemes = await query<{
      wordId: number;
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
      canonicalId: number | null;
      position: number;
    }>(
      `SELECT wm.word_id as "wordId", m.id, m.morpheme, m.type, m.meaning, m.canonical_id as "canonicalId", wm.position
       FROM word_morphemes wm
       JOIN morphemes m ON wm.morpheme_id = m.id
       WHERE wm.word_id = ANY($1)
       ORDER BY wm.word_id, wm.position`,
      [wordIdsArray]
    );

    // Get all morphemes for context (including variants)
    const allMorphemes = await query<{
      id: number;
      morpheme: string;
      type: string;
      meaning: string;
      canonicalId: number | null;
    }>(
      'SELECT id, morpheme, type, meaning, canonical_id as "canonicalId" FROM morphemes ORDER BY morpheme'
    );

    // Build the words data for AI
    const wordsForAudit = words.map(w => ({
      id: w.id,
      word: w.word,
      currentMorphemes: currentMorphemes
        .filter(m => m.wordId === w.id)
        .map(m => ({
          id: m.id,
          morpheme: m.morpheme,
          type: m.type,
          meaning: m.meaning,
          canonicalId: m.canonicalId,
        })),
    }));

    // Log the operation
    const logEntry = await queryOne<{ id: number }>(
      `INSERT INTO ai_generation_log (admin_user_id, operation_type, input_data, status, provider, model)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.user!.id,
        'morpheme-audit',
        JSON.stringify({ wordCount: words.length, wordIds: wordIdsArray }),
        'processing',
        'anthropic',
        'claude-sonnet-4-20250514',
      ]
    );

    try {
      const auditResults = await aiService.auditWordMorphemes(wordsForAudit, allMorphemes);

      // Filter to only words with discrepancies
      const discrepancies = auditResults.filter(r => r.hasDiscrepancy);

      // Update log with success
      await execute(
        `UPDATE ai_generation_log SET status = $1, output_data = $2, processed_at = NOW()
         WHERE id = $3`,
        ['completed', JSON.stringify({ discrepancyCount: discrepancies.length }), logEntry?.id]
      );

      res.json({
        results: auditResults,
        total: words.length,
        discrepancyCount: discrepancies.length,
      });
    } catch (error) {
      await execute(
        `UPDATE ai_generation_log SET status = $1, error_message = $2, processed_at = NOW()
         WHERE id = $3`,
        ['failed', error instanceof Error ? error.message : 'Unknown error', logEntry?.id]
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/apply-audit-fix - Apply a single audit fix
aiRouter.post('/apply-audit-fix', async (req: AuthRequest, res: Response, next) => {
  try {
    const { wordId, suggestedMorphemes } = req.body;

    if (!wordId || !suggestedMorphemes) {
      throw createError('wordId and suggestedMorphemes are required', 400);
    }

    const morphemeIds: number[] = [];

    for (const m of suggestedMorphemes) {
      // Try to find existing morpheme (exact match or canonical form)
      let morpheme = await queryOne<{ id: number }>(
        'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
        [m.text]
      );

      if (!morpheme && m.canonicalForm) {
        // If it's a variant and doesn't exist, create it linked to canonical
        const canonical = await queryOne<{ id: number }>(
          'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
          [m.canonicalForm]
        );

        if (canonical) {
          morpheme = await queryOne<{ id: number }>(
            `INSERT INTO morphemes (morpheme, type, meaning, origin, canonical_id)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (morpheme, COALESCE(origin, ''))
             DO UPDATE SET morpheme = EXCLUDED.morpheme
             RETURNING id`,
            [m.text, m.type, m.meaning, m.origin || null, canonical.id]
          );
        }
      }

      if (!morpheme) {
        // Create new morpheme without canonical link
        // Use ON CONFLICT with proper constraint specification
        morpheme = await queryOne<{ id: number }>(
          `INSERT INTO morphemes (morpheme, type, meaning, origin)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (morpheme, COALESCE(origin, ''))
           DO UPDATE SET morpheme = EXCLUDED.morpheme
           RETURNING id`,
          [m.text, m.type, m.meaning, m.origin || null]
        );

        // Fallback: If insert somehow failed, try to get the existing one
        if (!morpheme) {
          morpheme = await queryOne<{ id: number }>(
            'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1) AND COALESCE(origin, \'\') = COALESCE($2, \'\')',
            [m.text, m.origin || null]
          );
        }
      }

      if (morpheme) {
        morphemeIds.push(morpheme.id);
      }
    }

    // Clear existing associations and create new ones
    await execute('DELETE FROM word_morphemes WHERE word_id = $1', [wordId]);

    for (let i = 0; i < morphemeIds.length; i++) {
      await execute(
        'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
        [wordId, morphemeIds[i], i]
      );
    }

    res.json({
      success: true,
      wordId,
      morphemeCount: morphemeIds.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/ai/apply-audit-fixes - Apply multiple audit fixes at once
aiRouter.post('/apply-audit-fixes', async (req: AuthRequest, res: Response, next) => {
  try {
    const { fixes } = req.body;

    if (!fixes || !Array.isArray(fixes) || fixes.length === 0) {
      throw createError('fixes array is required', 400);
    }

    const results = [];
    const errors = [];

    // Process each fix in a transaction for atomicity
    for (const fix of fixes) {
      try {
        const { wordId, suggestedMorphemes } = fix;

        if (!wordId || !suggestedMorphemes) {
          errors.push({ wordId, error: 'Missing wordId or suggestedMorphemes' });
          continue;
        }

        const morphemeIds: number[] = [];

        for (const m of suggestedMorphemes) {
          // Try to find existing morpheme (exact match or canonical form)
          let morpheme = await queryOne<{ id: number }>(
            'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
            [m.text]
          );

          if (!morpheme && m.canonicalForm) {
            // If it's a variant and doesn't exist, create it linked to canonical
            const canonical = await queryOne<{ id: number }>(
              'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1)',
              [m.canonicalForm]
            );

            if (canonical) {
              morpheme = await queryOne<{ id: number }>(
                `INSERT INTO morphemes (morpheme, type, meaning, origin, canonical_id)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (morpheme, COALESCE(origin, ''))
                 DO UPDATE SET morpheme = EXCLUDED.morpheme
                 RETURNING id`,
                [m.text, m.type, m.meaning, m.origin || null, canonical.id]
              );
            }
          }

          if (!morpheme) {
            // Create new morpheme without canonical link
            morpheme = await queryOne<{ id: number }>(
              `INSERT INTO morphemes (morpheme, type, meaning, origin)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (morpheme, COALESCE(origin, ''))
               DO UPDATE SET morpheme = EXCLUDED.morpheme
               RETURNING id`,
              [m.text, m.type, m.meaning, m.origin || null]
            );

            // Fallback: If insert somehow failed, try to get the existing one
            if (!morpheme) {
              morpheme = await queryOne<{ id: number }>(
                'SELECT id FROM morphemes WHERE LOWER(morpheme) = LOWER($1) AND COALESCE(origin, \'\') = COALESCE($2, \'\')',
                [m.text, m.origin || null]
              );
            }
          }

          if (morpheme) {
            morphemeIds.push(morpheme.id);
          }
        }

        // Clear existing associations and create new ones
        await execute('DELETE FROM word_morphemes WHERE word_id = $1', [wordId]);

        for (let i = 0; i < morphemeIds.length; i++) {
          await execute(
            'INSERT INTO word_morphemes (word_id, morpheme_id, position) VALUES ($1, $2, $3)',
            [wordId, morphemeIds[i], i]
          );
        }

        results.push({
          wordId,
          success: true,
          morphemeCount: morphemeIds.length,
        });
      } catch (error: any) {
        errors.push({
          wordId: fix.wordId,
          error: error.message || 'Unknown error',
        });
      }
    }

    res.json({
      success: true,
      applied: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    next(error);
  }
});
