const { signup, login, handleGoogleOAuth } = require('../services/auth.service');
const { env } = require('../config/env');
const jwt = require('jsonwebtoken');

// Add debug logging to see what's being imported
console.log('🔍 Auth service functions:', { signup, login, handleGoogleOAuth });

async function signupController(req, res, next) {
  try {
    console.log('🎯 Signup controller called');
    const result = await signup(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        code: result.code
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    console.error('❌ Signup controller error:', error);
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    console.log('🎯 Login controller called');
    const result = await login(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Make sure we're sending the correct format
    res.json({
      success: true,
      data: {
        token: result.data.token,
        user: result.data.user
      }
    });
  } catch (error) {
    console.error('❌ Login controller error:', error);
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