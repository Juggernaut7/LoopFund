const mongoose = require('mongoose');
const User = require('../models/User');
const { env } = require('../config/env');

async function checkUnverifiedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all unverified users
    const unverifiedUsers = await User.find({ isVerified: false });
    
    console.log(`\n📊 Found ${unverifiedUsers.length} unverified users:`);
    
    if (unverifiedUsers.length === 0) {
      console.log('🎉 All users are verified!');
      return;
    }

    // Display unverified users
    unverifiedUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   Has verification code: ${user.emailVerificationCode ? 'Yes' : 'No'}`);
      console.log(`   Code expires: ${user.emailVerificationExpires ? user.emailVerificationExpires.toLocaleString() : 'N/A'}`);
      
      // Check if code is expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        console.log(`   ⚠️  Verification code is EXPIRED`);
      } else if (user.emailVerificationCode) {
        console.log(`   ✅ Verification code is VALID`);
      }
    });

    console.log(`\n🔧 Solutions for existing unverified users:`);
    console.log(`1. They can log in normally`);
    console.log(`2. Frontend will show email verification modal`);
    console.log(`3. They can click "Resend Code" to get a new verification code`);
    console.log(`4. They can enter the new code to verify their email`);
    console.log(`5. After verification, they'll have full access to the app`);

    console.log(`\n📧 To help existing users:`);
    console.log(`- They should check their email for verification codes`);
    console.log(`- If codes are expired, they can request new ones`);
    console.log(`- The resend functionality has rate limiting (10 minutes)`);
    console.log(`- All verification codes expire after 10 minutes`);

  } catch (error) {
    console.error('❌ Error checking unverified users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
checkUnverifiedUsers();
