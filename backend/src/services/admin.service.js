const Goal = require('../models/Goal');
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const Group = require('../models/Group');
const { Notification } = require('../models/Notification');
const mongoose = require('mongoose');

// Basic admin functions
async function getAllGoals() {
  return Goal.find().populate('createdBy', 'firstName lastName email').populate('group').lean();
}

async function getAllContributions() {
  return Contribution.find().populate('user', 'firstName lastName email').populate('goal', 'name').lean();
}

async function getAllUsers() {
  return User.find().select('-passwordHash').lean();
}

// Enhanced admin dashboard stats
async function getAdminDashboardStats() {
  try {
    const [
      totalUsers,
      activeUsers,
      totalGroups,
      totalGoals,
      totalContributions,
      premiumUsers,
      pendingUsers,
      suspendedUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Group.countDocuments(),
      Goal.countDocuments(),
      Contribution.countDocuments(),
      User.countDocuments({ role: 'premium' }),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ status: 'suspended' })
    ]);

    // Calculate revenue (mock data for now)
    const totalRevenue = await calculateTotalRevenue();
    const monthlyRevenue = await calculateMonthlyRevenue();
    const weeklyRevenue = await calculateWeeklyRevenue();
    const dailyRevenue = await calculateDailyRevenue();

    // System health metrics
    const systemHealth = await getSystemHealth();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        premium: premiumUsers,
        pending: pendingUsers,
        suspended: suspendedUsers
      },
      platform: {
        groups: totalGroups,
        goals: totalGoals,
        contributions: totalContributions
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        daily: dailyRevenue
      },
      system: systemHealth
    };
  } catch (error) {
    console.error('Error getting admin dashboard stats:', error);
    throw error;
  }
}

// User management functions
async function getUserById(userId) {
  return User.findById(userId).select('-passwordHash').lean();
}

async function updateUser(userId, updateData) {
  const allowedFields = ['firstName', 'lastName', 'email', 'status', 'role', 'isAdmin'];
  const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  return User.findByIdAndUpdate(userId, filteredData, { new: true }).select('-passwordHash');
}

async function deleteUser(userId) {
  // Check if user has any contributions or goals
  const [contributions, goals] = await Promise.all([
    Contribution.countDocuments({ user: userId }),
    Goal.countDocuments({ createdBy: userId })
  ]);

  if (contributions > 0 || goals > 0) {
    throw new Error('Cannot delete user with existing contributions or goals');
  }

  return User.findByIdAndDelete(userId);
}

async function suspendUser(userId) {
  return User.findByIdAndUpdate(userId, { status: 'suspended' }, { new: true }).select('-passwordHash');
}

async function activateUser(userId) {
  return User.findByIdAndUpdate(userId, { status: 'active' }, { new: true }).select('-passwordHash');
}

async function getUsersWithFilters(filters = {}) {
  const query = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.role) {
    query.role = filters.role;
  }
  
  if (filters.search) {
    query.$or = [
      { firstName: { $regex: filters.search, $options: 'i' } },
      { lastName: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return User.find(query).select('-passwordHash').lean();
}

// Revenue analytics functions
async function getRevenueAnalytics(period = 'monthly') {
  try {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Mock revenue calculation (replace with actual payment processing)
    const revenue = await calculateRevenueForPeriod(startDate, now);
    const subscriptions = await getSubscriptionStats(startDate, now);
    const premiumUsers = await User.countDocuments({ role: 'premium' });
    const conversionRate = await calculateConversionRate();

    return {
      period,
      revenue,
      subscriptions,
      premiumUsers,
      conversionRate,
      growth: await calculateGrowthRate(period)
    };
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
}

// System health functions
async function getSystemHealth() {
  try {
    const dbStatus = await checkDatabaseHealth();
    const apiStatus = await checkAPIHealth();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      database: dbStatus,
      api: apiStatus,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      uptime: Math.round(uptime),
      status: dbStatus.status === 'healthy' && apiStatus.status === 'healthy' ? 'healthy' : 'warning'
    };
  } catch (error) {
    console.error('Error getting system health:', error);
    throw error;
  }
}

// Helper functions
async function calculateTotalRevenue() {
  // Mock revenue calculation - replace with actual payment processing
  const premiumUsers = await User.countDocuments({ role: 'premium' });
  const monthlySubscription = 99.99;
  const totalContributions = await Contribution.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  const contributionRevenue = totalContributions[0]?.total || 0;
  const subscriptionRevenue = premiumUsers * monthlySubscription * 12; // Annual
  
  return contributionRevenue + subscriptionRevenue;
}

async function calculateMonthlyRevenue() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  return calculateRevenueForPeriod(startOfMonth, new Date());
}

async function calculateWeeklyRevenue() {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  
  return calculateRevenueForPeriod(startOfWeek, new Date());
}

async function calculateDailyRevenue() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  return calculateRevenueForPeriod(startOfDay, new Date());
}

async function calculateRevenueForPeriod(startDate, endDate) {
  // Mock calculation - replace with actual payment processing
  const contributions = await Contribution.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: { _id: null, total: { $sum: '$amount' } }
    }
  ]);
  
  return contributions[0]?.total || 0;
}

async function getSubscriptionStats(startDate, endDate) {
  const premiumUsers = await User.countDocuments({ 
    role: 'premium',
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  return {
    total: premiumUsers,
    monthly: 99.99,
    annual: 99.99 * 12
  };
}

async function calculateConversionRate() {
  const totalUsers = await User.countDocuments();
  const premiumUsers = await User.countDocuments({ role: 'premium' });
  
  return totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;
}

async function calculateGrowthRate(period) {
  // Mock growth calculation
  return Math.random() * 30 + 5; // 5-35% growth
}

async function checkDatabaseHealth() {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', responseTime: 'fast' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkAPIHealth() {
  try {
    const startTime = Date.now();
    // Simulate API health check
    await new Promise(resolve => setTimeout(resolve, 10));
    const responseTime = Date.now() - startTime;
    
    return { 
      status: 'healthy', 
      responseTime: responseTime < 100 ? 'fast' : 'slow'
    };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

module.exports = { 
  getAllGoals, 
  getAllContributions, 
  getAllUsers,
  getAdminDashboardStats,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getUsersWithFilters,
  getRevenueAnalytics,
  getSystemHealth
};