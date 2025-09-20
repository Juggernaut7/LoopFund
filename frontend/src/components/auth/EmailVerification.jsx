import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoopFundCard from '../ui/LoopFundCard';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundInput from '../ui/LoopFundInput';

const EmailVerification = ({ email, onVerified, onBack, onResend }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/email/verify', {
        email,
        code
      });

      if (response.data.success) {
        // Store the new token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('authToken', response.data.token);
        }
        toast.success('Email verified successfully!');
        onVerified(response.data.user, response.data.token);
      } else {
        toast.error(response.data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await api.post('/email/resend-verification', { email });
      
      if (response.data.success) {
        toast.success('Verification code sent!');
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setCode(''); // Clear current code
      } else {
        toast.error(response.data.error || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.error || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <LoopFundCard variant="elevated" className="p-8">
        <div className="text-center mb-8">
          <motion.div 
            className="mx-auto w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Verify Your Email
          </motion.h2>
          <motion.p 
            className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            We've sent a 6-digit verification code to
          </motion.p>
          <motion.p 
            className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {email}
          </motion.p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <LoopFundInput
              label="Verification Code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              icon={<Mail className="w-5 h-5" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <LoopFundButton
              type="submit"
              disabled={isLoading || code.length !== 6}
              variant="primary"
              size="lg"
              className="w-full"
              icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </LoopFundButton>
          </motion.div>
        </form>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {timeLeft > 0 ? (
            <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <LoopFundButton
              onClick={handleResend}
              disabled={isResending}
              variant="secondary"
              size="sm"
              icon={isResending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </LoopFundButton>
          )}
        </motion.div>

        <motion.div 
          className="mt-6 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <LoopFundButton
            onClick={onBack}
            variant="outline"
            size="sm"
            className="w-full"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Sign Up
          </LoopFundButton>
        </motion.div>

        <motion.div 
          className="mt-4 p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-loopfund-coral-600 dark:text-loopfund-coral-400 mt-0.5 flex-shrink-0" />
            <div className="font-body text-body-sm text-loopfund-coral-800 dark:text-loopfund-coral-200">
              <p className="font-medium">Didn't receive the email?</p>
              <ul className="mt-1 space-y-1 text-body-xs">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes and try again</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </LoopFundCard>
    </motion.div>
  );
};

export default EmailVerification;
