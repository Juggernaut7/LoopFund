import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  Bell,
  Star,
  Award,
  Zap,
  Heart,
  Brain,
  Gamepad2,
  Shield,
  BarChart3,
  Sparkles,
  Crown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundInput from '../components/ui/LoopFundInput';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Mock events data - replace with real API calls
  const mockEvents = [
    {
      id: 1,
      title: 'Goal Contribution Due',
      type: 'goal',
      date: new Date(2024, 0, 15),
      time: '09:00',
      amount: 500,
      goalName: 'Emergency Fund',
      status: 'pending',
      priority: 'high',
      description: 'Monthly contribution to emergency fund goal'
    },
    {
      id: 2,
      title: 'Group Savings Meeting',
      type: 'group',
      date: new Date(2024, 0, 20),
      time: '14:00',
      groupName: 'Vacation Fund',
      status: 'confirmed',
      priority: 'medium',
      description: 'Monthly group contribution and planning session'
    },
    {
      id: 3,
      title: 'AI Financial Review',
      type: 'ai',
      date: new Date(2024, 0, 25),
      time: '10:00',
      status: 'scheduled',
      priority: 'low',
      description: 'Monthly AI-powered financial health review'
    },
    {
      id: 4,
      title: 'Therapy Game Session',
      type: 'therapy',
      date: new Date(2024, 0, 28),
      time: '16:00',
      status: 'scheduled',
      priority: 'low',
      description: 'Financial wellness game session'
    },
    {
      id: 5,
      title: 'Goal Deadline',
      type: 'deadline',
      date: new Date(2024, 1, 1),
      time: '23:59',
      goalName: 'New Car Fund',
      amount: 15000,
      status: 'urgent',
      priority: 'high',
      description: 'Final deadline for new car savings goal'
    }
  ];

  // Simulate loading with timeout
  useEffect(() => {
    const loadCalendarData = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 2000));
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error loading calendar data:', error);
        toast.error('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [toast]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'goal': return Target;
      case 'group': return Users;
      case 'ai': return Brain;
      case 'therapy': return Gamepad2;
      case 'deadline': return AlertCircle;
      default: return CalendarIcon;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'goal': return 'bg-loopfund-emerald-100 text-loopfund-emerald-800 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300';
      case 'group': return 'bg-loopfund-coral-100 text-loopfund-coral-800 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300';
      case 'ai': return 'bg-loopfund-lavender-100 text-loopfund-lavender-800 dark:bg-loopfund-lavender-900/30 dark:text-loopfund-lavender-300';
      case 'therapy': return 'bg-loopfund-gold-100 text-loopfund-gold-800 dark:bg-loopfund-gold-900/30 dark:text-loopfund-gold-300';
      case 'deadline': return 'bg-loopfund-electric-100 text-loopfund-electric-800 dark:bg-loopfund-electric-900/30 dark:text-loopfund-electric-300';
      default: return 'bg-loopfund-neutral-100 text-loopfund-neutral-800 dark:bg-loopfund-neutral-900/30 dark:text-loopfund-neutral-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-loopfund-electric-500';
      case 'medium': return 'border-l-loopfund-gold-500';
      case 'low': return 'border-l-loopfund-emerald-500';
      default: return 'border-l-loopfund-neutral-500';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mb-6"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CalendarIcon className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading Your Calendar
              </motion.h2>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 text-center">
                Preparing your financial milestones and events...
              </p>
            </motion.div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <motion.div
                className="flex items-center space-x-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CalendarIcon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Financial Calendar
                  </h1>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Track your financial milestones, goals, and important dates
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4 mt-4 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* View Toggle */}
              <div className="flex bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl border border-loopfund-neutral-200 dark:border-loopfund-dark-border p-1">
                {['month', 'week', 'day'].map((viewType) => (
                  <motion.button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-300 rounded-lg ${
                      view === viewType
                        ? 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white shadow-loopfund'
                        : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-dark-text hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {viewType}
                  </motion.button>
                ))}
              </div>
              
              {/* Add Event Button */}
              <LoopFundButton
                onClick={() => setShowEventModal(true)}
                variant="primary"
                size="md"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </LoopFundButton>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <LoopFundCard variant="elevated" className="overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-dark-border">
                  <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {formatDate(currentDate)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-dark-text transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Today
                    </motion.button>
                    <motion.button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      const dayEvents = getEventsForDate(day);
                      const isToday = day && day.toDateString() === new Date().toDateString();
                      const isSelected = day && day.toDateString() === selectedDate.toDateString();
                      const isCurrentMonth = day && day.getMonth() === currentDate.getMonth();

                      return (
                        <motion.button
                          key={index}
                          onClick={() => day && setSelectedDate(day)}
                          className={`relative p-2 h-20 text-left transition-all duration-300 ${
                            !day
                              ? 'cursor-default'
                              : isSelected
                              ? 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white rounded-xl shadow-loopfund'
                              : isToday
                              ? 'bg-gradient-to-r from-loopfund-coral-100 to-loopfund-gold-100 dark:from-loopfund-coral-900/30 dark:to-loopfund-gold-900/30 text-loopfund-coral-900 dark:text-loopfund-coral-100 rounded-xl'
                              : isCurrentMonth
                              ? 'hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text rounded-lg'
                              : 'text-loopfund-neutral-400 dark:text-loopfund-neutral-600'
                          }`}
                          whileHover={day ? { scale: 1.05 } : {}}
                          whileTap={day ? { scale: 0.95 } : {}}
                        >
                          {day && (
                            <>
                              <div className="text-sm font-medium mb-1">
                                {day.getDate()}
                              </div>
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event) => {
                                  const Icon = getEventTypeIcon(event.type);
                                  return (
                                    <motion.div
                                      key={event.id}
                                      className={`flex items-center space-x-1 text-xs px-1 py-0.5 rounded ${
                                        isSelected ? 'bg-white/20' : getEventTypeColor(event.type)
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <Icon className="w-3 h-3" />
                                      <span className="truncate">{event.title}</span>
                                    </motion.div>
                                  );
                                })}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Selected Date Events */}
              <LoopFundCard variant="elevated" className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => {
                      const Icon = getEventTypeIcon(event.type);
                      return (
                        <motion.div
                          key={event.id}
                          className={`p-4 rounded-xl border-l-4 ${getPriorityColor(event.priority)} bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated hover:shadow-loopfund transition-all duration-300`}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex items-start space-x-3">
                            <motion.div 
                              className="p-2 bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface rounded-lg"
                              whileHover={{ rotate: 5 }}
                            >
                              <Icon className="w-4 h-4 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text text-body-sm">
                                {event.title}
                              </h4>
                              <p className="font-body text-body-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
                                {event.time} • {event.description}
                              </p>
                              {event.amount && (
                                <p className="font-body text-body-xs font-medium text-loopfund-emerald-600 dark:text-loopfund-emerald-400 mt-1">
                                  ${event.amount.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-loopfund-neutral-400 to-loopfund-neutral-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CalendarIcon className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="font-body text-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      No events scheduled for this date
                    </p>
                  </div>
                )}
              </LoopFundCard>

              {/* Upcoming Events */}
              <LoopFundCard variant="elevated" className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-coral-500 rounded-xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Upcoming Events
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const Icon = getEventTypeIcon(event.type);
                    const eventDate = new Date(event.date);
                    const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <motion.div
                        key={event.id}
                        className="flex items-center space-x-3 p-4 rounded-xl hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-all duration-300 hover:shadow-loopfund"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-loopfund ${getEventTypeColor(event.type)}`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text text-body-sm truncate">
                            {event.title}
                          </h4>
                          <p className="font-body text-body-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                            {eventDate.toLocaleDateString()} • {event.time}
                          </p>
                          <p className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </LoopFundCard>

              {/* Quick Stats */}
              <LoopFundCard variant="elevated" className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    This Month
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Events</span>
                    <span className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {events.filter(e => new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Goal Deadlines</span>
                    <span className="font-display font-semibold text-loopfund-coral-600 dark:text-loopfund-coral-400">
                      {events.filter(e => e.type === 'deadline' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Group Meetings</span>
                    <span className="font-display font-semibold text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                      {events.filter(e => e.type === 'group' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </motion.div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

export default CalendarPage;