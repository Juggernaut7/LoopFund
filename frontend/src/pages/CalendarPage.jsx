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
  BarChart3
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
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

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

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
      case 'goal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'group': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'ai': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'therapy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'deadline': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-slate-500';
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

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Financial Calendar
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your financial milestones, goals, and important dates
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* View Toggle */}
              <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                {['month', 'week', 'day'].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      view === viewType
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
              
              {/* Add Event Button */}
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {formatDate(currentDate)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
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
                        <button
                          key={index}
                          onClick={() => day && setSelectedDate(day)}
                          className={`relative p-2 h-20 text-left transition-colors ${
                            !day
                              ? 'cursor-default'
                              : isSelected
                              ? 'bg-blue-600 text-white rounded-lg'
                              : isToday
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-lg'
                              : isCurrentMonth
                              ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
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
                                    <div
                                      key={event.id}
                                      className={`flex items-center space-x-1 text-xs px-1 py-0.5 rounded ${
                                        isSelected ? 'bg-white/20' : getEventTypeColor(event.type)
                                      }`}
                                    >
                                      <Icon className="w-3 h-3" />
                                      <span className="truncate">{event.title}</span>
                                    </div>
                                  );
                                })}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Selected Date Events */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => {
                      const Icon = getEventTypeIcon(event.type);
                      return (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg border-l-4 ${getPriorityColor(event.priority)} bg-slate-50 dark:bg-slate-700/50`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                                {event.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {event.time} • {event.description}
                              </p>
                              {event.amount && (
                                <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                                  ${event.amount.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No events scheduled for this date
                  </p>
                )}
              </div>

              {/* Upcoming Events */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Upcoming Events
                </h3>
                
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const Icon = getEventTypeIcon(event.type);
                    const eventDate = new Date(event.date);
                    const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div
                        key={event.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {eventDate.toLocaleDateString()} • {event.time}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  This Month
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Events</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {events.filter(e => new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Goal Deadlines</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {events.filter(e => e.type === 'deadline' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Group Meetings</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {events.filter(e => e.type === 'group' && new Date(e.date).getMonth() === currentDate.getMonth()).length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
