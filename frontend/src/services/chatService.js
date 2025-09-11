import api from './api';

const chatService = {
  // Send message to group
  async sendMessage(groupId, message, type = 'text', metadata = {}) {
    try {
      const response = await api.post(`/chat/groups/${groupId}/messages`, {
        message,
        type,
        metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get group messages
  async getGroupMessages(groupId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/chat/groups/${groupId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting group messages:', error);
      throw error;
    }
  },

  // Edit message
  async editMessage(messageId, message) {
    try {
      const response = await api.put(`/chat/messages/${messageId}`, {
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/chat/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};

export default chatService;
