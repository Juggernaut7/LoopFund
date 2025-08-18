const notificationService = require('../services/notification.service');
const { User } = require('../models/User');

// Get user notifications
async function getUserNotifications(req, res, next) {
  try {
    const userId = req.user.userId;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      category: req.query.category,
      isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
      isArchived: req.query.isArchived === 'true',
      search: req.query.search,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    const result = await notificationService.getUserNotifications(userId, options);
    
    res.json({
      success: true,
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

// Get notification statistics
async function getNotificationStats(req, res, next) {
  try {
    const userId = req.user.userId;
    const stats = await notificationService.getNotificationStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

// Mark notification as read
async function markAsRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await notificationService.markAsRead(notificationId, userId);
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
}

// Mark all notifications as read
async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.userId;
    const result = await notificationService.markAllAsRead(userId);
    
    res.json({
      success: true,
      data: result,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
}

// Archive notification
async function archiveNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await notificationService.archiveNotification(notificationId, userId);
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification archived'
    });
  } catch (error) {
    next(error);
  }
}

// Archive multiple notifications
async function archiveMultipleNotifications(req, res, next) {
  try {
    const { notificationIds } = req.body;
    const userId = req.user.userId;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Notification IDs array is required'
      });
    }

    const result = await notificationService.archiveMultipleNotifications(notificationIds, userId);
    
    res.json({
      success: true,
      data: result,
      message: `${result.modifiedCount} notifications archived`
    });
  } catch (error) {
    next(error);
  }
}

// Delete notification
async function deleteNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await notificationService.deleteNotification(notificationId, userId);
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
}

// Create notification (for testing/admin purposes)
async function createNotification(req, res, next) {
  try {
    const { userId, title, message, type, category, priority, metadata, expiresAt } = req.body;

    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'User ID, title, and message are required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const notificationData = {
      user: userId,
      title,
      message,
      type: type || 'info',
      category: category || 'system',
      priority: priority || 'medium',
      metadata: metadata || {},
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    };

    const notification = await notificationService.createNotification(notificationData);
    
    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    next(error);
  }
}

// Get unread count for header badge
async function getUnreadCount(req, res, next) {
  try {
    const userId = req.user.userId;
    
    const count = await notificationService.getUserNotifications(userId, {
      page: 1,
      limit: 1,
      isRead: false
    });
    
    res.json({
      success: true,
      data: {
        unreadCount: count.pagination.total
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserNotifications,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  archiveMultipleNotifications,
  deleteNotification,
  createNotification,
  getUnreadCount
};