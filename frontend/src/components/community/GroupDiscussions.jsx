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
  ChevronUp,
  Sparkles,
  Zap,
  Crown,
  Loader2
} from 'lucide-react';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

const GroupDiscussions = ({ groupId, groupName }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

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
      setIsCreating(true);
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
    } finally {
      setIsCreating(false);
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setIsReplying(true);
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
    } finally {
      setIsReplying(false);
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
              Loading discussions...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Group Discussions
          </h2>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Share ideas and get support from {groupName} members
          </p>
        </div>
        <LoopFundButton
          onClick={() => setShowCreateDiscussion(true)}
          variant="primary"
          size="lg"
          icon={<Plus className="w-5 h-5" />}
        >
          Start Discussion
        </LoopFundButton>
      </motion.div>

      {/* Create Discussion Modal */}
      <AnimatePresence>
        {showCreateDiscussion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
                </div>

                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Start New Discussion
                        </h3>
                        <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Share your thoughts with the group
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowCreateDiscussion(false)}
                      className="p-3 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface rounded-xl transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleCreateDiscussion} className="space-y-6">
                    <div>
                      <LoopFundInput
                        type="text"
                        label="Discussion Title"
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                        placeholder="What's your discussion about?"
                        maxLength={100}
                        icon={<MessageCircle className="w-5 h-5" />}
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Content
                      </label>
                      <textarea
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                        placeholder="Share your thoughts, ask questions, or provide support..."
                        rows={6}
                        className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body text-body"
                        maxLength={1000}
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <LoopFundButton
                        type="button"
                        onClick={() => setShowCreateDiscussion(false)}
                        variant="secondary"
                        size="md"
                      >
                        Cancel
                      </LoopFundButton>
                      <LoopFundButton
                        type="submit"
                        disabled={isCreating}
                        variant="primary"
                        size="md"
                        icon={isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                      >
                        {isCreating ? 'Creating...' : 'Create Discussion'}
                      </LoopFundButton>
                    </div>
                  </form>
                </div>
              </LoopFundCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
              No discussions yet
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Be the first to start a discussion in this group!
            </p>
            <LoopFundButton
              onClick={() => setShowCreateDiscussion(true)}
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
            >
              Start Discussion
            </LoopFundButton>
          </motion.div>
        ) : (
          discussions.map((discussion, index) => (
            <motion.div
              key={discussion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LoopFundCard variant="elevated" hover className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float" />
                </div>

                <div className="relative p-8">
                  {/* Discussion Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund flex-shrink-0"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {discussion.author?.avatar ? (
                          <img
                            src={discussion.author.avatar}
                            alt={discussion.author.name}
                            className="w-12 h-12 rounded-2xl object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          <span className="font-body text-body-sm">by {discussion.author?.name || 'Unknown'}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-body text-body-sm">{formatDate(discussion.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setExpandedDiscussion(
                        expandedDiscussion === discussion._id ? null : discussion._id
                      )}
                      className="p-3 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {expandedDiscussion === discussion._id ? (
                        <ChevronUp className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                      )}
                    </motion.button>
                  </div>

                  {/* Discussion Content */}
                  <div className="mb-6">
                    <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 whitespace-pre-wrap leading-relaxed">
                      {discussion.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {discussion.tags && discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {discussion.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-700 dark:text-loopfund-emerald-300 font-body font-medium"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: tagIndex * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Discussion Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                    <div className="flex items-center space-x-6">
                      <motion.button 
                        className="flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="w-5 h-5" />
                        <span className="font-body text-body-sm font-medium">{discussion.likes?.length || 0}</span>
                      </motion.button>
                      <motion.button
                        onClick={() => setReplyingTo(replyingTo === discussion._id ? null : discussion._id)}
                        className="flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Reply className="w-5 h-5" />
                        <span className="font-body text-body-sm font-medium">{discussion.replies?.length || 0}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <AnimatePresence>
                    {replyingTo === discussion._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                      >
                        <div className="flex space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-loopfund">
                            {user?.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write a reply..."
                              rows={3}
                              className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body text-body"
                            />
                            <div className="flex justify-end mt-3 space-x-3">
                              <LoopFundButton
                                onClick={() => setReplyingTo(null)}
                                variant="secondary"
                                size="sm"
                              >
                                Cancel
                              </LoopFundButton>
                              <LoopFundButton
                                onClick={() => handleReply(discussion._id)}
                                disabled={isReplying}
                                variant="primary"
                                size="sm"
                                icon={isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              >
                                {isReplying ? 'Replying...' : 'Reply'}
                              </LoopFundButton>
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
                        className="mt-6 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                      >
                        <h4 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                          Replies ({discussion.replies.length})
                        </h4>
                        <div className="space-y-4">
                          {discussion.replies.map((reply, replyIndex) => (
                            <motion.div 
                              key={replyIndex} 
                              className="flex space-x-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: replyIndex * 0.1 }}
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-loopfund-gold-500 to-loopfund-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-loopfund">
                                {reply.author?.avatar ? (
                                  <img
                                    src={reply.author.avatar}
                                    alt={reply.author.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                                    {reply.author?.name || 'Unknown'}
                                  </span>
                                  <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                                  {reply.content}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </LoopFundCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupDiscussions;