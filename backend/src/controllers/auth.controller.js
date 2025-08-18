const { signup, login, handleGoogleOAuth } = require('../services/auth.service');
const { env } = require('../config/env');
const jwt = require('jsonwebtoken');

async function signupController(req, res, next) {
  try {
    const result = await signup(req.body);
    // Send token and user directly for frontend compatibility
    res.status(201).json({
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const result = await login(req.body);
    // Send token and user directly for frontend compatibility
    res.json({
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function googleOAuthController(req, res, next) {
  try {
    console.log('Google OAuth Controller - req.user:', req.user);
    
    // This will be called after Google OAuth authentication
    // The user data will be available in req.user (set by Passport)
    if (!req.user) {
      console.error('No user found in req.user');
      return res.status(401).json({ success: false, message: 'Google OAuth failed - no user data' });
    }

    // Since req.user is already the database user, we just need to generate a token
    // No need to call handleGoogleOAuth again
    const token = jwt.sign(
      { userId: req.user._id, isAdmin: req.user.isAdmin }, 
      env.jwtSecret, 
      { expiresIn: '7d' }
    );

    const result = {
      token,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
    };

    console.log('Google OAuth result:', result);
    
    // Redirect to frontend with token and user ID
    const redirectUrl = `${env.frontendUrl}/auth/callback?token=${result.token}&userId=${result.user.id}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth Controller Error:', error);
    next(error);
  }
}

module.exports = { 
  signup: signupController, 
  login: loginController,
  googleOAuth: googleOAuthController
};