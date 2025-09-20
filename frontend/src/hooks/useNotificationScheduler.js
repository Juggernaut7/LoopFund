import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import goalNotificationService from '../services/goalNotificationService';

export const useNotificationScheduler = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    reminderFrequency: 'daily',
    reminderTime: '09:00', // Default 9 AM
    advanceReminder: 1 // 1 day advance
  });
  
  const { toast } = useToast();
  const intervalRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // Check for due payments every minute
  useEffect(() => {
    const checkForDuePayments = async () => {
      try {
        const response = await goalNotificationService.getUpcomingReminders();
        
        // Handle different response formats
        const reminders = response?.data || response || [];
        
        // Ensure reminders is an array
        if (!Array.isArray(reminders)) {
          console.log('Reminders response is not an array:', reminders);
          return;
        }
        
        // Check if any reminders are due now
        const now = new Date();
        const dueReminders = reminders.filter(reminder => {
          const reminderTime = new Date(reminder.scheduledTime);
          const timeDiff = now - reminderTime;
          return timeDiff >= 0 && timeDiff < 60000; // Within 1 minute
        });

        // Send notifications for due reminders
        for (const reminder of dueReminders) {
          await handleDuePayment(reminder);
        }
      } catch (error) {
        console.error('Error checking for due payments:', error);
      }
    };

    // Check every minute
    checkIntervalRef.current = setInterval(checkForDuePayments, 60000);
    
    // Initial check
    checkForDuePayments();

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Handle due payment notification
  const handleDuePayment = useCallback(async (reminder) => {
    try {
      // Show in-app notification
      if (notificationPreferences.push) {
        toast.info(
          'Payment Due! 💰',
          `Time to contribute ₦${reminder.amount.toLocaleString()} to "${reminder.goalName}"`
        );
      }

      // Send email reminder if enabled
      if (notificationPreferences.email) {
        await goalNotificationService.sendEmailReminder(reminder.goalId, 'payment_due');
      }

      // Mark reminder as sent
      await goalNotificationService.markReminderCompleted(reminder._id);
      
      // Update local state
      setScheduledNotifications(prev => 
        prev.filter(notif => notif._id !== reminder._id)
      );

    } catch (error) {
      console.error('Error handling due payment:', error);
    }
  }, [notificationPreferences, toast]);

  // Schedule payment reminders for a goal
  const schedulePaymentReminders = useCallback(async (goalId, goalData) => {
    setIsScheduling(true);
    try {
      const { frequency, amount, endDate } = goalData;
      const startDate = new Date();
      
      // Calculate reminder schedule based on frequency
      const reminders = calculateReminderSchedule(startDate, endDate, frequency, amount);
      
      // Schedule each reminder
      for (const reminder of reminders) {
        await goalNotificationService.schedulePaymentReminder(goalId, {
          ...reminder,
          goalName: goalData.name,
          goalId
        });
      }

      // Also schedule recurring notifications
      await goalNotificationService.scheduleRecurringNotifications(goalId, goalData);
      
      toast.success('Payment Reminders Scheduled', 'You\'ll be notified when payments are due!');
      
    } catch (error) {
      console.error('Error scheduling payment reminders:', error);
      toast.error('Scheduling Failed', 'Failed to schedule payment reminders');
    } finally {
      setIsScheduling(false);
    }
  }, [toast]);

  // Calculate reminder schedule based on frequency
  const calculateReminderSchedule = (startDate, endDate, frequency, amount) => {
    const reminders = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current < end) {
      // Add reminder based on frequency
      let nextReminder = new Date(current);
      
      switch (frequency) {
        case 'daily':
          nextReminder.setDate(current.getDate() + 1);
          break;
        case 'weekly':
          nextReminder.setDate(current.getDate() + 7);
          break;
        case 'monthly':
          nextReminder.setMonth(current.getMonth() + 1);
          break;
        case 'yearly':
          nextReminder.setFullYear(current.getFullYear() + 1);
          break;
        default:
          nextReminder.setDate(current.getDate() + 1);
      }
      
      // Set reminder time (default 9 AM)
      const [hours, minutes] = notificationPreferences.reminderTime.split(':');
      nextReminder.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (nextReminder <= end) {
        reminders.push({
          scheduledTime: nextReminder.toISOString(),
          amount,
          frequency,
          type: 'payment_due'
        });
      }
      
      current.setTime(nextReminder.getTime());
    }
    
    return reminders;
  };

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      await goalNotificationService.updateNotificationPreferences(newPreferences);
      setNotificationPreferences(newPreferences);
      toast.success('Preferences Updated', 'Notification preferences saved successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Update Failed', 'Failed to update notification preferences');
    }
  }, [toast]);

  // Load notification preferences
  const loadPreferences = useCallback(async () => {
    try {
      const preferences = await goalNotificationService.getNotificationPreferences();
      setNotificationPreferences(preferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);

  // Cancel scheduled notifications for a goal
  const cancelScheduledNotifications = useCallback(async (goalId) => {
    try {
      await goalNotificationService.cancelScheduledNotifications(goalId);
      setScheduledNotifications(prev => 
        prev.filter(notif => notif.goalId !== goalId)
      );
      toast.success('Notifications Cancelled', 'Scheduled notifications cancelled for this goal');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      toast.error('Cancellation Failed', 'Failed to cancel scheduled notifications');
    }
  }, [toast]);

  // Get upcoming reminders
  const getUpcomingReminders = useCallback(async () => {
    try {
      const response = await goalNotificationService.getUpcomingReminders();
      const reminders = response?.data || response || [];
      
      // Ensure reminders is an array
      if (!Array.isArray(reminders)) {
        console.log('Reminders response is not an array:', reminders);
        setScheduledNotifications([]);
        return [];
      }
      
      setScheduledNotifications(reminders);
      return reminders;
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      setScheduledNotifications([]);
      return [];
    }
  }, []);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    scheduledNotifications,
    isScheduling,
    notificationPreferences,
    schedulePaymentReminders,
    updatePreferences,
    cancelScheduledNotifications,
    getUpcomingReminders,
    handleDuePayment
  };
};
