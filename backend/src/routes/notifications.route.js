const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  getUserNotifications,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  archiveMultipleNotifications,
  deleteNotification,
  createNotification,
  getUnreadCount
} = require('../controllers/notification.controller');

const router = Router();

// Get user notifications with filters and pagination
router.get('/', requireAuth, getUserNotifications);

// Get notification statistics
router.get('/stats', requireAuth, getNotificationStats);

// Get unread count for header badge
router.get('/unread-count', requireAuth, getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', requireAuth, markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', requireAuth, markAllAsRead);

// Archive notification
router.put('/:notificationId/archive', requireAuth, archiveNotification);

// Archive multiple notifications
router.put('/archive', requireAuth, archiveMultipleNotifications);

// Delete notification
router.delete('/:notificationId', requireAuth, deleteNotification);

// Create notification (for testing/admin purposes)
router.post('/', requireAuth, createNotification);

module.exports = router;