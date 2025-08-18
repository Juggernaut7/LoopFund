const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { Goal } = require('../models/Goal');
const { Contribution } = require('../models/Contribution');
const { Group } = require('../models/Group');
const { User } = require('../models/User');

const router = Router();

/**
 * @openapi
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get comprehensive analytics for the dashboard
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 */
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's goals, contributions, and groups
    const [goals, contributions, groups] = await Promise.all([
      Goal.find({ 
        $or: [
          { createdBy: userId }, 
          { 'members.user': userId }
        ] 
      }),
      Contribution.find({ user: userId }),
      Group.find({ 
        $or: [
          { createdBy: userId }, 
          { 'members.user': userId }
        ] 
      })
    ]);

    // Calculate summary statistics
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status !== 'completed').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalContributed = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
    const completionRate = totalTarget > 0 ? (totalContributed / totalTarget) * 100 : 0;
    
    // Calculate monthly trends
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    const monthlyContributions = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthContributions = contributions.filter(c => {
        const contribDate = new Date(c.createdAt);
        return contribDate >= monthStart && contribDate <= monthEnd;
      });
      
      monthlyContributions.unshift({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: monthContributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        count: monthContributions.length
      });
    }

    // Goal progress breakdown
    const goalProgress = goals.map(goal => ({
      id: goal._id,
      name: goal.name,
      current: goal.currentAmount || 0,
      target: goal.targetAmount || 0,
      percentage: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
      isGroupGoal: goal.isGroupGoal || false,
      status: goal.status,
      createdAt: goal.createdAt
    }));

    // Recent activity
    const recentActivity = contributions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(contribution => ({
        id: contribution._id,
        amount: contribution.amount,
        description: contribution.description,
        createdAt: contribution.createdAt,
        goalId: contribution.goal
      }));

    // Savings rate calculation
    const daysSinceJoining = Math.floor((now - new Date(goals[0]?.createdAt || now)) / (1000 * 60 * 60 * 24));
    const dailySavingsRate = daysSinceJoining > 0 ? totalContributed / daysSinceJoining : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalGoals,
          activeGoals,
          completedGoals,
          totalContributed,
          totalTarget,
          completionRate: Math.round(completionRate * 100) / 100,
          dailySavingsRate: Math.round(dailySavingsRate * 100) / 100
        },
        trends: {
          monthlyContributions
        },
        goalProgress,
        recentActivity,
        groups: groups.length
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/analytics/goals:
 *   get:
 *     summary: Get goal-specific analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Goal analytics data
 */
router.get('/goals', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const goals = await Goal.find({ 
      $or: [
        { createdBy: userId }, 
        { 'members.user': userId }
      ] 
    }).populate('group');

    // Goal category breakdown
    const categoryBreakdown = goals.reduce((acc, goal) => {
      const category = goal.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Goal status breakdown
    const statusBreakdown = goals.reduce((acc, goal) => {
      const status = goal.status || 'active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Goal type breakdown
    const typeBreakdown = goals.reduce((acc, goal) => {
      const type = goal.isGroupGoal ? 'group' : 'individual';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalGoals: goals.length,
        categoryBreakdown,
        statusBreakdown,
        typeBreakdown,
        goals: goals.map(goal => ({
          id: goal._id,
          name: goal.name,
          category: goal.category,
          status: goal.status,
          isGroupGoal: goal.isGroupGoal,
          currentAmount: goal.currentAmount,
          targetAmount: goal.targetAmount,
          progress: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
          createdAt: goal.createdAt,
          group: goal.group
        }))
      }
    });

  } catch (error) {
    console.error('Goal analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/analytics/contributions:
 *   get:
 *     summary: Get contribution analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Contribution analytics data
 */
router.get('/contributions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const contributions = await Contribution.find({ user: userId })
      .populate('goal')
      .sort({ createdAt: -1 });

    // Contribution trends by time period
    const now = new Date();
    const periods = [
      { name: 'This Week', days: 7 },
      { name: 'This Month', days: 30 },
      { name: 'This Quarter', days: 90 },
      { name: 'This Year', days: 365 }
    ];

    const periodStats = periods.map(period => {
      const startDate = new Date(now.getTime() - period.days * 24 * 60 * 60 * 1000);
      const periodContributions = contributions.filter(c => 
        new Date(c.createdAt) >= startDate
      );
      
      return {
        period: period.name,
        amount: periodContributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        count: periodContributions.length,
        average: periodContributions.length > 0 
          ? periodContributions.reduce((sum, c) => sum + (c.amount || 0), 0) / periodContributions.length 
          : 0
      };
    });

    // Payment method breakdown
    const paymentMethodBreakdown = contributions.reduce((acc, contribution) => {
      const method = contribution.paymentMethod || 'unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalContributions: contributions.length,
        totalAmount: contributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        periodStats,
        paymentMethodBreakdown,
        recentContributions: contributions.slice(0, 20)
      }
    });

  } catch (error) {
    console.error('Contribution analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 