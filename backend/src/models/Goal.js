const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  targetAmount: { type: Number, required: true, min: 0 },
  currentAmount: { type: Number, default: 0, min: 0 },
  endDate: { type: Date, required: true },
  startDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'completed', 'cancelled'], 
    default: 'active' 
  },
  isGroupGoal: { type: Boolean, default: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  contributionSchedule: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], required: true },
    amount: { type: Number, required: true, min: 0 },
    customDates: [{ type: Date }],
    nextDueDate: { type: Date },
    lastContributionDate: { type: Date }
  },
  progress: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    daysRemaining: { type: Number },
    contributionsCount: { type: Number, default: 0 },
    averageContribution: { type: Number, default: 0 }
  },
  category: { type: String, enum: ['personal', 'business', 'education', 'travel', 'emergency', 'other'], default: 'personal' },
  isPublic: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating progress percentage
GoalSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for days remaining
GoalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Pre-save middleware to update progress
GoalSchema.pre('save', function(next) {
  // Update progress percentage
  this.progress.percentage = this.progressPercentage;
  
  // Update days remaining
  this.progress.daysRemaining = this.daysRemaining;
  
  // Update current amount from contributions
  if (this.currentAmount !== this.progress.averageContribution * this.progress.contributionsCount) {
    this.currentAmount = this.progress.averageContribution * this.progress.contributionsCount;
  }
  
  next();
});

// Indexes for better performance
GoalSchema.index({ createdBy: 1, status: 1 });
GoalSchema.index({ 'members.user': 1, status: 1 });
GoalSchema.index({ endDate: 1, status: 1 });
GoalSchema.index({ category: 1 });

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = { Goal };