const mongoose = require('mongoose');

const therapyGameScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String,
    required: true,
    enum: ['anxiety-reduction', 'trigger-identification', 'mindset-transformation', 'confidence-building']
  },
  gameTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true,
    default: 0
  },
  accuracy: {
    type: Number,
    required: true,
    default: 0
  },
  timeSpent: {
    type: Number,
    required: true,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  isPerfect: {
    type: Boolean,
    default: false
  },
  timeBonus: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient leaderboard queries
therapyGameScoreSchema.index({ user: 1, gameId: 1 });
therapyGameScoreSchema.index({ totalPoints: -1, completedAt: -1 });
therapyGameScoreSchema.index({ gameId: 1, totalPoints: -1 });

// Virtual for user's total score across all games
therapyGameScoreSchema.virtual('userTotalScore', {
  ref: 'TherapyGameScore',
  localField: 'user',
  foreignField: 'user',
  justOne: false
});

module.exports = mongoose.model('TherapyGameScore', therapyGameScoreSchema);
