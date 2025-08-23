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

router.get('/websocket-test', (req, res) => {
  const wsCount = global.notificationSocket ? global.notificationSocket.getConnectedClientsCount() : 0;
  res.json({
    websocket_available: !!global.notificationSocket,
    connected_clients: wsCount,
    endpoint: 'ws://localhost:4000/ws'
  });
});

module.exports = router; 