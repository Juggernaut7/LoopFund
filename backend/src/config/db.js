const mongoose = require('mongoose');
const { env } = require('./env');

// MongoDB connection options (valid for current Mongoose version)
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  maxIdleTimeMS: 30000, // Close idle connections after 30s
  retryWrites: true,
  retryReads: true,
};

// Retry configuration (separate from MongoDB options)
const retryConfig = {
  retryDelay: 1000, // Start with 1 second delay
  maxRetries: 5, // Maximum number of retries
  retryMultiplier: 2, // Exponential backoff multiplier
  maxRetryDelay: 30000, // Maximum delay between retries (30 seconds)
};

let retryCount = 0;
let isConnecting = false;
let connectionPromise = null;

// Exponential backoff function
const getRetryDelay = (attempt) => {
  const delay = retryConfig.retryDelay * Math.pow(retryConfig.retryMultiplier, attempt);
  return Math.min(delay, retryConfig.maxRetryDelay);
};

// Connection event handlers
const setupConnectionHandlers = () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    retryCount = 0; // Reset retry count on successful connection
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (!isConnecting) {
      handleConnectionError(err);
    }
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
    if (!isConnecting) {
      handleDisconnection();
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
    retryCount = 0; // Reset retry count on successful reconnection
  });
};

// Handle connection errors with retry logic
const handleConnectionError = async (error) => {
  if (retryCount >= retryConfig.maxRetries) {
    console.error('❌ Max retry attempts reached. MongoDB connection failed permanently.');
    console.error('Error details:', error);
    process.exit(1);
  }

  retryCount++;
  const delay = getRetryDelay(retryCount - 1);
  
  console.log(`🔄 MongoDB connection failed. Retrying in ${delay}ms... (Attempt ${retryCount}/${retryConfig.maxRetries})`);
  
  setTimeout(() => {
    if (!isConnecting) {
      connectToDatabase();
    }
  }, delay);
};

// Handle disconnection with reconnection logic
const handleDisconnection = async () => {
  if (retryCount >= retryConfig.maxRetries) {
    console.error('❌ Max reconnection attempts reached. Stopping reconnection attempts.');
    return;
  }

  retryCount++;
  const delay = getRetryDelay(retryCount - 1);
  
  console.log(`🔄 MongoDB disconnected. Attempting to reconnect in ${delay}ms... (Attempt ${retryCount}/${retryConfig.maxRetries})`);
  
  setTimeout(() => {
    if (!isConnecting && mongoose.connection.readyState === 0) {
      connectToDatabase();
    }
  }, delay);
};

// Main connection function with retry logic
const connectToDatabase = async () => {
  if (isConnecting) {
    console.log('⏳ MongoDB connection already in progress...');
    return connectionPromise;
  }

  isConnecting = true;
  console.log('🔌 Attempting to connect to MongoDB...');

  try {
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      if (mongoose.connection.readyState === 0) {
        console.error('⏰ MongoDB connection timeout');
        isConnecting = false;
        handleConnectionError(new Error('Connection timeout'));
      }
    }, 10000); // 10 second timeout

    await mongoose.connect(env.mongoUri, mongoOptions);
    
    clearTimeout(connectionTimeout);
    isConnecting = false;
    
    console.log('✅ MongoDB connection established successfully');
    return mongoose.connection;
    
  } catch (error) {
    isConnecting = false;
    console.error('❌ MongoDB connection failed:', error.message);
    handleConnectionError(error);
    throw error;
  }
};

// Health check function
const checkDatabaseHealth = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Ping the database to ensure it's responsive
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
    console.log('🛑 Closing MongoDB connection gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

// Initialize connection handlers
setupConnectionHandlers();

module.exports = {
  connectToDatabase,
  checkDatabaseHealth,
  gracefulShutdown,
  mongoose
}; 