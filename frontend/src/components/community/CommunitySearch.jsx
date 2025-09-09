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
  Shield
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';

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
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'challenge':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'group':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'resource':
        return <BookOpen className="w-5 h-5 text-orange-600" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getResultColor = (result) => {
    switch (result.type) {
      case 'post':
        return 'border-blue-200 bg-blue-50';
      case 'challenge':
        return 'border-green-200 bg-green-50';
      case 'group':
        return 'border-purple-200 bg-purple-50';
      case 'resource':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
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
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Search
            </h1>
            <p className="text-gray-600">
              Find posts, challenges, groups, and resources in the community
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for posts, challenges, groups, or resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Type */}
            <div className="flex items-center space-x-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {searchTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mood Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood
                    </label>
                    <select
                      value={filters.mood}
                      onChange={(e) => handleFilterChange('mood', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {dateRanges.map((range) => (
                        <option key={range.id} value={range.id}>{range.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Engagement Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Engagement
                    </label>
                    <select
                      value={filters.engagement}
                      onChange={(e) => handleFilterChange('engagement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {engagementLevels.map((level) => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search Results */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {!loading && searchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({searchResults.length})
                </h2>
                <p className="text-sm text-gray-600">
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
                    className={`bg-white rounded-xl p-6 shadow-sm border ${getResultColor(result)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Result Icon */}
                      <div className="flex-shrink-0">
                        {getResultIcon(result)}
                      </div>

                      {/* Result Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(result.title) }} />
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                                <span className="capitalize bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  {result.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Result Description */}
                        {result.description && (
                          <p className="text-gray-700 mb-3 line-clamp-2">
                            <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(result.description) }} />
                          </p>
                        )}

                        {/* Result Tags */}
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.slice(0, 5).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                            {result.tags.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{result.tags.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Result Stats */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          {result.engagement && (
                            <>
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{result.engagement.likes || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{result.engagement.comments || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Share2 className="w-3 h-3" />
                                <span>{result.engagement.shares || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{result.engagement.views || 0}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 font-medium">
                          <span>View</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load More Results
                  </button>
                </div>
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySearch; 
