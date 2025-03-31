const express = require('express');
const userService = require('../services/user-service');

const router = express.Router();

/**
 * @route   GET /api/users/:userId
 * @desc    Get user data by ID
 * @access  Private (requires user authentication in a real app)
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(`Error getting user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * @route   PUT /api/users/:userId
 * @desc    Update user data
 * @access  Private (requires user authentication in a real app)
 */
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    
    const updatedUser = await userService.updateUser(userId, userData);
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @route   PUT /api/users/:userId/preferences
 * @desc    Update user preferences
 * @access  Private (requires user authentication in a real app)
 */
router.put('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    const updatedUser = await userService.updatePreferences(userId, preferences);
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error updating preferences for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

/**
 * @route   POST /api/demo-user
 * @desc    Create or retrieve a demo user
 * @access  Public
 */
router.post('/demo-user', async (req, res) => {
  try {
    const demoUser = await userService.createDemoUser();
    res.json(demoUser);
  } catch (error) {
    console.error('Error creating demo user:', error);
    res.status(500).json({ error: 'Failed to create demo user' });
  }
});

module.exports = router;