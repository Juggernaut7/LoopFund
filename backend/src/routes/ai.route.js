const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');

const router = Router();

// All routes require authentication
router.use(requireAuth);

// AI Financial Advisor
router.post('/advice', aiController.getFinancialAdvice);

// Savings Predictions
router.post('/predict', aiController.getSavingsPrediction);

// Smart Goal Recommendations
router.post('/goals', aiController.getSmartGoals);

// Behavioral Analysis
router.post('/behavior', aiController.analyzeBehavior);

module.exports = router; 