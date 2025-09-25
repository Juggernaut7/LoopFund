const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Group = require('../models/Group');
const { validationResult } = require('express-validator');

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
      status: 'completed',
      createdAt: new Date(),
      metadata: {
        source: 'paystack',
        paymentMethod: 'card',
        transactionType: 'wallet_deposit'
      }
    });
    
    // Update balance
    wallet.balance += amount;
    
    await wallet.save();
    
    // Create notification for successful deposit
    try {
      const notificationService = require('../services/notification.service');
      await notificationService.createNotification({
        user: userId,
        title: 'Deposit Successful',
        message: `₦${amount.toLocaleString()} has been added to your wallet`,
        type: 'success',
        category: 'wallet',
        priority: 'medium',
        metadata: {
          amount: amount,
          reference: reference,
          transactionType: 'deposit'
        }
      });
    } catch (notificationError) {
      console.error('Error creating deposit notification:', notificationError);
    }
    
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
      status: 'completed',
      createdAt: new Date(),
      metadata: {
        goalName: goal.name,
        goalType: goal.type,
        transactionType: 'goal_contribution',
        paymentMethod: 'wallet'
      }
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
      status: 'completed',
      createdAt: new Date(),
      metadata: {
        groupName: group.name,
        groupType: group.category,
        transactionType: 'group_contribution',
        paymentMethod: 'wallet'
      }
    });
    
    await wallet.save();
    
    // Update group progress
    group.currentAmount = (group.currentAmount || 0) + amount;
    
    // Check if group goal is completed
    if (group.currentAmount >= group.targetAmount && group.status !== 'completed') {
      group.status = 'completed';
      group.completedAt = new Date();
      
      // Trigger fund release check for completed group
      const fundReleaseService = require('../services/fundRelease.service');
      setTimeout(async () => {
        try {
          await fundReleaseService.checkAndReleaseGroupFunds(group._id);
        } catch (error) {
          console.error('Error auto-releasing group funds:', error);
        }
      }, 1000); // Small delay to ensure group is saved
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
    const { 
      page = 1, 
      limit = 20, 
      type, 
      status, 
      startDate, 
      endDate,
      search 
    } = req.query;

    console.log('🔍 Getting transactions for user:', userId);
    const wallet = await Wallet.findOne({ user: userId });
    console.log('🔍 Wallet found:', !!wallet);

    if (!wallet) {
      console.log('❌ Wallet not found for user:', userId);
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    let transactions = wallet.transactions;
    console.log('🔍 All wallet transactions:', transactions);
    console.log('🔍 Wallet ID:', wallet._id);
    console.log('🔍 User ID:', userId);
    console.log('🔍 Transaction count:', transactions.length);

    // Filter by type
    if (type) {
      transactions = transactions.filter(t => t.type === type);
      console.log(`🔍 Filtered by type ${type}:`, transactions);
    }

    // Filter by status
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    // Filter by date range
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.createdAt);
        if (startDate && transactionDate < new Date(startDate)) return false;
        if (endDate && transactionDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Search in description
    if (search) {
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by date descending
    transactions = transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const total = transactions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Calculate summary
    const summary = {
      totalTransactions: total,
      totalDeposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: Math.abs(transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)),
      totalContributions: Math.abs(transactions.filter(t => t.type === 'contribution').reduce((sum, t) => sum + t.amount, 0)),
      pendingWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length
    };

        const response = {
          success: true,
          data: {
            transactions: paginatedTransactions,
            pagination: {
              currentPage: parseInt(page),
              totalPages: Math.ceil(total / limit),
              totalItems: total,
              itemsPerPage: parseInt(limit)
            },
            summary
          }
        };
        
        console.log('📤 Sending transaction response:', JSON.stringify(response, null, 2));
        res.json(response);
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

// Withdraw money from wallet
const withdrawFromWallet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { amount, description, bankAccount } = req.body;
    
    console.log('🔄 Withdrawal request:', { userId, amount, description, bankAccount });
    console.log('🏦 Bank account details:', bankAccount);
    console.log('📊 Request body:', req.body);

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds in wallet'
      });
    }

    // Deduct amount immediately but mark as pending withdrawal
    console.log('💰 Wallet balance before withdrawal:', wallet.balance);
    wallet.balance -= amount;
    console.log('💰 Wallet balance after withdrawal:', wallet.balance);
    
    wallet.transactions.push({
      type: 'withdrawal',
      amount: -amount, // Negative for deduction
      description: description || 'Wallet withdrawal',
      status: 'pending', // Withdrawal needs approval
      createdAt: new Date(),
      metadata: {
        bankAccount: bankAccount,
        withdrawalRequestedAt: new Date(),
        transactionType: 'wallet_withdrawal',
        paymentMethod: 'bank_transfer'
      }
    });

    await wallet.save();
    console.log('✅ Withdrawal processed successfully');

    // Create notification for withdrawal request
    try {
      const notificationService = require('../services/notification.service');
      await notificationService.createNotification({
        user: userId,
        title: 'Withdrawal Requested',
        message: `Withdrawal request of ₦${amount.toLocaleString()} has been submitted for review`,
        type: 'info',
        category: 'wallet',
        priority: 'high',
        metadata: {
          amount: amount,
          bankAccount: bankAccount,
          transactionType: 'withdrawal'
        }
      });
    } catch (notificationError) {
      console.error('Error creating withdrawal notification:', notificationError);
    }

    res.json({
      success: true,
      data: wallet,
      message: 'Withdrawal request submitted successfully'
    });
  } catch (error) {
    console.error('Withdraw from wallet error:', error);
    next(error);
  }
};

// Get withdrawal requests (admin only)
const getWithdrawalRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get pending withdrawals
    const withdrawals = wallet.transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    console.error('Get withdrawal requests error:', error);
    next(error);
  }
};

// Approve withdrawal (admin only)
const approveWithdrawal = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    
    // This would typically be an admin function
    // For now, we'll just mark as completed
    const wallet = await Wallet.findOne({ 'transactions._id': transactionId });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transaction = wallet.transactions.id(transactionId);
    if (transaction.status === 'pending') {
      // Amount was already deducted, just mark as completed
      transaction.status = 'completed';
      await wallet.save();
    }

    res.json({
      success: true,
      data: wallet,
      message: 'Withdrawal approved successfully'
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    next(error);
  }
};

// Deduct money from wallet (for fees, etc.)
const deductFromWallet = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { amount, description, type, metadata } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }
    
    // Deduct amount
    wallet.balance -= amount;
    
    // Add transaction
    wallet.transactions.push({
      type: type || 'fee',
      amount: -amount, // Negative for deduction
      description: description || 'Wallet deduction',
      status: 'completed',
      createdAt: new Date(),
      metadata: metadata || {}
    });
    
    await wallet.save();
    
    res.json({
      success: true,
      data: wallet,
      message: 'Amount deducted successfully'
    });
  } catch (error) {
    console.error('Deduct from wallet error:', error);
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
  releaseGroupFunds,
  withdrawFromWallet,
  getWithdrawalRequests,
  approveWithdrawal,
  deductFromWallet
};
