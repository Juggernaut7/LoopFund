const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['group_creation', 'group_contribution', 'goal_creation', 'goal_contribution', 'premium_upgrade', 'challenge_access', 'wallet_deposit', 'other'],
    required: true
  },
  metadata: {
    groupName: String,
    groupTarget: Number,
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    goalName: String,
    goalTarget: Number,
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    description: String,
    category: String,
    endDate: Date,
    frequency: String,
    amount: Number,
    fee: Number,
    customerEmail: String,
    customerName: String,
    durationMonths: Number,
    feeBreakdown: {
      baseFee: Number,
      durationFee: Number,
      totalFee: Number,
      percentage: String,
      breakdown: {
        basePercentage: String,
        durationPercentage: String,
        totalPercentage: String
      }
    }
  },
  paystackData: {
    accessCode: String,
    authorizationUrl: String,
    customerId: String,
    paidAt: Date,
    channel: String,
    ipAddress: String,
    fees: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
// Note: reference already has an index via unique property in schema
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ type: 1, status: 1 });
paymentSchema.index({ 'metadata.groupId': 1 });

// Virtual for amount in dollars (assuming 1 USD = 1000 NGN for demo)
paymentSchema.virtual('amountUSD').get(function() {
  return (this.amount / 1000).toFixed(2);
});

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount / 100);
});

// Static method to get revenue statistics
paymentSchema.statics.getRevenueStats = async function(startDate, endDate) {
  const matchStage = {};
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  matchStage.status = 'successful';
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
  
  return stats[0] || { totalRevenue: 0, totalTransactions: 0, averageAmount: 0 };
};

// Static method to get revenue by type
paymentSchema.statics.getRevenueByType = async function(startDate, endDate) {
  const matchStage = {};
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  matchStage.status = 'successful';
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'successful'] }, 1, 0] } },
        pendingPayments: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'successful'] }, '$amount', 0] } }
      }
    }
  ]);
  
  return stats[0] || {
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalRevenue: 0
  };
};

// Static method to get recent payments
paymentSchema.statics.getRecentPayments = async function(limit = 10) {
  return await this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .select('reference amount status type createdAt metadata');
};

// Instance method to mark as successful
paymentSchema.methods.markSuccessful = function(paystackData) {
  this.status = 'successful';
  this.paystackData = { ...this.paystackData, ...paystackData };
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to mark as failed
paymentSchema.methods.markFailed = function() {
  this.status = 'failed';
  this.updatedAt = new Date();
  return this.save();
};

// Instance method to mark as cancelled
paymentSchema.methods.markCancelled = function() {
  this.status = 'cancelled';
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema); 