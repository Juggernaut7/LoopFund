const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');

async function setTestToken() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database');
      process.exit(0);
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user._id})`);

    // Create a JWT token for this user
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('\n🔑 Generated JWT Token:');
    console.log(token);
    
    console.log('\n📋 To test this token in the browser:');
    console.log('1. Open browser console');
    console.log('2. Run: localStorage.setItem("token", "' + token + '")');
    console.log('3. Refresh the achievements page');
    
    console.log('\n🔍 Token payload:');
    const payload = jwt.decode(token);
    console.log(JSON.stringify(payload, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error setting test token:', error);
    process.exit(1);
  }
}

// Run the function
setTestToken();
