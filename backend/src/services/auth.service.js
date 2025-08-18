const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { env } = require('../config/env');

async function signup({ firstName, lastName, email, password, isAdmin = false }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, passwordHash, isAdmin });
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
  return { token, user: { id: user._id, firstName, lastName, email, isAdmin } };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
  return { token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin } };
}

async function handleGoogleOAuth(profile) {
  try {
    console.log('Google OAuth Profile:', JSON.stringify(profile, null, 2));
    
    // Validate profile structure
    if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      throw new Error('Invalid Google profile structure - missing email information');
    }
    
    if (!profile.name) {
      throw new Error('Invalid Google profile structure - missing name information');
    }

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
        profilePicture: profile.photos?.[0]?.value,
        passwordHash: 'google-oauth-user', // Placeholder for OAuth users
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
          reminderFrequency: 'daily'
        },
        preferences: {
          currency: 'USD',
          timezone: 'UTC',
          language: 'en'
        }
      });
    } else {
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, 
      env.jwtSecret, 
      { expiresIn: '7d' }
    );

    return { 
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
    console.error('Google OAuth Error:', error);
    throw new Error(`Google OAuth failed: ${error.message}`);
  }
}

module.exports = { signup, login, handleGoogleOAuth };