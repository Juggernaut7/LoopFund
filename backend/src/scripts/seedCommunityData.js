const mongoose = require('mongoose');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

const samplePosts = [
  {
    title: "Paid off $15,000 in credit card debt! 🎉",
    content: "After 2 years of hard work and discipline, I finally paid off all my credit card debt. The key was creating a strict budget and cutting unnecessary expenses. I'm so proud of this achievement!",
    category: "success_story",
    mood: "proud",
    tags: ["debt-free", "budgeting", "discipline"],
    financialMetrics: {
      savingsAmount: 15000,
      debtReduction: 15000,
      goalProgress: 100
    }
  },
  {
    title: "Struggling with emotional spending",
    content: "I've been having a really tough time lately and I keep buying things I don't need. It's like I'm trying to fill a void with shopping. Has anyone else dealt with this?",
    category: "struggle_share",
    mood: "anxious",
    tags: ["emotional-spending", "support", "mental-health"],
    financialMetrics: {
      emotionalSpendingReduction: -500
    }
  },
  {
    title: "The 50/30/20 rule changed my life",
    content: "I started using the 50/30/20 budgeting rule 6 months ago and it's been a game changer. 50% for needs, 30% for wants, 20% for savings. My savings have grown by 300%!",
    category: "tips_advice",
    mood: "excited",
    tags: ["budgeting", "savings", "tips"],
    financialMetrics: {
      savingsAmount: 5000,
      goalProgress: 80
    }
  },
  {
    title: "Emergency fund milestone reached!",
    content: "Just hit my 6-month emergency fund goal! $12,000 saved up. It took 18 months but I feel so much more secure now. Next goal: house down payment!",
    category: "goal_update",
    mood: "grateful",
    tags: ["emergency-fund", "milestone", "security"],
    financialMetrics: {
      savingsAmount: 12000,
      goalProgress: 100
    }
  },
  {
    title: "Need advice on student loan repayment",
    content: "I have $45,000 in student loans and I'm not sure whether to pay them off aggressively or invest the money instead. What would you do?",
    category: "question",
    mood: "anxious",
    tags: ["student-loans", "advice", "investment"],
    financialMetrics: {
      debtReduction: 0
    }
  },
  {
    title: "Celebrating 1 year of no impulse purchases!",
    content: "I made a rule to wait 24 hours before buying anything over $50. It's been a year and I've saved over $3,000 that I would have spent on things I didn't really need!",
    category: "celebration",
    mood: "determined",
    tags: ["impulse-control", "savings", "habits"],
    financialMetrics: {
      savingsAmount: 3000,
      emotionalSpendingReduction: 3000
    }
  },
  {
    title: "Understanding compound interest",
    content: "Just learned about compound interest and I'm mind-blown! Starting to invest early really does make a huge difference. Wish I had known this in my 20s!",
    category: "financial_education",
    mood: "hopeful",
    tags: ["investing", "compound-interest", "education"],
    financialMetrics: {
      goalProgress: 25
    }
  },
  {
    title: "Weekly check-in: Staying on track",
    content: "Week 8 of my financial wellness journey. Still sticking to my budget, meal prepping to save money, and avoiding unnecessary purchases. Feeling motivated!",
    category: "habit_tracking",
    mood: "determined",
    tags: ["check-in", "budgeting", "habits"],
    financialMetrics: {
      goalProgress: 60
    }
  }
];

async function seedCommunityData() {
  try {
    console.log('🌱 Seeding community data...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loopfund');
    console.log('✅ Connected to MongoDB');

    // Find or create a test user
    let testUser = await User.findOne({ email: 'community@loopfund.com' });
    if (!testUser) {
      testUser = new User({
        firstName: 'Community',
        lastName: 'User',
        email: 'community@loopfund.com',
        passwordHash: 'hashedpassword',
        isVerified: true
      });
      await testUser.save();
      console.log('✅ Created test user');
    }

    // Clear existing community posts
    await CommunityPost.deleteMany({});
    console.log('✅ Cleared existing posts');

    // Create sample posts
    const posts = [];
    for (const postData of samplePosts) {
      const post = new CommunityPost({
        ...postData,
        author: testUser._id,
        displayName: 'Community User',
        isAnonymous: false
      });
      posts.push(post);
    }

    await CommunityPost.insertMany(posts);
    console.log(`✅ Created ${posts.length} sample posts`);

    // Add some likes and comments to make it more realistic
    const allPosts = await CommunityPost.find({});
    
    // Add random likes
    for (const post of allPosts) {
      const numLikes = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < numLikes; i++) {
        post.addLike(testUser._id);
      }
      await post.save();
    }

    // Add some comments
    const comments = [
      "Congratulations! That's amazing!",
      "I'm so proud of you!",
      "This is so inspiring!",
      "Thank you for sharing this!",
      "You've got this!",
      "I needed to hear this today!",
      "Great advice!",
      "Keep going!",
      "This is helpful!",
      "You're doing great!"
    ];

    for (const post of allPosts.slice(0, 5)) { // Add comments to first 5 posts
      const numComments = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numComments; i++) {
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        post.addComment(testUser._id, randomComment);
      }
      await post.save();
    }

    console.log('✅ Added likes and comments');

    console.log('\n🎉 Community data seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`- ${posts.length} posts`);
    console.log(`- Multiple likes and comments`);
    console.log(`- Various categories and moods`);

  } catch (error) {
    console.error('❌ Error seeding community data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedCommunityData();
}

module.exports = seedCommunityData;
