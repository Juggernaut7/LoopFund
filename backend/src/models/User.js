const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    reminderFrequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'daily' }
  },
  preferences: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = { User };