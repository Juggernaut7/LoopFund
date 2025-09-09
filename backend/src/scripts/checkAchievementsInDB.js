const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { env } = require('../config/env');

async function checkAchievementsInDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find();
    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user._id})`);
    });

    // Find all achievements
    const allAchievements = await Achievement.find();
    console.log(`\n🏆 Found ${allAchievements.length} total achievements:`);
    allAchievements.forEach(achievement => {
      console.log(`- ${achievement.title} (User: ${achievement.user}, Type: ${achievement.type})`);
    });

    // Check achievements for each user
    for (const user of users) {
      console.log(`\n🔍 Checking achievements for user: ${user.firstName} ${user.lastName} (${user._id})`);
      
      const userAchievements = await Achievement.find({ user: user._id });
      console.log(`   Found ${userAchievements.length} achievements:`);
      
      userAchievements.forEach(achievement => {
        console.log(`   - ${achievement.title} (${achievement.type})`);
      });
    }

    // Test the specific user ID from our token
    const testUserId = '6899d6abd6966a79a11d35b2';
    console.log(`\n🎯 Testing specific user ID: ${testUserId}`);
    
    const testUser = await User.findById(testUserId);
    if (testUser) {
      console.log(`   User found: ${testUser.firstName} ${testUser.lastName}`);
      
      const testAchievements = await Achievement.find({ user: testUserId });
      console.log(`   Achievements for this user: ${testAchievements.length}`);
      
      testAchievements.forEach(achievement => {
        console.log(`   - ${achievement.title} (${achievement.type})`);
      });
    } else {
      console.log(`   ❌ User not found with ID: ${testUserId}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking achievements in DB:', error);
    process.exit(1);
  }
}

// Run the function
checkAchievementsInDB();
