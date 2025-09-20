const Notification = require('../models/Notification');
const Group = require('../models/Group');
const Goal = require('../models/Goal');
const User = require('../models/User');

// Enhanced notification creation with comprehensive metadata
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification({
      user: notificationData.user,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      category: notificationData.category || 'system',
      priority: notificationData.priority || 'medium',
      metadata: notificationData.metadata || {},
      expiresAt: notificationData.expiresAt,
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

    console.log('🔔 Notification created:', {
      id: savedNotification._id,
      user: notificationData.user,
      title: notificationData.title,
      type: notificationData.type,
      category: notificationData.category
    });

    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Create multiple notifications for group members
const createGroupNotification = async (groupId, notificationData, excludeUserId = null) => {
  try {
    const group = await Group.findById(groupId).populate('members.user', 'name email');
    if (!group) {
      throw new Error('Group not found');
    }

    const notifications = [];
    const members = group.members.filter(member => 
      member.isActive && member.user._id.toString() !== excludeUserId?.toString()
    );

    for (const member of members) {
      const notification = await createNotification({
        ...notificationData,
        user: member.user._id,
        metadata: {
          ...notificationData.metadata,
          groupId: group._id,
          groupName: group.name
        }
      });
      notifications.push(notification);
    }

    console.log(`🔔 Group notification sent to ${notifications.length} members of group: ${group.name}`);
    return notifications;
  } catch (error) {
    console.error('Error creating group notification:', error);
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

// ===== PAYMENT NOTIFICATIONS =====

// Notify group members when someone makes a contribution
const notifyGroupContribution = async (groupId, contributorId, amount, description) => {
  try {
    const contributor = await User.findById(contributorId);
    const group = await Group.findById(groupId);
    
    if (!contributor || !group) return;

    const notificationData = {
      title: '💰 New Group Contribution',
      message: `${contributor.name || contributor.email} contributed ₦${amount.toLocaleString()} to "${group.name}". ${description ? `Note: ${description}` : ''}`,
      type: 'success',
      category: 'payment',
      priority: 'medium',
      metadata: {
        contributorId,
        contributorName: contributor.name || contributor.email,
        amount,
        description,
        groupId,
        groupName: group.name
      }
    };

    await createGroupNotification(groupId, notificationData, contributorId);
  } catch (error) {
    console.error('Error notifying group contribution:', error);
  }
};

// Notify when goal contribution is made
const notifyGoalContribution = async (goalId, contributorId, amount, description) => {
  try {
    const contributor = await User.findById(contributorId);
    const goal = await Goal.findById(goalId);
    
    if (!contributor || !goal) return;

    const progress = goal.targetAmount > 0 ? ((goal.currentAmount + amount) / goal.targetAmount * 100).toFixed(1) : 0;
    
    const notificationData = {
      title: '🎯 Goal Contribution Made',
      message: `You contributed ₦${amount.toLocaleString()} to "${goal.name}". Progress: ${progress}%`,
      type: 'success',
      category: 'goal',
      priority: 'medium',
      metadata: {
        goalId,
        goalName: goal.name,
        amount,
        description,
        progress: parseFloat(progress),
        targetAmount: goal.targetAmount
      }
    };

    await createNotification({
      ...notificationData,
      user: contributorId
    });
  } catch (error) {
    console.error('Error notifying goal contribution:', error);
  }
};

// ===== DUE DATE NOTIFICATIONS =====

// Check and notify about upcoming due dates
const checkAndNotifyDueDates = async () => {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

    // Check groups with upcoming due dates
    const groupsWithDueDates = await Group.find({
      nextContributionDate: {
        $gte: now,
        $lte: threeDaysFromNow
      },
      isActive: true
    }).populate('members.user', 'name email');

    for (const group of groupsWithDueDates) {
      const daysUntilDue = Math.ceil((group.nextContributionDate - now) / (24 * 60 * 60 * 1000));
      
      let priority = 'medium';
      let title = '📅 Contribution Due Soon';
      let message = `Your next contribution to "${group.name}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}.`;

      if (daysUntilDue <= 1) {
        priority = 'high';
        title = '⚠️ Contribution Due Tomorrow';
        message = `Your contribution to "${group.name}" is due tomorrow! Don't miss it.`;
      }

      const notificationData = {
        title,
        message,
        type: daysUntilDue <= 1 ? 'warning' : 'info',
        category: 'reminder',
        priority,
        metadata: {
          groupId: group._id,
          groupName: group.name,
          dueDate: group.nextContributionDate,
          daysUntilDue
        },
        expiresAt: group.nextContributionDate
      };

      await createGroupNotification(group._id, notificationData);
    }

    console.log(`🔔 Due date notifications sent for ${groupsWithDueDates.length} groups`);
  } catch (error) {
    console.error('Error checking due dates:', error);
  }
};

// ===== GOAL MILESTONE NOTIFICATIONS =====

// Notify when goal milestones are reached
const notifyGoalMilestone = async (goalId, milestone, contributorId) => {
  try {
    const goal = await Goal.findById(goalId);
    const contributor = await User.findById(contributorId);
    
    if (!goal || !contributor) return;

    const milestoneMessages = {
      25: '🎉 25% Milestone Reached!',
      50: '🎊 Halfway There! 50% Complete!',
      75: '🚀 Almost There! 75% Complete!',
      90: '💪 So Close! 90% Complete!',
      100: '🏆 Goal Completed! Congratulations!'
    };

    const title = milestoneMessages[milestone] || `🎯 ${milestone}% Milestone Reached!`;
    const message = `"${goal.name}" has reached ${milestone}% completion! Keep up the great work!`;

    const notificationData = {
      title,
      message,
      type: milestone === 100 ? 'achievement' : 'success',
      category: milestone === 100 ? 'achievement' : 'goal',
      priority: milestone >= 75 ? 'high' : 'medium',
      metadata: {
        goalId,
        goalName: goal.name,
        milestone,
        progress: milestone,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount
      }
    };

    await createNotification({
      ...notificationData,
      user: contributorId
    });
  } catch (error) {
    console.error('Error notifying goal milestone:', error);
  }
};

// ===== GROUP ACTIVITY NOTIFICATIONS =====

// Notify when someone joins a group
const notifyGroupJoin = async (groupId, newMemberId) => {
  try {
    const newMember = await User.findById(newMemberId);
    const group = await Group.findById(groupId);
    
    if (!newMember || !group) return;

    const notificationData = {
      title: '👋 New Member Joined',
      message: `${newMember.name || newMember.email} joined "${group.name}"! Welcome them to the group.`,
      type: 'info',
      category: 'group',
      priority: 'low',
      metadata: {
        groupId,
        groupName: group.name,
        newMemberId,
        newMemberName: newMember.name || newMember.email
      }
    };

    await createGroupNotification(groupId, notificationData, newMemberId);
  } catch (error) {
    console.error('Error notifying group join:', error);
  }
};

// Notify when group target is reached
const notifyGroupTargetReached = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) return;

    const notificationData = {
      title: '🎊 Group Target Achieved!',
      message: `Congratulations! "${group.name}" has reached its target of ₦${group.targetAmount.toLocaleString()}!`,
      type: 'achievement',
      category: 'group',
      priority: 'high',
      metadata: {
        groupId,
        groupName: group.name,
        targetAmount: group.targetAmount,
        currentAmount: group.currentAmount
      }
    };

    await createGroupNotification(groupId, notificationData);
  } catch (error) {
    console.error('Error notifying group target reached:', error);
  }
};

