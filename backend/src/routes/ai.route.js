const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');

const router = Router();

// AI Financial Advisor
router.post('/advice', requireAuth, aiController.getFinancialAdvice);

// Savings Predictions
router.post('/predict', requireAuth, aiController.getSavingsPrediction);

// Smart Goal Recommendations
router.post('/goals', requireAuth, aiController.getSmartGoals);

// Behavioral Analysis
router.post('/behavior', requireAuth, aiController.analyzeBehavior);

// NEW: AI Financial Therapist Endpoints
router.post('/therapy/session', requireAuth, aiController.startTherapySession);
router.post('/therapy/analyze-emotion', requireAuth, aiController.analyzeEmotionalState);
router.post('/therapy/interventions', requireAuth, aiController.getPersonalizedInterventions);
router.post('/therapy/progress', requireAuth, aiController.trackTherapyProgress);

// NEW: Predictive Health Endpoints
router.post('/predictive/forecast', requireAuth, aiController.getFinancialForecast);
router.post('/predictive/crisis-alerts', requireAuth, aiController.getCrisisAlerts);
router.post('/predictive/opportunity-costs', requireAuth, aiController.calculateOpportunityCosts);
router.post('/predictive/life-events', requireAuth, aiController.analyzeLifeEvents);

// NEW: Community AI Insights
router.post('/community/analyze-post', requireAuth, aiController.analyzeCommunityPost);
router.post('/community/recommendations', requireAuth, aiController.getCommunityRecommendations);
router.post('/community/success-stories', requireAuth, aiController.analyzeSuccessStories);

// NEW: Micro-Interventions
router.post('/interventions/trigger', requireAuth, aiController.detectSpendingTriggers);
router.post('/interventions/pause', requireAuth, aiController.startSpendingPause);
router.post('/interventions/habit-stacking', requireAuth, aiController.suggestHabitStacking);

// NEW: Therapy Games
router.post('/games/anxiety-reduction', requireAuth, aiController.startAnxietyReductionGame);
router.post('/games/trigger-identification', requireAuth, aiController.startTriggerIdentificationGame);
router.post('/games/mindset-transformation', requireAuth, aiController.startMindsetTransformationGame);
router.post('/games/confidence-building', requireAuth, aiController.startConfidenceBuildingGame);

module.exports = router; 