const express = require('express');
const wordService = require('../services/word-service');

const router = express.Router();

/**
 * @route   GET /api/words
 * @desc    Get all words with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null,
      difficulty: req.query.difficulty ? parseInt(req.query.difficulty) : null
    };
    
    const words = await wordService.getAllWords(options);
    res.json(words);
  } catch (error) {
    console.error('Error getting words:', error);
    res.status(500).json({ error: 'Failed to get words' });
  }
});

/**
 * @route   GET /api/words/search
 * @desc    Search for words
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const words = await wordService.searchWords(
      query,
      limit ? parseInt(limit) : 20
    );
    
    res.json(words);
  } catch (error) {
    console.error('Error searching words:', error);
    res.status(500).json({ error: 'Failed to search words' });
  }
});

/**
 * @route   GET /api/words/:id
 * @desc    Get word by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const word = await wordService.getWordById(req.params.id);
    
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    res.json(word);
  } catch (error) {
    console.error(`Error getting word ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get word' });
  }
});

/**
 * @route   GET /api/words/:id/related
 * @desc    Get related words
 * @access  Public
 */
router.get('/:id/related', async (req, res) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 5;
    const relatedWords = await wordService.getRelatedWords(req.params.id, count);
    res.json(relatedWords);
  } catch (error) {
    console.error(`Error getting related words for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get related words' });
  }
});

/**
 * @route   POST /api/words
 * @desc    Add a new word
 * @access  Protected (in a real app, would require authentication)
 */
router.post('/', async (req, res) => {
  try {
    const wordData = req.body;
    
    // Validate required fields
    if (!wordData.value || !wordData.definition || !wordData.partOfSpeech) {
      return res.status(400).json({ 
        error: 'Required fields missing (value, definition, partOfSpeech)' 
      });
    }
    
    const newWord = await wordService.addWord(wordData);
    res.status(201).json(newWord);
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Failed to add word' });
  }
});

/**
 * @route   PUT /api/words/:id
 * @desc    Update an existing word
 * @access  Protected (in a real app, would require authentication)
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedWord = await wordService.updateWord(req.params.id, req.body);
    
    if (!updatedWord) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    res.json(updatedWord);
  } catch (error) {
    console.error(`Error updating word ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update word' });
  }
});

/**
 * @route   DELETE /api/words/:id
 * @desc    Delete a word
 * @access  Protected (in a real app, would require admin authentication)
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await wordService.deleteWord(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Word not found' });
    }
    
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error(`Error deleting word ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

/**
 * @route   POST /api/words/import
 * @desc    Import multiple words
 * @access  Protected (in a real app, would require admin authentication)
 */
router.post('/import', async (req, res) => {
  try {
    const words = req.body;
    
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Invalid word data. Expected non-empty array.' });
    }
    
    const importedCount = await wordService.importWords(words);
    
    res.status(201).json({ 
      message: `Successfully imported ${importedCount} words`,
      importedCount
    });
  } catch (error) {
    console.error('Error importing words:', error);
    res.status(500).json({ error: 'Failed to import words' });
  }
});

module.exports = router;