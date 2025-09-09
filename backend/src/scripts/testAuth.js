const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');

async function testAuth() {
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
    console.log('\n📋 Test this token with:');
    console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/achievements/progress`);

    process.exit(0);
  } catch (error) {
    console.error('Error testing auth:', error);
    process.exit(1);
  }
}

// Run the function
testAuth();
