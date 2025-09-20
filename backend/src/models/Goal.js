const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  targetAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currentAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  type: { 
    type: String, 
    enum: ['individual', 'group'], 
    default: 'individual' 
  },
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
  },
  category: { 
    type: String, 
    enum: ['personal', 'business', 'education', 'travel', 'emergency', 'other'], 
    default: 'personal' 
  },
  deadline: { 
    type: Date 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastContributionDate: { 
    type: Date 
  },
  contributions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    paidAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
  }]
}, { 
  timestamps: true 
});

// Indexes for better query performance
GoalSchema.index({ user: 1, isActive: 1 });
GoalSchema.index({ group: 1, isActive: 1 });
GoalSchema.index({ type: 1 });
GoalSchema.index({ category: 1 });

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;