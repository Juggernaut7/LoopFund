const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'system', 'contribution', 'join', 'leave'],
    default: 'text'
  },
  metadata: {
    contributionAmount: { type: Number },
    contributionMethod: { type: String },
    systemAction: { type: String }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ChatSchema.index({ group: 1, createdAt: -1 });
ChatSchema.index({ user: 1, createdAt: -1 });
ChatSchema.index({ type: 1 });

// Virtual for formatted message
ChatSchema.virtual('formattedMessage').get(function() {
  if (this.type === 'system') {
    return this.message;
  }
  if (this.type === 'contribution') {
    return `${this.user.firstName} contributed $${this.metadata.contributionAmount} via ${this.metadata.contributionMethod}`;
  }
  if (this.type === 'join') {
    return `${this.user.firstName} joined the group`;
  }
  if (this.type === 'leave') {
    return `${this.user.firstName} left the group`;
  }
  return this.message;
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
