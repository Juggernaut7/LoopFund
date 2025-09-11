const chatService = require('../services/chat.service');

// Send message to group
async function sendMessage(req, res, next) {
  try {
    const { groupId } = req.params;
    const { message, type = 'text', metadata = {} } = req.body;
    const userId = req.user.userId;

    const chatMessage = await chatService.sendMessage(
      groupId,
      userId,
      message,
      type,
      metadata
    );

    // Emit to WebSocket clients in the group
    if (global.notificationSocket) {
      // Get group members
      const Group = require('../models/Group');
      const group = await Group.findById(groupId).populate('members.user', '_id');
      
      if (group) {
        const memberIds = group.members
          .filter(member => member.user && member.user._id.toString() !== userId)
          .map(member => member.user._id.toString());

        // Send to all group members except sender
        global.notificationSocket.sendNotificationToUsers(memberIds, {
          type: 'group_message',
          groupId,
          message: chatMessage,
          sender: {
            id: userId,
            name: `${chatMessage.user.firstName} ${chatMessage.user.lastName}`
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    next(error);
  }
}

// Get group messages
async function getGroupMessages(req, res, next) {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.userId;

    const messages = await chatService.getGroupMessages(
      groupId,
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    next(error);
  }
}

// Edit message
async function editMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    const updatedMessage = await chatService.editMessage(
      messageId,
      userId,
      message
    );

    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    console.error('Edit message error:', error);
    next(error);
  }
}

// Delete message
async function deleteMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const deletedMessage = await chatService.deleteMessage(
      messageId,
      userId
    );

    res.json({
      success: true,
      data: deletedMessage
    });
  } catch (error) {
    console.error('Delete message error:', error);
    next(error);
  }
}

module.exports = {
  sendMessage,
  getGroupMessages,
  editMessage,
  deleteMessage
};
