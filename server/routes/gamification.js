const express = require('express');
const gamificationService = require('../services/gamification-service');

const router = express.Router();

/**
 * @route   GET /api/users/:userId/badges
 * @desc    Get all badges with earned status for a user
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId/badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const badges = await gamificationService.getUserBadges(userId);
    res.json(badges);
  } catch (error) {
    console.error(`Error getting badges for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

/**
 * @route   GET /api/users/:userId/stats
 * @desc    Get user statistics
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await gamificationService.calculateUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error(`Error getting stats for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

/**
 * @route   POST /api/users/:userId/reset-progress
 * @desc    Reset user progress
 * @access  Private (requires user authentication in a real app)
 */
router.post('/:userId/reset-progress', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // This would be a transaction to:
    // 1. Delete user_badges for the user
    // 2. Delete word_progress (and cascaded review_history) for the user
    // 3. Reset user_progress (streak, level, experience)
    
    // Since this is a sensitive operation, implement with caution in a real app
    
    res.status(501).json({ 
      error: 'Reset progress functionality is not implemented in this version',
      message: 'For safety, this endpoint is stubbed. In a real implementation, it would reset the user progress.'
    });
  } catch (error) {
    console.error(`Error resetting progress for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to reset user progress' });
  }
});

/**
 * @route   POST /api/users/:userId/check-badges
 * @desc    Manually check for new badges (normally this happens after reviews)
 * @access  Private (requires user authentication in a real app)
 */
router.post('/:userId/check-badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const newBadges = await gamificationService.checkForBadges(userId);
    
    res.json({
      newBadges,
      count: newBadges.length,
      message: newBadges.length > 0 
        ? `Earned ${newBadges.length} new badge(s)!` 
        : 'No new badges earned.'
    });
  } catch (error) {
    console.error(`Error checking badges for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to check for badges' });
  }
});

/**
 * @route   POST /api/users/:userId/update-streak
 * @desc    Manually update user streak (normally happens during review)
 * @access  Private (requires user authentication in a real app)
 */
router.post('/:userId/update-streak', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedStreak = await gamificationService.updateStreak(userId);
    
    res.json({
      ...updatedStreak,
      message: `Streak updated to ${updatedStreak.streak} day(s)`
    });
  } catch (error) {
    console.error(`Error updating streak for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

module.exports = router;