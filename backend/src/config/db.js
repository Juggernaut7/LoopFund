const mongoose = require('mongoose');
const { env } = require('./env');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// Retry helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// MongoDB connection function with retry logic
const connectToDatabase = async () => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`🔌 Attempt ${attempt + 1} to connect to MongoDB...`);
      console.log('🔌 Connection string:', env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        retryReads: true,
        family: 4,
      });

      console.log('✅ MongoDB connected successfully!');
      console.log('📍 Connected to:', mongoose.connection.host);
      console.log('📚 Database:', mongoose.connection.name);
      return true;

    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${attempt + 1}):`, error.message);

      if (error.message.includes('ESERVFAIL')) {
        console.error('💡 DNS Resolution Error - Try these solutions:');
        console.error('   1. Check your internet connection');
        console.error('   2. Use a different DNS (8.8.8.8, 1.1.1.1)');
        console.error('   3. Verify MongoDB Atlas access from your network');
        console.error('   4. Try a different network (e.g., mobile hotspot)');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('💡 Network Error - Try these solutions:');
        console.error('   1. Check firewall / proxy settings');
        console.error('   2. Try a VPN or different network');
        console.error('   3. Check ISP restrictions on MongoDB Atlas');
      }

      attempt += 1;

      if (attempt < MAX_RETRIES) {
        console.log(`🔁 Retrying in ${RETRY_DELAY_MS / 1000} seconds...\n`);
        await delay(RETRY_DELAY_MS);
      } else {
        console.error('❌ Exceeded max retries. Could not connect to MongoDB.');
        throw error;
      }
    }
  }
};

// Health check function
const checkDatabaseHealth = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      };
    } else {
      return {
        status: 'unhealthy',
        readyState: mongoose.connection.readyState,
        error: 'Database not connected'
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      readyState: mongoose.connection.readyState,
      error: error.message
    };
  }
};

// Graceful shutdown function
const gracefulShutdown = async () => {
  try {
    console.log('🛑 Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectToDatabase,
  checkDatabaseHealth,
  gracefulShutdown,
  mongoose
}; 
