const { app } = require('./app');
const { env } = require('./config/env');

const PORT = env.port || 4000;

const server = app.listen(PORT, () => {
  console.log('🚀 LoopFund Backend Test Server Started!');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`🧪 Test Endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('✨ Enhanced Features Available:');
  console.log('   • Enhanced User Management with Profile & Preferences');
  console.log('   • Advanced Goal Tracking with Progress & Analytics');
  console.log('   • Group Savings with Invite System & Member Management');
  console.log('   • Contribution System with Payment Status Tracking');
  console.log('   • Multi-channel Notification System');
  console.log('   • Gamification with Achievement System');
  console.log('   • Comprehensive Analytics & Insights');
  console.log('   • Transaction Logging with Audit Trail');
  console.log('   • Multi-currency Support');
  console.log('   • Advanced Validation & Security');
  console.log('');
  console.log('🎯 Ready for your milestone presentation!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { server }; 