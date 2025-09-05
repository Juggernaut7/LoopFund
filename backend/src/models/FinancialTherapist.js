const mongoose = require('mongoose');

const financialTherapistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotionalProfile: {
    spendingTriggers: [{
      trigger: String,
      frequency: Number,
      impact: Number,
      lastOccurrence: Date
    }],
    stressLevels: [{
      level: Number,
      timestamp: Date,
      spendingAmount: Number,
      category: String
    }],
    moodPatterns: [{
      mood: String,
      spendingBehavior: String,
      timestamp: Date,
      amount: Number
    }],
    anxietyTriggers: [{
      trigger: String,
      severity: Number,
      copingMechanism: String,
      effectiveness: Number
    }]
  },
  therapySessions: [{
    sessionType: {
      type: String,
      enum: ['emotional_analysis', 'spending_intervention', 'habit_building', 'crisis_prevention', 'mindset_shift'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: Number,
    insights: [String],
    recommendations: [String],
    moodBefore: String,
    moodAfter: String,
    effectiveness: Number,
    followUpActions: [String]
  }],
  interventions: [{
    type: {
      type: String,
      enum: ['micro_pause', 'emotional_check', 'habit_reminder', 'crisis_alert', 'celebration'],
      required: true
    },
    timestamp: Date,
    trigger: String,
    action: String,
    outcome: String,
    effectiveness: Number
  }],
  habitTracking: {
    currentHabits: [{
      habit: String,
      frequency: String,
      streak: Number,
      effectiveness: Number,
      lastPerformed: Date
    }],
    targetHabits: [{
      habit: String,
      targetFrequency: String,
      progress: Number,
      startDate: Date,
      targetDate: Date
    }],
    habitStacking: [{
      anchorHabit: String,
      newHabit: String,
      success: Boolean,
      lastAttempt: Date
    }]
  },
  predictiveInsights: {
    nextSpendingCrisis: {
      predictedDate: Date,
      confidence: Number,
      triggers: [String],
      preventionStrategies: [String]
    },
    emotionalSpendingForecast: {
      nextWeek: Number,
      nextMonth: Number,
      confidence: Number
    },
    habitFormationPredictions: [{
      habit: String,
      estimatedDays: Number,
      successProbability: Number
    }]
  },
  wellnessMetrics: {
    financialStress: {
      current: Number,
      trend: String,
      lastUpdated: Date
    },
    emotionalSpendingControl: {
      score: Number,
      improvement: Number,
      lastUpdated: Date
    },
    financialConfidence: {
      score: Number,
      trend: String,
      lastUpdated: Date
    },
    habitAdherence: {
      score: Number,
      consistency: Number,
      lastUpdated: Date
    }
  },
  aiRecommendations: {
    daily: [{
      type: String,
      content: String,
      priority: Number,
      completed: Boolean,
      date: Date
    }],
    weekly: [{
      focus: String,
      goals: [String],
      strategies: [String],
      progress: Number
    }],
    monthly: [{
      theme: String,
      objectives: [String],
      milestones: [String],
      achievements: [String]
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

financialTherapistSchema.index({ user: 1 });
financialTherapistSchema.index({ 'emotionalProfile.spendingTriggers.trigger': 1 });
financialTherapistSchema.index({ 'therapySessions.sessionType': 1, 'therapySessions.timestamp': -1 });
financialTherapistSchema.index({ 'interventions.type': 1, 'interventions.timestamp': -1 });

financialTherapistSchema.methods.addSpendingTrigger = function(trigger, impact) {
  const existingTrigger = this.emotionalProfile.spendingTriggers.find(t => t.trigger === trigger);
  if (existingTrigger) {
    existingTrigger.frequency += 1;
    existingTrigger.impact = Math.max(existingTrigger.impact, impact);
    existingTrigger.lastOccurrence = new Date();
  } else {
    this.emotionalProfile.spendingTriggers.push({
      trigger,
      frequency: 1,
      impact,
      lastOccurrence: new Date()
    });
  }
};

financialTherapistSchema.methods.recordStressLevel = function(level, spendingAmount, category) {
  this.emotionalProfile.stressLevels.push({
    level,
    timestamp: new Date(),
    spendingAmount,
    category
  });
};

financialTherapistSchema.methods.addTherapySession = function(sessionData) {
  this.therapySessions.push({
    ...sessionData,
    timestamp: new Date()
  });
};

financialTherapistSchema.methods.addIntervention = function(interventionData) {
  this.interventions.push({
    ...interventionData,
    timestamp: new Date()
  });
};

financialTherapistSchema.methods.updateWellnessMetrics = function(metrics) {
  this.wellnessMetrics = {
    ...this.wellnessMetrics,
    ...metrics,
    lastUpdated: new Date()
  };
};

financialTherapistSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('FinancialTherapist', financialTherapistSchema); 