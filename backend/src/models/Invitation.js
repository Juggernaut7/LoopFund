const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for public invitations
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  type: {
    type: String,
    enum: ['direct', 'public'],
    default: 'direct'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired', 'active'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  acceptedAt: Date,
  declinedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for performance
invitationSchema.index({ group: 1, status: 1 });
invitationSchema.index({ inviteCode: 1 });
invitationSchema.index({ expiresAt: 1 });

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = { Invitation: mongoose.model('Invitation', invitationSchema) }; 