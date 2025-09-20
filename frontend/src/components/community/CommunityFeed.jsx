import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Send, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Tag,
  Smile,
  AlertCircle,
  CheckCircle,
  Star,
  Plus,
  Edit,
  Trash2,
  Flag,
  Bookmark,
  User,
  Shield,
  Globe,
  Lock,
  Unlock,
  Sparkles,
  Target,
  Lightbulb,
  Zap,
  Calendar,
  BarChart3,
  Award,
  Trophy,
  Gift,
  X,
  Crown,
} from 'lucide-react';
import { FaFire } from 'react-icons/fa';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';

const CommunityFeed = ({ autoShowCreatePost = false }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'success_story',
    mood: 'excited',
    isAnonymous: false,
    tags: [],
    financialMetrics: {}
  });
  const [showComments, setShowComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const categories = [
    { id: 'all', name: 'All Posts', icon: Globe, color: 'neutral', gradient: 'from-loopfund-neutral-500 to-loopfund-neutral-600' },
    { id: 'success_story', name: 'Success Stories', icon: Trophy, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { id: 'struggle_share', name: 'Struggles', icon: AlertCircle, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'tips_advice', name: 'Tips & Advice', icon: Lightbulb, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { id: 'goal_update', name: 'Goal Updates', icon: Target, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' },
    { id: 'emotional_support', name: 'Support', icon: Heart, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'financial_education', name: 'Education', icon: Bookmark, color: 'electric', gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500' },
    { id: 'celebration', name: 'Celebrations', icon: Gift, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { id: 'question', name: 'Questions', icon: MessageCircle, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { id: 'motivation', name: 'Motivation', icon: Zap, color: 'electric', gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500' }
  ];

  const moods = [
    { id: 'excited', name: 'Excited', emoji: '😃', color: 'text-loopfund-emerald-600' },
    { id: 'hopeful', name: 'Hopeful', emoji: '🤗', color: 'text-loopfund-electric-600' },
    { id: 'stressed', name: 'Stressed', emoji: '😰', color: 'text-loopfund-coral-600' },
    { id: 'frustrated', name: 'Frustrated', emoji: '😤', color: 'text-loopfund-orange-600' },
    { id: 'proud', name: 'Proud', emoji: '😌', color: 'text-loopfund-lavender-600' },
    { id: 'anxious', name: 'Anxious', emoji: '😟', color: 'text-loopfund-gold-600' },
    { id: 'grateful', name: 'Grateful', emoji: '🙏', color: 'text-loopfund-mint-600' },
    { id: 'determined', name: 'Determined', emoji: '💪', color: 'text-loopfund-electric-600' }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (autoShowCreatePost) {
      setShowCreatePost(true);
    }
  }, [autoShowCreatePost]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await communityService.getPosts(1, 20, filters);
      
      if (response.success) {
        setPosts(response.data.posts || []);
      } else {
        toast.error('Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await communityService.createPost(newPost);
      
      if (response.success) {
        toast.success('Post created successfully!');
        setShowCreatePost(false);
        setNewPost({
          title: '',
          content: '',
          category: 'success_story',
          mood: 'excited',
          isAnonymous: false,
          tags: [],
          financialMetrics: {}
        });
        loadPosts(); // Reload posts
      } else {
        toast.error(response.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await communityService.likePost(postId);
      if (response.success) {
        loadPosts(); // Reload to get updated like count
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const response = await communityService.addComment(postId, { content: comment });
      if (response.success) {
        loadPosts(); // Reload to get updated comments
        setNewComments({ ...newComments, [postId]: '' }); // Clear comment input
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Globe;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? `bg-loopfund-${cat.color}-100 dark:bg-loopfund-${cat.color}-900/20 text-loopfund-${cat.color}-800 dark:text-loopfund-${cat.color}-200` : 'bg-loopfund-neutral-100 dark:bg-loopfund-neutral-900/20 text-loopfund-neutral-800 dark:text-loopfund-neutral-200';
  };

  const getMoodEmoji = (mood) => {
    const moodObj = moods.find(m => m.id === mood);
    return moodObj ? moodObj.emoji : '😊';
  };

  const formatDate = (date) => {
    return communityService.formatPostDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            {/* Floating background elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500/20 to-loopfund-mint-500/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-loopfund-coral-500/20 to-loopfund-orange-500/20 rounded-full animate-float-delayed"></div>
            
            <h1 className="text-3xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 relative z-10">
              Community Feed
            </h1>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 relative z-10">
              Share your journey, get support, and learn from others
            </p>
          </div>
          <LoopFundButton
            onClick={() => setShowCreatePost(true)}
            variant="primary"
            size="lg"
            icon={<Plus size={20} />}
          >
            Create Post
          </LoopFundButton>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <LoopFundInput
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? `bg-loopfund-${category.color}-100 dark:bg-loopfund-${category.color}-900/20 text-loopfund-${category.color}-600 dark:text-loopfund-${category.color}-400 border-2 border-loopfund-${category.color}-200 dark:border-loopfund-${category.color}-800 shadow-loopfund`
                  : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface border-2 border-transparent hover:border-loopfund-neutral-300 dark:hover:border-loopfund-neutral-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`p-1 rounded-lg ${
                  selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.gradient}` 
                    : 'bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700'
                }`}
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <category.icon size={16} className={selectedCategory === category.id ? 'text-white' : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'} />
              </motion.div>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <LoopFundCard variant="elevated" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="p-2 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl shadow-loopfund"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Crown className="w-6 h-6 text-white" />
                    </motion.div>
                    <h2 className="text-xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Create New Post</h2>
                  </div>
                  <motion.button
                    onClick={() => setShowCreatePost(false)}
                    className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} className="text-loopfund-neutral-500" />
                  </motion.button>
                </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Title *
                  </label>
                  <LoopFundInput
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your post about?"
                    maxLength={200}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your story, ask for advice, or provide tips..."
                    rows={6}
                    className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body"
                    maxLength={2000}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Mood
                    </label>
                    <select
                      value={newPost.mood}
                      onChange={(e) => setNewPost({ ...newPost, mood: e.target.value })}
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body"
                    >
                      {moods.map((mood) => (
                        <option key={mood.id} value={mood.id}>
                          {mood.emoji} {mood.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                      className="rounded border-loopfund-neutral-300 text-loopfund-emerald-600 focus:ring-loopfund-emerald-500"
                    />
                    <span className="text-sm font-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Post anonymously</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <LoopFundButton
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    variant="secondary"
                    size="lg"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Create Post
                  </LoopFundButton>
                </div>
              </form>
              </LoopFundCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <motion.div 
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="animate-spin rounded-full h-12 w-12 border-4 border-loopfund-emerald-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle size={48} className="mx-auto text-loopfund-neutral-400 mb-4" />
            </motion.div>
            <h3 className="text-lg font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">No posts yet</h3>
            <p className="font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Be the first to share your financial wellness journey!</p>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <LoopFundCard variant="elevated" className="p-6 hover:shadow-loopfund-lg transition-all duration-300">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center shadow-loopfund"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {post.isAnonymous ? (post.displayName || 'Anonymous') : (post.author?.name || 'User')}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm font-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <span>•</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-3xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getMoodEmoji(post.mood)}
                    </motion.span>
                    <motion.button 
                      className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal size={16} className="text-loopfund-neutral-500" />
                    </motion.button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-6">
                  <h2 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                    {post.title}
                  </h2>
                  <p className="font-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-800 dark:text-loopfund-emerald-200 text-sm rounded-full font-body"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                  <div className="flex items-center space-x-8">
                    <motion.button
                      onClick={() => handleLikePost(post._id)}
                      className="flex items-center space-x-2 text-loopfund-neutral-500 hover:text-loopfund-coral-500 transition-colors group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Heart size={18} className="group-hover:fill-current" />
                      </motion.div>
                      <span className="font-body text-sm">{post.engagement?.likes?.length || 0}</span>
                    </motion.button>
                    <motion.button 
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center space-x-2 text-loopfund-neutral-500 hover:text-loopfund-emerald-500 transition-colors group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <MessageCircle size={18} />
                      </motion.div>
                      <span className="font-body text-sm">{post.engagement?.comments?.length || 0}</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 text-loopfund-neutral-500 hover:text-loopfund-gold-500 transition-colors group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Share2 size={18} />
                      </motion.div>
                      <span className="font-body text-sm">{post.engagement?.shares?.length || 0}</span>
                    </motion.button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm font-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    <Eye size={16} />
                    <span>{post.engagement?.views || 0} views</span>
                  </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments[post._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                    >
                      {/* Existing Comments */}
                      {post.engagement?.comments && post.engagement.comments.length > 0 && (
                        <div className="space-y-4 mb-6">
                          {post.engagement.comments.map((comment, index) => (
                            <motion.div 
                              key={index} 
                              className="flex space-x-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <motion.div 
                                className="w-10 h-10 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-loopfund"
                                whileHover={{ scale: 1.1 }}
                              >
                                <User size={18} className="text-white" />
                              </motion.div>
                              <div className="flex-1">
                                <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-4 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                                  <p className="font-body text-body text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                                    {comment.content}
                                  </p>
                                  <p className="font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                                    {comment.isAnonymous ? (comment.displayName || 'Anonymous') : 'User'} • {formatDate(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Form */}
                      <div className="flex space-x-4">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-loopfund"
                          whileHover={{ scale: 1.1 }}
                        >
                          <User size={18} className="text-white" />
                        </motion.div>
                        <div className="flex-1 flex space-x-3">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComments[post._id] || ''}
                            onChange={(e) => setNewComments({ ...newComments, [post._id]: e.target.value })}
                            className="flex-1 px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-2xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text placeholder-loopfund-neutral-500 dark:placeholder-loopfund-neutral-400 focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newComments[post._id]?.trim()) {
                                handleAddComment(post._id, newComments[post._id]);
                              }
                            }}
                          />
                          <LoopFundButton
                            onClick={() => {
                              if (newComments[post._id]?.trim()) {
                                handleAddComment(post._id, newComments[post._id]);
                              }
                            }}
                            disabled={!newComments[post._id]?.trim()}
                            variant="primary"
                            size="sm"
                            icon={<Send size={16} />}
                          >
                            Post
                          </LoopFundButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LoopFundCard>
            </motion.div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
