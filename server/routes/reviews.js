const express = require('express');
const spacedRepetitionService = require('../services/spaced-repetition-service');
const wordService = require('../services/word-service');

const router = express.Router();

/**
 * @route   GET /api/users/:userId/due-words
 * @desc    Get words due for review
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId/due-words', async (req, res) => {
  try {
    console.log('GET /api/users/:userId/due-words route hit');
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);
    
    const { userId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    
    const dueWords = await spacedRepetitionService.getDueWords(userId, limit);
    console.log(`Due words for user ${userId}:`, dueWords);
    res.json(dueWords);
  } catch (error) {
    console.error(`Error getting due words for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to get due words' });
  }
});

/**
 * @route   GET /api/users/:userId/new-words
 * @desc    Get new words for the user to learn
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId/new-words', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = req.query.count ? parseInt(req.query.count) : 5;
    const maxDifficulty = req.query.maxDifficulty ? parseInt(req.query.maxDifficulty) : 5;
    
    const newWords = await wordService.getNewWords(userId, count, maxDifficulty);
    res.json(newWords);
  } catch (error) {
    console.error(`Error getting new words for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to get new words' });
  }
});

/**
 * @route   POST /api/users/:userId/words
 * @desc    Add a word to the user's learning queue
 * @access  Private (requires user authentication in a real app)
 */
router.post('/:userId/words', async (req, res) => {
  try {
    const { userId } = req.params;
    const { wordId } = req.body;
    
    if (!wordId) {
      return res.status(400).json({ error: 'Word ID is required' });
    }
    
    // Check if the word exists
    const word = await wordService.getWordById(wordId);
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    // Initialize the word progress
    const wordProgress = await spacedRepetitionService.initializeWordProgress(userId, wordId);
    
    // Return the word with progress
    res.status(201).json({
      progress: wordProgress,
      word
    });
  } catch (error) {
    console.error(`Error adding word to learning for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to add word to learning' });
  }
});

/**
 * @route   POST /api/users/:userId/reviews
 * @desc    Record a word review
 * @access  Private (requires user authentication in a real app)
 */
router.post('/:userId/reviews', async (req, res) => {
  try {
    const { userId } = req.params;
    const { wordId, score, timeSpent, learningMode } = req.body;
    
    // Validate required fields
    if (!wordId) {
      return res.status(400).json({ error: 'Word ID is required' });
    }
    
    if (score === undefined || score < 0 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 0 and 5' });
    }
    
    // Check if the word exists
    const word = await wordService.getWordById(wordId);
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    // Process the review
    const wordProgress = await spacedRepetitionService.processReview(
      userId,
      wordId,
      score,
      timeSpent || 0,
      learningMode || 'FLASHCARD'
    );
    
    // Get review history
    const reviewHistory = await spacedRepetitionService.getWordReviewHistory(userId, wordId);
    
    // Return the updated progress with the word and review history
    res.json({
      progress: {
        ...wordProgress,
        easeFactor: parseFloat(wordProgress.ease_factor),
        reviewHistory
      },
      word
    });
  } catch (error) {
    console.error(`Error recording review for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to record review' });
  }
});

/**
 * @route   GET /api/users/:userId/words/:wordId/progress
 * @desc    Get progress for a specific word
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId/words/:wordId/progress', async (req, res) => {
  try {
    const { userId, wordId } = req.params;
    
    // Get word progress
    const wordProgressResult = await spacedRepetitionService.getWordProgress(userId, wordId);
    
    if (!wordProgressResult) {
      return res.status(404).json({ error: 'Word progress not found' });
    }
    
    // Get the word details
    const word = await wordService.getWordById(wordId);
    
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    // Get review history
    const reviewHistory = await spacedRepetitionService.getWordReviewHistory(userId, wordId);
    
    // Return the progress with the word and review history
    res.json({
      progress: {
        ...wordProgressResult,
        easeFactor: parseFloat(wordProgressResult.ease_factor),
        reviewHistory
      },
      word
    });
  } catch (error) {
    console.error(`Error getting word progress for user ${req.params.userId} and word ${req.params.wordId}:`, error);
    res.status(500).json({ error: 'Failed to get word progress' });
  }
});

module.exports = router;
