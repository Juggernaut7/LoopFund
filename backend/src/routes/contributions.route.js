const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const Contribution = require('../models/Contribution'); // Add this import
const {
  addContributionController,
  getUserContributionsController,
  getGoalContributionsController,
  getContributionStatsController
} = require('../controllers/contributions.controller');

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get user contributions with filters and pagination
router.get('/', getUserContributionsController);

// Add this new route to get all user contributions
router.get('/user/all', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    console.log('🔍 Fetching contributions for user:', userId);
    
    // Get all contributions for the user
    const contributions = await Contribution.find({ user: userId })
      .populate('goal', 'name')
      .sort({ createdAt: -1 });
    
    console.log('📊 Found contributions:', contributions.length);
    console.log('💰 Contribution amounts:', contributions.map(c => c.amount));
    
    res.json({
      success: true,
      data: contributions
    });
    
  } catch (error) {
    console.error('❌ Error fetching user contributions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contributions'
    });
  }
});

// Get contribution statistics
router.get('/stats', getContributionStatsController);

// Get contributions for a specific goal
router.get('/goal/:goalId', getGoalContributionsController);

// Add new contribution
router.post('/', addContributionController);

module.exports = router;