// ===== SYSTEM NOTIFICATIONS =====

// Notify about payment failures
const notifyPaymentFailure = async (userId, amount, reason, groupId = null, goalId = null) => {
  try {
    const notificationData = {
      title: '❌ Payment Failed',
      message: `Your payment of ₦${amount.toLocaleString()} failed. Reason: ${reason}. Please try again.`,
      type: 'error',
      category: 'payment',
      priority: 'high',
      metadata: {
        amount,
        reason,
        groupId,
        goalId
      }
    };

    await createNotification({
      ...notificationData,
      user: userId
    });
  } catch (error) {
    console.error('Error notifying payment failure:', error);
  }
};

// Notify about successful payments
const notifyPaymentSuccess = async (userId, amount, type, entityName) => {
  try {
    const notificationData = {
      title: '✅ Payment Successful',
      message: `Your payment of ₦${amount.toLocaleString()} for ${type} "${entityName}" was processed successfully!`,
      type: 'success',
      category: 'payment',
      priority: 'medium',
      metadata: {
        amount,
        type,
        entityName
      }
    };

    await createNotification({
      ...notificationData,
      user: userId
    });
  } catch (error) {
    console.error('Error notifying payment success:', error);
  }
};

// ===== ACHIEVEMENT NOTIFICATIONS =====

// Notify about achievements
const notifyAchievement = async (userId, achievementName, description) => {
  try {
    const notificationData = {
      title: '🏆 Achievement Unlocked!',
      message: `You've earned the "${achievementName}" achievement! ${description}`,
      type: 'achievement',
      category: 'achievement',
      priority: 'high',
      metadata: {
        achievementName,
        description
      }
    };

    await createNotification({
      ...notificationData,
      user: userId
    });
  } catch (error) {
    console.error('Error notifying achievement:', error);
  }
};

// ===== SCHEDULED NOTIFICATIONS =====

// Run daily checks for due dates and milestones
const runDailyNotificationChecks = async () => {
  try {
    console.log('🔔 Running daily notification checks...');
    
    // Check due dates
    await checkAndNotifyDueDates();
    
    // Check goal milestones (this would be called when contributions are made)
    // Check for inactive users (could add this later)
    
    console.log('✅ Daily notification checks completed');
  } catch (error) {
    console.error('Error in daily notification checks:', error);
  }
};

// Cancel scheduled notifications for a specific goal
const cancelScheduledNotifications = async (userId, goalId) => {
  try {
    await Notification.updateMany(
      { 
        user: userId, 
        'metadata.goalId': goalId,
        category: 'payment',
        isRead: false
      },
      { isRead: true }
    );

    console.log(`🔔 Cancelled scheduled notifications for goal ${goalId}`);
  } catch (error) {
    console.error('Error cancelling scheduled notifications:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createGroupNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  
  // Payment notifications
  notifyGroupContribution,
  notifyGoalContribution,
  notifyPaymentSuccess,
  notifyPaymentFailure,
  
  // Due date notifications
  checkAndNotifyDueDates,
  
  // Goal notifications
  notifyGoalMilestone,
  
  // Group notifications
  notifyGroupJoin,
  notifyGroupTargetReached,
  
  // Achievement notifications
  notifyAchievement,
  
  // Scheduled notifications
  runDailyNotificationChecks,
  cancelScheduledNotifications
}; 