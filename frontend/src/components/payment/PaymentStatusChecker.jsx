import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const PaymentStatusChecker = ({ reference, onStatusChange, autoCheck = true }) => {
  const [status, setStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    if (reference && autoCheck) {
      checkStatus();
    }
  }, [reference, autoCheck]);

  const checkStatus = async () => {
    if (!reference) return;

    try {
      setStatus('checking');
      setError('');

      const response = await api.get(`/payments/status/${reference}`);
      
      if (response.data.success) {
        const payment = response.data.data;
        setPaymentData(payment);
        setStatus(payment.status);
        setLastChecked(new Date());
        
        // Notify parent component of status change
        onStatusChange?.(payment.status, payment);
      } else {
        setError(response.data.message || 'Failed to check status');
        setStatus('error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check payment status');
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-gray-500" size={20} />;
      case 'checking':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'successful':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400';
      case 'checking':
        return 'text-blue-600 dark:text-blue-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'successful':
        return 'Payment successful! Group created.';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'pending':
        return 'Payment is being processed...';
      case 'cancelled':
        return 'Payment was cancelled.';
      case 'checking':
        return 'Checking payment status...';
      case 'error':
        return 'Error checking status.';
      default:
        return 'Unknown status.';
    }
  };

  if (!reference) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            Payment Status
          </span>
        </div>
        
        <button
          onClick={checkStatus}
          disabled={status === 'checking'}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-2">
        <p className={`text-sm ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        
        {paymentData && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Reference: {paymentData.reference}</p>
            <p>Amount: ₦{(paymentData.amount / 100).toLocaleString()}</p>
            {paymentData.metadata?.groupName && (
              <p>Group: {paymentData.metadata.groupName}</p>
            )}
            {lastChecked && (
              <p>Last checked: {lastChecked.toLocaleTimeString()}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Error: {error}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentStatusChecker; 