const { 
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
} = require('../services/admin.service');

// Basic admin functions
async function getAllGoalsController(req, res, next) {
  try {
    const goals = await getAllGoals();
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
}

async function getAllContributionsController(req, res, next) {
  try {
    const contributions = await getAllContributions();
    res.json({ success: true, data: contributions });
  } catch (error) {
    next(error);
  }
}

async function getAllUsersController(req, res, next) {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

// Enhanced admin dashboard
async function getAdminDashboardStatsController(req, res, next) {
  try {
    const stats = await getAdminDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

// User management functions
async function getUserByIdController(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUserController(req, res, next) {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const updatedUser = await updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: updatedUser, message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
}

async function deleteUserController(req, res, next) {
  try {
    const { userId } = req.params;
    
    await deleteUser(userId);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    if (error.message.includes('Cannot delete user')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
}

async function suspendUserController(req, res, next) {
  try {
    const { userId } = req.params;
    
    const suspendedUser = await suspendUser(userId);
    
    if (!suspendedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: suspendedUser, message: 'User suspended successfully' });
  } catch (error) {
    next(error);
  }
}

async function activateUserController(req, res, next) {
  try {
    const { userId } = req.params;
    
    const activatedUser = await activateUser(userId);
    
    if (!activatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: activatedUser, message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
}

async function getUsersWithFiltersController(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      role: req.query.role,
      search: req.query.search
    };
    
    const users = await getUsersWithFilters(filters);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

// Revenue analytics functions
async function getRevenueAnalyticsController(req, res, next) {
  try {
    const { period = 'monthly' } = req.query;
    const analytics = await getRevenueAnalytics(period);
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}

// System health functions
async function getSystemHealthController(req, res, next) {
  try {
    const health = await getSystemHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  getAllGoals: getAllGoalsController, 
  getAllContributions: getAllContributionsController, 
  getAllUsers: getAllUsersController,
  getAdminDashboardStats: getAdminDashboardStatsController,
  getUserById: getUserByIdController,
  updateUser: updateUserController,
  deleteUser: deleteUserController,
  suspendUser: suspendUserController,
  activateUser: activateUserController,
  getUsersWithFilters: getUsersWithFiltersController,
  getRevenueAnalytics: getRevenueAnalyticsController,
  getSystemHealth: getSystemHealthController
};