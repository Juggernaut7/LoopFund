const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'goal_reminder', 
      'contribution_due', 
      'goal_completed', 
      'group_invite', 
      'payment_success', 
      'payment_failed',
      'group_update',
      'system_alert',
      'achievement_unlocked'
    ], 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  channels: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  scheduledFor: { type: Date },
  sentAt: { type: Date },
  readAt: { type: Date },
  metadata: {
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    contributionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' },
    actionUrl: { type: String },
    actionText: { type: String }
  },
  expiresAt: { type: Date }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for notification age
NotificationSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60));
});

// Virtual for is expired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Pre-save middleware to set default expiration
NotificationSchema.pre('save', function(next) {
  // Set default expiration to 30 days if not specified
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  // Set sentAt when isSent becomes true
  if (this.isSent && !this.sentAt) {
    this.sentAt = new Date();
  }
  
  // Set readAt when isRead becomes true
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  
  next();
});

// Indexes for better performance
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, isSent: 1 });
NotificationSchema.index({ scheduledFor: 1, isSent: 1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ priority: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification }; 