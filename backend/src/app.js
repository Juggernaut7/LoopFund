const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const passport = require('./config/passport');
const healthRoutes = require('./routes/health.route');
const authRoutes = require('./routes/auth.route');
const groupRoutes = require('./routes/groups.route');
const goalRoutes = require('./routes/goals.route');
const contributionRoutes = require('./routes/contributions.route');
const adminRoutes = require('./routes/admin.route');
const testRoutes = require('./routes/test.route');
const achievementRoutes = require('./routes/achievements.route');
const analyticsRoutes = require('./routes/analytics.route');
const { env } = require('./config/env');
const notificationRoutes = require('./routes/notifications.route');
const paymentRoutes = require('./routes/payment.route');
const transactionRoutes = require('./routes/transactions.route');
const enhancedCommunityRoutes = require('./routes/enhancedCommunity.route');
const communityRoutes = require('./routes/community.route');
const emailVerificationRoutes = require('./routes/emailVerification.route');
const walletRoutes = require('./routes/wallet.route');

const app = express();

// Create HTTP server for WebSocket
const server = require('http').createServer(app);

// Initialize WebSocket
try {
  const NotificationSocket = require('./websocket/notificationSocket');
  const notificationSocket = new NotificationSocket(server);
  global.notificationSocket = notificationSocket;
  console.log('✅ WebSocket server initialized on /ws path');
} catch (error) {
  console.log('⚠️ WebSocket not available - notifications will work without real-time updates');
  console.error('WebSocket error:', error);
  global.notificationSocket = null;
}

// Security & basics
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session configuration for OAuth
app.use(session({
  secret: env.jwtSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/enhanced-community', enhancedCommunityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/email', emailVerificationRoutes);
app.use('/api/wallet', walletRoutes);

// Invitation routes
app.use('/api/invitations', require('./routes/invitations.route'));

// Dashboard routes
app.use('/api/dashboard', require('./routes/dashboard.route'));

// AI routes
app.use('/api/ai', require('./routes/ai.route'));

// Chat routes
app.use('/api/chat', require('./routes/chat.route'));

// Analytics routes (already registered above)

// Therapy Game routes
app.use('/api/therapy-games', require('./routes/therapyGame.route'));

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route - API welcome page
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🔄 Welcome to LoopFund API',
    version: '2.0.0',
    status: 'online',
    description: 'Smart Savings Platform API for Africa',
    endpoints: {
      health: '/api/health',
      documentation: '/docs',
      test: '/api/test'
    },
    features: [
      'Individual Goal Management',
      'Group Savings',
      'Payment Integration (Paystack)',
      'Achievement System',
      'Analytics & Insights',
      'Real-time Notifications',
      'AI Financial Advisor'
    ],
    links: {
      github: 'https://github.com/Juggernaut7/LoopFund',
      frontend: env.frontendUrl || 'https://loopfund.netlify.app',
      documentation: `${req.protocol}://${req.get('host')}/docs`
    },
    timestamp: new Date().toISOString()
  });
});

// 404 & Error handler
app.use(notFound);
app.use(errorHandler);

// Start fund release cron job
const fundReleaseCronService = require('./services/fundReleaseCron.service');
fundReleaseCronService.startFundReleaseCron();

// Export both app and server
module.exports = { app, server };