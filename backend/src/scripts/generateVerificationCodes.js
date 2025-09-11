const mongoose = require('mongoose');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { env } = require('../config/env');

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateVerificationCodesForUnverifiedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all unverified users without valid codes
    const unverifiedUsers = await User.find({ 
      isVerified: false,
      $or: [
        { emailVerificationCode: { $exists: false } },
        { emailVerificationCode: null },
        { emailVerificationExpires: { $lt: new Date() } }
      ]
    });
    
    console.log(`\n📊 Found ${unverifiedUsers.length} unverified users without valid codes:`);
    
    if (unverifiedUsers.length === 0) {
      console.log('🎉 All unverified users have valid verification codes!');
      return;
    }

    // Generate new verification codes for each user
    for (const user of unverifiedUsers) {
      console.log(`\n🔄 Processing: ${user.firstName} ${user.lastName} (${user.email})`);
      
      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Update user with new code
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = expiresAt;
      await user.save();
      
      console.log(`   ✅ Generated new verification code: ${verificationCode}`);
      console.log(`   ⏰ Expires at: ${expiresAt.toLocaleString()}`);
      
      // Send verification email
      try {
        await emailService.sendVerificationCode(user.email, verificationCode, user.firstName);
        console.log(`   📧 Verification email sent successfully`);
      } catch (emailError) {
        console.log(`   ⚠️  Email sending failed (check console for code)`);
      }
    }

    console.log(`\n🎉 Successfully generated verification codes for ${unverifiedUsers.length} users!`);
    console.log(`\n📋 Next steps for users:`);
    console.log(`1. Check their email for the verification code`);
    console.log(`2. Log in to the app`);
    console.log(`3. Enter the verification code when prompted`);
    console.log(`4. Enjoy full access to LoopFund!`);

  } catch (error) {
    console.error('❌ Error generating verification codes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
generateVerificationCodesForUnverifiedUsers();
