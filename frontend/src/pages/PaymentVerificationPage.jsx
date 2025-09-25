import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PaymentVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get reference from URL path (from useParams) or query parameters
    const pathname = window.location.pathname;
    const referenceFromPath = pathname.split('/payment/verify/')[1];
    const referenceFromQuery = searchParams.get('reference') || searchParams.get('trxref');
    const reference = referenceFromPath || referenceFromQuery;
    
    console.log('🔍 URL pathname:', pathname);
    console.log('🔍 Reference from path:', referenceFromPath);
    console.log('🔍 Reference from query:', referenceFromQuery);
    console.log('🔍 Final reference:', reference);
    console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));
    
    if (reference) {
      verifyPayment(reference);
    } else {
      console.error('❌ No reference found in URL');
      setVerificationStatus('error');
    }
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      console.log('🔍 Verifying payment with reference:', reference);
      console.log('🔍 Auth token:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
      console.log('🔍 API URL:', `http://localhost:4000/api/payments/verify/${reference}`);
      
      // Call backend to verify payment
      const response = await fetch(`http://localhost:4000/api/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📊 Payment verification response:', data);
      
      // Check if the response has nested data structure
      if (data.data) {
        console.log('📊 Nested data structure found:', data.data);
      }

      if (response.ok && data.success) {
        setVerificationStatus('success');
        setPaymentData(data.data);
        
        // Show success toast
        toast.success('Payment Successful', 'Your payment has been processed successfully!');
      } else {
        console.error('❌ Payment verification failed:', data);
        setVerificationStatus('error');
        toast.error('Payment Verification Failed', data.error || data.message || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      setVerificationStatus('error');
      toast.error('Error', `Failed to verify payment: ${error.message}`);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verifying':
        return <Loader2 className="w-16 h-16 text-loopfund-emerald-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-loopfund-emerald-600" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-600" />;
      default:
        return <Loader2 className="w-16 h-16 text-loopfund-emerald-600 animate-spin" />;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'Verifying your payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Verification Failed';
      default:
        return 'Verifying your payment...';
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'Please wait while we verify your payment with our payment processor.';
      case 'success':
        return 'Your payment has been processed successfully. You will be redirected shortly.';
      case 'error':
        return 'There was an issue verifying your payment. Please contact support if the problem persists.';
      default:
        return 'Please wait while we verify your payment.';
    }
  };

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-loopfund-dark-surface rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            {getStatusMessage()}
          </h1>
          
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
            {getStatusDescription()}
          </p>

          {paymentData && verificationStatus === 'success' && (
            <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl p-4 mb-6">
              <div className="text-sm text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                <div className="font-medium">Payment Reference: {paymentData.reference}</div>
                <div>Amount: ₦{(paymentData.amount / 100).toLocaleString()}</div>
                <div>Status: {paymentData.status}</div>
              </div>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <div className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                Payment completed successfully! Where would you like to go next?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    // Trigger a custom event to refresh data on the target page
                    window.dispatchEvent(new CustomEvent('paymentCompleted', { 
                      detail: { type: 'dashboard' } 
                    }));
                    navigate('/dashboard', { replace: true });
                  }}
                  className="px-4 py-3 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Go to Dashboard
                </button>
                {paymentData?.metadata?.groupId && (
                  <button
                    onClick={() => {
                      // Trigger a custom event to refresh data on the target page
                      window.dispatchEvent(new CustomEvent('paymentCompleted', { 
                        detail: { type: 'group', groupId: paymentData.metadata.groupId } 
                      }));
                      navigate(`/groups/${paymentData.metadata.groupId}`, { replace: true });
                    }}
                    className="px-4 py-3 bg-loopfund-blue-600 hover:bg-loopfund-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    View Group
                  </button>
                )}
                {paymentData?.metadata?.goalId && (
                  <button
                    onClick={() => {
                      // Trigger a custom event to refresh data on the target page
                      window.dispatchEvent(new CustomEvent('paymentCompleted', { 
                        detail: { type: 'goals' } 
                      }));
                      navigate('/goals', { replace: true });
                    }}
                    className="px-4 py-3 bg-loopfund-purple-600 hover:bg-loopfund-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    View Goals
                  </button>
                )}
                <button
                  onClick={() => {
                    // Trigger a custom event to refresh data on the target page
                    window.dispatchEvent(new CustomEvent('paymentCompleted', { 
                      detail: { type: 'groups' } 
                    }));
                    navigate('/groups', { replace: true });
                  }}
                  className="px-4 py-3 bg-loopfund-neutral-600 hover:bg-loopfund-neutral-700 text-white rounded-lg font-medium transition-colors"
                >
                  View Groups
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-3">
              <div className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mb-4">
                There was an issue verifying your payment. You can try again or go back to the dashboard.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-3 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/dashboard', { replace: true })}
                  className="px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 text-loopfund-neutral-700 dark:text-loopfund-neutral-300 rounded-lg font-medium hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage;