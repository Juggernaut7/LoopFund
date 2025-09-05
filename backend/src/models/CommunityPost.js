const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String,
    default: 'Anonymous User'
  },
  category: {
    type: String,
    enum: [
      'success_story',
      'struggle_share',
      'tips_advice',
      'goal_update',
      'emotional_support',
      'financial_education',
      'habit_tracking',
      'celebration',
      'question',
      'motivation'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  financialMetrics: {
    savingsAmount: Number,
    debtReduction: Number,
    goalProgress: Number,
    emotionalSpendingReduction: Number
  },
  mood: {
    type: String,
    enum: ['excited', 'hopeful', 'stressed', 'frustrated', 'proud', 'anxious', 'grateful', 'determined'],
    required: true
  },
  privacyLevel: {
    type: String,
    enum: ['public', 'community_only', 'anonymous'],
    default: 'public'
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
      content: {
        type: String,
        required: true,
        maxlength: 500
      },
      isAnonymous: {
        type: Boolean,
        default: false
      },
      displayName: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }]
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
    }],
    views: {
      type: Number,
      default: 0
    }
  },
  aiInsights: {
    emotionalTone: String,
    sentimentScore: Number,
    keyThemes: [String],
    suggestedActions: [String],
    wellnessScore: Number
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'hidden', 'deleted'],
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

// Indexes for better performance
communityPostSchema.index({ category: 1, createdAt: -1 });
communityPostSchema.index({ author: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ 'engagement.likes': 1 });
communityPostSchema.index({ featured: 1, createdAt: -1 });

// Virtual for like count
communityPostSchema.virtual('likeCount').get(function() {
  return this.engagement.likes.length;
});

// Virtual for comment count
communityPostSchema.virtual('commentCount').get(function() {
  return this.engagement.comments.length;
});

// Virtual for share count
communityPostSchema.virtual('shareCount').get(function() {
  return this.engagement.shares.length;
});

// Method to add like
communityPostSchema.methods.addLike = function(userId) {
  const existingLike = this.engagement.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.engagement.likes.push({ user: userId });
    return true;
  }
  return false;
};

// Method to remove like
communityPostSchema.methods.removeLike = function(userId) {
  const likeIndex = this.engagement.likes.findIndex(like => like.user.toString() === userId.toString());
  if (likeIndex > -1) {
    this.engagement.likes.splice(likeIndex, 1);
    return true;
  }
  return false;
};

// Method to add comment
communityPostSchema.methods.addComment = function(userId, content, isAnonymous = false, displayName = null) {
  const comment = {
    user: userId,
    content,
    isAnonymous,
    displayName: isAnonymous ? (displayName || 'Anonymous') : null,
    timestamp: new Date()
  };
  this.engagement.comments.push(comment);
  return comment;
};

// Pre-save middleware to update updatedAt
communityPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CommunityPost', communityPostSchema); 