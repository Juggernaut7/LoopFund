const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');

// Add debug logging
console.log('🔍 Auth service loading...');

async function signup({ firstName, lastName, email, password, isAdmin = false }) {
  console.log('🎯 Signup function called with:', { firstName, lastName, email, isAdmin });
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        error: 'Email already in use. Please use a different email or sign in.',
        code: 'EMAIL_EXISTS'
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, passwordHash, isAdmin });
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
    
    // Fix: Return the format frontend expects
    return { 
      success: true,
      data: {
        token, 
        user: { id: user._id, firstName, lastName, email, isAdmin } 
      }
    };
  } catch (error) {
    console.error('❌ Signup error:', error);
    return {
      success: false,
      error: error.message || 'Signup failed',
      code: 'SIGNUP_ERROR'
    };
  }
}

async function login({ email, password }) {
  console.log('🎯 Login function called with:', { email });
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return {
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      };
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
    
    // Fix: Return the format frontend expects
    return { 
      success: true,
      data: {
        token, 
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin } 
      }
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed',
      code: 'LOGIN_ERROR'
    };
  }
}

// Add the missing handleGoogleOAuth function
async function handleGoogleOAuth(profile) {
  try {
    console.log('🎯 Google OAuth function called with profile:', profile);
    
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (!user) {
      // Create new user from Google profile
      const firstName = profile.name.givenName || profile.displayName?.split(' ')[0] || 'User';
      const lastName = profile.name.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';
      
      user = await User.create({
        firstName,
        lastName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isAdmin: false,
        isVerified: true,
        passwordHash: 'google-oauth-user' // Placeholder for OAuth users
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, 
      env.jwtSecret, 
      { expiresIn: '7d' }
    );

    return { 
      success: true,
      token, 
      user: { 
        id: user._id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        isAdmin: user.isAdmin 
      } 
    };
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return {
      success: false,
      error: error.message || 'Google OAuth failed',
      code: 'OAUTH_ERROR'
    };
  }
}

// Make sure the export is correct
console.log('🔍 Auth service functions defined:', { signup, login, handleGoogleOAuth });

module.exports = { 
  signup, 
  login, 
  handleGoogleOAuth 
};