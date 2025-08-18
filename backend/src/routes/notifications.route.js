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

// All routes require authentication
router.use(requireAuth);

// Get user notifications with filters and pagination
router.get('/', getUserNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Get unread count for header badge
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// Archive notification
router.put('/:notificationId/archive', archiveNotification);

// Archive multiple notifications
router.put('/archive', archiveMultipleNotifications);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Create notification (for testing/admin purposes)
router.post('/', createNotification);

module.exports = router;