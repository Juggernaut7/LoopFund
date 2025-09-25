const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/wallet.controller');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user wallet
router.get('/', getUserWallet);

// Add money to wallet
router.post('/add', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('reference').optional().isString(),
  body('description').optional().isString()
], addToWallet);

// Contribute to goal from wallet
router.post('/contribute/goal', [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString()
], contributeToGoal);

// Contribute to group from wallet
router.post('/contribute/group', [
  body('groupId').notEmpty().withMessage('Group ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString()
], contributeToGroup);

// Get wallet transactions
router.get('/transactions', getWalletTransactions);

// Release goal funds to goal owner
router.post('/release-goal-funds', [
  body('goalId').notEmpty().withMessage('Goal ID is required')
], releaseGoalFunds);

// Release group funds to group creator
router.post('/release-group-funds', [
  body('groupId').notEmpty().withMessage('Group ID is required')
], releaseGroupFunds);

// Withdraw money from wallet
router.post('/withdraw', [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('description').optional().isString(),
  body('bankAccount').isObject().withMessage('Bank account details must be an object'),
  body('bankAccount.bankName').notEmpty().withMessage('Bank name is required'),
  body('bankAccount.accountName').notEmpty().withMessage('Account name is required'),
  body('bankAccount.accountNumber').notEmpty().withMessage('Account number is required')
], withdrawFromWallet);

// Get withdrawal requests
router.get('/withdrawals', getWithdrawalRequests);

// Approve withdrawal (admin only)
router.post('/approve-withdrawal', [
  body('transactionId').notEmpty().withMessage('Transaction ID is required')
], approveWithdrawal);

// Deduct from wallet (for fees, etc.)
router.post('/deduct', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString(),
  body('type').optional().isString(),
  body('metadata').optional().isObject()
], deductFromWallet);

module.exports = router;
