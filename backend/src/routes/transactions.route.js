const express = require('express');
const { body, query } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const {
  getUserTransactions,
  getTransactionStats,
  getTransactionById,
  updateTransactionStatus,
  getRecentTransactions,
  getTransactionsByDateRange,
  exportTransactions,
  createManualTransaction,
  getTransactionAnalytics
} = require('../controllers/transaction.controller');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user transactions with filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['contribution', 'withdrawal', 'refund', 'fee', 'bonus', 'transfer', 'adjustment']),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']),
  query('paymentMethod').optional().isIn(['bank_transfer', 'card', 'mobile_money', 'crypto', 'manual', 'system']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('sortBy').optional().isIn(['createdAt', 'amount', 'status', 'type']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('search').optional().isString().trim().isLength({ max: 100 })
], getUserTransactions);

// Get transaction statistics
router.get('/stats', [
  query('timeRange').optional().isIn(['7', '30', '90', '365'])
], getTransactionStats);

// Get transaction analytics
router.get('/analytics', [
  query('timeRange').optional().isIn(['7', '30', '90', '365'])
], getTransactionAnalytics);

// Get recent transactions
router.get('/recent', [
  query('limit').optional().isInt({ min: 1, max: 50 })
], getRecentTransactions);

// Get transactions by date range
router.get('/date-range', [
  query('startDate').isISO8601().withMessage('Start date is required and must be valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date is required and must be valid ISO 8601 date')
], getTransactionsByDateRange);

// Export transactions
router.get('/export', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('type').optional().isIn(['contribution', 'withdrawal', 'refund', 'fee', 'bonus', 'transfer', 'adjustment']),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed'])
], exportTransactions);

// Get transaction by ID
router.get('/:transactionId', getTransactionById);

// Update transaction status
router.patch('/:transactionId/status', [
  body('status').isIn(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']).withMessage('Invalid status'),
  body('notes').optional().isString().trim().isLength({ max: 500 })
], updateTransactionStatus);

// Admin: Create manual transaction
router.post('/manual', [
  body('type').isIn(['contribution', 'withdrawal', 'refund', 'fee', 'bonus', 'transfer', 'adjustment']).withMessage('Invalid transaction type'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }),
  body('fee').optional().isFloat({ min: 0 }),
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('goal').optional().isMongoId(),
  body('group').optional().isMongoId(),
  body('paymentMethod').optional().isIn(['bank_transfer', 'card', 'mobile_money', 'crypto', 'manual', 'system']),
  body('description').optional().isString().trim().isLength({ max: 500 }),
  body('notes').optional().isString().trim().isLength({ max: 1000 })
], createManualTransaction);

module.exports = router;
