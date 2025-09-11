const Chat = require('../models/Chat');
const Group = require('../models/Group');
const User = require('../models/User');

class ChatService {
  // Send a message to a group
  async sendMessage(groupId, userId, message, type = 'text', metadata = {}) {
    try {
      // Verify user is a member of the group
      const group = await Group.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = group.members.some(member => 
        member.user && member.user.toString() === userId
      );
      
      if (!isMember) {
        throw new Error('You are not a member of this group');
      }

      // Create chat message
      const chatMessage = new Chat({
        group: groupId,
        user: userId,
        message,
        type,
        metadata
      });

      await chatMessage.save();

      // Populate user details
      await chatMessage.populate('user', 'firstName lastName email');

      return chatMessage;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Get chat messages for a group
  async getGroupMessages(groupId, userId, page = 1, limit = 50) {
    try {
      // Verify user is a member of the group
      const group = await Group.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = group.members.some(member => 
        member.user && member.user.toString() === userId
      );
      
      if (!isMember) {
        throw new Error('You are not a member of this group');
      }

      // Get messages with pagination
      const skip = (page - 1) * limit;
      const messages = await Chat.find({
        group: groupId,
        isDeleted: false
      })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting group messages:', error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(messageId, userId, newMessage) {
    try {
      const chatMessage = await Chat.findById(messageId);
      if (!chatMessage) {
        throw new Error('Message not found');
      }

      // Check if user owns the message
      if (chatMessage.user.toString() !== userId) {
        throw new Error('You can only edit your own messages');
      }

      // Check if message is not too old (e.g., 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (chatMessage.createdAt < fiveMinutesAgo) {
        throw new Error('Message is too old to edit');
      }

      chatMessage.message = newMessage;
      chatMessage.isEdited = true;
      chatMessage.editedAt = new Date();

      await chatMessage.save();
      await chatMessage.populate('user', 'firstName lastName email');

      return chatMessage;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId, userId) {
    try {
      const chatMessage = await Chat.findById(messageId);
      if (!chatMessage) {
        throw new Error('Message not found');
      }

      // Check if user owns the message
      if (chatMessage.user.toString() !== userId) {
        throw new Error('You can only delete your own messages');
      }

      chatMessage.isDeleted = true;
      chatMessage.deletedAt = new Date();
      chatMessage.message = 'This message was deleted';

      await chatMessage.save();

      return chatMessage;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Send system message (e.g., when someone joins/leaves)
  async sendSystemMessage(groupId, message, systemAction) {
    try {
      const systemMessage = new Chat({
        group: groupId,
        user: null, // System message
        message,
        type: 'system',
        metadata: {
          systemAction
        }
      });

      await systemMessage.save();
      return systemMessage;
    } catch (error) {
      console.error('Error sending system message:', error);
      throw error;
    }
  }

  // Send contribution notification message
  async sendContributionMessage(groupId, userId, amount, method) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const message = `${user.firstName} contributed $${amount} via ${method}`;
      
      const contributionMessage = new Chat({
        group: groupId,
        user: userId,
        message,
        type: 'contribution',
        metadata: {
          contributionAmount: amount,
          contributionMethod: method
        }
      });

      await contributionMessage.save();
      await contributionMessage.populate('user', 'firstName lastName email');

      return contributionMessage;
    } catch (error) {
      console.error('Error sending contribution message:', error);
      throw error;
    }
  }

  // Get online members count for a group
  async getOnlineMembersCount(groupId) {
    try {
      // This would integrate with the WebSocket service
      // For now, return a placeholder
      return 0;
    } catch (error) {
      console.error('Error getting online members count:', error);
      return 0;
    }
  }
}

module.exports = new ChatService();
