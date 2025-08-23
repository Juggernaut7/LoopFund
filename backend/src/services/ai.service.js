const { FinancialAdvisor } = require('../ai/financial_advisor');
const { SavingsPredictor } = require('../ai/savings_predictor');
const { BehavioralAnalyzer } = require('../ai/behavioral_analyzer');

class AIService {
  constructor() {
    this.financialAdvisor = new FinancialAdvisor();
    this.savingsPredictor = new SavingsPredictor();
    this.behavioralAnalyzer = new BehavioralAnalyzer();
  }

  // Get personalized financial advice
  async getFinancialAdvice(userQuery, userProfile) {
    try {
      const advice = await this.financialAdvisor.getAdvice(userQuery, userProfile);
      return {
        success: true,
        data: advice,
        type: 'financial_advice'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'financial_advice'
      };
    }
  }

  // Predict savings timeline
  async predictSavingsTimeline(userData) {
    try {
      const prediction = await this.savingsPredictor.predictGoalCompletion(userData);
      return {
        success: true,
        data: prediction,
        type: 'savings_prediction'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'savings_prediction'
      };
    }
  }

  // Analyze behavioral patterns
  async analyzeBehavior(userText, userHistory) {
    try {
      const analysis = await this.behavioralAnalyzer.analyze(userText, userHistory);
      return {
        success: true,
        data: analysis,
        type: 'behavioral_analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'behavioral_analysis'
      };
    }
  }

  // Get smart goal recommendations
  async getSmartGoalRecommendations(userProfile) {
    try {
      const recommendations = await this.financialAdvisor.recommendGoals(userProfile);
      return {
        success: true,
        data: recommendations,
        type: 'goal_recommendations'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'goal_recommendations'
      };
    }
  }
}

module.exports = new AIService(); 