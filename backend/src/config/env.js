const dotenv = require('dotenv');

dotenv.config();

function required(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  MONGODB_URI: required('MONGODB_URI', process.env.MONGODB_URI),
  jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Frontend URL for OAuth redirects
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = { env }; 