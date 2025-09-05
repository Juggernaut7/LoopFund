const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'first_goal',
      'goal_completed', 
      'first_contribution',
      'contribution_streak',
      'group_creator',
      'group_member',
      'savings_milestone',
      'weekly_saver',
      'monthly_saver'
    ]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  awardedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
achievementSchema.index({ user: 1, type: 1 });
achievementSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Achievement', achievementSchema); 