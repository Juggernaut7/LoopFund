const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  targetAmount: { type: Number, min: 0 },
  currentAmount: { type: Number, default: 0, min: 0 },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'completed', 'cancelled'], 
    default: 'active' 
  },
  members: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    totalContributed: { type: Number, default: 0 },
    lastContributionDate: { type: Date }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  settings: {
    isPublic: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxMembers: { type: Number, default: 50 },
    contributionLimit: { type: Number }, // Max contribution per member
    autoComplete: { type: Boolean, default: true } // Auto-complete when target reached
  },
  inviteCode: { type: String, unique: true, sparse: true },
  // Keep inviteLink for backward compatibility but make it optional
  inviteLink: { type: String, sparse: true },
  category: { type: String, enum: ['family', 'friends', 'business', 'community', 'other'], default: 'friends' },
  tags: [{ type: String, trim: true }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  durationMonths: { type: Number, default: 1 },
  progress: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    daysRemaining: { type: Number },
    activeMembers: { type: Number, default: 0 },
    totalContributions: { type: Number, default: 0 }
  },
  // Account/Payment Information
  accountInfo: {
    bankName: { type: String, trim: true },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    routingNumber: { type: String, trim: true },
    swiftCode: { type: String, trim: true },
    paymentMethod: { 
      type: String, 
      enum: ['bank_transfer', 'mobile_money', 'crypto', 'other'], 
      default: 'bank_transfer' 
    },
    additionalInfo: { type: String, trim: true }
  },
  // Contributions tracking
  contributions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    paidAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating progress percentage
GroupSchema.virtual('progressPercentage').get(function() {
  if (!this.targetAmount || this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for days remaining
GroupSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for active members count
GroupSchema.virtual('activeMembersCount').get(function() {
  return this.members.filter(member => member.isActive).length;
});

// Pre-save middleware to update progress and generate invite code
GroupSchema.pre('save', function(next) {
  // Update progress percentage
  this.progress.percentage = this.progressPercentage;
  
  // Update days remaining
  this.progress.daysRemaining = this.daysRemaining;
  
  // Update active members count
  this.progress.activeMembers = this.activeMembersCount;
  
  // Generate invite code if not exists (only if not already set)
  if (!this.inviteCode) {
    this.inviteCode = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
  
  // Generate inviteLink if not exists (for backward compatibility)
  if (!this.inviteLink) {
    this.inviteLink = this.inviteCode; // Use inviteCode as inviteLink
  }
  
  next();
});

// Indexes for better performance
GroupSchema.index({ createdBy: 1, status: 1 });
GroupSchema.index({ 'members.user': 1, status: 1 });
GroupSchema.index({ inviteCode: 1 }, { unique: true, sparse: true });
// Remove the problematic inviteLink unique index and make it sparse only
GroupSchema.index({ inviteLink: 1 }, { sparse: true });
GroupSchema.index({ category: 1 });
GroupSchema.index({ isPublic: 1, status: 1 });

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;