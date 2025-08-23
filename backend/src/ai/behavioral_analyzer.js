class BehavioralAnalyzer {
  constructor() {
    console.log('🧠 Behavioral Analyzer AI initialized');
  }

  async analyze(userText, userHistory) {
    const sentiment = this.analyzeSentiment(userText);
    const patterns = this.analyzePatterns(userHistory);
    const recommendations = this.generateRecommendations(sentiment, patterns);
    
    return {
      sentiment,
      patterns,
      recommendations,
      confidence: this.calculateConfidence(userHistory)
    };
  }

  analyzeSentiment(text) {
    const positiveWords = ['happy', 'excited', 'confident', 'motivated', 'success'];
    const negativeWords = ['worried', 'stressed', 'anxious', 'frustrated', 'overwhelmed'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  analyzePatterns(history) {
    if (!history || history.length === 0) {
      return { consistency: 'unknown', trend: 'stable', risk: 'low' };
    }
    
    const contributions = history.filter(h => h.type === 'contribution');
    const consistency = this.calculateConsistency(contributions);
    const trend = this.calculateTrend(contributions);
    const risk = this.assessRisk(consistency, trend);
    
    return { consistency, trend, risk };
  }

  calculateConsistency(contributions) {
    if (contributions.length < 2) return 'unknown';
    
    const intervals = [];
    for (let i = 1; i < contributions.length; i++) {
      const days = (new Date(contributions[i].date) - new Date(contributions[i-1].date)) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    
    if (variance < 7) return 'high';
    if (variance < 14) return 'medium';
    return 'low';
  }

  calculateTrend(contributions) {
    if (contributions.length < 3) return 'stable';
    
    const amounts = contributions.slice(-3).map(c => c.amount);
    const firstHalf = amounts.slice(0, Math.ceil(amounts.length / 2));
    const secondHalf = amounts.slice(Math.ceil(amounts.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) return 'increasing';
    if (secondAvg < firstAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  assessRisk(consistency, trend) {
    if (consistency === 'low' && trend === 'decreasing') return 'high';
    if (consistency === 'low' || trend === 'decreasing') return 'medium';
    return 'low';
  }

  generateRecommendations(sentiment, patterns) {
    const recommendations = [];
    
    if (sentiment === 'negative') {
      recommendations.push('Consider setting smaller, more achievable goals to build confidence');
    }
    
    if (patterns.consistency === 'low') {
      recommendations.push('Set up automatic contributions to improve consistency');
    }
    
    if (patterns.trend === 'decreasing') {
      recommendations.push('Review your budget and identify areas to reduce expenses');
    }
    
    if (patterns.risk === 'high') {
      recommendations.push('Focus on building an emergency fund before pursuing larger goals');
    }
    
    return recommendations;
  }

  calculateConfidence(history) {
    if (!history || history.length === 0) return 0.5;
    return Math.min(0.5 + (history.length * 0.1), 0.95);
  }
}

module.exports = { BehavioralAnalyzer }; 