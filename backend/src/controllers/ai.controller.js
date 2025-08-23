const aiService = require('../services/ai.service');

// Get AI financial advice
const getFinancialAdvice = async (req, res, next) => {
  try {
    const { query, userProfile } = req.body;
    const userId = req.user.userId;

    const result = await aiService.getFinancialAdvice(query, userProfile);
    
    res.json(result);
  } catch (error) {
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

module.exports = {
  getFinancialAdvice,
  getSavingsPrediction,
  getSmartGoals,
  analyzeBehavior
}; 