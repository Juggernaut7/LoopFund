const fetch = require('node-fetch');

class HuggingFaceAIService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    
    // Financial advisor models
    this.models = {
      financialAdvice: 'microsoft/DialoGPT-medium', // Good for conversational AI
      textGeneration: 'gpt2', // For generating financial advice
      sentimentAnalysis: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 HuggingFace AI Service initialized');
  }

  async getFinancialAdvice(query, userProfile = {}) {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ No HuggingFace API key found, using fallback');
        return this.getFallbackAdvice(query, userProfile);
      }

      // Create a context-aware prompt for financial advice
      const prompt = this.createFinancialPrompt(query, userProfile);
      
      // Use text generation model for financial advice
      const response = await this.callHuggingFaceAPI(
        this.models.textGeneration,
        {
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
          }
        }
      );

      if (response && response.length > 0) {
        const generatedText = response[0].generated_text;
        const advice = this.extractAdviceFromResponse(generatedText, prompt);
        
        return {
          success: true,
          data: {
            advice: advice,
            confidence: 0.85,
            model: 'HuggingFace GPT-2',
            insights: this.generateInsights(query, userProfile),
            insightType: this.determineInsightType(query)
          }
        };
      } else {
        throw new Error('No response from HuggingFace API');
      }
    } catch (error) {
      console.error('❌ HuggingFace API Error:', error);
      return this.getFallbackAdvice(query, userProfile);
    }
  }

  async callHuggingFaceAPI(model, payload) {
    const response = await fetch(`${this.baseUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  createFinancialPrompt(query, userProfile) {
    const income = userProfile.income || 'variable';
    const age = userProfile.age || 'unknown';
    const goals = userProfile.goals || 'financial goals';
    
    return `As a financial advisor, I recommend the following for someone with ${income} income, age ${age}, wanting to achieve ${goals}: ${query}. Here's my advice:`;
  }

  extractAdviceFromResponse(generatedText, originalPrompt) {
    // Remove the original prompt from the generated text
    let advice = generatedText.replace(originalPrompt, '').trim();
    
    // Clean up the advice
    advice = advice.split('\n')[0]; // Take first line
    advice = advice.replace(/[^\w\s.,!?-]/g, ''); // Remove special characters
    advice = advice.substring(0, 500); // Limit length
    
    // If advice is too short or generic, provide fallback
    if (advice.length < 20) {
      return this.getFallbackAdvice(originalPrompt, {}).data.advice;
    }
    
    return advice;
  }

  generateInsights(query, userProfile) {
    const insights = [];
    
    // Analyze query for insights
    if (query.toLowerCase().includes('spending') || query.toLowerCase().includes('budget')) {
      insights.push({
        type: 'spending',
        message: 'Consider tracking your expenses for 30 days to identify spending patterns',
        priority: 'high'
      });
    }
    
    if (query.toLowerCase().includes('save') || query.toLowerCase().includes('emergency')) {
      insights.push({
        type: 'savings',
        message: 'Aim to save 3-6 months of expenses for your emergency fund',
        priority: 'high'
      });
    }
    
    if (query.toLowerCase().includes('invest') || query.toLowerCase().includes('growth')) {
      insights.push({
        type: 'investments',
        message: 'Consider starting with low-cost index funds for long-term growth',
        priority: 'medium'
      });
    }
    
    return insights;
  }

  determineInsightType(query) {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('spending') || queryLower.includes('budget') || queryLower.includes('expense')) {
      return 'spending';
    } else if (queryLower.includes('save') || queryLower.includes('emergency') || queryLower.includes('fund')) {
      return 'savings';
    } else if (queryLower.includes('invest') || queryLower.includes('growth') || queryLower.includes('portfolio')) {
      return 'investments';
    }
    
    return 'spending'; // Default
  }

  getFallbackAdvice(query, userProfile) {
    const fallbackResponses = {
      savings: [
        "I recommend starting with a 20% savings rate if possible. Begin with an emergency fund of 3-6 months of expenses, then focus on your specific goals.",
        "Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        "Automate your savings by setting up automatic transfers to a high-yield savings account."
      ],
      budget: [
        "Track your expenses for a month to understand your spending patterns. Use the 50/30/20 rule as a starting point.",
        "Consider using the envelope method or a budgeting app to control discretionary spending.",
        "Review your subscriptions and recurring payments regularly to eliminate unnecessary expenses."
      ],
      investment: [
        "Start with low-cost index funds or ETFs. Consider your risk tolerance and time horizon.",
        "Diversify your portfolio across different asset classes and geographic regions.",
        "Consider dollar-cost averaging to reduce the impact of market volatility."
      ],
      emergency: [
        "Build an emergency fund covering 3-6 months of essential expenses in a high-yield savings account.",
        "Start small - even $500 can help with unexpected expenses while you build toward your full emergency fund.",
        "Keep your emergency fund separate from your regular checking account to avoid temptation."
      ]
    };

    const queryLower = query.toLowerCase();
    let category = 'savings';
    
    if (queryLower.includes('budget') || queryLower.includes('spending')) {
      category = 'budget';
    } else if (queryLower.includes('invest') || queryLower.includes('growth')) {
      category = 'investment';
    } else if (queryLower.includes('emergency') || queryLower.includes('fund')) {
      category = 'emergency';
    }

    const responses = fallbackResponses[category];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      success: true,
      data: {
        advice: randomResponse,
        confidence: 0.75,
        model: 'Fallback Financial Advisor',
        insights: this.generateInsights(query, userProfile),
        insightType: this.determineInsightType(query)
      }
    };
  }

  async analyzeSentiment(text) {
    try {
      if (!this.apiKey) {
        return { sentiment: 'neutral', confidence: 0.5 };
      }

      const response = await this.callHuggingFaceAPI(
        this.models.sentimentAnalysis,
        { inputs: text }
      );

      if (response && response.length > 0) {
        const result = response[0];
        return {
          sentiment: result.label,
          confidence: result.score
        };
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    }

    return { sentiment: 'neutral', confidence: 0.5 };
  }

  async generatePersonalizedRecommendations(userProfile, financialData) {
    const recommendations = [];
    
    // Analyze user profile and generate recommendations
    if (userProfile.income && userProfile.income < 3000) {
      recommendations.push({
        title: "Focus on Emergency Fund",
        description: "With your current income, prioritize building a small emergency fund first.",
        priority: "high",
        action: "Create Emergency Fund Goal"
      });
    }
    
    if (financialData && financialData.spendingRate > 80) {
      recommendations.push({
        title: "Reduce Spending",
        description: "Your spending rate is high. Consider reviewing your budget.",
        priority: "high",
        action: "Review Budget"
      });
    }
    
    if (userProfile.age && userProfile.age < 30) {
      recommendations.push({
        title: "Start Investing Early",
        description: "Time is on your side. Consider starting with small investments.",
        priority: "medium",
        action: "Learn About Investing"
      });
    }
    
    return recommendations;
  }
}

module.exports = new HuggingFaceAIService();
