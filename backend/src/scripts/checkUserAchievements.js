const mongoose = require('mongoose');
const achievementsService = require('../services/achievements.service');
const User = require('../models/User');
const { env } = require('../config/env');

async function checkUserAchievements() {
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

    console.log(`Checking achievements for user: ${user.firstName} ${user.lastName} (${user._id})`);

    // Check and unlock achievements
    const result = await achievementsService.checkAndUnlockAchievements(user._id);
    
    console.log(`\n🎉 Achievement check completed!`);
    console.log(`- Newly unlocked: ${result.newlyUnlocked}`);
    console.log(`- Total achievements: ${result.totalAchievements}`);
    
    if (result.newlyUnlocked > 0) {
      console.log('\nNew achievements unlocked:');
      result.unlockedAchievements.forEach(achievement => {
        console.log(`✅ ${achievement.title} - ${achievement.description}`);
      });
    }

    // Get current achievements
    const progressData = await achievementsService.getAchievementProgress(user._id);
    console.log('\n📊 Current Achievement Stats:');
    console.log(`- Total Achievements: ${progressData.stats.totalAchievements}`);
    console.log(`- Unlocked: ${progressData.stats.unlockedAchievements}`);
    console.log(`- Completion Rate: ${progressData.stats.completionRate}%`);
    console.log(`- Total Goals: ${progressData.stats.totalGoals}`);
    console.log(`- Completed Goals: ${progressData.stats.completedGoals}`);
    console.log(`- Total Contributed: $${progressData.stats.totalContributed}`);
    console.log(`- Days Since Joining: ${progressData.stats.daysSinceJoining}`);

    console.log('\n🏆 Current Achievements:');
    progressData.achievements.forEach(achievement => {
      console.log(`✅ ${achievement.achievement.name} - ${achievement.achievement.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking user achievements:', error);
    process.exit(1);
  }
}

// Run the function
checkUserAchievements();
