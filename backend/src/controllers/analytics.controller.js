const analyticsService = require('../services/analytics.service');

// Get user analytics
const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30' } = req.query;

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    next(error);
  }
};

// Get group analytics
const getGroupAnalytics = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { timeRange = '30' } = req.query;
    const userId = req.user.userId;

    // Verify user is member of the group
    const Group = require('../models/Group');
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const isMember = group.members.some(member => 
      member.user.toString() === userId && member.isActive
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this group.'
      });
    }

    const analytics = await analyticsService.getGroupAnalytics(groupId, timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get group analytics error:', error);
    next(error);
  }
};

// Get system analytics (admin only)
const getSystemAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '30' } = req.query;

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const analytics = await analyticsService.getSystemAnalytics(timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    next(error);
  }
};

// Get analytics summary
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30' } = req.query;

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    // Return only summary data for quick loading
    res.json({
      success: true,
      data: {
        summary: analytics.summary,
        recentActivity: analytics.recentActivity.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    next(error);
  }
};

// Export analytics data
const exportAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30', format = 'json' } = req.query;

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(analytics);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${timeRange}days.csv"`);
      res.send(csvData);
    } else {
      // Return JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${timeRange}days.json"`);
      res.json({
        success: true,
        data: analytics,
        exportDate: new Date().toISOString(),
        timeRange,
        userId
      });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    next(error);
  }
};

// Helper function to convert analytics to CSV
const convertToCSV = (analytics) => {
  const csvRows = [];
  
  // Add summary data
  csvRows.push('Metric,Value');
  csvRows.push(`Total Saved,${analytics.summary.totalSaved}`);
  csvRows.push(`Group Contributions,${analytics.summary.groupContributions}`);
  csvRows.push(`Solo Savings,${analytics.summary.soloSavings}`);
  csvRows.push(`Active Goals,${analytics.summary.activeGoals}`);
  csvRows.push(`Completed Goals,${analytics.summary.completedGoals}`);
  csvRows.push(`Savings Rate,${analytics.summary.savingsRate}`);
  
  // Add recent activity
  csvRows.push('');
  csvRows.push('Recent Activity');
  csvRows.push('Type,Goal,Amount,Date,Status');
  analytics.recentActivity.forEach(activity => {
    csvRows.push(`${activity.type},${activity.goal},${activity.amount},${activity.date},${activity.status}`);
  });
  
  // Add goal progress
  csvRows.push('');
  csvRows.push('Goal Progress');
  csvRows.push('Goal Name,Completed %,Progress %,Pending %');
  analytics.goalProgress.forEach(goal => {
    csvRows.push(`${goal.name},${goal.completed},${goal.progress},${goal.pending}`);
  });
  
  return csvRows.join('\n');
};

module.exports = {
  getUserAnalytics,
  getGroupAnalytics,
  getSystemAnalytics,
  getAnalyticsSummary,
  exportAnalytics
};
