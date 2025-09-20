const Goal = require('../models/Goal');
const Contribution = require('../models/Contribution');
const Group = require('../models/Group');
const User = require('../models/User');

class AnalyticsService {
  // Get comprehensive analytics for a user
  async getUserAnalytics(userId, timeRange = '30') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      // Fetch user's goals and contributions
      const [goals, contributions, groups, userGroupContributions, userGoalContributions] = await Promise.all([
        Goal.find({ user: userId }),
        Contribution.find({ 
          user: userId, 
          createdAt: { $gte: startDate } 
        }).populate('goal', 'name'),
        Group.find({ 
          'members.user': userId,
          createdAt: { $gte: startDate }
        }),
        // Get user's contributions from Group.contributions arrays
        Group.find({ 
          'members.user': userId,
          'contributions.userId': userId,
          'contributions.paidAt': { $gte: startDate }
        }).select('contributions name').populate('contributions.userId', 'name'),
        // Get user's contributions from Goal.contributions arrays
        Goal.find({ 
          user: userId,
          'contributions.userId': userId,
          'contributions.paidAt': { $gte: startDate }
        }).select('contributions name').populate('contributions.userId', 'name')
      ]);

      // Extract and format group contributions
      const groupContributions = userGroupContributions.flatMap(group => 
        group.contributions
          .filter(contrib => contrib.userId.toString() === userId.toString())
          .map(contrib => ({
            _id: contrib._id,
            user: contrib.userId,
            amount: contrib.amount,
            description: contrib.description,
            createdAt: contrib.paidAt || contrib.createdAt,
            type: 'group_contribution',
            group: { _id: group._id, name: group.name }
          }))
      );

      // Extract and format goal contributions
      const goalContributions = userGoalContributions.flatMap(goal => 
        goal.contributions
          .filter(contrib => contrib.userId.toString() === userId.toString())
          .map(contrib => ({
            _id: contrib._id,
            user: contrib.userId,
            amount: contrib.amount,
            description: contrib.description,
            createdAt: contrib.paidAt || contrib.createdAt,
            type: 'goal_contribution',
            goal: { _id: goal._id, name: goal.name }
          }))
      );

      // Combine all contributions
      const allContributions = [...contributions, ...groupContributions, ...goalContributions];

      console.log('🔍 Analytics data debug:', {
        userId,
        goalsCount: goals.length,
        contributionsCount: contributions.length,
        groupContributionsCount: groupContributions.length,
        goalContributionsCount: goalContributions.length,
        allContributionsCount: allContributions.length,
        groupsCount: groups.length,
        sampleContributions: allContributions.slice(0, 3).map(c => ({
          type: c.type,
          amount: c.amount,
          createdAt: c.createdAt
        }))
      });

      // Calculate summary metrics
      const summary = this.calculateSummaryMetrics(goals, allContributions, groups);
      
      // Generate savings trend data
      const savingsTrend = this.generateSavingsTrend(allContributions, startDate);
      
      // Calculate goal progress
      const goalProgress = this.calculateGoalProgress(goals);
      
      // Get top performers
      const topPerformers = this.getTopPerformers(goals, allContributions);
      
      // Get recent activity
      const recentActivity = this.getRecentActivity(allContributions, goals);
      
      // Generate financial projections
      const financialProjections = this.generateFinancialProjections(goals, allContributions);

