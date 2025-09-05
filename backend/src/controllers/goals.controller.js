const goalService = require('../services/goal.service');
const Goal = require('../models/Goal');

const createGoalController = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const userId = req.user.userId;
    const goalData = {
      ...req.body,
      user: userId
    };

    console.log('Goal data to create:', goalData);

    // Validate required fields
    if (!goalData.name || !goalData.targetAmount) {
      return res.status(400).json({
        success: false,
        error: 'Name and target amount are required'
      });
    }

    // Validate target amount
    if (goalData.targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Target amount must be greater than 0'
      });
    }

    const goal = await goalService.createGoal(goalData);

    res.status(201).json({
      success: true,
      data: goal,
      message: 'Goal created successfully'
    });
  } catch (error) {
    console.error('Full error details:', error);
    next(error);
  }
};

const getUserGoalsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      category: req.query.category,
      isActive: req.query.isActive !== 'false'
    };

    const result = await goalService.getUserGoals(userId, options);

    res.json({
      success: true,
      data: result.goals,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getGoalByIdController = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;

    const goal = await goalService.getGoalById(goalId, userId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

const updateGoalController = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    const goal = await goalService.updateGoal(goalId, userId, updateData);

    res.json({
      success: true,
      data: goal,
      message: 'Goal updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteGoalController = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;

    await goalService.deleteGoal(goalId, userId);

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoalController,
  getUserGoalsController,
  getGoalByIdController,
  updateGoalController,
  deleteGoalController
};