const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  goal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Goal', 
    required: function() {
      return this.type === 'individual';
    }
  },
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group',
    required: function() {
      return this.type === 'group';
    }
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  type: { 
    type: String, 
    enum: ['individual', 'group'], 
    default: 'individual' 
  },
  method: { 
    type: String, 
    enum: ['bank_transfer', 'card_payment', 'cash', 'other'], 
    default: 'bank_transfer' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  },
  description: { 
    type: String, 
    trim: true 
  },
  metadata: {
    goalName: { type: String },
    goalType: { type: String },
    groupName: { type: String }
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
ContributionSchema.index({ user: 1, createdAt: -1 });
ContributionSchema.index({ goal: 1, createdAt: -1 });
ContributionSchema.index({ group: 1, createdAt: -1 });
ContributionSchema.index({ type: 1 });
ContributionSchema.index({ status: 1 });

const Contribution = mongoose.model('Contribution', ContributionSchema);

module.exports = Contribution;