const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  bio: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  googleId: { type: String, sparse: true }, // For Google OAuth users
  profilePicture: { type: String },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
  lastLogin: { Date },
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

// Index for better query performance (removed duplicate email index)
UserSchema.index({ isActive: 1 });
UserSchema.index({ googleId: 1 }); // Index for Google OAuth lookups
UserSchema.index({ status: 1 }); // Index for status filtering
UserSchema.index({ role: 1 }); // Index for role filtering

const User = mongoose.model('User', UserSchema);

module.exports = { User };