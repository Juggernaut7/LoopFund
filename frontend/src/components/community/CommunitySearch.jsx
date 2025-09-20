import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  MessageCircle, 
  Target, 
  Calendar,
  TrendingUp,
  Heart,
  Share2,
  Eye,
  Clock,
  Tag,
  Star,
  Zap,
  Lightbulb,
  Flame,
  Trophy,
  Gift,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Video,
  Link,
  Download,
  Award,
  Activity,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Shield,
  Sparkles,
  Crown,
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';

const CommunitySearch = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [filters, setFilters] = useState({
    category: 'all',
    mood: 'all',
    dateRange: 'all',
    engagement: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeoutRef = useRef(null);

  const searchTypes = [
    { id: 'all', name: 'All Content', icon: Globe },
    { id: 'posts', name: 'Posts', icon: MessageCircle },
    { id: 'challenges', name: 'Challenges', icon: Target },
    { id: 'groups', name: 'Groups', icon: Users },
    { id: 'resources', name: 'Resources', icon: BookOpen }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'success_story', name: 'Success Stories' },
    { id: 'struggle_share', name: 'Struggles' },
    { id: 'tips_advice', name: 'Tips & Advice' },
    { id: 'goal_update', name: 'Goal Updates' },
    { id: 'emotional_support', name: 'Emotional Support' },
    { id: 'financial_education', name: 'Education' },
    { id: 'habit_tracking', name: 'Habit Tracking' },
    { id: 'celebration', name: 'Celebrations' },
    { id: 'question', name: 'Questions' },
    { id: 'motivation', name: 'Motivation' }
  ];

  const moods = [
    { id: 'all', name: 'All Moods', icon: '😊' },
    { id: 'excited', name: 'Excited', icon: '😃' },
    { id: 'hopeful', name: 'Hopeful', icon: '🤗' },
    { id: 'stressed', name: 'Stressed', icon: '😰' },
    { id: 'frustrated', name: 'Frustrated', icon: '😤' },
    { id: 'proud', name: 'Proud', icon: '😌' },
    { id: 'anxious', name: 'Anxious', icon: '😟' },
    { id: 'grateful', name: 'Grateful', icon: '🙏' },
    { id: 'determined', name: 'Determined', icon: '💪' }
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' }
  ];

  const engagementLevels = [
    { id: 'all', name: 'All Engagement' },
    { id: 'high', name: 'High Engagement' },
    { id: 'medium', name: 'Medium Engagement' },
    { id: 'low', name: 'Low Engagement' }
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      // Debounce search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 500);
    } else {
      setSearchResults([]);
      setHasMore(true);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, searchType, filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);
      
      const searchParams = {
        q: searchTerm,
        type: searchType,
        filters: filters,
        page: 1,
        limit: 10
      };
      
      const response = await communityService.advancedSearch(searchParams);
      if (response.success && response.data) {
        setSearchResults(response.data.results || []);
        setHasMore(response.data.pagination?.hasNext || false);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const searchParams = {
        q: searchTerm,
        type: searchType,
        filters: filters,
        page: currentPage + 1,
        limit: 10
      };
      
      const response = await communityService.advancedSearch(searchParams);
      if (response.success && response.data) {
        setSearchResults(prev => [...(prev || []), ...(response.data.results || [])]);
        setHasMore(response.data.pagination?.hasNext || false);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more results:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      mood: 'all',
      dateRange: 'all',
      engagement: 'all'
    });
  };

  const getResultIcon = (result) => {
    switch (result.type) {
      case 'post':
        return <MessageCircle className="w-5 h-5 text-loopfund-emerald-600" />;
      case 'challenge':
        return <Target className="w-5 h-5 text-loopfund-coral-600" />;
      case 'group':
        return <Users className="w-5 h-5 text-loopfund-lavender-600" />;
      case 'resource':
        return <BookOpen className="w-5 h-5 text-loopfund-gold-600" />;
      default:
        return <MessageCircle className="w-5 h-5 text-loopfund-neutral-600" />;
    }
  };

  const getResultColor = (result) => {
    switch (result.type) {
      case 'post':
        return 'border-loopfund-emerald-200 bg-loopfund-emerald-50 dark:border-loopfund-emerald-800 dark:bg-loopfund-emerald-900/20';
      case 'challenge':
        return 'border-loopfund-coral-200 bg-loopfund-coral-50 dark:border-loopfund-coral-800 dark:bg-loopfund-coral-900/20';
      case 'group':
        return 'border-loopfund-lavender-200 bg-loopfund-lavender-50 dark:border-loopfund-lavender-800 dark:bg-loopfund-lavender-900/20';
      case 'resource':
        return 'border-loopfund-gold-200 bg-loopfund-gold-50 dark:border-loopfund-gold-800 dark:bg-loopfund-gold-900/20';
      default:
        return 'border-loopfund-neutral-200 bg-loopfund-neutral-50 dark:border-loopfund-neutral-700 dark:bg-loopfund-dark-elevated';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-loopfund-gold-200 dark:bg-loopfund-gold-900/30">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-loopfund-gold-500/10 to-loopfund-orange-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-loopfund-electric-500/10 to-loopfund-lavender-500/10 rounded-full animate-float-delayed"></div>
          
          <div>
            <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Community Search
            </h1>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Find posts, challenges, groups, and resources in the community
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <LoopFundCard variant="elevated" className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <LoopFundInput
                  type="text"
                  placeholder="Search for posts, challenges, groups, or resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={20} />}
                  rightIcon={searchTerm ? <X size={20} /> : null}
                  onRightIconClick={() => setSearchTerm('')}
                  className="w-full text-lg"
                />
              </div>

              {/* Search Type */}
              <div className="flex items-center space-x-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-3 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                >
                  {searchTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* Filters Toggle */}
              <LoopFundButton
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "primary" : "secondary"}
                size="lg"
                icon={<Filter size={16} />}
              >
                Filters
              </LoopFundButton>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mood Filter */}
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Mood
                      </label>
                      <select
                        value={filters.mood}
                        onChange={(e) => handleFilterChange('mood', e.target.value)}
                        className="w-full px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                      >
                        {moods.map((mood) => (
                          <option key={mood.id} value={mood.id}>
                            {mood.icon} {mood.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Date Range
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="w-full px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                      >
                        {dateRanges.map((range) => (
                          <option key={range.id} value={range.id}>{range.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Engagement Filter */}
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Engagement
                      </label>
                      <select
                        value={filters.engagement}
                        onChange={(e) => handleFilterChange('engagement', e.target.value)}
                        className="w-full px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                      >
                        {engagementLevels.map((level) => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <LoopFundButton
                      onClick={clearFilters}
                      variant="secondary"
                      size="sm"
                      icon={<X size={16} />}
                    >
                      Clear All Filters
                    </LoopFundButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LoopFundCard>
        </motion.div>

        {/* Search Results */}
        <div className="space-y-6">
          {loading && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-loopfund-emerald-200 border-t-loopfund-emerald-600 rounded-full mx-auto"
              ></motion.div>
              <p className="mt-4 font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Searching...</p>
            </motion.div>
          )}

          {!loading && searchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Search Results ({searchResults.length})
                </h2>
                <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Showing results for "{searchTerm}"
                </p>
              </div>

              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="cursor-pointer"
                  >
                    <LoopFundCard variant="elevated" className={`p-6 hover:shadow-loopfund-lg transition-all duration-300 ${getResultColor(result)}`}>
                      <div className="flex items-start space-x-4">
                        {/* Result Icon */}
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {getResultIcon(result)}
                        </motion.div>

                        {/* Result Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1">
                                <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(result.title) }} />
                              </h3>
                              <div className="flex items-center space-x-4 font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(result.createdAt)}</span>
                                </span>
                                {result.author && (
                                  <span className="flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>{result.author.name}</span>
                                  </span>
                                )}
                                {result.type && (
                                  <span className="capitalize bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 px-2 py-1 rounded-full text-xs font-body">
                                    {result.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Result Description */}
                          {result.description && (
                            <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3 line-clamp-2">
                              <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(result.description) }} />
                            </p>
                          )}

                          {/* Result Tags */}
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {result.tags.slice(0, 5).map((tag, tagIndex) => (
                                <motion.span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-700 dark:text-loopfund-emerald-300 text-xs rounded-full font-body"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  #{tag}
                                </motion.span>
                              ))}
                              {result.tags.length > 5 && (
                                <span className="px-2 py-1 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-600 dark:text-loopfund-neutral-400 text-xs rounded-full font-body">
                                  +{result.tags.length - 5} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Result Stats */}
                          <div className="flex items-center space-x-6 font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {result.engagement && (
                              <>
                                <motion.span 
                                  className="flex items-center space-x-1"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Heart className="w-3 h-3 text-loopfund-coral-500" />
                                  <span>{result.engagement.likes || 0}</span>
                                </motion.span>
                                <motion.span 
                                  className="flex items-center space-x-1"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <MessageCircle className="w-3 h-3 text-loopfund-emerald-500" />
                                  <span>{result.engagement.comments || 0}</span>
                                </motion.span>
                                <motion.span 
                                  className="flex items-center space-x-1"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Share2 className="w-3 h-3 text-loopfund-gold-500" />
                                  <span>{result.engagement.shares || 0}</span>
                                </motion.span>
                                <motion.span 
                                  className="flex items-center space-x-1"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Eye className="w-3 h-3 text-loopfund-electric-500" />
                                  <span>{result.engagement.views || 0}</span>
                                </motion.span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <LoopFundButton
                            variant="primary"
                            size="sm"
                            icon={<ChevronRight size={16} />}
                          >
                            View
                          </LoopFundButton>
                        </div>
                      </div>
                    </LoopFundCard>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <motion.div 
                  className="text-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <LoopFundButton
                    onClick={loadMore}
                    variant="secondary"
                    size="lg"
                    icon={<TrendingUp size={18} />}
                  >
                    Load More Results
                  </LoopFundButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {!loading && searchTerm && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Search className="w-8 h-8 text-loopfund-neutral-400" />
              </motion.div>
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">No results found</h3>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <LoopFundButton
                onClick={() => setSearchTerm('')}
                variant="primary"
                size="lg"
                icon={<X size={18} />}
              >
                Clear Search
              </LoopFundButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySearch; 
