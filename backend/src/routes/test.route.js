const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// Test endpoint without auth
router.get('/', (req, res) => {
  res.json({
    message: 'Test route working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Test endpoint with auth
router.get('/auth-test', requireAuth, (req, res) => {
  res.json({
    message: 'Auth test successful',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check middleware loading
router.get('/middleware-test', (req, res) => {
  res.json({
    message: 'Middleware test',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 