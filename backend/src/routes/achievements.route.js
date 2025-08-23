const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const achievementsController = require('../controllers/achievements.controller');

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get user achievements
router.get('/', achievementsController.getUserAchievements);

// Add the progress route BEFORE the :achievementId route
router.get('/progress', achievementsController.getAchievementProgress);

// Get achievement details - This must come AFTER specific routes
router.get('/:achievementId', achievementsController.getAchievementDetails);

module.exports = router; 