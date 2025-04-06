const express = require('express');
const router = express.Router();
const morphemeService = require('../services/morpheme-service');

/**
 * GET /api/morphemes
 * Get all morphemes
 */
router.get('/', async (req, res) => {
  try {
    const morphemes = await morphemeService.getAllMorphemes();
    res.json(morphemes);
  } catch (error) {
    console.error('Error in GET /morphemes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/morphemes/type/:type
 * Get morphemes by type
 */
router.get('/type/:type', async (req, res) => {
  try {
    const morphemes = await morphemeService.getMorphemesByType(req.params.type);
    res.json(morphemes);
  } catch (error) {
    console.error(`Error in GET /morphemes/type/${req.params.type}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/morphemes/search
 * Search morphemes by query
 */
router.get('/search', async (req, res) => {
  try {
    const morphemes = await morphemeService.searchMorphemes(req.query.q);
    res.json(morphemes);
  } catch (error) {
    console.error('Error in GET /morphemes/search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/morphemes/word/:wordId
 * Get morphemes for a specific word
 */
router.get('/word/:wordId', async (req, res) => {
  try {
    const morphemes = await morphemeService.getMorphemesForWord(req.params.wordId);
    res.json(morphemes);
  } catch (error) {
    console.error(`Error in GET /morphemes/word/${req.params.wordId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/morphemes
 * Add a new morpheme
 */
router.post('/', async (req, res) => {
  try {
    const morpheme = await morphemeService.addMorpheme(req.body);
    res.status(201).json(morpheme);
  } catch (error) {
    console.error('Error in POST /morphemes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/morphemes/word/:wordId
 * Add morphemes to a word
 */
router.post('/word/:wordId', async (req, res) => {
  try {
    await morphemeService.addMorphemesToWord(req.params.wordId, req.body.morphemes);
    res.status(200).json({ message: 'Morphemes added successfully' });
  } catch (error) {
    console.error(`Error in POST /morphemes/word/${req.params.wordId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/morphemes/word/:wordId/family
 * Get word families for a word
 */
router.get('/word/:wordId/family', async (req, res) => {
  try {
    const families = await morphemeService.getWordFamilies(req.params.wordId);
    res.json(families);
  } catch (error) {
    console.error(`Error in GET /morphemes/word/${req.params.wordId}/family:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/morphemes/word/:wordId/family
 * Add a word family relationship
 */
router.post('/word/:wordId/family', async (req, res) => {
  try {
    await morphemeService.addWordFamilyRelationship(
      req.params.wordId,
      req.body.relatedWordId,
      req.body.relationshipType
    );
    res.status(200).json({ message: 'Word family relationship added successfully' });
  } catch (error) {
    console.error(`Error in POST /morphemes/word/${req.params.wordId}/family:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;