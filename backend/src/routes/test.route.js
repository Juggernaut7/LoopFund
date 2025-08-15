const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint to verify API is working
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API is working correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LoopFund Backend API is running! 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: [
      'Enhanced User Management',
      'Advanced Goal Tracking',
      'Group Savings Management',
      'Contribution System',
      'Notification System',
      'Achievement System',
      'Analytics & Insights',
      'Transaction Logging',
      'Multi-currency Support',
      'Gamification Features'
    ],
    models: [
      'User (Enhanced with profile, preferences, notifications)',
      'Goal (With progress tracking, categories, member roles)',
      'Group (With invite codes, settings, member management)',
      'Contribution (With payment status, transaction tracking)',
      'Notification (Multi-channel, scheduled, priority-based)',
      'Achievement (Gamification with rarity, progress tracking)',
      'TransactionLog (Complete audit trail, payment integration)'
    ],
    services: [
      'Analytics Service (User, Goal, Group, Platform analytics)',
      'Reminder Service (Automated notifications)',
      'Validation Service (Comprehensive input validation)',
      'Auth Service (JWT-based authentication)'
    ]
  });
});

/**
 * @swagger
 * /api/test/models:
 *   get:
 *     summary: Test model schemas
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Model schemas overview
 */
router.get('/models', (req, res) => {
  res.json({
    success: true,
    models: {
      User: {
        fields: ['firstName', 'lastName', 'email', 'phone', 'profilePicture', 'isVerified', 'isActive', 'lastLogin', 'notificationPreferences', 'preferences'],
        features: ['Profile management', 'Notification preferences', 'Multi-currency support', 'Account verification']
      },
      Goal: {
        fields: ['name', 'description', 'targetAmount', 'currentAmount', 'endDate', 'status', 'isGroupGoal', 'members', 'contributionSchedule', 'progress', 'category', 'tags'],
        features: ['Progress tracking', 'Member roles', 'Flexible scheduling', 'Category classification', 'Auto-progress calculation']
      },
      Group: {
        fields: ['name', 'description', 'targetAmount', 'currentAmount', 'status', 'members', 'settings', 'inviteCode', 'category', 'progress'],
        features: ['Invite system', 'Member management', 'Group settings', 'Progress tracking', 'Auto-invite code generation']
      },
      Contribution: {
        fields: ['goal', 'user', 'amount', 'currency', 'status', 'paymentMethod', 'transactionId', 'paymentProvider', 'scheduledDate', 'notes'],
        features: ['Payment status tracking', 'Multiple payment methods', 'Transaction IDs', 'Scheduled contributions', 'Payment provider integration']
      },
      Notification: {
        fields: ['user', 'type', 'title', 'message', 'isRead', 'isSent', 'priority', 'channels', 'scheduledFor', 'metadata'],
        features: ['Multi-channel notifications', 'Priority levels', 'Scheduled notifications', 'Action metadata', 'Expiration handling']
      },
      Achievement: {
        fields: ['name', 'description', 'type', 'category', 'icon', 'color', 'criteria', 'points', 'rarity'],
        features: ['Gamification system', 'Multiple categories', 'Progress criteria', 'Point system', 'Rarity levels']
      },
      TransactionLog: {
        fields: ['transactionId', 'type', 'status', 'amount', 'currency', 'fee', 'netAmount', 'paymentMethod', 'paymentProvider', 'metadata'],
        features: ['Complete audit trail', 'Payment integration', 'Risk scoring', 'Error handling', 'Retry mechanism']
      }
    }
  });
});

module.exports = router; 