const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const therapyGameController = require('../controllers/therapyGame.controller');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');

const router = Router();

// Save game score
router.post('/score', 
  requireAuth,
  [
    body('gameId').notEmpty().withMessage('Game ID is required'),
    body('gameTitle').notEmpty().withMessage('Game title is required'),
    body('score').isNumeric().withMessage('Score must be a number'),
    body('totalPoints').isNumeric().withMessage('Total points must be a number'),
    body('accuracy').isNumeric().withMessage('Accuracy must be a number'),
    body('timeSpent').isNumeric().withMessage('Time spent must be a number'),
    body('questionsAnswered').isNumeric().withMessage('Questions answered must be a number'),
    body('correctAnswers').isNumeric().withMessage('Correct answers must be a number'),
    body('difficulty').notEmpty().withMessage('Difficulty is required'),
    body('isPerfect').isBoolean().withMessage('Is perfect must be a boolean'),
    body('timeBonus').isNumeric().withMessage('Time bonus must be a number')
  ],
  validateRequest,
  therapyGameController.saveGameScore
);

// Get user's game history
router.get('/history', requireAuth, therapyGameController.getUserGameHistory);

// Get user's stats
router.get('/stats', requireAuth, therapyGameController.getUserStats);

// Get leaderboard
router.get('/leaderboard', therapyGameController.getLeaderboard);

// Get user's rank
router.get('/rank', requireAuth, therapyGameController.getUserRank);

// Get game-specific leaderboard
router.get('/leaderboard/:gameId', therapyGameController.getGameLeaderboard);

// Get recent activity
router.get('/recent-activity', therapyGameController.getRecentActivity);

module.exports = router;
