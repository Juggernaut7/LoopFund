const transactionService = require('../services/transaction.service');
const { validationResult } = require('express-validator');

// Get user transactions with filtering
const getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const result = await transactionService.getUserTransactions(userId, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    next(error);
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30' } = req.query;

    const stats = await transactionService.getTransactionStats(userId, timeRange);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    next(error);
  }
};

// Get transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { transactionId } = req.params;

    const transaction = await transactionService.getTransactionById(transactionId, userId);

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    next(error);
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.userId;
    const { transactionId } = req.params;
    const { status, notes } = req.body;

    const transaction = await transactionService.updateTransactionStatus(
      transactionId,
      status,
      userId,
      { notes }
    );

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    if (error.message === 'Transaction not found') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    next(error);
  }
};

// Get recent transactions
const getRecentTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 10 } = req.query;

    const transactions = await transactionService.getRecentTransactions(userId, parseInt(limit));

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get recent transactions error:', error);
    next(error);
  }
};

// Get transactions by date range
const getTransactionsByDateRange = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const transactions = await transactionService.getTransactionsByDateRange(
      userId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions by date range error:', error);
    next(error);
  }
};

// Export transactions
const exportTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const transactions = await transactionService.exportTransactions(userId, options);

    // Convert to CSV format
    const csvData = convertToCSV(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions-${Date.now()}.csv"`);
    res.send(csvData);
  } catch (error) {
    console.error('Export transactions error:', error);
    next(error);
  }
};

// Create manual transaction (admin only)
const createManualTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const transactionData = {
      ...req.body,
      createdBy: req.user.userId,
      status: 'completed' // Manual transactions are typically completed immediately
    };

    const transaction = await transactionService.createTransaction(transactionData);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Create manual transaction error:', error);
    next(error);
  }
};

// Get transaction analytics
const getTransactionAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30' } = req.query;

    const stats = await transactionService.getTransactionStats(userId, timeRange);

    // Calculate additional analytics
    const analytics = {
      ...stats,
      insights: {
        averageTransactionSize: stats.summary.avgTransactionAmount,
        successRate: stats.summary.totalTransactions > 0 
          ? (stats.summary.completedTransactions / stats.summary.totalTransactions * 100).toFixed(1)
          : 0,
        totalFeesPaid: stats.summary.totalFees,
        netAmountReceived: stats.summary.netAmount,
        mostCommonType: stats.byType.length > 0 ? stats.byType[0]._id : null,
        transactionTrend: stats.monthlyTrend
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get transaction analytics error:', error);
    next(error);
  }
};

// Helper function to convert transactions to CSV
const convertToCSV = (transactions) => {
  const csvRows = [];
  
  // Add header
  csvRows.push([
    'Transaction ID',
    'Type',
    'Status',
    'Amount',
    'Currency',
    'Fee',
    'Net Amount',
    'Payment Method',
    'Description',
    'Goal',
    'Group',
    'Created At',
    'Completed At'
  ].join(','));

  // Add data rows
  transactions.forEach(transaction => {
    csvRows.push([
      transaction.transactionId,
      transaction.type,
      transaction.status,
      transaction.amount,
      transaction.currency,
      transaction.fee,
      transaction.netAmount,
      transaction.paymentMethod,
      `"${transaction.description || ''}"`,
      `"${transaction.goal?.name || ''}"`,
      `"${transaction.group?.name || ''}"`,
      transaction.createdAt.toISOString(),
      transaction.completedAt ? transaction.completedAt.toISOString() : ''
    ].join(','));
  });

  return csvRows.join('\n');
};

module.exports = {
  getUserTransactions,
  getTransactionStats,
  getTransactionById,
  updateTransactionStatus,
  getRecentTransactions,
  getTransactionsByDateRange,
  exportTransactions,
  createManualTransaction,
  getTransactionAnalytics
};
