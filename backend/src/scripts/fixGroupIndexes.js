const mongoose = require('mongoose');
require('dotenv').config();

async function fixGroupIndexes() {
  try {
    console.log('🔧 Starting database index fix...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loopfund');
    console.log('✅ Connected to MongoDB');
    
    // Get the database instance
    const db = mongoose.connection.db;
    
    // Check existing indexes on groups collection
    const indexes = await db.collection('groups').indexes();
    console.log('📊 Current indexes:', indexes.map(idx => idx.name));
    
    // Find the problematic inviteLink index
    const inviteLinkIndex = indexes.find(idx => 
      idx.key && idx.key.inviteLink && idx.unique === true
    );
    
    if (inviteLinkIndex) {
      console.log('❌ Found problematic inviteLink unique index:', inviteLinkIndex.name);
      
      // Drop the problematic index
      await db.collection('groups').dropIndex(inviteLinkIndex.name);
      console.log('✅ Dropped problematic inviteLink unique index');
    } else {
      console.log('✅ No problematic inviteLink unique index found');
    }
    
    // Check if there are any groups with null inviteLink values
    const groupsWithNullInviteLink = await db.collection('groups').find({ inviteLink: null }).count();
    console.log(`📊 Groups with null inviteLink: ${groupsWithNullInviteLink}`);
    
    if (groupsWithNullInviteLink > 0) {
      console.log('🔄 Updating groups with null inviteLink...');
      
      // Update all groups with null inviteLink to have a proper value
      const result = await db.collection('groups').updateMany(
        { inviteLink: null },
        { 
          $set: { 
            inviteLink: { $concat: ['INV_', { $toString: { $toLong: '$$NOW' } }, '_', { $substr: [{ $toString: { $rand: {} } }, 2, 8] }] }
          } 
        }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} groups`);
    }
    
    // Create the new sparse index for inviteLink (non-unique)
    await db.collection('groups').createIndex({ inviteLink: 1 }, { sparse: true });
    console.log('✅ Created new sparse inviteLink index');
    
    // Verify the new index structure
    const newIndexes = await db.collection('groups').indexes();
    console.log('📊 New index structure:', newIndexes.map(idx => ({
      name: idx.name,
      key: idx.key,
      unique: idx.unique,
      sparse: idx.sparse
    })));
    
    console.log('🎉 Database index fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixGroupIndexes();
}

module.exports = fixGroupIndexes; 