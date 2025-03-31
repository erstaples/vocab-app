const express = require('express');
const gamificationService = require('../services/gamification-service');
const db = require('../services/database');

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
    
    console.log(`Processing reset-progress request for user ${userId}`);
    
    // This is a sensitive operation that resets all user progress
    // We use a transaction to ensure all operations succeed or fail together
    await db.transaction(async (client) => {
      // First, verify that the user exists and has progress records
      const userCheck = await client.query(
        'SELECT * FROM user_progress WHERE user_id = $1',
        [userId]
      );
      
      if (userCheck.rows.length === 0) {
        throw new Error(`User progress not found for user ${userId}`);
      }
      
      // 1. Delete user_badges for the user
      const badgeResult = await client.query(
        'DELETE FROM user_badges WHERE user_id = $1 RETURNING badge_id',
        [userId]
      );
      console.log(`Deleted ${badgeResult.rowCount} badges for user ${userId}`);
      
      // 2. Delete word_progress (which will cascade to delete review_history)
      const wordProgressResult = await client.query(
        'DELETE FROM word_progress WHERE user_id = $1 RETURNING id',
        [userId]
      );
      console.log(`Deleted ${wordProgressResult.rowCount} word progress records for user ${userId}`);
      
      // 3. Reset user_progress (streak, level, experience)
      const progressResult = await client.query(
        `UPDATE user_progress
         SET streak = 0,
             level = 1,
             experience = 0,
             last_activity = NOW()
         WHERE user_id = $1`,
        [userId]
      );
      
      if (progressResult.rowCount === 0) {
        throw new Error(`Failed to update user progress for user ${userId}`);
      }
      
      console.log(`Reset progress for user ${userId}`);
    });
    
    res.status(200).json({
      success: true,
      message: 'User progress has been reset successfully'
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