const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const achievementsService = require('../services/achievements.service');
const { env } = require('../config/env');

async function createAchievementsForCurrentUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the most recent user (likely the current user in frontend)
    const users = await User.find().sort({ createdAt: -1 });
    console.log(`\n👥 Found ${users.length} users (sorted by creation date):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user._id}) - Created: ${user.createdAt}`);
    });

    // Use the most recent user (likely the current frontend user)
    const currentUser = users[0];
    console.log(`\n🎯 Creating achievements for current user: ${currentUser.firstName} ${currentUser.lastName} (${currentUser._id})`);

    // Clear existing achievements for this user
    await Achievement.deleteMany({ user: currentUser._id });
    console.log('Cleared existing achievements for current user');

    // Create sample achievements for the current user
    const sampleAchievements = [
      {
        user: currentUser._id,
        type: 'first_goal',
        title: 'First Steps',
        description: 'You set your first savings goal!',
        data: { category: 'beginner', icon: '🎯', color: '#3B82F6', points: 10, rarity: 'common' }
      },
      {
        user: currentUser._id,
        type: 'first_contribution',
        title: 'First Contribution',
        description: 'You made your first contribution!',
        data: { category: 'beginner', icon: '💰', color: '#3B82F6', points: 15, rarity: 'common' }
      },
      {
        user: currentUser._id,
        type: 'savings_milestone',
        title: 'Savings Champion',
        description: 'You reached a significant savings milestone!',
        data: { category: 'intermediate', icon: '🏆', color: '#3B82F6', points: 50, rarity: 'uncommon', amount: 1000 }
      },
      {
        user: currentUser._id,
        type: 'weekly_saver',
        title: 'Weekly Warrior',
        description: 'You saved consistently for a week!',
        data: { category: 'beginner', icon: '📅', color: '#3B82F6', points: 20, rarity: 'common', days: 7 }
      }
    ];

    // Insert sample achievements
    const achievements = await Achievement.insertMany(sampleAchievements);
    console.log(`\n✅ Created ${achievements.length} achievements for current user:`);
    achievements.forEach(achievement => {
      console.log(`- ${achievement.title} (${achievement.type})`);
    });

    // Generate a new JWT token for this user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: currentUser._id,
        email: currentUser.email 
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('\n🔑 New JWT Token for current user:');
    console.log(token);
    
    console.log('\n📋 To test this token in the browser:');
    console.log('1. Open browser console');
    console.log('2. Run: localStorage.setItem("token", "' + token + '")');
    console.log('3. Refresh the achievements page');

    process.exit(0);
  } catch (error) {
    console.error('Error creating achievements for current user:', error);
    process.exit(1);
  }
}

// Run the function
createAchievementsForCurrentUser();
