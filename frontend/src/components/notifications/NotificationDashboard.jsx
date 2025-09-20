import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Filter,
  Search,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';
import { useNotificationScheduler } from '../../hooks/useNotificationScheduler';
import PaymentReminderCard from './PaymentReminderCard';
import NotificationPreferences from './NotificationPreferences';

const NotificationDashboard = ({ isOpen, onClose }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, due, upcoming, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  
  const { toast } = useToast();
  const { getUpcomingReminders, cancelScheduledNotifications } = useNotificationScheduler();

  useEffect(() => {
    if (isOpen) {
      loadReminders();
    }
  }, [isOpen]);

  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const upcomingReminders = await getUpcomingReminders();
      // Ensure reminders is an array
      const remindersArray = Array.isArray(upcomingReminders) ? upcomingReminders : [];
      setReminders(remindersArray);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast.error('Error', 'Failed to load payment reminders');
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async (reminder) => {
    try {
      // Navigate to payment page or open payment modal
      toast.success('Payment Initiated', 'Redirecting to payment page...');
      // Here you would integrate with your payment system
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Payment Failed', 'Failed to initiate payment');
    }
  };

  const handleSnooze = async (reminderId) => {
    try {
      // Snooze the reminder for 1 hour
      toast.success('Reminder Snoozed', 'You\'ll be reminded again in 1 hour');
      await loadReminders(); // Refresh the list
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      toast.error('Snooze Failed', 'Failed to snooze reminder');
    }
  };

  const filteredReminders = Array.isArray(reminders) ? reminders.filter(reminder => {
    const matchesFilter = filter === 'all' || reminder.status === filter;
    const matchesSearch = reminder.goalName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) : [];

  const getReminderStats = () => {
    if (!Array.isArray(reminders)) {
      return { due: 0, upcoming: 0, completed: 0, total: 0 };
    }
    
    const due = reminders.filter(r => r.status === 'due').length;
    const upcoming = reminders.filter(r => r.status === 'upcoming').length;
    const completed = reminders.filter(r => r.status === 'completed').length;
    const total = reminders.length;
    
    return { due, upcoming, completed, total };
  };

  const stats = getReminderStats();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-loopfund-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <LoopFundCard variant="elevated" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Payment Reminders
                  </h2>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Manage your scheduled payments and reminders
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <LoopFundButton
                  onClick={() => setShowPreferences(true)}
                  variant="secondary"
                  size="md"
                  icon={<Settings className="w-4 h-4" />}
                >
                  Settings
                </LoopFundButton>
                <LoopFundButton
                  onClick={loadReminders}
                  variant="secondary"
                  size="md"
                  icon={<RefreshCw className="w-4 h-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </LoopFundButton>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center transition-colors duration-200"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 rounded-xl p-4 border border-loopfund-coral-200 dark:border-loopfund-coral-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-h4 text-loopfund-coral-600">
                        {stats.due}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-coral-600">
                        Due Now
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20 rounded-xl p-4 border border-loopfund-gold-200 dark:border-loopfund-gold-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-h4 text-loopfund-gold-600">
                        {stats.upcoming}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-gold-600">
                        Upcoming
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl p-4 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-h4 text-loopfund-emerald-600">
                        {stats.completed}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-emerald-600">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl p-4 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-loopfund-neutral-500 to-loopfund-neutral-600 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display text-h4 text-loopfund-neutral-600">
                        {stats.total}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-neutral-600">
                        Total
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <LoopFundInput
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                  />
                </div>
                <div className="flex space-x-2">
                  {['all', 'due', 'upcoming', 'completed'].map((filterType) => (
                    <LoopFundButton
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      variant={filter === filterType ? 'primary' : 'secondary'}
                      size="md"
                      className="capitalize"
                    >
                      {filterType}
                    </LoopFundButton>
                  ))}
                </div>
              </div>

              {/* Reminders List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-loopfund-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredReminders.length > 0 ? (
                <div className="space-y-4">
                  {filteredReminders.map((reminder) => (
                    <PaymentReminderCard
                      key={reminder._id}
                      reminder={reminder}
                      onPayNow={handlePayNow}
                      onSnooze={handleSnooze}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-loopfund-neutral-400" />
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    No Reminders Found
                  </h3>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {searchTerm || filter !== 'all' 
                      ? 'No reminders match your current filters'
                      : 'You don\'t have any payment reminders scheduled yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </LoopFundCard>
        </motion.div>
      </motion.div>

      {/* Notification Preferences Modal */}
      <NotificationPreferences
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </AnimatePresence>
  );
};

export default NotificationDashboard;
