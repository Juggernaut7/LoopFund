const User = require('../models/User');
const emailService = require('../services/emailService');
const { env } = require('../config/env');
const crypto = require('crypto');

// Generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email after signup
async function sendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save verification code to user
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationCode(
      email,
      verificationCode,
      user.firstName
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Verify email with code
async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    console.log('🔍 Email verification request:', { email, code });

    if (!email || !code) {
      console.log('❌ Missing email or code');
      return res.status(400).json({
        success: false,
        error: 'Email and verification code are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('🔍 User found:', user ? { id: user._id, email: user.email, isVerified: user.isVerified } : 'No user found');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Check if verification code exists and is not expired
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        error: 'No verification code found. Please request a new one.'
      });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new one.'
      });
    }

    // Verify the code
    if (user.emailVerificationCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    // Generate new JWT token for verified user
    const jwt = require('jsonwebtoken');
    const { env } = require('../config/env');
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        isActive: user.isActive,
        profilePicture: user.profilePicture,
        notificationPreferences: user.notificationPreferences,
        preferences: user.preferences,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Resend verification email
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Check rate limiting (prevent spam)
    const now = new Date();
    if (user.emailVerificationExpires && now < user.emailVerificationExpires) {
      const timeLeft = Math.ceil((user.emailVerificationExpires - now) / 1000 / 60);
      return res.status(429).json({
        success: false,
        error: `Please wait ${timeLeft} minutes before requesting another verification email`
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save verification code to user
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationCode(
      email,
      verificationCode,
      user.firstName
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail
};
