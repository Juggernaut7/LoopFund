const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const achievementsController = require('../controllers/achievements.controller');

const router = Router();

// Get user achievements
router.get('/', requireAuth, achievementsController.getUserAchievements);

// Add the progress route BEFORE the :achievementId route
router.get('/progress', requireAuth, achievementsController.getAchievementProgress);

// Check and unlock achievements
router.post('/check', requireAuth, achievementsController.checkAchievements);

// Get achievement details - This must come AFTER specific routes
router.get('/:achievementId', requireAuth, achievementsController.getAchievementDetails);

module.exports = router; 