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
  DollarSign,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';
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
        return <DollarSign className="w-4 h-4 text-loopfund-emerald-500" />;
      case 'system':
        return <MessageCircle className="w-4 h-4 text-loopfund-electric-500" />;
      default:
        return null;
    }
  };

  // Get message type color
  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'contribution':
        return 'bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border-l-loopfund-emerald-500';
      case 'system':
        return 'bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 border-l-loopfund-electric-500';
      default:
        return 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated';
    }
  };

  return (
    <div className="flex flex-col h-full bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-2xl border border-loopfund-neutral-300 dark:border-loopfund-neutral-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-300 dark:border-loopfund-neutral-700">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {groupName} Chat
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-loopfund-emerald-500' : 'bg-loopfund-coral-500'}`} />
              <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            <Users className="w-5 h-5" />
            <span className="font-body text-body-sm font-medium">Group</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Sparkles className="w-5 h-5 text-loopfund-gold-500" />
          </motion.div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Loading messages...
              </p>
            </motion.div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
              No messages yet
            </h4>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Start the conversation by sending a message!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.user?._id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.user?._id === user?.id ? 'order-2' : 'order-1'}`}>
                  {message.user && message.user._id !== user?.id && (
                    <motion.div 
                      className="flex items-center space-x-3 mb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center shadow-loopfund">
                        <span className="text-white text-sm font-medium">
                          {message.user.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        {message.user.firstName} {message.user.lastName}
                      </span>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className={`relative group ${getMessageTypeColor(message.type)} border-l-4 rounded-2xl p-4 shadow-loopfund`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {getMessageTypeIcon(message.type)}
                    
                    {editingMessage?._id === message._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text resize-none font-body text-body focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <LoopFundButton
                            onClick={handleEditMessage}
                            variant="primary"
                            size="sm"
                            icon={<Check className="w-4 h-4" />}
                          >
                            Save
                          </LoopFundButton>
                          <LoopFundButton
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText('');
                            }}
                            variant="secondary"
                            size="sm"
                            icon={<X className="w-4 h-4" />}
                          >
                            Cancel
                          </LoopFundButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`font-body text-body ${message.isDeleted ? 'italic text-loopfund-neutral-500' : 'text-loopfund-neutral-900 dark:text-loopfund-dark-text'}`}>
                          {message.message}
                        </p>
                        {message.isEdited && (
                          <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
                            (edited)
                          </p>
                        )}
                        
                        {message.user?._id === user?.id && !message.isDeleted && (
                          <motion.div 
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="flex space-x-1">
                              <motion.button
                                onClick={() => {
                                  setEditingMessage(message);
                                  setEditText(message.message);
                                }}
                                className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-lg transition-colors"
                                title="Edit message"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit3 className="w-4 h-4 text-loopfund-neutral-500" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="p-2 hover:bg-loopfund-coral-100 dark:hover:bg-loopfund-coral-900/20 rounded-lg transition-colors"
                                title="Delete message"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4 text-loopfund-coral-500" />
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                  
                  <p className={`font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2 ${message.user?._id === user?.id ? 'text-right' : 'text-left'}`}>
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
      <div className="p-6 border-t border-loopfund-neutral-300 dark:border-loopfund-neutral-700">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <LoopFundInput
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              rightIcon={<Smile className="w-5 h-5" />}
              className="w-full"
            />
          </div>
          <LoopFundButton
            type="submit"
            disabled={!newMessage.trim() || isSending}
            variant="primary"
            size="lg"
            icon={isSending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          >
            {isSending ? 'Sending...' : 'Send'}
          </LoopFundButton>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;