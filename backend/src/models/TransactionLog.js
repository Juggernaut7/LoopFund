const mongoose = require('mongoose');

const TransactionLogSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'contribution', 
      'withdrawal', 
      'refund', 
      'fee', 
      'bonus', 
      'transfer', 
      'adjustment'
    ], 
    required: true 
  },
  status: { 
    type: String, 
    enum: [
      'pending', 
      'processing', 
      'completed', 
      'failed', 
      'cancelled', 
      'reversed'
    ], 
    default: 'pending' 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  fee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  
  // Related entities
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  contribution: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' },
  
  // Payment details
  paymentMethod: { 
    type: String, 
    enum: ['bank_transfer', 'card', 'mobile_money', 'crypto', 'manual', 'system'], 
    default: 'manual' 
  },
  paymentProvider: { type: String }, // Paystack, Flutterwave, etc.
  providerTransactionId: { type: String },
  providerReference: { type: String },
  
  // Timestamps
  initiatedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  completedAt: { type: Date },
  
  // Metadata
  description: { type: String, trim: true },
  notes: { type: String, trim: true },
  metadata: {
    ipAddress: { type: String },
    userAgent: { type: String },
    deviceInfo: { type: String },
    location: { type: String },
    riskScore: { type: Number, min: 0, max: 100 }
  },
  
  // Audit trail
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  
  // Error handling
  errorCode: { type: String },
  errorMessage: { type: String },
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction age
TransactionLogSchema.virtual('ageInMinutes').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60));
});

// Virtual for processing duration
TransactionLogSchema.virtual('processingDuration').get(function() {
  if (!this.processedAt || !this.initiatedAt) return null;
  const diffTime = this.processedAt - this.initiatedAt;
  return Math.floor(diffTime / (1000 * 60)); // minutes
});

// Pre-save middleware to calculate net amount and generate transaction ID
TransactionLogSchema.pre('save', function(next) {
  // Calculate net amount
  this.netAmount = this.amount - this.fee;
  
  // Generate transaction ID if not provided
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Set processed timestamp when status changes
  if (this.status === 'processing' && !this.processedAt) {
    this.processedAt = new Date();
  }
  
  // Set completed timestamp when status changes to completed
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Indexes for better performance
TransactionLogSchema.index({ transactionId: 1 }, { unique: true });
TransactionLogSchema.index({ user: 1, createdAt: -1 });
TransactionLogSchema.index({ goal: 1, createdAt: -1 });
TransactionLogSchema.index({ group: 1, createdAt: -1 });
TransactionLogSchema.index({ status: 1, createdAt: -1 });
TransactionLogSchema.index({ type: 1, status: 1 });
TransactionLogSchema.index({ paymentProvider: 1, providerTransactionId: 1 });
TransactionLogSchema.index({ initiatedAt: -1 });

const TransactionLog = mongoose.model('TransactionLog', TransactionLogSchema);

module.exports = { TransactionLog }; 