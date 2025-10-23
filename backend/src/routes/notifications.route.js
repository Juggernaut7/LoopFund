const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getNotificationStats,
  getCronStatus,
  triggerCronJob,
  schedulePaymentReminder,
  getUpcomingReminders,
  sendPaymentDueNotification,
  sendEmailReminder,
  updateNotificationPreferences,
  getNotificationPreferences,
  markReminderCompleted,
  scheduleRecurringNotifications,
  cancelScheduledNotifications
} = require('../controllers/notification.controller');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user notifications
router.get('/', getUserNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Mark notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Admin routes
router.get('/admin/cron-status', getCronStatus);
router.post('/admin/trigger/:jobName', triggerCronJob);


// Goal notification endpoints
router.post('/schedule-payment-reminder', [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('scheduledTime').isISO8601().withMessage('Scheduled time must be a valid date'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency'),
  body('goalName').optional().isString()
], schedulePaymentReminder);

router.get('/upcoming-reminders', getUpcomingReminders);

router.post('/payment-due', [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency')
], sendPaymentDueNotification);

router.post('/send-email-reminder', [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('reminderType').optional().isIn(['payment_due', 'advance_reminder', 'overdue'])
], sendEmailReminder);

router.put('/preferences', [
  body('email').optional().isBoolean(),
  body('push').optional().isBoolean(),
  body('sms').optional().isBoolean(),
  body('reminderFrequency').optional().isIn(['daily', 'weekly', 'monthly']),
  body('reminderTime').optional().isString(),
  body('advanceReminder').optional().isInt({ min: 0, max: 7 })
], updateNotificationPreferences);

router.get('/preferences', getNotificationPreferences);

router.put('/reminders/:reminderId/completed', markReminderCompleted);

router.post('/schedule-recurring', [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date')
], scheduleRecurringNotifications);

router.delete('/cancel-scheduled/:goalId', cancelScheduledNotifications);

module.exports = router;