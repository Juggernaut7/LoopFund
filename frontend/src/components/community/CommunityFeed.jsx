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
} from 'lucide-react';
import { FaFire } from 'react-icons/fa';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

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
    { id: 'all', name: 'All Posts', icon: Globe, color: 'bg-gray-100 text-gray-800' },
    { id: 'success_story', name: 'Success Stories', icon: Trophy, color: 'bg-green-100 text-green-800' },
    { id: 'struggle_share', name: 'Struggles', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { id: 'tips_advice', name: 'Tips & Advice', icon: Lightbulb, color: 'bg-blue-100 text-blue-800' },
    { id: 'goal_update', name: 'Goal Updates', icon: Target, color: 'bg-purple-100 text-purple-800' },
    { id: 'emotional_support', name: 'Support', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'financial_education', name: 'Education', icon: Bookmark, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'celebration', name: 'Celebrations', icon: Gift, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'question', name: 'Questions', icon: MessageCircle, color: 'bg-gray-100 text-gray-800' },
    { id: 'motivation', name: 'Motivation', icon: Zap, color: 'bg-orange-100 text-orange-800' }
  ];

  const moods = [
    { id: 'excited', name: 'Excited', emoji: '😃', color: 'text-green-600' },
    { id: 'hopeful', name: 'Hopeful', emoji: '🤗', color: 'text-blue-600' },
    { id: 'stressed', name: 'Stressed', emoji: '😰', color: 'text-red-600' },
    { id: 'frustrated', name: 'Frustrated', emoji: '😤', color: 'text-orange-600' },
    { id: 'proud', name: 'Proud', emoji: '😌', color: 'text-purple-600' },
    { id: 'anxious', name: 'Anxious', emoji: '😟', color: 'text-yellow-600' },
    { id: 'grateful', name: 'Grateful', emoji: '🙏', color: 'text-teal-600' },
    { id: 'determined', name: 'Determined', emoji: '💪', color: 'text-indigo-600' }
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
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getMoodEmoji = (mood) => {
    const moodObj = moods.find(m => m.id === mood);
    return moodObj ? moodObj.emoji : '😊';
  };

  const formatDate = (date) => {
    return communityService.formatPostDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Financial Wellness Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your journey, get support, and learn from others
            </p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Create Post</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <category.icon size={16} />
              <span>{category.name}</span>
            </button>
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
              className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your post about?"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your story, ask for advice, or provide tips..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={2000}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mood
                    </label>
                    <select
                      value={newPost.mood}
                      onChange={(e) => setNewPost({ ...newPost, mood: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Post anonymously</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to share your financial wellness journey!</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {post.isAnonymous ? (post.displayName || 'Anonymous') : (post.author?.name || 'User')}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} />
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(post.category)}`}>
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMoodEmoji(post.mood)}</span>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Heart size={18} />
                    <span>{post.engagement?.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle size={18} />
                    <span>{post.engagement?.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Share2 size={18} />
                    <span>{post.engagement?.shares?.length || 0}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    {/* Existing Comments */}
                    {post.engagement?.comments && post.engagement.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.engagement.comments.map((comment, index) => (
                          <div key={index} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {comment.content}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {comment.isAnonymous ? (comment.displayName || 'Anonymous') : 'User'} • {formatDate(comment.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-white" />
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComments[post._id] || ''}
                          onChange={(e) => setNewComments({ ...newComments, [post._id]: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newComments[post._id]?.trim()) {
                              handleAddComment(post._id, newComments[post._id]);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newComments[post._id]?.trim()) {
                              handleAddComment(post._id, newComments[post._id]);
                            }
                          }}
                          disabled={!newComments[post._id]?.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
