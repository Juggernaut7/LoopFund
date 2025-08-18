const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authenticateToken = (req, res, next) => {
  console.log('🔐 Auth Middleware: Processing request to:', req.path);
  console.log('🔐 Auth Middleware: Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 Auth Middleware: Auth header:', authHeader);
  console.log('🔐 Auth Middleware: Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

  if (!token) {
    console.log('🔐 Auth Middleware: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('🔐 Auth Middleware: Verifying token with secret:', env.jwtSecret ? 'SECRET EXISTS' : 'NO SECRET');
    const decoded = jwt.verify(token, env.jwtSecret);
    console.log('🔐 Auth Middleware: Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('🔐 Auth Middleware: Token verification failed:', error.message);
    console.error('🔐 Auth Middleware: Error type:', error.name);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Token verification failed' });
  }
};

// Alias for authenticateToken
const requireAuth = authenticateToken;

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { 
  authenticateToken, 
  requireAuth, 
  requireAdmin 
};