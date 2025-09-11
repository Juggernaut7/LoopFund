const aiService = require('../services/ai.service');
const huggingFaceAI = require('../services/huggingFaceAI.service');

// Get AI financial advice
const getFinancialAdvice = async (req, res, next) => {
  try {
    const { query, userProfile, context } = req.body;
    const userId = req.user.userId;

    console.log('🤖 AI Financial Advice Request:', { query, userId, context });

    // Use HuggingFace AI service for financial advice
    const result = await huggingFaceAI.getFinancialAdvice(query, userProfile);
    
    console.log('✅ AI Response generated:', result.success ? 'Success' : 'Failed');
    
    res.json(result);
  } catch (error) {
    console.error('❌ AI Controller Error:', error);
    next(error);
  }
};

// Get savings predictions
const getSavingsPrediction = async (req, res, next) => {
  try {
    const { userData } = req.body;
    const userId = req.user.userId;

    const result = await aiService.predictSavingsTimeline(userData);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get smart goal recommendations
const getSmartGoals = async (req, res, next) => {
  try {
    const { userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getSmartGoalRecommendations(userProfile);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Analyze behavioral patterns
const analyzeBehavior = async (req, res, next) => {
  try {
    const { userText, userHistory } = req.body;
    const userId = req.user.userId;

    const result = await aiService.analyzeBehavior(userText, userHistory);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// NEW: AI Financial Therapist Endpoints
const startTherapySession = async (req, res, next) => {
  try {
    const { sessionType, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startTherapySession(sessionType, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const analyzeEmotionalState = async (req, res, next) => {
  try {
    const { userText, context } = req.body;
    const userId = req.user.userId;

    const result = await aiService.analyzeEmotionalState(userText, context, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPersonalizedInterventions = async (req, res, next) => {
  try {
    const { emotionalState, triggers, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getPersonalizedInterventions(emotionalState, triggers, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const trackTherapyProgress = async (req, res, next) => {
  try {
    const { sessionId, progress } = req.body;
    const userId = req.user.userId;

    const result = await aiService.trackTherapyProgress(sessionId, progress, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// NEW: Predictive Health Endpoints
const getFinancialForecast = async (req, res, next) => {
  try {
    const { userData, forecastPeriod } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getFinancialForecast(userData, forecastPeriod, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCrisisAlerts = async (req, res, next) => {
  try {
    const { userData } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getCrisisAlerts(userData, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const calculateOpportunityCosts = async (req, res, next) => {
  try {
    const { spendingPatterns, investmentOptions } = req.body;
    const userId = req.user.userId;

    const result = await aiService.calculateOpportunityCosts(spendingPatterns, investmentOptions, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const analyzeLifeEvents = async (req, res, next) => {
  try {
    const { userProfile, lifeEvents } = req.body;
    const userId = req.user.userId;

    const result = await aiService.analyzeLifeEvents(userProfile, lifeEvents, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// NEW: Community AI Insights
const analyzeCommunityPost = async (req, res, next) => {
  try {
    const { postContent, postType } = req.body;
    const userId = req.user.userId;

    const result = await aiService.analyzeCommunityPost(postContent, postType, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCommunityRecommendations = async (req, res, next) => {
  try {
    const { userProfile, communityData } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getCommunityRecommendations(userProfile, communityData, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const analyzeSuccessStories = async (req, res, next) => {
  try {
    const { successStories } = req.body;
    const userId = req.user.userId;

    const result = await aiService.analyzeSuccessStories(successStories, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// NEW: Micro-Interventions
const detectSpendingTriggers = async (req, res, next) => {
  try {
    const { userBehavior, context } = req.body;
    const userId = req.user.userId;

    const result = await aiService.detectSpendingTriggers(userBehavior, context, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const startSpendingPause = async (req, res, next) => {
  try {
    const { triggerType, duration } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startSpendingPause(triggerType, duration, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const suggestHabitStacking = async (req, res, next) => {
  try {
    const { existingHabits, financialGoals } = req.body;
    const userId = req.user.userId;

    const result = await aiService.suggestHabitStacking(existingHabits, financialGoals, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// NEW: Therapy Games
const startAnxietyReductionGame = async (req, res, next) => {
  try {
    const { gameType, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startAnxietyReductionGame(gameType, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const startTriggerIdentificationGame = async (req, res, next) => {
  try {
    const { scenarios, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startTriggerIdentificationGame(scenarios, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const startMindsetTransformationGame = async (req, res, next) => {
  try {
    const { beliefs, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startMindsetTransformationGame(beliefs, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const startConfidenceBuildingGame = async (req, res, next) => {
  try {
    const { decisions, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.startConfidenceBuildingGame(decisions, userProfile, userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFinancialAdvice,
  getSavingsPrediction,
  getSmartGoals,
  analyzeBehavior,
  // AI Financial Therapist
  startTherapySession,
  analyzeEmotionalState,
  getPersonalizedInterventions,
  trackTherapyProgress,
  // Predictive Health
  getFinancialForecast,
  getCrisisAlerts,
  calculateOpportunityCosts,
  analyzeLifeEvents,
  // Community AI Insights
  analyzeCommunityPost,
  getCommunityRecommendations,
  analyzeSuccessStories,
  // Micro-Interventions
  detectSpendingTriggers,
  startSpendingPause,
  suggestHabitStacking,
  // Therapy Games
  startAnxietyReductionGame,
  startTriggerIdentificationGame,
  startMindsetTransformationGame,
  startConfidenceBuildingGame
}; 