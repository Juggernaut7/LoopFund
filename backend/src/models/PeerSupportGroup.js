const mongoose = require('mongoose');

const peerSupportGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: [
      'debt_recovery',
      'savings_focus',
      'emotional_spending',
      'financial_anxiety',
      'budgeting_beginners',
      'investment_newbies',
      'single_parents',
      'students',
      'entrepreneurs',
      'retirement_planning',
      'general_support'
    ],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin', 'creator'],
      default: 'member'
    },
    status: {
      type: String,
      enum: ['active', 'muted', 'banned'],
      default: 'active'
    },
    contributionScore: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }],
  privacy: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  rules: [String],
  topics: [String],
  weeklyGoals: [{
    week: Number,
    goal: String,
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      progress: Number,
      completed: Boolean
    }]
  }],
  discussions: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    tags: [String]
  }],
  resources: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['article', 'video', 'tool', 'worksheet', 'template']
    },
    url: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  }],
  events: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['meeting', 'workshop', 'challenge', 'celebration']
    },
    startDate: Date,
    endDate: Date,
    location: String,
    maxParticipants: Number,
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  aiInsights: {
    groupHealth: {
      activityLevel: Number,
      engagementScore: Number,
      supportQuality: Number,
      lastUpdated: Date
    },
    commonChallenges: [String],
    successPatterns: [String],
    recommendedTopics: [String],
    memberMatching: [{
      member1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      member2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      compatibilityScore: Number,
      reason: String
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
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

peerSupportGroupSchema.index({ category: 1, status: 1 });
peerSupportGroupSchema.index({ creator: 1 });
peerSupportGroupSchema.index({ 'members.user': 1 });
peerSupportGroupSchema.index({ featured: 1, status: 1 });
peerSupportGroupSchema.index({ privacy: 1, status: 1 });

peerSupportGroupSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(m => m.user.toString() === userId.toString());
  if (!existingMember && this.members.length < this.maxMembers) {
    this.members.push({
      user: userId,
      joinedAt: new Date(),
      role,
      status: 'active',
      contributionScore: 0,
      lastActive: new Date()
    });
    return true;
  }
  return false;
};

peerSupportGroupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(m => m.user.toString() === userId.toString());
  if (memberIndex > -1) {
    this.members.splice(memberIndex, 1);
    return true;
  }
  return false;
};

peerSupportGroupSchema.methods.addDiscussion = function(discussionData) {
  this.discussions.push({
    ...discussionData,
    createdAt: new Date(),
    replies: [],
    likes: [],
    tags: discussionData.tags || []
  });
};

peerSupportGroupSchema.methods.addResource = function(resourceData) {
  this.resources.push({
    ...resourceData,
    addedAt: new Date(),
    rating: {
      average: 0,
      count: 0
    }
  });
};

peerSupportGroupSchema.methods.addEvent = function(eventData) {
  this.events.push({
    ...eventData,
    participants: []
  });
};

peerSupportGroupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

peerSupportGroupSchema.virtual('activeMemberCount').get(function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.members.filter(m => m.lastActive > thirtyDaysAgo).length;
});

peerSupportGroupSchema.virtual('discussionCount').get(function() {
  return this.discussions.length;
});

peerSupportGroupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('PeerSupportGroup', peerSupportGroupSchema); 