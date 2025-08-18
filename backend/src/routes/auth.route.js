const { Router } = require('express');
const { body } = require('express-validator');
const { signup, login, googleOAuth } = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validateRequest');
const passport = require('passport');
const { User } = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               isAdmin: { type: boolean }
 *     responses:
 *       201:
 *         description: User created
 */
router.post(
  '/signup',
  [
    body('firstName').isString().isLength({ min: 2 }),
    body('lastName').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('isAdmin').optional().isBoolean(),
  ],
  validateRequest,
  signup
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Authenticated
 */
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6 }),
  ],
  validateRequest,
  login
);

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 */
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend with token
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleOAuth
);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Authentication required
 */
// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, bio } = req.body;
    
    // Build update object only with provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change user password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    user.passwordHash = hashedNewPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;