const { User } = require('../models/User');
const { Goal } = require('../models/Goal');
const { Group } = require('../models/Group');
const { Contribution } = require('../models/Contribution');
const { TransactionLog } = require('../models/TransactionLog');

class AnalyticsService {
  // User Analytics
  async getUserAnalytics(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const [
        totalGoals,
        activeGoals,
        completedGoals,
        totalContributions,
        totalAmountContributed,
        averageContribution,
        longestStreak,
        currentStreak,
        monthlyStats,
        categoryBreakdown
      ] = await Promise.all([
        this.getUserGoalsCount(userId),
        this.getUserActiveGoalsCount(userId),
        this.getUserCompletedGoalsCount(userId),
        this.getUserContributionsCount(userId),
        this.getUserTotalContributed(userId),
        this.getUserAverageContribution(userId),
        this.getUserLongestStreak(userId),
        this.getUserCurrentStreak(userId),
        this.getUserMonthlyStats(userId),
        this.getUserCategoryBreakdown(userId)
      ]);

      return {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        overview: {
          totalGoals,
          activeGoals,
          completedGoals,
          completionRate: totalGoals > 0 ? (completedGoals / totalGoals * 100).toFixed(1) : 0
        },
        contributions: {
          totalContributions,
          totalAmountContributed,
          averageContribution,
          longestStreak,
          currentStreak
        },
        trends: monthlyStats,
        categories: categoryBreakdown
      };
    } catch (error) {
      throw new Error(`Failed to get user analytics: ${error.message}`);
    }
  }

  // Goal Analytics
  async getGoalAnalytics(goalId, userId) {
    try {
      const goal = await Goal.findById(goalId).populate('members.user', 'firstName lastName email');
      if (!goal) throw new Error('Goal not found');

      // Check if user has access to this goal
      const hasAccess = goal.createdBy.toString() === userId || 
                       goal.members.some(member => member.user._id.toString() === userId);
      if (!hasAccess) throw new Error('Access denied');

      const [
        contributions,
        memberStats,
        progressTrend,
        completionPrediction
      ] = await Promise.all([
        this.getGoalContributions(goalId),
        this.getGoalMemberStats(goalId),
        this.getGoalProgressTrend(goalId),
        this.getGoalCompletionPrediction(goalId)
      ]);

      return {
        goal: {
          id: goal._id,
          name: goal.name,
          description: goal.description,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          progress: goal.progress,
          status: goal.status,
          endDate: goal.endDate,
          category: goal.category
        },
        contributions: {
          total: contributions.length,
          amount: contributions.reduce((sum, c) => sum + c.amount, 0),
          average: contributions.length > 0 ? contributions.reduce((sum, c) => sum + c.amount, 0) / contributions.length : 0,
          recent: contributions.slice(0, 5)
        },
        members: memberStats,
        trends: progressTrend,
        prediction: completionPrediction
      };
    } catch (error) {
      throw new Error(`Failed to get goal analytics: ${error.message}`);
    }
  }

  // Group Analytics
  async getGroupAnalytics(groupId, userId) {
    try {
      const group = await Group.findById(groupId).populate('members.user', 'firstName lastName email');
      if (!group) throw new Error('Group not found');

      // Check if user has access to this group
      const hasAccess = group.createdBy.toString() === userId || 
                       group.members.some(member => member.user._id.toString() === userId);
      if (!hasAccess) throw new Error('Access denied');

      const [
        memberActivity,
        contributionTrends,
        topContributors,
        groupGoals
      ] = await Promise.all([
        this.getGroupMemberActivity(groupId),
        this.getGroupContributionTrends(groupId),
        this.getGroupTopContributors(groupId),
        this.getGroupGoals(groupId)
      ]);

      return {
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
          targetAmount: group.targetAmount,
          currentAmount: group.currentAmount,
          progress: group.progress,
          status: group.status,
          memberCount: group.members.length,
          category: group.category
        },
        activity: memberActivity,
        trends: contributionTrends,
        topContributors,
        goals: groupGoals
      };
    } catch (error) {
      throw new Error(`Failed to get group analytics: ${error.message}`);
    }
  }

  // Platform Analytics (Admin only)
  async getPlatformAnalytics() {
    try {
      const [
        totalUsers,
        activeUsers,
        totalGoals,
        activeGoals,
        totalGroups,
        totalContributions,
        totalAmount,
        monthlyGrowth,
        topCategories,
        retentionRate
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getActiveUsers(),
        this.getTotalGoals(),
        this.getActiveGoals(),
        this.getTotalGroups(),
        this.getTotalContributions(),
        this.getTotalAmountContributed(),
        this.getMonthlyGrowth(),
        this.getTopCategories(),
        this.getRetentionRate()
      ]);

      return {
        overview: {
          totalUsers,
          activeUsers,
          totalGoals,
          activeGoals,
          totalGroups,
          totalContributions,
          totalAmount
        },
        growth: monthlyGrowth,
        categories: topCategories,
        retention: retentionRate
      };
    } catch (error) {
      throw new Error(`Failed to get platform analytics: ${error.message}`);
    }
  }

  // Helper methods
  async getUserGoalsCount(userId) {
    return await Goal.countDocuments({
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ]
    });
  }

  async getUserActiveGoalsCount(userId) {
    return await Goal.countDocuments({
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ],
      status: 'active'
    });
  }

  async getUserCompletedGoalsCount(userId) {
    return await Goal.countDocuments({
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ],
      status: 'completed'
    });
  }

  async getUserContributionsCount(userId) {
    return await Contribution.countDocuments({ user: userId, status: 'completed' });
  }

  async getUserTotalContributed(userId) {
    const result = await Contribution.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getUserAverageContribution(userId) {
    const result = await Contribution.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, average: { $avg: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].average : 0;
  }

  async getUserLongestStreak(userId) {
    // Implementation for calculating longest contribution streak
    const contributions = await Contribution.find({ user: userId, status: 'completed' })
      .sort({ transactionDate: 1 });
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (const contribution of contributions) {
      const currentDate = new Date(contribution.transactionDate);
      if (lastDate) {
        const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 7) { // Within a week
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = currentDate;
    }

    return longestStreak;
  }

  async getUserCurrentStreak(userId) {
    // Implementation for calculating current contribution streak
    const contributions = await Contribution.find({ user: userId, status: 'completed' })
      .sort({ transactionDate: -1 })
      .limit(10);
    
    let currentStreak = 0;
    let lastDate = null;

    for (const contribution of contributions) {
      const currentDate = new Date(contribution.transactionDate);
      if (lastDate) {
        const daysDiff = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 7) { // Within a week
          currentStreak++;
        } else {
          break;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = currentDate;
    }

    return currentStreak;
  }

  async getUserMonthlyStats(userId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await Contribution.aggregate([
      { $match: { user: userId, status: 'completed', transactionDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$transactionDate' },
            month: { $month: '$transactionDate' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return result.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      totalAmount: item.totalAmount,
      count: item.count
    }));
  }

  async getUserCategoryBreakdown(userId) {
    const result = await Goal.aggregate([
      {
        $match: {
          $or: [
            { createdBy: userId },
            { 'members.user': userId }
          ]
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalTarget: { $sum: '$targetAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return result.map(item => ({
      category: item._id,
      count: item.count,
      totalTarget: item.totalTarget
    }));
  }

  // Additional helper methods for goal, group, and platform analytics
  async getGoalContributions(goalId) {
    return await Contribution.find({ goal: goalId, status: 'completed' })
      .sort({ transactionDate: -1 })
      .populate('user', 'firstName lastName');
  }

  async getGoalMemberStats(goalId) {
    const goal = await Goal.findById(goalId).populate('members.user', 'firstName lastName');
    const contributions = await Contribution.find({ goal: goalId, status: 'completed' });

    return goal.members.map(member => {
      const memberContributions = contributions.filter(c => c.user.toString() === member.user._id.toString());
      const totalContributed = memberContributions.reduce((sum, c) => sum + c.amount, 0);
      
      return {
        user: member.user,
        role: member.role,
        totalContributed,
        contributionCount: memberContributions.length,
        averageContribution: memberContributions.length > 0 ? totalContributed / memberContributions.length : 0
      };
    });
  }

  async getGoalProgressTrend(goalId) {
    const contributions = await Contribution.find({ goal: goalId, status: 'completed' })
      .sort({ transactionDate: 1 });

    let cumulative = 0;
    return contributions.map(contribution => {
      cumulative += contribution.amount;
      return {
        date: contribution.transactionDate,
        amount: contribution.amount,
        cumulative
      };
    });
  }

  async getGoalCompletionPrediction(goalId) {
    const goal = await Goal.findById(goalId);
    const contributions = await Contribution.find({ goal: goalId, status: 'completed' })
      .sort({ transactionDate: -1 })
      .limit(10);

    if (contributions.length < 2) return null;

    // Simple linear regression for prediction
    const avgContribution = contributions.reduce((sum, c) => sum + c.amount, 0) / contributions.length;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const estimatedContributions = Math.ceil(remainingAmount / avgContribution);
    
    const avgDaysBetweenContributions = this.calculateAverageDaysBetweenContributions(contributions);
    const estimatedDays = estimatedContributions * avgDaysBetweenContributions;

    return {
      estimatedContributions,
      estimatedDays,
      estimatedCompletionDate: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000),
      confidence: this.calculatePredictionConfidence(contributions)
    };
  }

  calculateAverageDaysBetweenContributions(contributions) {
    if (contributions.length < 2) return 7; // Default to weekly

    let totalDays = 0;
    for (let i = 0; i < contributions.length - 1; i++) {
      const daysDiff = Math.abs(
        (contributions[i].transactionDate - contributions[i + 1].transactionDate) / (1000 * 60 * 60 * 24)
      );
      totalDays += daysDiff;
    }
    return totalDays / (contributions.length - 1);
  }

  calculatePredictionConfidence(contributions) {
    // Simple confidence calculation based on consistency
    if (contributions.length < 3) return 0.5;
    
    const amounts = contributions.map(c => c.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    // Lower CV = higher confidence
    return Math.max(0.1, Math.min(1, 1 - coefficientOfVariation));
  }

  // Platform analytics helpers
  async getTotalUsers() {
    return await User.countDocuments({ isActive: true });
  }

  async getActiveUsers() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await User.countDocuments({ 
      isActive: true, 
      lastLogin: { $gte: thirtyDaysAgo } 
    });
  }

  async getTotalGoals() {
    return await Goal.countDocuments();
  }

  async getActiveGoals() {
    return await Goal.countDocuments({ status: 'active' });
  }

  async getTotalGroups() {
    return await Group.countDocuments();
  }

  async getTotalContributions() {
    return await Contribution.countDocuments({ status: 'completed' });
  }

  async getTotalAmountContributed() {
    const result = await Contribution.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getMonthlyGrowth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const goalGrowth = await Goal.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      users: userGrowth.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count
      })),
      goals: goalGrowth.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count
      }))
    };
  }

  async getTopCategories() {
    const result = await Goal.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalTarget: { $sum: '$targetAmount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return result.map(item => ({
      category: item._id,
      count: item.count,
      totalTarget: item.totalTarget
    }));
  }

  async getRetentionRate() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [activeUsers, totalUsers] = await Promise.all([
      User.countDocuments({ 
        isActive: true, 
        lastLogin: { $gte: thirtyDaysAgo } 
      }),
      User.countDocuments({ 
        isActive: true, 
        createdAt: { $lte: sixtyDaysAgo } 
      })
    ]);

    return totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : 0;
  }
}

module.exports = new AnalyticsService(); 