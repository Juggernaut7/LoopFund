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
  // Email verification fields
  emailVerificationCode: { type: String },
  emailVerificationExpires: { type: Date },
  emailVerifiedAt: { type: Date },
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
  },
  interests: [{ type: String }], // Financial interests and goals
  financialProfile: {
    income: Number,
    expenses: Number,
    savings: Number,
    debt: Number,
    riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    investmentGoals: [String],
    preferredCategories: [String]
  }
}, { timestamps: true });

// Indexes for better query performance
// Note: email and googleId already have indexes via unique/sparse properties
UserSchema.index({ isActive: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

// Virtual for full name
UserSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for avatar (alias for profilePicture)
UserSchema.virtual('avatar').get(function() {
  return this.profilePicture;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;