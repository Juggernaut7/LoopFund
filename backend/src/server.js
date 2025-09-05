const { app, server } = require('./app');
const { connectToDatabase, checkDatabaseHealth, gracefulShutdown } = require('./config/db');
const { env } = require('./config/env');

const PORT = env.port || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB with retry logic
    console.log('🚀 Starting LoopFund Backend Server...');
    console.log('🔌 Connecting to MongoDB...');

    await connectToDatabase();
    
    // Start the server using the server from app.js
    server.listen(PORT, () => {
      console.log('✅ LoopFund Backend Server Started Successfully!');
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
      console.log('   • Robust MongoDB Connection with Retry Logic');
      console.log('   • Google OAuth Authentication');
      console.log('');
      console.log('🎯 Ready for your milestone presentation!');
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);
      
      // Stop accepting new requests
      server.close(() => {
        console.log('✅ HTTP server closed');
      });

      // Close database connection
      await gracefulShutdown();
      
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown().then(() => process.exit(1));
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown().then(() => process.exit(1));
    });

    return server;

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();