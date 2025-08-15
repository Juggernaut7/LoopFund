const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: [
      'first_goal', 
      'goal_completed', 
      'streak_milestone', 
      'contribution_milestone', 
      'group_leader', 
      'early_bird', 
      'consistency', 
      'team_player',
      'savings_expert',
      'milestone_reached'
    ], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'], 
    default: 'beginner' 
  },
  icon: { type: String, default: '🏆' },
  color: { type: String, default: '#FFD700' },
  criteria: {
    goalsCompleted: { type: Number, default: 0 },
    totalContributed: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    groupMembers: { type: Number, default: 0 },
    earlyContributions: { type: Number, default: 0 },
    consistencyWeeks: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isSecret: { type: Boolean, default: false }, // Hidden achievements
  points: { type: Number, default: 10 },
  rarity: { 
    type: String, 
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], 
    default: 'common' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for achievement rarity color
AchievementSchema.virtual('rarityColor').get(function() {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[this.rarity] || colors.common;
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

// User Achievement Junction Model
const UserAchievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
  unlockedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // Progress towards achievement (0-100)
  isUnlocked: { type: Boolean, default: false },
  metadata: {
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    contributionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }
  }
}, { 
  timestamps: true 
});

// Compound index to ensure unique user-achievement pairs
UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
UserAchievementSchema.index({ user: 1, isUnlocked: 1 });
UserAchievementSchema.index({ unlockedAt: -1 });

const UserAchievement = mongoose.model('UserAchievement', UserAchievementSchema);

module.exports = { Achievement, UserAchievement }; 