      return {
        summary,
        goals, // Add goals to the response
        savingsTrend,
        goalProgress,
        topPerformers,
        recentActivity,
        financialProjections
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Get group analytics
  async getGroupAnalytics(groupId, timeRange = '30') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const group = await Group.findById(groupId).populate('members.user', 'name email');
      if (!group) {
        throw new Error('Group not found');
      }

      // Get group contributions from both Contribution model and Group.contributions array
      const [contributionModelContributions, groupContributions] = await Promise.all([
        Contribution.find({
          group: groupId,
          createdAt: { $gte: startDate }
        }).populate('user', 'name'),
        // Get contributions from Group.contributions array
        Group.findById(groupId).select('contributions').populate('contributions.userId', 'name')
      ]);

      // Combine both types of contributions
      const contributions = [
        ...contributionModelContributions,
        ...(groupContributions?.contributions || []).map(contrib => ({
          _id: contrib._id,
          user: contrib.userId,
          amount: contrib.amount,
          description: contrib.description,
          createdAt: contrib.paidAt || contrib.createdAt,
          type: 'group_contribution'
        }))
      ];

      // Calculate group metrics
      const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
      const memberCount = group.members.length;
      const averageContribution = memberCount > 0 ? totalContributed / memberCount : 0;
      const progressPercentage = group.targetAmount > 0 ? (totalContributed / group.targetAmount) * 100 : 0;

      // Get member performance
      const memberPerformance = group.members.map(member => {
        const memberContributions = contributions.filter(c => c.user._id.toString() === member.user._id.toString());
        const memberTotal = memberContributions.reduce((sum, c) => sum + c.amount, 0);
        
        return {
          user: member.user,
          totalContributed: memberTotal,
          contributionCount: memberContributions.length,
          lastContribution: memberContributions.length > 0 ? 
            memberContributions[memberContributions.length - 1].createdAt : null
        };
      }).sort((a, b) => b.totalContributed - a.totalContributed);

      return {
        group: {
          id: group._id,
          name: group.name,
          targetAmount: group.targetAmount,
          currentAmount: totalContributed,
          progressPercentage,
          memberCount,
          averageContribution
        },
        memberPerformance,
        contributions: contributions.slice(0, 10), // Recent contributions
        savingsTrend: this.generateSavingsTrend(contributions, startDate)
      };
    } catch (error) {
      console.error('Error getting group analytics:', error);
      throw error;
    }
  }

  // Get system-wide analytics (for admin)
  async getSystemAnalytics(timeRange = '30') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const [totalUsers, totalGoals, totalGroups, totalContributions] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startDate } }),
        Goal.countDocuments({ createdAt: { $gte: startDate } }),
        Group.countDocuments({ createdAt: { $gte: startDate } }),
        Contribution.find({ createdAt: { $gte: startDate } })
      ]);

      const totalAmount = totalContributions.reduce((sum, c) => sum + c.amount, 0);
      const averageContribution = totalContributions.length > 0 ? totalAmount / totalContributions.length : 0;

      // Get top performing groups
      const topGroups = await Group.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $lookup: {
            from: 'contributions',
            localField: '_id',
            foreignField: 'group',
            as: 'contributions'
          }
        },
        {
          $addFields: {
            totalContributed: { $sum: '$contributions.amount' },
            memberCount: { $size: '$members' }
          }
        },
        { $sort: { totalContributed: -1 } },
        { $limit: 10 }
      ]);

      return {
        summary: {
          totalUsers,
          totalGoals,
          totalGroups,
          totalContributions: totalContributions.length,
          totalAmount,
          averageContribution
        },
        topGroups,
        trends: this.generateSystemTrends(startDate)
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw error;
    }
  }

  // Helper methods
  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90':
        startDate.setDate(now.getDate() - 90);
        break;
      case '365':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    return startDate;
  }

  calculateSummaryMetrics(goals, contributions, groups) {
    const totalSaved = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalContributions = contributions.length;
    
    // Updated to handle new contribution types
    const groupContributions = contributions.filter(c => 
      c.type === 'group_contribution' || c.group
    ).reduce((sum, c) => sum + (c.amount || 0), 0);
    
    const soloSavings = contributions.filter(c => 
      c.type === 'goal_contribution' || (!c.group && !c.type)
    ).reduce((sum, c) => sum + (c.amount || 0), 0);
    
    const activeGoals = goals.filter(g => g.isActive !== false).length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const groupCount = groups.length;
    const soloGoalCount = goals.filter(g => !g.isGroupGoal).length;
    
    // Calculate average contribution
    const averageContribution = totalContributions > 0 ? totalSaved / totalContributions : 0;
    
    // Calculate this month's contributions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthContributions = contributions.filter(c => {
      const contributionDate = new Date(c.createdAt || c.paidAt);
      return contributionDate >= startOfMonth;
    });
    const thisMonth = thisMonthContributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    
    // Calculate completion rate
    const totalGoals = goals.length;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    // Calculate savings rate (daily average)
    const days = 30; // Default to 30 days
    const savingsRate = days > 0 ? totalSaved / days : 0;

    console.log('🔍 Analytics calculation debug:', {
      totalContributions,
      totalSaved,
      groupContributions,
      soloSavings,
      activeGoals,
      completedGoals,
      groupCount,
      soloGoalCount,
      averageContribution,
      thisMonth,
      completionRate,
      contributionTypes: contributions.map(c => ({ type: c.type, amount: c.amount, createdAt: c.createdAt }))
    });

    return {
      totalSaved,
      totalContributions,
      groupContributions,
      soloSavings,
      activeGoals,
      completedGoals,
      groupCount,
      soloGoalCount,
      averageContribution: Math.round(averageContribution * 100) / 100,
      thisMonth,
      completionRate: Math.round(completionRate * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100
    };
  }

  generateSavingsTrend(contributions, startDate) {
    const trend = [];
    const current = new Date(startDate);
    const now = new Date();
    
    // Group contributions by date
    const contributionsByDate = {};
    contributions.forEach(c => {
      const date = c.createdAt.toISOString().split('T')[0];
      if (!contributionsByDate[date]) {
        contributionsByDate[date] = { group: 0, individual: 0 };
      }
      if (c.group) {
        contributionsByDate[date].group += c.amount;
      } else {
        contributionsByDate[date].individual += c.amount;
      }
    });

    // Generate trend data
    while (current <= now) {
      const dateStr = current.toISOString().split('T')[0];
      const dateData = contributionsByDate[dateStr] || { group: 0, individual: 0 };
      
      trend.push({
        date: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        groupSavings: dateData.group,
        individualSavings: dateData.individual,
        total: dateData.group + dateData.individual
      });
      
      current.setDate(current.getDate() + 1);
    }

    return trend.slice(-30); // Last 30 days
  }

  calculateGoalProgress(goals) {
    return goals.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const completed = Math.min(progress, 100);
      const remaining = Math.max(100 - progress, 0);
      
      return {
        name: goal.name,
        completed: Math.round(completed),
        progress: Math.round(Math.min(progress, 100)),
        pending: Math.round(Math.max(remaining, 0)),
        total: 100,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount
      };
    }).sort((a, b) => b.progress - a.progress);
  }

  getTopPerformers(goals, contributions) {
    const performers = [];
    
    // Add individual goals
    goals.filter(g => !g.isGroupGoal).forEach(goal => {
      const goalContributions = contributions.filter(c => c.goal && c.goal._id.toString() === goal._id.toString());
      const totalAmount = goalContributions.reduce((sum, c) => sum + c.amount, 0);
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      
      performers.push({
        name: goal.name,
        type: 'individual',
        amount: totalAmount,
        progress: Math.round(progress)
      });
    });

    // Add group goals
    goals.filter(g => g.isGroupGoal).forEach(goal => {
      const goalContributions = contributions.filter(c => c.goal && c.goal._id.toString() === goal._id.toString());
      const totalAmount = goalContributions.reduce((sum, c) => sum + c.amount, 0);
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      
      performers.push({
        name: goal.name,
        type: 'group',
        amount: totalAmount,
        progress: Math.round(progress),
        members: goal.members ? goal.members.length : 0
      });
    });

    return performers.sort((a, b) => b.amount - a.amount).slice(0, 10);
  }

  getRecentActivity(contributions, goals) {
    const activities = [];
    
    contributions.slice(0, 20).forEach(contribution => {
      const date = contribution.createdAt || contribution.paidAt || new Date();
      const goalName = contribution.goal ? contribution.goal.name : 
                      contribution.type === 'group_contribution' ? 'Group Contribution' :
                      contribution.type === 'goal_contribution' ? 'Goal Contribution' : 'Unknown Goal';
      
      activities.push({
        type: 'contribution',
        goal: goalName,
        amount: contribution.amount,
        date: new Date(date).toISOString().split('T')[0],
        status: 'completed'
      });
    });

    // Add goal completions
    goals.filter(g => g.status === 'completed').forEach(goal => {
      activities.push({
        type: 'goal_completed',
        goal: goal.name,
        amount: goal.targetAmount,
        date: goal.updatedAt ? goal.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: 'completed'
      });
    });

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  }

  generateFinancialProjections(goals, contributions) {
    const projections = [];
    const now = new Date();
    
    // Calculate current savings rate
    const last30Days = contributions.filter(c => {
      const contributionDate = new Date(c.createdAt);
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      return contributionDate >= thirtyDaysAgo;
    });
    
    const currentMonthlyRate = last30Days.reduce((sum, c) => sum + c.amount, 0);
    
    // Generate 8 months of projections
    for (let i = 1; i <= 8; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const projected = currentMonthlyRate * i;
      const actual = Math.random() * 0.2 * projected + projected * 0.9; // Simulate some variance
      
      projections.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        projected: Math.round(projected),
        actual: Math.round(actual)
      });
    }
    
    return projections;
  }

  generateSystemTrends(startDate) {
    // This would generate system-wide trends
    // For now, return mock data
    return {
      userGrowth: [],
      goalCreation: [],
      contributionVolume: []
    };
  }
}

module.exports = new AnalyticsService();