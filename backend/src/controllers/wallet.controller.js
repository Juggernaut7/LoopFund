const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Group = require('../models/Group');

// Get user wallet
const getUserWallet = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log('🔍 Getting wallet for user:', userId);
    
    let wallet = await Wallet.findOne({ user: userId });
    console.log('📊 Found wallet:', wallet);
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = new Wallet({
        user: userId,
        balance: 0,
        transactions: []
      });
      await wallet.save();
      console.log('🆕 Created new wallet:', wallet);
    }
    
    console.log('💰 Returning wallet data:', wallet);
    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('❌ Get wallet error:', error);
    next(error);
  }
};

// Add money to wallet (deposit)
const addToWallet = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { amount, reference, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      wallet = new Wallet({
        user: userId,
        balance: 0,
        transactions: []
      });
    }
    
    // Add transaction
    wallet.transactions.push({
      type: 'deposit',
      amount: amount,
      description: description || 'Wallet deposit',
      reference: reference,
      status: 'completed'
    });
    
    // Update balance
    wallet.balance += amount;
    
    await wallet.save();
    
    res.json({
      success: true,
      data: wallet,
      message: 'Money added to wallet successfully'
    });
  } catch (error) {
    console.error('Add to wallet error:', error);
    next(error);
  }
};

// Contribute to goal from wallet
const contributeToGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, amount, description } = req.body;
    
    if (!goalId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal ID or amount'
      });
    }
    
    // Check if goal exists
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    
    // Check if goal is still active
    if (goal.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Goal is already completed'
      });
    }
    
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    // Check if user has sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }
    
    // Deduct from wallet
    wallet.balance -= amount;
    
    // Add transaction
    wallet.transactions.push({
      type: 'contribution',
      amount: -amount, // Negative for deduction
      description: description || `Contribution to goal: ${goal.name}`,
      goalId: goalId,
      status: 'completed'
    });
    
    await wallet.save();
    
    // Update goal progress
    goal.currentAmount = (goal.currentAmount || 0) + amount;
    
    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }
    
    await goal.save();
    
    res.json({
      success: true,
      data: {
        wallet: wallet,
        goal: goal
      },
      message: 'Contribution successful'
    });
  } catch (error) {
    console.error('Contribute to goal error:', error);
    next(error);
  }
};

// Contribute to group from wallet
const contributeToGroup = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { groupId, amount, description } = req.body;
    
    if (!groupId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid group ID or amount'
      });
    }
    
    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    // Check if user has sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }
    
    // Deduct from wallet
    wallet.balance -= amount;
    
    // Add transaction
    wallet.transactions.push({
      type: 'contribution',
      amount: -amount, // Negative for deduction
      description: description || `Contribution to group: ${group.name}`,
      groupId: groupId,
      status: 'completed'
    });
    
    await wallet.save();
    
    // Update group progress
    group.currentAmount = (group.currentAmount || 0) + amount;
    
    // Check if group goal is completed
    if (group.currentAmount >= group.targetAmount) {
      group.status = 'completed';
      group.completedAt = new Date();
    }
    
    await group.save();
    
    res.json({
      success: true,
      data: {
        wallet: wallet,
        group: group
      },
      message: 'Group contribution successful'
    });
  } catch (error) {
    console.error('Contribute to group error:', error);
    next(error);
  }
};

// Get wallet transactions
const getWalletTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, type } = req.query;
    
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      return res.json({
        success: true,
        data: {
          transactions: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    }
    
    let transactions = wallet.transactions;
    
    // Filter by type if provided
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    // Sort by timestamp (newest first)
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: transactions.length,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get wallet transactions error:', error);
    next(error);
  }
};

// Release goal funds to goal owner
const releaseGoalFunds = async (req, res, next) => {
  try {
    const { goalId } = req.body;
    
    if (!goalId) {
      return res.status(400).json({
        success: false,
        message: 'Goal ID is required'
      });
    }
    
    // Check if goal exists and is completed
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    
    if (goal.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Goal is not completed yet'
      });
    }
    
    if (goal.fundsReleased) {
      return res.status(400).json({
        success: false,
        message: 'Funds already released'
      });
    }
    
    // Get goal owner's wallet
    let ownerWallet = await Wallet.findOne({ user: goal.user });
    
    if (!ownerWallet) {
      ownerWallet = new Wallet({
        user: goal.user,
        balance: 0,
        transactions: []
      });
    }
    
    // Add funds to owner's wallet
    ownerWallet.balance += goal.currentAmount;
    
    // Add transaction
    ownerWallet.transactions.push({
      type: 'goal_release',
      amount: goal.currentAmount,
      description: `Goal completion funds: ${goal.name}`,
      goalId: goalId,
      status: 'completed'
    });
    
    await ownerWallet.save();
    
    // Mark goal as funds released
    goal.fundsReleased = true;
    goal.fundsReleasedAt = new Date();
    await goal.save();
    
    res.json({
      success: true,
      data: {
        wallet: ownerWallet,
        goal: goal
      },
      message: 'Funds released to goal owner successfully'
    });
  } catch (error) {
    console.error('Release goal funds error:', error);
    next(error);
  }
};

// Release group funds to group creator
const releaseGroupFunds = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    
    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }
    
    // Check if group exists and is completed
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }
    
    if (group.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Group is not completed yet'
      });
    }
    
    if (group.fundsReleased) {
      return res.status(400).json({
        success: false,
        message: 'Funds already released'
      });
    }
    
    // Get group creator's wallet
    let creatorWallet = await Wallet.findOne({ user: group.createdBy });
    
    if (!creatorWallet) {
      creatorWallet = new Wallet({
        user: group.createdBy,
        balance: 0,
        transactions: []
      });
    }
    
    // Add funds to creator's wallet
    creatorWallet.balance += group.currentAmount;
    
    // Add transaction
    creatorWallet.transactions.push({
      type: 'group_release',
      amount: group.currentAmount,
      description: `Group completion funds: ${group.name}`,
      groupId: groupId,
      status: 'completed'
    });
    
    await creatorWallet.save();
    
    // Mark group as funds released
    group.fundsReleased = true;
    group.fundsReleasedAt = new Date();
    await group.save();
    
    res.json({
      success: true,
      data: {
        wallet: creatorWallet,
        group: group
      },
      message: 'Funds released to group creator successfully'
    });
  } catch (error) {
    console.error('Release group funds error:', error);
    next(error);
  }
};

module.exports = {
  getUserWallet,
  addToWallet,
  contributeToGoal,
  contributeToGroup,
  getWalletTransactions,
  releaseGoalFunds,
  releaseGroupFunds
};
