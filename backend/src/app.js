const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const healthRoutes = require('./routes/health.route');
const authRoutes = require('./routes/auth.route');
const groupRoutes = require('./routes/groups.route');
const goalRoutes = require('./routes/goals.route');
const contributionRoutes = require('./routes/contributions.route');
const adminRoutes = require('./routes/admin.route');
const testRoutes = require('./routes/test.route');
const { env } = require('./config/env');

const app = express();

// Security & basics
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/admin', adminRoutes);

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 & Error handler
app.use(notFound);
app.use(errorHandler);

module.exports = { app };