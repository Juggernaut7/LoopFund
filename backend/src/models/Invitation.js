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
    required: false // Optional for public invitations and email invitations
  },
  inviteeEmail: {
    type: String,
    required: false // For email invitations
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  type: {
    type: String,
    enum: ['direct', 'public', 'email'],
    default: 'direct'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  invitationToken: {
    type: String,
    unique: true,
    sparse: true // For email invitations
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
// Note: inviteCode and invitationToken already have indexes via unique/sparse properties
invitationSchema.index({ group: 1, status: 1 });
invitationSchema.index({ expiresAt: 1 });

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('Invitation', invitationSchema); 