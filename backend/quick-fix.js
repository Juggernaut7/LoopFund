const mongoose = require('mongoose');
require('dotenv').config();

async function quickFix() {
  try {
    console.log('🚀 Quick fix for Group model inviteLink issue...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loopfund');
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Drop the problematic inviteLink unique index
    try {
      await db.collection('groups').dropIndex('inviteLink_1');
      console.log('✅ Dropped problematic inviteLink_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  inviteLink_1 index not found (already removed)');
      } else {
        console.log('⚠️  Could not drop inviteLink_1 index:', err.message);
      }
    }
    
    // Update any groups with null inviteLink
    const result = await db.collection('groups').updateMany(
      { inviteLink: null },
      { 
        $set: { 
          inviteLink: { $concat: ['INV_', { $toString: { $toLong: '$$NOW' } }, '_', { $substr: [{ $toString: { $rand: {} } }, 2, 8] }] }
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${result.modifiedCount} groups with null inviteLink`);
    } else {
      console.log('ℹ️  No groups with null inviteLink found');
    }
    
    console.log('🎉 Quick fix completed! You can now create groups.');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

quickFix(); 