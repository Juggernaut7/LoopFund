class SavingsPredictor {
  constructor() {
    console.log('📊 Savings Predictor AI initialized');
  }

  async predictGoalCompletion(userData) {
    const { currentSavings, monthlyContribution, targetAmount, monthlyIncome, monthlyExpenses } = userData;
    
    const disposableIncome = monthlyIncome - monthlyExpenses;
    const effectiveContribution = Math.min(monthlyContribution, disposableIncome * 0.3);
    
    if (effectiveContribution <= 0) {
      return {
        feasible: false,
        message: 'Your expenses exceed your income. Focus on reducing expenses first.',
        recommendedContribution: disposableIncome * 0.2
      };
    }
    
    const monthsToGoal = Math.ceil((targetAmount - currentSavings) / effectiveContribution);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsToGoal);
    
    return {
      feasible: true,
      monthsToGoal,
      completionDate: completionDate.toISOString(),
      monthlyContribution: effectiveContribution,
      successProbability: this.calculateSuccessProbability(monthsToGoal, effectiveContribution, disposableIncome)
    };
  }

  calculateSuccessProbability(months, contribution, disposableIncome) {
    const consistencyScore = Math.min(contribution / (disposableIncome * 0.3), 1);
    const timelineScore = Math.max(1 - (months / 60), 0.3);
    return Math.round((consistencyScore * 0.7 + timelineScore * 0.3) * 100);
  }
}

module.exports = { SavingsPredictor }; 