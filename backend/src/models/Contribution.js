const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['bank_transfer', 'card', 'mobile_money', 'crypto', 'manual'], 
    default: 'manual' 
  },
  transactionId: { type: String },
  paymentProvider: { type: String }, // Paystack, Flutterwave, etc.
  scheduledDate: { type: Date },
  transactionDate: { type: Date, default: Date.now },
  processedDate: { type: Date },
  notes: { type: String, trim: true },
  metadata: {
    ipAddress: { type: String },
    userAgent: { type: String },
    deviceInfo: { type: String }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for contribution age
ContributionSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate transaction ID if not provided
ContributionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Set processed date when status changes to completed
  if (this.status === 'completed' && !this.processedDate) {
    this.processedDate = new Date();
  }
  
  next();
});

// Indexes for better performance
ContributionSchema.index({ goal: 1, status: 1 });
ContributionSchema.index({ user: 1, status: 1 });
ContributionSchema.index({ transactionDate: -1 });
ContributionSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
ContributionSchema.index({ paymentProvider: 1, status: 1 });

const Contribution = mongoose.model('Contribution', ContributionSchema);

module.exports = { Contribution };