const goalService = require('../services/goal.service');
const Goal = require('../models/Goal');

const createGoalController = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const userId = req.user.userId;
    const { feeData, ...goalData } = req.body;
    const finalGoalData = {
      ...goalData,
      user: userId
    };

    console.log('Goal data to create:', finalGoalData);

    // Validate required fields
    if (!finalGoalData.name || !finalGoalData.targetAmount) {
      return res.status(400).json({
        success: false,
        error: 'Name and target amount are required'
      });
    }

    // Validate target amount
    if (finalGoalData.targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Target amount must be greater than 0'
      });
    }

    // Process wallet deduction if feeData is provided
    if (feeData && feeData.totalFee > 0) {
      const Wallet = require('../models/Wallet');
      
      // Find user's wallet
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found. Please create a wallet first.'
        });
      }
      
      // Check if user has sufficient balance
      if (wallet.balance < feeData.totalFee) {
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance. Required: ₦${feeData.totalFee.toLocaleString()}, Available: ₦${wallet.balance.toLocaleString()}`
        });
      }
      
      // Deduct fee from wallet
      wallet.balance -= feeData.totalFee;
      
      // Add transaction record
      wallet.transactions.push({
        type: 'goal_creation_fee',
        amount: -feeData.totalFee, // Negative for deduction
        description: `Goal creation fee for "${finalGoalData.name}"`,
        status: 'completed',
        timestamp: new Date(),
        metadata: {
          goalName: finalGoalData.name,
          targetAmount: finalGoalData.targetAmount,
          feeBreakdown: feeData
        }
      });
      
      await wallet.save();
      console.log(`✅ Goal creation fee of ₦${feeData.totalFee} deducted from wallet`);
    }

    const goal = await goalService.createGoal(finalGoalData);

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