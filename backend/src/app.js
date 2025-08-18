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

const app = express();  

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
  
// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
// 404 & Error handler 
app.use(notFound);
app.use(errorHandler);  

module.exports = { app }; 