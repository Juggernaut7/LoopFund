const notificationService = require('../services/notification.service');
const cronService = require('../services/cron.service');
const emailService = require('../services/emailService');
const Goal = require('../models/Goal');
const User = require('../models/User');

// Get user notifications
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, unreadOnly = false, category, type } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true'
    };

    const result = await notificationService.getUserNotifications(userId, options);

    // Filter by category and type if provided
    let notifications = result.notifications;
    if (category) {
      notifications = notifications.filter(n => n.category === category);
    }
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }

    res.json({
      success: true,
      data: {
        notifications,
        pagination: result.pagination,
        unreadCount: result.unreadCount
      }
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await notificationService.markAsRead(userId, notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await notificationService.deleteNotification(userId, notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    next(error);
  }
};

// Get notification statistics
const getNotificationStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Get all notifications for stats
    const allNotifications = await notificationService.getUserNotifications(userId, { limit: 1000 });
    const notifications = allNotifications.notifications;

    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byCategory: {},
      byType: {},
      byPriority: {},
      recent: notifications.slice(0, 5)
    };

    // Calculate stats by category
    notifications.forEach(notification => {
      stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1;
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    next(error);
  }
};

// Admin: Get cron service status
const getCronStatus = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const status = cronService.getStatus();

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Get cron status error:', error);
    next(error);
  }
};

// Admin: Manually trigger cron job
const triggerCronJob = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { jobName } = req.params;

    await cronService.triggerJob(jobName);

    res.json({
      success: true,
      message: `Job ${jobName} triggered successfully`
    });
  } catch (error) {
    console.error('Trigger cron job error:', error);
    next(error);
  }
};

// Test notification creation (for development)
const createTestNotification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { title, message, type = 'info', category = 'system' } = req.body;

    const notification = await notificationService.createNotification({
      user: userId,
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      type,
      category,
      priority: 'medium'
    });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Create test notification error:', error);
    next(error);
  }
};

// Schedule payment reminder
const schedulePaymentReminder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, scheduledTime, amount, frequency, goalName } = req.body;

    const reminder = await notificationService.createNotification({
      user: userId,
      title: 'Payment Reminder',
      message: `Time to contribute ₦${amount.toLocaleString()} to "${goalName}"`,
      type: 'reminder',
      category: 'payment',
      priority: 'high',
      metadata: {
        goalId,
        amount,
        frequency,
        scheduledTime,
        goalName
      },
      scheduledTime: new Date(scheduledTime)
    });

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Schedule payment reminder error:', error);
    next(error);
  }
};

// Get upcoming reminders
const getUpcomingReminders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    
    const reminders = await notificationService.getUserNotifications(userId, {
      category: 'payment',
      scheduledTime: { $gte: now },
      isRead: false
    });

    res.json({
      success: true,
      data: reminders.notifications
    });
  } catch (error) {
    console.error('Get upcoming reminders error:', error);
    next(error);
  }
};

// Send payment due notification
const sendPaymentDueNotification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, amount, frequency } = req.body;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const notification = await notificationService.createNotification({
      user: userId,
      title: 'Payment Due! 💰',
      message: `Time to contribute ₦${amount.toLocaleString()} to "${goal.name}"`,
      type: 'warning',
      category: 'payment',
      priority: 'high',
      metadata: {
        goalId,
        amount,
        frequency,
        goalName: goal.name
      }
    });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Send payment due notification error:', error);
    next(error);
  }
};

// Send email reminder
const sendEmailReminder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, reminderType = 'payment_due' } = req.body;

    const goal = await Goal.findById(goalId);
    const user = await User.findById(userId);

    if (!goal || !user) {
      return res.status(404).json({
        success: false,
        message: 'Goal or user not found'
      });
    }

    const emailData = {
      to: user.email,
      subject: `Payment Reminder - ${goal.name}`,
      template: 'payment-reminder',
      data: {
        userName: user.firstName,
        goalName: goal.name,
        amount: goal.amount,
        frequency: goal.frequency,
        reminderType
      }
    };

    await emailService.sendEmail(emailData);

    res.json({
      success: true,
      message: 'Email reminder sent successfully'
    });
  } catch (error) {
    console.error('Send email reminder error:', error);
    next(error);
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const preferences = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { notificationPreferences: preferences },
      { new: true }
    );

    res.json({
      success: true,
      data: user.notificationPreferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    next(error);
  }
};

// Get notification preferences
const getNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: user.notificationPreferences || {
        email: true,
        push: true,
        sms: false,
        reminderFrequency: 'daily',
        reminderTime: '09:00',
        advanceReminder: 1
      }
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    next(error);
  }
};

// Mark reminder as completed
const markReminderCompleted = async (req, res, next) => {
  try {
    const { reminderId } = req.params;
    
    await notificationService.markAsRead(reminderId);

    res.json({
      success: true,
      message: 'Reminder marked as completed'
    });
  } catch (error) {
    console.error('Mark reminder completed error:', error);
    next(error);
  }
};

// Schedule recurring notifications
const scheduleRecurringNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId, frequency, amount, endDate, startDate = new Date() } = req.body;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Calculate reminder schedule
    const reminders = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current < end) {
      let nextDate = new Date(current);
      
      switch (frequency) {
        case 'daily':
          nextDate.setDate(current.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(current.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(current.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(current.getFullYear() + 1);
          break;
      }

      if (nextDate <= end) {
        reminders.push({
          user: userId,
          title: 'Payment Reminder',
          message: `Time to contribute ₦${amount.toLocaleString()} to "${goal.name}"`,
          type: 'reminder',
          category: 'payment',
          priority: 'high',
          metadata: {
            goalId,
            amount,
            frequency,
            goalName: goal.name
          },
          scheduledTime: nextDate
        });
      }

      current.setTime(nextDate.getTime());
    }

    // Create all reminders
    const createdReminders = [];
    for (const reminder of reminders) {
      const created = await notificationService.createNotification(reminder);
      createdReminders.push(created);
    }

    res.json({
      success: true,
      data: {
        scheduledCount: createdReminders.length,
        reminders: createdReminders
      }
    });
  } catch (error) {
    console.error('Schedule recurring notifications error:', error);
    next(error);
  }
};

// Cancel scheduled notifications
const cancelScheduledNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { goalId } = req.params;

    await notificationService.cancelScheduledNotifications(userId, goalId);

    res.json({
      success: true,
      message: 'Scheduled notifications cancelled'
    });
  } catch (error) {
    console.error('Cancel scheduled notifications error:', error);
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
  getCronStatus,
  triggerCronJob,
  createTestNotification,
  schedulePaymentReminder,
  getUpcomingReminders,
  sendPaymentDueNotification,
  sendEmailReminder,
  updateNotificationPreferences,
  getNotificationPreferences,
  markReminderCompleted,
  scheduleRecurringNotifications,
  cancelScheduledNotifications
};