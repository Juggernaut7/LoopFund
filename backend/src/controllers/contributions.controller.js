const contributionService = require('../services/contribution.service');
const { Goal } = require('../models/Goal');

const addContributionController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, amount, method, description, type } = req.body;

    // Validate required fields
    if (!goalId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Goal ID and amount are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Check if goal exists
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    const contributionData = {
      userId,
      goalId,
      amount: parseFloat(amount),
      method: method || 'bank_transfer',
      description: description || 'Contribution',
      type: type || goal.type || 'individual'
    };

    const contribution = await contributionService.addContribution(contributionData);

    res.status(201).json({
      success: true,
      data: contribution,
      message: 'Contribution added successfully'
    });
  } catch (error) {
    console.error('Error in addContributionController:', error);
    
    if (error.message === 'You are not authorized to contribute to this goal') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    if (error.message === 'Goal not found') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to add contribution. Please try again.'
    });
  }
};

const getUserContributionsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      goalId: req.query.goalId,
      groupId: req.query.groupId,
      type: req.query.type
    };

    const result = await contributionService.getUserContributions(userId, options);

    res.json({
      success: true,
      data: result.contributions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getGoalContributionsController = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };

    const result = await contributionService.getGoalContributions(goalId, options);

    res.json({
      success: true,
      data: result.contributions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getContributionStatsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const stats = await contributionService.getContributionStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addContributionController,
  getUserContributionsController,
  getGoalContributionsController,
  getContributionStatsController
};