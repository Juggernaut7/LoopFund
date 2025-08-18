const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/User');
const { env } = require('./env');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Passport Google Strategy Profile:', JSON.stringify(profile, null, 2));
    
    // Validate profile structure
    if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      console.error('Invalid profile structure:', profile);
      return done(new Error('Invalid Google profile structure - missing email information'));
    }
    
    if (!profile.name) {
      console.error('Invalid profile structure - missing name:', profile);
      return done(new Error('Invalid Google profile structure - missing name information'));
    }

    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // User exists, update last login and Google ID
      user.lastLogin = new Date();
      user.googleId = profile.id;
      await user.save();
      console.log('Existing user updated:', user.email);
    } else {
      // Create new user
      const firstName = profile.name.givenName || profile.displayName?.split(' ')[0] || 'User';
      const lastName = profile.name.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';
      
      user = new User({
        firstName,
        lastName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true, // Google accounts are pre-verified
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
      
      await user.save();
      console.log('New user created:', user.email);
    }
    
    // Return just the user profile (token will be generated in controller)
    return done(null, user);
    
  } catch (error) {
    console.error('Passport Google Strategy Error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 