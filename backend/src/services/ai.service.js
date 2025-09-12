// AI Service with Mock Data for Demo (No Python Required)
const AI_BRIDGE_URL = process.env.AI_BRIDGE_URL || 'http://localhost:5001';
const fetch = require('node-fetch');

class AIService {
  constructor() {
    console.log('✅ AI Service initialized - using Mock Data for Demo');
  }

  // Mock data for revolutionary features
  getMockData() {
    return {
      // AI Financial Therapist
      therapySession: {
        sessionId: `session_${Date.now()}`,
        sessionType: 'emotional_analysis',
        startTime: new Date().toISOString(),
        emotionalState: 'stressed',
        interventions: [
          {
            type: 'pause',
            title: '5-Second Spending Pause',
            description: 'Take 5 deep breaths before any purchase',
            action: 'Start Pause Timer',
            duration: 5
          },
          {
            type: 'redirect',
            title: 'Stress Relief Alternatives',
            description: 'Try free stress relief activities instead',
            action: 'Show Alternatives',
            alternatives: ['Deep breathing', 'Walking', 'Meditation']
          }
        ],
        progress: 0
      },

      // Predictive Health
      financialForecast: {
        currentScore: 72,
        predictedScore: 78,
        riskLevel: 'medium',
        trend: 'improving',
        forecastPeriod: 6,
        monthlyProjections: [
          { month: 'Jan', score: 74 },
          { month: 'Feb', score: 76 },
          { month: 'Mar', score: 77 },
          { month: 'Apr', score: 78 },
          { month: 'May', score: 79 },
          { month: 'Jun', score: 80 }
        ]
      },

      crisisAlerts: [
        {
          id: 1,
          type: 'spending_spike',
          severity: 'high',
          title: 'Potential Spending Spike Detected',
          description: 'Based on your patterns, you may spend 40% more next week due to stress triggers',
          probability: 85,
          impact: 'high',
          recommendation: 'Enable spending pause alerts and review your emotional triggers',
          timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          actions: ['Enable Alerts', 'Review Triggers', 'Set Spending Limit']
        },
        {
          id: 2,
          type: 'savings_dip',
          severity: 'medium',
          title: 'Savings Rate May Decline',
          description: 'Your savings rate could drop by 25% in the next month due to upcoming expenses',
          probability: 65,
          impact: 'medium',
          recommendation: 'Consider adjusting your budget or finding additional income sources',
          timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          actions: ['Adjust Budget', 'Find Side Income', 'Review Expenses']
        }
      ],

      opportunityCosts: [
        {
          id: 1,
          scenario: 'Daily Coffee Purchase',
          currentCost: 5,
          frequency: 'daily',
          annualCost: 1825,
          opportunity: 'Invested in S&P 500',
          potentialReturn: 2920,
          lostGrowth: 1095,
          recommendation: 'Consider making coffee at home 3 days per week'
        },
        {
          id: 2,
          scenario: 'Impulse Online Shopping',
          currentCost: 50,
          frequency: 'weekly',
          annualCost: 2600,
          opportunity: 'Emergency Fund',
          potentialReturn: 2600,
          lostGrowth: 0,
          recommendation: 'Implement 24-hour purchase rule for items over $25'
        }
      ],

      // Therapy Games
      anxietyGame: {
        gameId: `anxiety_${Date.now()}`,
        gameName: 'Mindful Money Moments',
        gameType: 'mindfulness',
        targetReduction: 40,
        duration: '5 minutes',
        exercises: [
          { name: 'Deep Breathing', duration: 60, points: 20 },
          { name: 'Positive Affirmations', duration: 120, points: 30 },
          { name: 'Gratitude Practice', duration: 180, points: 50 }
        ]
      },

      // Community
      communityAnalysis: {
        sentiment: 'neutral',
        category: 'support_request',
        supportLevel: 'high',
        keywords: ['financial', 'savings', 'goals'],
        recommendations: ['Connect with similar users', 'Try AI therapy session']
      }
    };
  }

