const { Notification } = require('../models/Notification');

const createNotification = async (notificationData) => {
  try {
    const notification = new Notification({
      user: notificationData.user,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      relatedId: notificationData.relatedId,
      relatedType: notificationData.relatedType,
      isRead: false
    });

    const savedNotification = await notification.save();

    // Send real-time notification via WebSocket
    if (global.notificationSocket) {
      global.notificationSocket.sendNotification(
        notificationData.user, 
        savedNotification
      );
    }

    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getUserNotifications = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    let query = { user: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      user: userId, 
      isRead: false 
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

const markAsRead = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

const deleteNotification = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });

    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
}; 