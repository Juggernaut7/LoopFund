import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const PaymentVerificationPage = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'failed', 'pending'
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (reference) {
      verifyPayment();
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      setVerificationStatus('verifying');
      setError('');

      const response = await api.get(`/payments/verify/${reference}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setPaymentData(data);
        
        if (data.status === 'success') {
          setVerificationStatus('success');
          
          // If group was created, redirect after a delay
          if (data.groupId) {
            setTimeout(() => {
              navigate(`/groups/${data.groupId}`);
            }, 3000);
          }
        } else if (data.status === 'pending') {
          setVerificationStatus('pending');
        } else {
          setVerificationStatus('failed');
          setError('Payment was not successful');
        }
      } else {
        setVerificationStatus('failed');
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setVerificationStatus('failed');
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const retryVerification = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(verifyPayment, 2000); // Wait 2 seconds before retrying
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="text-green-500" size={64} />;
      case 'failed':
        return <XCircle className="text-red-500" size={64} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={64} />;
      default:
        return <AlertCircle className="text-blue-500" size={64} />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Verifying Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return paymentData?.groupId 
          ? 'Your group has been created successfully! Redirecting...'
          : 'Payment was successful but group creation is pending. Please contact support.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. This may take a few minutes.';
      default:
        return 'Please wait while we verify your payment...';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  if (!reference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface flex items-center justify-center">
        <div className="text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Payment Reference
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No payment reference provided for verification.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className={`${getStatusColor()} border-2 rounded-2xl p-8 text-center`}>
          {/* Status Icon */}
          <div className="mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {getStatusTitle()}
          </h1>

          {/* Status Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getStatusMessage()}
          </p>

          {/* Payment Details */}
          {paymentData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {paymentData.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₦{(paymentData.amount / 100).toLocaleString()}
                  </span>
                </div>
                {paymentData.groupName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Group:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {paymentData.groupName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {verificationStatus === 'success' && paymentData?.groupId && (
              <button
                onClick={() => navigate(`/groups/${paymentData.groupId}`)}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>View Your Group</span>
                <ArrowRight size={20} />
              </button>
            )}

            {verificationStatus === 'failed' && (
              <div className="space-y-3">
                <button
                  onClick={retryVerification}
                  disabled={retryCount >= 3}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {retryCount >= 3 ? 'Max Retries Reached' : `Retry Verification (${3 - retryCount} left)`}
                </button>
                <button
                  onClick={() => navigate('/create-group')}
                  className="w-full btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <button
                onClick={retryVerification}
                className="w-full btn-primary"
              >
                Check Again
              </button>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage; 