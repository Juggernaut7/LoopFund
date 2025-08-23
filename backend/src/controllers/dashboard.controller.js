const { Contribution } = require('../models/Contribution');
const { Goal } = require('../models/Goal');
const { User } = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's contributions
    const contributions = await Contribution.find({ user: userId });
    
    // Calculate contribution stats
    const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    const totalContributions = contributions.length;
    const averageContribution = totalContributions > 0 ? totalContributed / totalContributions : 0;
    
    // Get this month's contributions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthContributions = contributions.filter(contrib => 
      new Date(contrib.createdAt) >= startOfMonth
    );
    const thisMonthTotal = thisMonthContributions.reduce((sum, contrib) => sum + contrib.amount, 0);

    // Get user's goals
    const goals = await Goal.find({ user: userId });
    const activeGoals = goals.filter(goal => !goal.isCompleted).length;
    
    // Calculate overall progress
    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const completionRate = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;

    // Get user profile
    const user = await User.findById(userId).select('firstName lastName name');

    res.json({
      success: true,
      data: {
        stats: {
          totalContributed,
          totalContributions,
          averageContribution: Math.round(averageContribution * 100) / 100,
          thisMonth: thisMonthTotal,
          activeGoals,
          completionRate: Math.round(completionRate * 100) / 100,
          totalSaved: totalContributed, // For compatibility
          groupSavings: 0, // Will be calculated separately
          individualSavings: totalContributed
        },
        profile: user,
        goals: goals.slice(0, 4), // Recent goals
        recentContributions: contributions.slice(0, 5).map(contrib => ({
          _id: contrib._id,
          amount: contrib.amount,
          goalName: contrib.goalName || 'General Savings',
          goalType: contrib.goalType || 'individual',
          createdAt: contrib.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
};

module.exports = {
  getDashboardStats
}; 