const contributionService = require('../services/contribution.service');
const Goal = require('../models/Goal');

const addContributionController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, groupId, amount, method, description, type } = req.body;

    // Validate required fields - either goalId or groupId must be provided
    if ((!goalId && !groupId) || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Goal ID or Group ID and amount are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    let targetEntity = null;
    let contributionType = type || 'individual';

    // Check if it's a goal contribution
    if (goalId) {
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      }
      targetEntity = goal;
      contributionType = goal.type || 'individual';
    }
    // Check if it's a group contribution
    else if (groupId) {
      const Group = require('../models/Group');
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'Group not found'
        });
      }
      targetEntity = group;
      contributionType = 'group';
    }

    const contributionData = {
      userId,
      goalId: goalId || null,
      groupId: groupId || null,
      amount: parseFloat(amount),
      method: method || 'wallet',
      description: description || 'Contribution',
      type: contributionType,
      paymentMethod: method || 'wallet' // Use the method from request
    };

    // Handle different payment methods
    if (method === 'paystack_direct') {
      console.log('💳 Processing Paystack direct payment for:', { method, goalId, groupId, amount });
      
      // For direct Paystack payments, we need to initialize payment
      const paymentService = require('../services/payment.service');
      const paymentResult = await paymentService.initializeContributionPayment({
        userId,
        goalId: goalId || null,
        groupId: groupId || null,
        amount: parseFloat(amount),
        description: description || 'Contribution',
        targetName: targetEntity.name
      });
      
      console.log('📊 Payment result:', paymentResult);
      
      return res.status(200).json({
        success: true,
        data: paymentResult,
        message: 'Payment initialized. Please complete payment to add contribution.'
      });
    } else {
      // For wallet payments, process immediately
      const contribution = await contributionService.addContribution(contributionData);
      
      res.status(201).json({
        success: true,
        data: contribution,
        message: 'Contribution added successfully'
      });
    }
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