  // AI Financial Therapist Methods
  async startTherapySession(sessionType, userProfile, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.therapySession,
        type: 'therapy_session'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'therapy_session'
      };
    }
  }

  async analyzeEmotionalState(userText, context, userId) {
    try {
      // Simple text analysis
      const lowerText = userText.toLowerCase();
      let emotionalState = 'neutral';
      
      if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('worried')) {
        emotionalState = 'stressed';
      } else if (lowerText.includes('excited') || lowerText.includes('happy') || lowerText.includes('confident')) {
        emotionalState = 'excited';
      } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('lonely')) {
        emotionalState = 'sad';
      }

      const triggers = [];
      if (lowerText.includes('shopping') || lowerText.includes('buy') || lowerText.includes('spend')) {
        triggers.push('retail_therapy');
      }
      if (lowerText.includes('stress') || lowerText.includes('anxiety')) {
        triggers.push('stress_relief');
      }

      return {
        success: true,
        data: {
          emotionalState,
          triggers,
          confidence: 0.85,
          analysis: {
            sentiment: emotionalState,
            intensity: triggers.length,
            context
          }
        },
        type: 'emotional_analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'emotional_analysis'
      };
    }
  }

  async getPersonalizedInterventions(emotionalState, triggers, userProfile, userId) {
    try {
      const mockData = this.getMockData();
      const interventions = mockData.therapySession.interventions;
      
      return {
        success: true,
        data: {
          primaryIntervention: interventions[0].title,
          interventions,
          emotionalState,
          triggers
        },
        type: 'personalized_interventions'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'personalized_interventions'
      };
    }
  }

  async trackTherapyProgress(sessionId, progress, userId) {
    try {
      return {
        success: true,
        data: {
          sessionId,
          timestamp: new Date().toISOString(),
          progress,
          insights: {
            emotionalImprovement: 0.25,
            triggerAwareness: 0.35,
            interventionSuccess: 0.75
          }
        },
        type: 'therapy_progress'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'therapy_progress'
      };
    }
  }

  // Predictive Health Methods
  async getFinancialForecast(userData, forecastPeriod, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.financialForecast,
        type: 'financial_forecast'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'financial_forecast'
      };
    }
  }

  async getCrisisAlerts(userData, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.crisisAlerts,
        type: 'crisis_alerts'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'crisis_alerts'
      };
    }
  }

  async calculateOpportunityCosts(spendingPatterns, investmentOptions, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.opportunityCosts,
        type: 'opportunity_costs'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'opportunity_costs'
      };
    }
  }

  async analyzeLifeEvents(userProfile, lifeEvents, userId) {
    try {
      const lifeEventAnalysis = [
        {
          id: 1,
          event: 'Home Purchase',
          probability: 35,
          timeline: '2 years',
          estimatedCost: 250000,
          impact: 'major',
          preparation: 'Save $50,000 for down payment',
          monthlySavings: 2083,
          currentProgress: 45
        },
        {
          id: 2,
          event: 'Career Change',
          probability: 60,
          timeline: '1 year',
          estimatedCost: 15000,
          impact: 'medium',
          preparation: 'Build emergency fund and skill development',
          monthlySavings: 1250,
          currentProgress: 70
        }
      ];

      return {
        success: true,
        data: lifeEventAnalysis,
        type: 'life_events_analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'life_events_analysis'
      };
    }
  }

  // Community AI Insights Methods
  async analyzeCommunityPost(postContent, postType, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.communityAnalysis,
        type: 'community_post_analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'community_post_analysis'
      };
    }
  }

  async getCommunityRecommendations(userProfile, communityData, userId) {
    try {
      const recommendations = [
        {
          title: 'Join Stress Management Group',
          description: 'Connect with others dealing with emotional spending',
          type: 'group',
          members: 45,
          relevance: 0.9
        },
        {
          title: 'Share Your Success Story',
          description: 'Inspire others with your progress',
          type: 'action',
          impact: 'high',
          relevance: 0.8
        },
        {
          title: 'Set Daily Budget',
          description: 'Track your daily spending limit',
          type: 'feature',
          effectiveness: 0.85,
          relevance: 0.9
        }
      ];

      return {
        success: true,
        data: { recommendations },
        type: 'community_recommendations'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'community_recommendations'
      };
    }
  }

  async analyzeSuccessStories(successStories, userId) {
    try {
      const analysis = {
        averageSavings: 8500,
        averageTimeToGoal: 8,
        successFactors: ['AI therapy', 'Community support', 'Goal tracking'],
        commonPatterns: ['Regular check-ins', 'Goal setting', 'Emotional awareness'],
        recommendations: ['Start with small goals', 'Use AI therapist regularly', 'Join community groups']
      };

      return {
        success: true,
        data: analysis,
        type: 'success_stories_analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'success_stories_analysis'
      };
    }
  }

  // Therapy Games Methods
  async startAnxietyReductionGame(gameType, userProfile, userId) {
    try {
      const mockData = this.getMockData();
      return {
        success: true,
        data: mockData.anxietyGame,
        type: 'anxiety_reduction_game'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'anxiety_reduction_game'
      };
    }
  }

  async startTriggerIdentificationGame(scenarios, userProfile, userId) {
    try {
      const gameData = {
        gameId: `trigger_${userId}_${Date.now()}`,
        gameName: 'Spending Trigger Hunt',
        scenarios,
        successRate: 85,
        difficulty: 'medium',
        points: 150
      };

      return {
        success: true,
        data: gameData,
        type: 'trigger_identification_game'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'trigger_identification_game'
      };
    }
  }

  async startMindsetTransformationGame(beliefs, userProfile, userId) {
    try {
      const gameData = {
        gameId: `mindset_${userId}_${Date.now()}`,
        gameName: 'Money Mindset Quest',
        beliefs,
        transformationsCount: beliefs.length,
        difficulty: 'hard',
        points: 200
      };

      return {
        success: true,
        data: gameData,
        type: 'mindset_transformation_game'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'mindset_transformation_game'
      };
    }
  }

  async startConfidenceBuildingGame(decisions, userProfile, userId) {
    try {
      const gameData = {
        gameId: `confidence_${userId}_${Date.now()}`,
        gameName: 'Financial Confidence Builder',
        decisions,
        difficulty: 'medium',
        points: 120
      };

      return {
        success: true,
        data: gameData,
        type: 'confidence_building_game'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'confidence_building_game'
      };
    }
  }

  // Enhanced AI methods for Financial Therapist
  async analyzeEmotionalSpending(spendingData) {
    try {
      const { amount, category, mood, trigger } = spendingData;
      
      // Analyze spending patterns
      let emotionalTrigger = null;
      let impact = 1;
      let stressLevel = 1;
      let needsIntervention = false;
      
      // Detect emotional spending patterns
      if (amount > 100 && ['entertainment', 'shopping', 'food'].includes(category)) {
        emotionalTrigger = 'impulse_purchase';
        impact = 7;
        stressLevel = 6;
        needsIntervention = true;
      }
      
      if (mood && ['stressed', 'anxious', 'sad', 'frustrated'].includes(mood)) {
        emotionalTrigger = 'emotional_comfort';
        impact = Math.max(impact, 8);
        stressLevel = Math.max(stressLevel, 7);
        needsIntervention = true;
      }
      
      if (trigger && ['boredom', 'stress', 'celebration', 'compensation'].includes(trigger)) {
        emotionalTrigger = trigger;
        impact = Math.max(impact, 6);
        needsIntervention = true;
      }
      
      // Generate insights
      const insights = [];
      if (emotionalTrigger) {
        insights.push(`Detected ${emotionalTrigger} pattern`);
        insights.push(`Spending amount: $${amount} in ${category}`);
        if (mood) insights.push(`Mood state: ${mood}`);
      }
      
      return {
        emotionalTrigger,
        impact,
        stressLevel,
        needsIntervention,
        insights,
        category,
        amount
      };
    } catch (error) {
      console.error('Error analyzing emotional spending:', error);
      return {
        emotionalTrigger: null,
        impact: 1,
        stressLevel: 1,
        needsIntervention: false,
        insights: ['Analysis unavailable'],
        category: spendingData.category,
        amount: spendingData.amount
      };
    }
  }

  async generateTherapySession(sessionType, therapist) {
    try {
      const sessions = {
        emotional_analysis: {
          insights: [
            'Your spending patterns show emotional triggers',
            'Stress and anxiety often lead to impulse purchases',
            'Recognizing these patterns is the first step to change'
          ],
          recommendations: [
            'Practice mindfulness before making purchases',
            'Create a 24-hour waiting period for non-essential items',
            'Find alternative stress-relief activities'
          ],
          followUpActions: [
            'Track your mood before each purchase',
            'Identify your top 3 emotional triggers',
            'Practice deep breathing exercises daily'
          ]
        },
        spending_intervention: {
          insights: [
            'You have the power to change your spending habits',
            'Small changes lead to big financial improvements',
            'Your future self will thank you for today\'s choices'
          ],
          recommendations: [
            'Use the 5-second rule before any purchase',
            'Ask yourself: "Do I need this or want this?"',
            'Set up automatic savings transfers'
          ],
          followUpActions: [
            'Create a spending pause ritual',
            'Set up accountability with a friend',
            'Review your progress weekly'
          ]
        },
        habit_building: {
          insights: [
            'Building new habits takes time and consistency',
            'Your current habits can be transformed',
            'Small daily actions create lasting change'
          ],
          recommendations: [
            'Start with one small habit change',
            'Stack new habits onto existing routines',
            'Celebrate small wins along the way'
          ],
          followUpActions: [
            'Choose one habit to focus on this week',
            'Set up daily reminders',
            'Track your habit streak'
          ]
        },
        crisis_prevention: {
          insights: [
            'You\'re building resilience against financial stress',
            'Preparation reduces anxiety about money',
            'Your emergency fund is your financial safety net'
          ],
          recommendations: [
            'Build an emergency fund gradually',
            'Create a crisis spending plan',
            'Identify your support network'
          ],
          followUpActions: [
            'Set up automatic emergency fund contributions',
            'Create a list of free stress-relief activities',
            'Practice your crisis response plan'
          ]
        },
        mindset_shift: {
          insights: [
            'Your relationship with money is evolving',
            'Abundance mindset attracts financial opportunities',
            'You deserve financial security and peace'
          ],
          recommendations: [
            'Practice gratitude for what you have',
            'Focus on progress, not perfection',
            'Surround yourself with positive financial influences'
          ],
          followUpActions: [
            'Start a gratitude journal',
            'Follow financial wellness influencers',
            'Celebrate your financial wins'
          ]
        }
      };
      
      const session = sessions[sessionType] || sessions.emotional_analysis;
      
      // Personalize based on user's history
      if (therapist) {
        const topTriggers = therapist.emotionalProfile.spendingTriggers
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 3)
          .map(t => t.trigger);
        
        if (topTriggers.length > 0) {
          session.insights.push(`Your top spending triggers: ${topTriggers.join(', ')}`);
        }
      }
      
      return session;
    } catch (error) {
      console.error('Error generating therapy session:', error);
      return {
        insights: ['Session generation unavailable'],
        recommendations: ['Focus on your financial goals'],
        followUpActions: ['Continue your journey']
      };
    }
  }

  async generateFinancialPredictions(therapist) {
    try {
      const predictions = {
        nextSpendingCrisis: {
          predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          confidence: 65,
          triggers: ['stress', 'boredom', 'social pressure'],
          preventionStrategies: [
            'Practice stress management techniques',
            'Have alternative activities ready',
            'Set up spending limits'
          ]
        },
        emotionalSpendingForecast: {
          nextWeek: 150,
          nextMonth: 600,
          confidence: 70
        },
        habitFormationPredictions: [
          {
            habit: 'Daily budget review',
            estimatedDays: 21,
            successProbability: 75
          },
          {
            habit: 'Mindful spending pause',
            estimatedDays: 14,
            successProbability: 80
          },
          {
            habit: 'Weekly savings transfer',
            estimatedDays: 7,
            successProbability: 90
          }
        ]
      };
      
      // Customize based on user's history
      if (therapist) {
        const recentStress = therapist.emotionalProfile.stressLevels
          .filter(s => s.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .map(s => s.level);
        
        if (recentStress.length > 0) {
          const avgStress = recentStress.reduce((a, b) => a + b, 0) / recentStress.length;
          if (avgStress > 7) {
            predictions.nextSpendingCrisis.confidence = 85;
            predictions.nextSpendingCrisis.predictedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          }
        }
      }
      
      return predictions;
    } catch (error) {
      console.error('Error generating financial predictions:', error);
      return {
        nextSpendingCrisis: {
          predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          confidence: 50,
          triggers: ['general stress'],
          preventionStrategies: ['Stay mindful of your spending']
        },
        emotionalSpendingForecast: {
          nextWeek: 100,
          nextMonth: 400,
          confidence: 50
        },
        habitFormationPredictions: [
          {
            habit: 'Basic financial awareness',
            estimatedDays: 30,
            successProbability: 60
          }
        ]
      };
    }
  }

  async analyzePostRelevance(post, therapist) {
    try {
      let relevanceScore = 50; // Base score
      
      // Analyze content sentiment
      const positiveWords = ['success', 'achieved', 'proud', 'happy', 'grateful', 'motivated'];
      const negativeWords = ['struggle', 'stress', 'anxious', 'frustrated', 'difficult', 'challenge'];
      
      const content = post.content.toLowerCase();
      const positiveCount = positiveWords.filter(word => content.includes(word)).length;
      const negativeCount = negativeWords.filter(word => content.includes(word)).length;
      
      // Adjust relevance based on user's emotional state
      if (therapist) {
        const stressLevel = therapist.wellnessMetrics.financialStress.current;
        
        if (stressLevel > 7 && positiveCount > negativeCount) {
          relevanceScore += 30; // High stress users need positive content
        } else if (stressLevel < 4 && negativeCount > positiveCount) {
          relevanceScore += 20; // Low stress users can handle challenges
        }
        
        // Match with user's interests
        if (post.category === 'success_story' && therapist.wellnessMetrics.financialConfidence.score < 60) {
          relevanceScore += 25; // Boost confidence
        }
        
        if (post.category === 'emotional_support' && stressLevel > 6) {
          relevanceScore += 35; // Provide support
        }
      }
      
      return {
        relevanceScore: Math.min(100, relevanceScore),
        sentiment: positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral',
        category: post.category,
        emotionalMatch: therapist ? therapist.wellnessMetrics.financialStress.current < 5 : 'unknown'
      };
    } catch (error) {
      console.error('Error analyzing post relevance:', error);
      return {
        relevanceScore: 50,
        sentiment: 'neutral',
        category: post.category,
        emotionalMatch: 'unknown'
      };
    }
  }

  async generateCommunityRecommendations(user, therapist) {
    try {
      const recommendations = {
        challenges: [],
        groups: [],
        posts: [],
        users: []
      };
      
      // Recommend challenges based on user's needs
      if (therapist) {
        const stressLevel = therapist.wellnessMetrics.financialStress.current;
        const confidence = therapist.wellnessMetrics.financialConfidence.score;
        
        if (stressLevel > 7) {
          recommendations.challenges.push({
            type: 'emotional_control',
            title: 'Mindful Spending Challenge',
            description: 'Learn to pause before spending',
            duration: '7 days',
            difficulty: 'beginner'
          });
        }
        
        if (confidence < 60) {
          recommendations.challenges.push({
            type: 'mindset_shift',
            title: 'Financial Confidence Builder',
            description: 'Build your financial self-esteem',
            duration: '30 days',
            difficulty: 'intermediate'
          });
        }
      }
      
      // Recommend support groups
      if (user.interests && user.interests.length > 0) {
        recommendations.groups.push({
          category: 'general_support',
          name: 'Financial Wellness Community',
          description: 'A supportive space for everyone',
          memberCount: 150,
          activityLevel: 'high'
        });
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error generating community recommendations:', error);
      return {
        challenges: [],
        groups: [],
        posts: [],
        users: []
      };
    }
  }

  // Legacy methods for backward compatibility
  async getFinancialAdvice(userQuery, userProfile) {
    try {
      return {
        success: true,
        data: {
          advice: "Based on your profile, I recommend focusing on building an emergency fund first, then investing in low-cost index funds.",
          confidence: 0.85,
          type: 'financial_advice'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'financial_advice'
      };
    }
  }

  async predictSavingsTimeline(userData) {
    try {
      return {
        success: true,
        data: {
          timeline: "Based on your current savings rate, you'll reach your goal in 8 months.",
          confidence: 0.78,
          type: 'savings_prediction'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'savings_prediction'
      };
    }
  }

  async getSmartGoalRecommendations(userProfile) {
    try {
      return {
        success: true,
        data: {
          recommendations: [
            "Emergency Fund: $10,000 (3-6 months expenses)",
            "Retirement: 15% of income",
            "Debt Payoff: Focus on high-interest debt first"
          ],
          type: 'goal_recommendations'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'goal_recommendations'
      };
    }
  }

  async analyzeBehavior(userText, userHistory) {
    try {
      return {
        success: true,
        data: {
          sentiment: 'positive',
          patterns: { consistency: 'high', trend: 'improving', risk: 'low' },
          recommendations: ['Keep up the good work!', 'Consider increasing your savings rate'],
          confidence: 0.82,
          type: 'behavioral_analysis'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        type: 'behavioral_analysis'
      };
    }
  }

  async analyzePostContent(content, therapist) {
    try {
      // Analyze content sentiment and emotional tone
      const positiveWords = ['success', 'achieved', 'proud', 'happy', 'grateful', 'motivated', 'excited'];
      const negativeWords = ['struggle', 'stress', 'anxious', 'frustrated', 'difficult', 'challenge', 'worried'];
      
      const contentLower = content.toLowerCase();
      const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
      const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
      
      let emotionalTone = 'neutral';
      if (positiveCount > negativeCount) {
        emotionalTone = 'positive';
      } else if (negativeCount > positiveCount) {
        emotionalTone = 'negative';
      }
      
      const sentimentScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1) * 100;
      
      return {
        emotionalTone,
        sentimentScore,
        keyThemes: this.extractKeyThemes(content),
        suggestedActions: this.generateSuggestedActions(content, therapist),
        wellnessScore: Math.max(0, Math.min(100, 50 + sentimentScore))
      };
    } catch (error) {
      console.error('Error analyzing post content:', error);
      return {
        emotionalTone: 'neutral',
        sentimentScore: 0,
        keyThemes: [],
        suggestedActions: [],
        wellnessScore: 50
      };
    }
  }

  extractKeyThemes(content) {
    const themes = [];
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('savings') || contentLower.includes('save')) themes.push('savings');
    if (contentLower.includes('debt') || contentLower.includes('pay off')) themes.push('debt');
    if (contentLower.includes('budget') || contentLower.includes('spending')) themes.push('budgeting');
    if (contentLower.includes('investment') || contentLower.includes('invest')) themes.push('investing');
    if (contentLower.includes('goal') || contentLower.includes('target')) themes.push('goal-setting');
    if (contentLower.includes('stress') || contentLower.includes('anxiety')) themes.push('emotional-wellness');
    
    return themes;
  }

  generateSuggestedActions(content, therapist) {
    const actions = [];
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('struggle') || contentLower.includes('difficult')) {
      actions.push('Consider breaking down your goal into smaller steps');
      actions.push('Reach out to the community for support');
    }
    
    if (contentLower.includes('success') || contentLower.includes('achieved')) {
      actions.push('Celebrate your win and share your strategy');
      actions.push('Help others by sharing your experience');
    }
    
    if (therapist && therapist.wellnessMetrics.financialStress.current > 7) {
      actions.push('Practice stress management techniques');
      actions.push('Consider a therapy session to process emotions');
    }
    
    return actions;
  }
}

module.exports = new AIService(); 