// AI Bridge service endpoints
const AI_BRIDGE_URL = process.env.AI_BRIDGE_URL || 'http://localhost:5001';
const fetch = require('node-fetch');

class AIService {
  constructor() {
    // AI models are now accessed through the Python bridge service
    console.log('✅ AI Service initialized - using Python AI Bridge');
  }

  // Get personalized financial advice
  async getFinancialAdvice(userQuery, userProfile) {
    try {
      const response = await fetch(`${AI_BRIDGE_URL}/ai/financial-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuery,
          userProfile: userProfile
        }),
      });

      const result = await response.json();
      return result;
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
      const response = await fetch(`${AI_BRIDGE_URL}/ai/savings-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: userData
        }),
      });

      const result = await response.json();
      return result;
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
      const response = await fetch(`${AI_BRIDGE_URL}/ai/behavioral-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userText: userText,
          userHistory: userHistory
        }),
      });

      const result = await response.json();
      return result;
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
      const response = await fetch(`${AI_BRIDGE_URL}/ai/goal-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: userProfile
        }),
      });

      const result = await response.json();
      return result;
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