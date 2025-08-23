class FinancialAdvisor {
  constructor() {
    console.log('🤖 Financial Advisor AI initialized');
  }

  async getAdvice(query, userProfile) {
    // For now, return smart financial advice based on patterns
    const advice = this.generateSmartAdvice(query, userProfile);
    return advice;
  }

  generateSmartAdvice(query, userProfile) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('house') || lowerQuery.includes('down payment')) {
      return `Based on your profile, aim to save 20% of your target amount monthly. For a $200,000 house, save $4,000 monthly. Consider setting up automatic transfers to make it effortless.`;
    }
    
    if (lowerQuery.includes('budget') || lowerQuery.includes('expense')) {
      return `Track your spending for 30 days first. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Cut non-essential expenses and redirect to your goals.`;
    }
    
    if (lowerQuery.includes('emergency') || lowerQuery.includes('fund')) {
      return `Build an emergency fund of 3-6 months of expenses. Start with $1,000, then build up gradually. Keep it in a high-yield savings account for easy access.`;
    }
    
    return `Great question! Consider setting specific, measurable goals with deadlines. Break large goals into smaller milestones and celebrate each achievement. Remember, consistency beats perfection.`;
  }

  async recommendGoals(userProfile) {
    const { income = 50000, expenses = 30000, savings = 10000 } = userProfile;
    const disposableIncome = income - expenses;
    
    return [
      {
        type: 'emergency',
        amount: expenses * 3,
        timeline: '6 months',
        priority: 'high',
        description: 'Emergency fund for financial security'
      },
      {
        type: 'investment',
        amount: disposableIncome * 12,
        timeline: '1 year',
        priority: 'medium',
        description: 'Investment portfolio for long-term growth'
      }
    ];
  }
}

module.exports = { FinancialAdvisor }; 