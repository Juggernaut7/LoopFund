import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Settings, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';
import { useNotificationScheduler } from '../../hooks/useNotificationScheduler';

const NotificationPreferences = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    reminderFrequency: 'daily',
    reminderTime: '09:00',
    advanceReminder: 1,
    paymentReminders: true,
    goalUpdates: true,
    achievementAlerts: true,
    weeklyReports: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updatePreferences, notificationPreferences } = useNotificationScheduler();

  useEffect(() => {
    if (notificationPreferences) {
      setPreferences(notificationPreferences);
    }
  }, [notificationPreferences]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updatePreferences(preferences);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <LoopFundCard variant="elevated" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Notification Preferences
                  </h2>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Customize how and when you receive notifications
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center transition-colors duration-200"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
              </motion.button>
            </div>

            <div className="p-6 space-y-8">
              {/* Notification Channels */}
              <div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                  Notification Channels
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Push Notifications
                        </h4>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          In-app notifications and browser alerts
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.push}
                        onChange={(e) => handlePreferenceChange('push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-loopfund-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-loopfund-emerald-300 dark:peer-focus:ring-loopfund-emerald-800 rounded-full peer dark:bg-loopfund-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-loopfund-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-loopfund-neutral-600 peer-checked:bg-loopfund-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Email Reminders
                        </h4>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Email notifications for important updates
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.email}
                        onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-loopfund-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-loopfund-emerald-300 dark:peer-focus:ring-loopfund-emerald-800 rounded-full peer dark:bg-loopfund-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-loopfund-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-loopfund-neutral-600 peer-checked:bg-loopfund-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          SMS Notifications
                        </h4>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Text message reminders (premium feature)
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.sms}
                        onChange={(e) => handlePreferenceChange('sms', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-loopfund-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-loopfund-emerald-300 dark:peer-focus:ring-loopfund-emerald-800 rounded-full peer dark:bg-loopfund-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-loopfund-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-loopfund-neutral-600 peer-checked:bg-loopfund-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reminder Settings */}
              <div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                  Reminder Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Reminder Time
                      </label>
                      <LoopFundInput
                        type="time"
                        value={preferences.reminderTime}
                        onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                        icon={<Clock className="w-5 h-5" />}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Advance Reminder (days)
                      </label>
                      <LoopFundInput
                        type="number"
                        value={preferences.advanceReminder}
                        onChange={(e) => handlePreferenceChange('advanceReminder', parseInt(e.target.value))}
                        min="0"
                        max="7"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                  Notification Types
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'paymentReminders', label: 'Payment Due Reminders', description: 'Get notified when payments are due' },
                    { key: 'goalUpdates', label: 'Goal Progress Updates', description: 'Updates on your goal progress' },
                    { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Celebrate your milestones' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly summary of your progress' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                      <div>
                        <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {label}
                        </h4>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[key]}
                          onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-loopfund-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-loopfund-emerald-300 dark:peer-focus:ring-loopfund-emerald-800 rounded-full peer dark:bg-loopfund-neutral-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-loopfund-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-loopfund-neutral-600 peer-checked:bg-loopfund-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                <LoopFundButton
                  onClick={onClose}
                  variant="secondary"
                  size="lg"
                >
                  Cancel
                </LoopFundButton>
                <LoopFundButton
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                  icon={isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </LoopFundButton>
              </div>
            </div>
          </LoopFundCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPreferences;
