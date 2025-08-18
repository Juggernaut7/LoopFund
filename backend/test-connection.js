const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('🔌 Connection string:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📍 Connected to:', mongoose.connection.host);
    console.log('📚 Database:', mongoose.connection.name);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 8000) {
      console.log('\n💡 This looks like an authentication error. Please check:');
      console.log('   1. Username and password are correct');
      console.log('   2. User has access to the database');
      console.log('   3. Network access is allowed from your IP');
    }
  }
};

testConnection(); 