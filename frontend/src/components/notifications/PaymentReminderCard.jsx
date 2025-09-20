import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Bell, 
  DollarSign, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LoopFundButton, LoopFundCard } from '../ui';
import { formatCurrencySimple } from '../../utils/currency';

const PaymentReminderCard = ({ reminder, onPayNow, onSnooze }) => {
  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'weekly':
        return <Calendar className="w-4 h-4" />;
      case 'monthly':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'Periodic';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'due':
        return 'text-loopfund-coral-600 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20';
      case 'upcoming':
        return 'text-loopfund-gold-600 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20';
      case 'completed':
        return 'text-loopfund-emerald-600 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20';
      default:
        return 'text-loopfund-neutral-600 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'due':
        return <AlertCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimeUntilDue = (scheduledTime) => {
    const now = new Date();
    const due = new Date(scheduledTime);
    const diffMs = due - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      return 'Overdue';
    } else if (diffHours < 1) {
      return 'Due now';
    } else if (diffHours < 24) {
      return `Due in ${diffHours}h`;
    } else {
      return `Due in ${diffDays}d`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoopFundCard variant="elevated" className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500/10 to-loopfund-mint-500/10 rounded-full animate-float" />
        </div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1">
                  {reminder.goalName}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-medium flex items-center space-x-1 ${getStatusColor(reminder.status)}`}>
                    {getStatusIcon(reminder.status)}
                    <span className="capitalize">{reminder.status}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 flex items-center space-x-1">
                    {getFrequencyIcon(reminder.frequency)}
                    <span>{getFrequencyText(reminder.frequency)}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-display text-h3 text-loopfund-emerald-600 mb-1">
                {formatCurrencySimple(reminder.amount)}
              </div>
              <div className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                {formatTimeUntilDue(reminder.scheduledTime)}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl p-4">
              <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                Amount Due
              </div>
              <div className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {formatCurrencySimple(reminder.amount)}
              </div>
            </div>
            
            <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl p-4">
              <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                Frequency
              </div>
              <div className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text capitalize">
                {reminder.frequency}
              </div>
            </div>
            
            <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl p-4">
              <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                Due Date
              </div>
              <div className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {new Date(reminder.scheduledTime).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          {reminder.status === 'due' && (
            <div className="flex space-x-3">
              <LoopFundButton
                onClick={() => onSnooze(reminder._id)}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Snooze 1 Hour
              </LoopFundButton>
              <LoopFundButton
                onClick={() => onPayNow(reminder)}
                variant="primary"
                size="md"
                icon={<DollarSign className="w-4 h-4" />}
                className="flex-1"
              >
                Pay Now
              </LoopFundButton>
            </div>
          )}
          
          {reminder.status === 'upcoming' && (
            <div className="text-center">
              <LoopFundButton
                onClick={() => onPayNow(reminder)}
                variant="primary"
                size="md"
                icon={<DollarSign className="w-4 h-4" />}
                className="w-full"
              >
                Pay Early
              </LoopFundButton>
            </div>
          )}
          
          {reminder.status === 'completed' && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-loopfund-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-body text-body font-medium">Payment Completed</span>
              </div>
            </div>
          )}
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default PaymentReminderCard;
