import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Plus, 
  Heart, 
  Reply, 
  MoreVertical, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  Tag,
  Send,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

const GroupDiscussions = ({ groupId, groupName }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (groupId) {
      loadDiscussions();
    }
  }, [groupId]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      console.log('Loading discussions for group:', groupId);
      const response = await communityService.getGroupDiscussions(groupId);
      
      console.log('Discussions response:', response);
      
      if (response.success) {
        setDiscussions(response.data.discussions || []);
      } else {
        console.error('Failed to load discussions:', response.error);
        toast.error('Failed to load discussions');
        setDiscussions([]);
      }
    } catch (error) {
      console.error('Error loading discussions:', error);
      toast.error('Failed to load discussions');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user || !user.id) {
      toast.error('You must be logged in to create discussions');
      return;
    }

    try {
      console.log('Creating discussion with data:', {
        groupId,
        discussionData: newDiscussion,
        userId: user.id
      });

      const response = await communityService.addGroupDiscussion(groupId, newDiscussion);
      
      console.log('Discussion creation response:', response);
      
      if (response.success) {
        toast.success('Discussion created successfully!');
        setShowCreateDiscussion(false);
        setNewDiscussion({ title: '', content: '', tags: [] });
        loadDiscussions();
      } else {
        console.error('Discussion creation failed:', response.error);
        toast.error(response.error || 'Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to create discussion');
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const response = await communityService.addDiscussionReply(groupId, discussionId, replyContent);
      
      if (response.success) {
        toast.success('Reply added successfully!');
        setReplyingTo(null);
        setReplyContent('');
        loadDiscussions();
      } else {
        toast.error(response.error || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading discussions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Group Discussions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share ideas and get support from {groupName} members
          </p>
        </div>
        <button
          onClick={() => setShowCreateDiscussion(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* Create Discussion Modal */}
      <AnimatePresence>
        {showCreateDiscussion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Start New Discussion
                </h3>
                <button
                  onClick={() => setShowCreateDiscussion(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    placeholder="What's your discussion about?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    placeholder="Share your thoughts, ask questions, or provide support..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength={1000}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateDiscussion(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Create Discussion
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No discussions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to start a discussion in this group!
            </p>
            <button
              onClick={() => setShowCreateDiscussion(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Start Discussion
            </button>
          </div>
        ) : (
          discussions.map((discussion) => (
            <motion.div
              key={discussion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Discussion Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    {discussion.author?.avatar ? (
                      <img
                        src={discussion.author.avatar}
                        alt={discussion.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>by {discussion.author?.name || 'Unknown'}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{formatDate(discussion.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedDiscussion(
                    expandedDiscussion === discussion._id ? null : discussion._id
                  )}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {expandedDiscussion === discussion._id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {/* Discussion Content */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {discussion.content}
                </p>
              </div>

              {/* Tags */}
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {discussion.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Discussion Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Heart size={16} />
                    <span>{discussion.likes?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === discussion._id ? null : discussion._id)}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Reply size={16} />
                    <span>{discussion.replies?.length || 0}</span>
                  </button>
                </div>
              </div>

              {/* Reply Section */}
              <AnimatePresence>
                {replyingTo === discussion._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(discussion._id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            <Send size={14} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Replies */}
              <AnimatePresence>
                {expandedDiscussion === discussion._id && discussion.replies && discussion.replies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Replies ({discussion.replies.length})
                    </h4>
                    <div className="space-y-3">
                      {discussion.replies.map((reply, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            {reply.author?.avatar ? (
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {reply.author?.name || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupDiscussions;
