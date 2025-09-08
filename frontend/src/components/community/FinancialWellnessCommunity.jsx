import React, { useState, useEffect, useRef } from 'react';
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
  X
} from 'lucide-react';
import { FaFire } from 'react-icons/fa';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';

const FinancialWellnessCommunity = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'success_story',
    mood: 'excited',
    isAnonymous: false,
    tags: [],
    financialMetrics: {}
  });

  const categories = [
    { id: 'all', name: 'All Posts', icon: Globe, color: 'bg-gray-100 text-gray-800' },
    { id: 'success_story', name: 'Success Stories', icon: Trophy, color: 'bg-green-100 text-green-800' },
    { id: 'struggle_share', name: 'Struggle Sharing', icon: AlertCircle, color: 'bg-orange-100 text-orange-800' },
    { id: 'tips_advice', name: 'Tips & Advice', icon: Lightbulb, color: 'bg-blue-100 text-blue-800' },
    { id: 'goal_update', name: 'Goal Updates', icon: Target, color: 'bg-purple-100 text-purple-800' },
    { id: 'emotional_support', name: 'Emotional Support', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'financial_education', name: 'Financial Education', icon: Bookmark, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'habit_tracking', name: 'Habit Tracking', icon: BarChart3, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'celebration', name: 'Celebrations', icon: Gift, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'question', name: 'Questions', icon: MessageCircle, color: 'bg-gray-100 text-gray-800' },
    { id: 'motivation', name: 'Motivation', icon: FaFire, color: 'bg-red-100 text-red-800' }
  ];

  const moods = [
    { id: 'excited', name: 'Excited', icon: '😃', color: 'text-green-600' },
    { id: 'hopeful', name: 'Hopeful', icon: '🤞', color: 'text-blue-600' },
    { id: 'stressed', name: 'Stressed', icon: '😰', color: 'text-red-600' },
    { id: 'frustrated', name: 'Frustrated', icon: '😤', color: 'text-orange-600' },
    { id: 'proud', name: 'Proud', icon: '😊', color: 'text-purple-600' },
    { id: 'anxious', name: 'Anxious', icon: '😟', color: 'text-yellow-600' },
    { id: 'grateful', name: 'Grateful', icon: '🙏', color: 'text-green-600' },
    { id: 'determined', name: 'Determined', icon: '💪', color: 'text-red-600' }
  ];

  // Sample posts for demo
  const samplePosts = [
    {
      id: '1',
      title: 'Finally hit my emergency fund goal! 🎉',
      content: 'After 8 months of consistent saving, I finally reached my $10,000 emergency fund goal! The journey wasn\'t easy - there were so many tempting purchases and moments of doubt. But the peace of mind I feel now is absolutely worth it. My AI therapist helped me identify my emotional spending triggers, and the community support kept me motivated during tough times.',
      category: 'success_story',
      mood: 'proud',
      author: { name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      isAnonymous: false,
      tags: ['emergency-fund', 'savings', 'goals'],
      financialMetrics: { savingsAmount: 10000, goalProgress: 100 },
      engagement: {
        likes: [{ user: 'user1' }, { user: 'user2' }, { user: 'user3' }],
        comments: [
          { user: { name: 'Mike R.' }, content: 'This is amazing! You\'re an inspiration!', timestamp: new Date(Date.now() - 3600000) },
          { user: { name: 'Lisa K.' }, content: 'How did you stay motivated? I\'m struggling with my savings goal.', timestamp: new Date(Date.now() - 7200000) }
        ],
        views: 45
      },
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      title: 'Struggling with impulse buying during stress 😰',
      content: 'I\'ve been under a lot of stress at work lately, and I\'ve noticed I\'m spending more on impulse purchases. Yesterday I bought a $200 gadget I don\'t really need just because I was feeling overwhelmed. I know this is my emotional spending trigger, but it\'s so hard to resist in the moment. Any advice on how to pause before buying?',
      category: 'struggle_share',
      mood: 'stressed',
      author: { name: 'Anonymous User', avatar: null },
      isAnonymous: true,
      tags: ['impulse-buying', 'stress', 'emotional-spending'],
      financialMetrics: { emotionalSpendingReduction: -200 },
      engagement: {
        likes: [{ user: 'user4' }, { user: 'user5' }],
        comments: [
          { user: { name: 'David L.' }, content: 'Try the 24-hour rule! Wait a day before any purchase over $50.', timestamp: new Date(Date.now() - 1800000) },
          { user: { name: 'Emma W.' }, content: 'I use the app\'s spending pause feature when I feel stressed. It really helps!', timestamp: new Date(Date.now() - 3600000) }
        ],
        views: 32
      },
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      title: 'Pro tip: Use habit stacking for savings 💡',
      content: 'I\'ve been using habit stacking to build my savings habit. Every time I make my morning coffee, I transfer $5 to my savings. Every time I check my email, I review my spending for the day. It\'s amazing how these small actions add up! I\'ve saved $300 this month without even thinking about it.',
      category: 'tips_advice',
      mood: 'excited',
      author: { name: 'Alex T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      isAnonymous: false,
      tags: ['habit-stacking', 'savings-tips', 'automation'],
      financialMetrics: { savingsAmount: 300 },
      engagement: {
        likes: [{ user: 'user6' }, { user: 'user7' }, { user: 'user8' }, { user: 'user9' }],
        comments: [
          { user: { name: 'Rachel B.' }, content: 'This is brilliant! I\'m going to try this with my daily routines.', timestamp: new Date(Date.now() - 900000) }
        ],
        views: 67
      },
      createdAt: new Date(Date.now() - 259200000)
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await communityService.getPosts(1, 10, selectedCategory !== 'all' ? { category: selectedCategory } : {});
        if (resp?.success) {
          const fetched = resp.data.posts?.map(p => ({ ...p, id: p._id || p.id })) || [];
          setPosts(fetched);
        } else if (Array.isArray(resp?.data)) {
          const fetched = resp.data.map(p => ({ ...p, id: p._id || p.id }));
          setPosts(fetched);
        }
      } catch (e) {
        console.error('Error fetching posts:', e);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Initialize socket connection
    if (user && user.token) {
      const socketInstance = communityService.initializeSocket(
        user.token,
        () => console.log('Connected to community'),
        () => console.log('Disconnected from community')
      );

      if (socketInstance) {
        setSocket(socketInstance);
        
        // Setup socket handlers
        communityService.setupSocketHandlers(socketInstance, {
          onNewPost: (post) => {
            setPosts(prev => [{ ...post, id: post._id || post.id }, ...prev]);
          },
          onPostLiked: (data) => {
            setPosts(prev => prev.map(post => 
              (post._id || post.id) === data.postId 
                ? { ...post, engagement: { ...post.engagement, likes: [...post.engagement.likes, { user: data.userId }] }}
                : post
            ));
          },
          onNewComment: (comment) => {
            setPosts(prev => prev.map(post => 
              (post._id || post.id) === comment.postId 
                ? { ...post, engagement: { ...post.engagement, comments: [...post.engagement.comments, comment] }}
                : post
            ));
          },
          onUserTyping: (data) => {
            setTypingUsers(prev => new Set([...prev, data.userName]));
          },
          onUserStoppedTyping: (data) => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.userName);
              return newSet;
            });
          },
          onError: (error) => {
            console.error('Socket error:', error);
          }
        });
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const handleCreatePost = async () => {
    try {
      const postData = {
        ...newPost,
        tags: newPost.tags.filter(tag => tag.trim() !== '')
      };

      // Emit via socket for real-time
      if (socket) {
        communityService.emitCreatePost(socket, postData);
      }
      // Persist via API (enhanced endpoint)
      const resp = await communityService.createPost(postData);
      if (resp?.success) {
        const created = resp.data || resp;
        setPosts(prev => [{ ...created, id: created._id || created.id }, ...prev]);
      }
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
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (socket) {
        communityService.emitToggleLike(socket, postId);
      }
      // Optimistic UI update
      setPosts(prev => prev.map(post => {
        const pid = post._id || post.id;
        if (pid === postId) {
          const isLiked = post.engagement.likes.some(like => like.user === user?.id);
          const newLikes = isLiked 
            ? post.engagement.likes.filter(like => like.user !== user?.id)
            : [...post.engagement.likes, { user: user?.id }];
          
          return {
            ...post,
            engagement: { ...post.engagement, likes: newLikes }
          };
        }
        return post;
      }));
      // Persist like via API
      try { await communityService.likePost(postId); } catch {}
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return (b.engagement.likes.length + b.engagement.comments.length) - 
               (a.engagement.likes.length + a.engagement.comments.length);
      case 'trending':
        return b.engagement.views - a.engagement.views;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Financial Wellness Community
              </h1>
              <p className="text-gray-600">
                Share your journey, support others, and grow together in financial wellness
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{onlineUsers} online</span>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Share Your Story</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts, tags, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          <AnimatePresence>
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {post.isAnonymous ? 'A' : post.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {post.isAnonymous ? 'Anonymous User' : post.author.name}
                        </span>
                        {post.isAnonymous && <Shield className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{communityService.formatPostDate(post.createdAt)}</span>
                        <span>•</span>
                        <span className={communityService.getCategoryColor(post.category)}>
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${communityService.getMoodColor(post.mood)}`}>
                      {communityService.getMoodIcon(post.mood)}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Financial Metrics */}
                {post.financialMetrics && Object.keys(post.financialMetrics).length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Financial Impact</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {post.financialMetrics.savingsAmount && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            ${post.financialMetrics.savingsAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Saved</div>
                        </div>
                      )}
                      {post.financialMetrics.debtReduction && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            ${post.financialMetrics.debtReduction.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Debt Reduced</div>
                        </div>
                      )}
                      {post.financialMetrics.goalProgress && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {post.financialMetrics.goalProgress}%
                          </div>
                          <div className="text-xs text-gray-600">Goal Progress</div>
                        </div>
                      )}
                      {post.financialMetrics.emotionalSpendingReduction && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            ${Math.abs(post.financialMetrics.emotionalSpendingReduction).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {post.financialMetrics.emotionalSpendingReduction > 0 ? 'Reduced' : 'Spent'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.engagement.likes.some(like => like.user === user?.id)
                          ? 'bg-red-50 text-red-600'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        post.engagement.likes.some(like => like.user === user?.id) ? 'fill-current' : ''
                      }`} />
                      <span>{post.engagement.likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.engagement.comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{post.engagement.views} views</span>
                  </div>
                </div>

                {/* Comments Preview */}
                {post.engagement.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      {post.engagement.comments.slice(0, 2).map((comment, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs">
                            {comment.user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 text-sm">
                                {comment.user.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {communityService.formatPostDate(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {post.engagement.comments.length > 2 && (
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          View all {post.engagement.comments.length} comments
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreatePost(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Share Your Story</h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What's your story about?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your financial wellness journey..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={2000}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How are you feeling?
                      </label>
                      <select
                        value={newPost.mood}
                        onChange={(e) => setNewPost(prev => ({ ...prev, mood: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {moods.map((mood) => (
                          <option key={mood.id} value={mood.id}>
                            {mood.icon} {mood.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Post anonymously
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.title || !newPost.content}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Share Story
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinancialWellnessCommunity; 