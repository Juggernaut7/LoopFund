import api from './api';

// AI Service for revolutionary features
class AIService {
  // AI Financial Therapist
  async startTherapySession(sessionType, userProfile) {
    try {
      const response = await api.post('/ai/therapy/session', {
        sessionType,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error starting therapy session:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeEmotionalState(userText, context) {
    try {
      const response = await api.post('/ai/therapy/analyze-emotion', {
        userText,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing emotional state:', error);
      return { success: false, error: error.message };
    }
  }

  async getPersonalizedInterventions(emotionalState, triggers, userProfile) {
    try {
      const response = await api.post('/ai/therapy/interventions', {
        emotionalState,
        triggers,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error getting interventions:', error);
      return { success: false, error: error.message };
    }
  }

  async trackTherapyProgress(sessionId, progress) {
    try {
      const response = await api.post('/ai/therapy/progress', {
        sessionId,
        progress
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking therapy progress:', error);
      return { success: false, error: error.message };
    }
  }

  // Predictive Health
  async getFinancialForecast(userData, forecastPeriod = 6) {
    try {
      const response = await api.post('/ai/predictive/forecast', {
        userData,
        forecastPeriod
      });
      return response.data;
    } catch (error) {
      console.error('Error getting financial forecast:', error);
      return { success: false, error: error.message };
    }
  }

  async getCrisisAlerts(userData) {
    try {
      const response = await api.post('/ai/predictive/crisis-alerts', {
        userData
      });
      return response.data;
    } catch (error) {
      console.error('Error getting crisis alerts:', error);
      return { success: false, error: error.message };
    }
  }

  async calculateOpportunityCosts(spendingPatterns, investmentOptions) {
    try {
      const response = await api.post('/ai/predictive/opportunity-costs', {
        spendingPatterns,
        investmentOptions
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating opportunity costs:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeLifeEvents(userProfile, lifeEvents) {
    try {
      const response = await api.post('/ai/predictive/life-events', {
        userProfile,
        lifeEvents
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing life events:', error);
      return { success: false, error: error.message };
    }
  }

  // Community AI Insights
  async analyzeCommunityPost(postContent, postType) {
    try {
      const response = await api.post('/ai/community/analyze-post', {
        postContent,
        postType
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing community post:', error);
      return { success: false, error: error.message };
    }
  }

  async getCommunityRecommendations(userProfile, communityData) {
    try {
      const response = await api.post('/ai/community/recommendations', {
        userProfile,
        communityData
      });
      return response.data;
    } catch (error) {
      console.error('Error getting community recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeSuccessStories(successStories) {
    try {
      const response = await api.post('/ai/community/success-stories', {
        successStories
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing success stories:', error);
      return { success: false, error: error.message };
    }
  }


  // Therapy Games
  async startAnxietyReductionGame(gameType, userProfile) {
    try {
      const response = await api.post('/ai/games/anxiety-reduction', {
        gameType,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error starting anxiety reduction game:', error);
      return { success: false, error: error.message };
    }
  }

  async startTriggerIdentificationGame(scenarios, userProfile) {
    try {
      const response = await api.post('/ai/games/trigger-identification', {
        scenarios,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error starting trigger identification game:', error);
      return { success: false, error: error.message };
    }
  }

  async startMindsetTransformationGame(beliefs, userProfile) {
    try {
      const response = await api.post('/ai/games/mindset-transformation', {
        beliefs,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error starting mindset transformation game:', error);
      return { success: false, error: error.message };
    }
  }

  async startConfidenceBuildingGame(decisions, userProfile) {
    try {
      const response = await api.post('/ai/games/confidence-building', {
        decisions,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error starting confidence building game:', error);
      return { success: false, error: error.message };
    }
  }

  // Legacy methods for backward compatibility
  async getFinancialAdvice(query, userProfile) {
    try {
      const response = await api.post('/ai/advice', {
        query,
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error getting financial advice:', error);
      return { success: false, error: error.message };
    }
  }

  async predictSavingsTimeline(userData) {
    try {
      const response = await api.post('/ai/predict', {
        userData
      });
      return response.data;
    } catch (error) {
      console.error('Error predicting savings timeline:', error);
      return { success: false, error: error.message };
    }
  }

  async getSmartGoals(userProfile) {
    try {
      const response = await api.post('/ai/goals', {
        userProfile
      });
      return response.data;
    } catch (error) {
      console.error('Error getting smart goals:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeBehavior(userText, userHistory) {
    try {
      const response = await api.post('/ai/behavior', {
        userText,
        userHistory
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AIService(); 