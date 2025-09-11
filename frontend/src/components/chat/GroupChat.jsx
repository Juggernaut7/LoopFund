import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  MessageCircle,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import chatService from '../../services/chatService';
import { useWebSocket } from '../../hooks/useWebSocket';

const GroupChat = ({ groupId, groupName }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // WebSocket connection for real-time messages
  const { socket, isConnected } = useWebSocket();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatService.getGroupMessages(groupId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const response = await chatService.sendMessage(groupId, newMessage.trim());
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Edit message
  const handleEditMessage = async () => {
    if (!editText.trim() || !editingMessage) return;

    try {
      const response = await chatService.editMessage(editingMessage._id, editText.trim());
      setMessages(prev => prev.map(msg => 
        msg._id === editingMessage._id ? response.data : msg
      ));
      setEditingMessage(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, isDeleted: true, message: 'This message was deleted' } : msg
      ));
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Handle WebSocket messages
  useEffect(() => {
    if (socket && isConnected) {
      const handleMessage = (data) => {
        if (data.type === 'group_message' && data.groupId === groupId) {
          setMessages(prev => [...prev, data.message]);
          scrollToBottom();
        }
      };

      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      return () => {
        socket.removeEventListener('message', handleMessage);
      };
    }
  }, [socket, isConnected, groupId]);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [groupId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format message time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get message type icon
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'contribution':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'system':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Get message type color
  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'contribution':
        return 'bg-green-50 dark:bg-green-900/20 border-l-green-500';
      case 'system':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500';
      default:
        return 'bg-white dark:bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {groupName} Chat
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4" />
            <span>Group</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-slate-400 mb-4" />
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No messages yet
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Start the conversation by sending a message!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.user?._id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.user?._id === user?.id ? 'order-2' : 'order-1'}`}>
                  {message.user && message.user._id !== user?.id && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {message.user.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {message.user.firstName} {message.user.lastName}
                      </span>
                    </div>
                  )}
                  
                  <div className={`relative group ${getMessageTypeColor(message.type)} border-l-4 rounded-lg p-3 shadow-sm`}>
                    {getMessageTypeIcon(message.type)}
                    
                    {editingMessage?._id === message._id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleEditMessage}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText('');
                            }}
                            className="px-3 py-1 bg-slate-500 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`text-sm ${message.isDeleted ? 'italic text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {message.message}
                        </p>
                        {message.isEdited && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            (edited)
                          </p>
                        )}
                        
                        {message.user?._id === user?.id && !message.isDeleted && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  setEditingMessage(message);
                                  setEditText(message.message);
                                }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                                title="Edit message"
                              >
                                <Edit3 className="w-3 h-3 text-slate-500" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="p-1 hover:bg-red-200 dark:hover:bg-red-600 rounded transition-colors"
                                title="Delete message"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${message.user?._id === user?.id ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isSending}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
