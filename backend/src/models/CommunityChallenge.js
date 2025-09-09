const mongoose = require('mongoose');

const communityChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: [
      'savings_challenge',
      'debt_free_challenge',
      'no_spend_challenge',
      'emotional_control',
      'habit_building',
      'financial_education',
      'mindset_shift',
      'community_support'
    ],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    role: {
      type: String,
      enum: ['participant', 'moderator', 'admin', 'creator'],
      default: 'participant'
    },
    milestones: [{
      milestone: String,
      completed: Boolean,
      completedAt: Date
    }],
    checkIns: [{
      date: Date,
      mood: String,
      progress: Number,
      notes: String
    }],
    tasks: [{
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChallengeTask'
      },
      completed: Boolean,
      completedAt: Date,
      submission: String,
      approved: Boolean,
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  }],
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    durationDays: {
      type: Number,
      required: true
    }
  },
  goals: {
    targetAmount: Number,
    targetParticipants: Number,
    targetCompletionRate: Number
  },
  rewards: {
    badges: [String],
    points: Number,
    recognition: String,
    communityFeatures: [String]
  },
  tasks: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'milestone', 'custom'],
      default: 'custom'
    },
    points: {
      type: Number,
      default: 10
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rules: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  engagement: {
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    shares: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  aiInsights: {
    successFactors: [String],
    commonStruggles: [String],
    motivationalTriggers: [String],
    completionPredictors: [String]
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

communityChallengeSchema.index({ category: 1, status: 1 });
communityChallengeSchema.index({ creator: 1 });
communityChallengeSchema.index({ 'participants.user': 1 });
communityChallengeSchema.index({ featured: 1, status: 1 });
communityChallengeSchema.index({ 'duration.startDate': 1, 'duration.endDate': 1 });

communityChallengeSchema.methods.removeParticipant = function(userId) {
  const participantIndex = this.participants.findIndex(p => p.user.toString() === userId.toString());
  if (participantIndex > -1) {
    this.participants.splice(participantIndex, 1);
    return true;
  }
  return false;
};

communityChallengeSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      joinedAt: new Date(),
      progress: 0,
      milestones: [],
      checkIns: []
    });
    return true;
  }
  return false;
};

communityChallengeSchema.methods.updateParticipantProgress = function(userId, progress, milestone = null) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.progress = Math.min(100, Math.max(0, progress));
    if (milestone) {
      participant.milestones.push({
        milestone,
        completed: true,
        completedAt: new Date()
      });
    }
    return true;
  }
  return false;
};

communityChallengeSchema.methods.addCheckIn = function(userId, checkInData) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.checkIns.push({
      ...checkInData,
      date: new Date()
    });
    return true;
  }
  return false;
};

communityChallengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

communityChallengeSchema.virtual('averageProgress').get(function() {
  if (this.participants.length === 0) return 0;
  const totalProgress = this.participants.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(totalProgress / this.participants.length);
});

communityChallengeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CommunityChallenge', communityChallengeSchema); 