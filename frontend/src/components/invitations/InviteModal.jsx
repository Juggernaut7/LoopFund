import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Users, 
  Copy, 
  CheckCircle, 
  Link as LinkIcon,
  RefreshCw,
  QrCode,
  Download
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuthStore } from '../../store/useAuthStore';
import LoopFundCard from '../ui/LoopFundCard';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundInput from '../ui/LoopFundInput';
import QRCode from 'qrcode';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

const InviteModal = ({ isOpen, onClose, group, onInviteSent }) => {
  const [inviteType, setInviteType] = useState('direct'); // 'direct', 'public', or 'qr'
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [publicInviteLink, setPublicInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const { toast } = useToast();
  const { getToken } = useAuthStore();

  const handleDirectInvite = async (e) => {
    e.preventDefault();
    if (!inviteeEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      console.log('🔑 Token for invitation:', token); // Debug log
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/invitations/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inviteeEmail: inviteeEmail.trim(),
          groupId: group._id,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email invitation sent successfully! They will receive an email to join your group.');
        setInviteeEmail('');
        setMessage('');
        onInviteSent && onInviteSent();
      } else {
        throw new Error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Invitation error:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePublicLink = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      console.log('🔑 Token for invitation:', token);
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/invitations/group/${group._id}/public-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response status:', response.status);
      console.log('📋 Response headers:', response.headers);

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('⚠️ Non-JSON response, trying to get text');
        const textResponse = await response.text();
        console.log('📄 Text response:', textResponse);
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok && data.success) {
        setPublicInviteLink(data.data.inviteLink);
        toast.success('Public invite link generated!');
      } else {
        // Handle error response
        const errorMessage = data?.error || data?.message || `Failed to generate invite link (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error generating link:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Cannot read properties of undefined')) {
        toast.error('Server response error - please try again');
      } else {
        toast.error(error.message || 'Failed to generate invitation link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const refreshPublicLink = () => {
    setPublicInviteLink('');
    generatePublicLink();
  };

  const generateQRCode = async () => {
    try {
      if (!publicInviteLink) {
        console.warn('No public invite link available for QR code generation');
        toast.error('Please generate a public invite link first');
        return;
      }
      
      console.log('Generating QR code for link:', publicInviteLink);
      
      const dataUrl = await QRCode.toDataURL(publicInviteLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeDataUrl(dataUrl);
      console.log('QR code generated successfully:', dataUrl.substring(0, 50) + '...');
      toast.success('QR code generated successfully!');
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setQrCodeDataUrl('');
      toast.error('Failed to generate QR code. Please try again.');
    }
  };

  const downloadQR = () => {
    if (!qrCodeDataUrl) {
      console.error('No QR code available for download');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.download = `loopfund-invite-${group.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = qrCodeDataUrl;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('QR code download initiated');
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  // Generate QR code when public link is available and QR tab is selected
  useEffect(() => {
    console.log('QR Code useEffect triggered:', { inviteType, publicInviteLink: !!publicInviteLink, qrCodeDataUrl: !!qrCodeDataUrl });
    if (inviteType === 'qr' && publicInviteLink && !qrCodeDataUrl) {
      console.log('Auto-generating QR code...');
      generateQRCode();
    }
  }, [inviteType, publicInviteLink, qrCodeDataUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <LoopFundCard variant="elevated" className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Invite to {group.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-loopfund-neutral-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Invite Type Tabs */}
                <div className="flex space-x-1 mb-6 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated p-1 rounded-lg">
                  <button
                    onClick={() => setInviteType('direct')}
                    className={`flex-1 py-2 px-3 rounded-md font-body text-body-sm font-medium transition-all ${
                      inviteType === 'direct'
                        ? 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
                        : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Direct Invite
                  </button>
                  <button
                    onClick={() => setInviteType('public')}
                    className={`flex-1 py-2 px-3 rounded-md font-body text-body-sm font-medium transition-all ${
                      inviteType === 'public'
                        ? 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
                        : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Public Link
                  </button>
                  <button
                    onClick={() => setInviteType('qr')}
                    className={`flex-1 py-2 px-3 rounded-md font-body text-body-sm font-medium transition-all ${
                      inviteType === 'qr'
                        ? 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
                        : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4 inline mr-2" />
                    QR Code
                  </button>
                </div>

                {inviteType === 'direct' ? (
                  /* Direct Invite Form */
                  <form onSubmit={handleDirectInvite} className="space-y-6">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Email Address
                      </label>
                      <LoopFundInput
                        type="email"
                        value={inviteeEmail}
                        onChange={(e) => setInviteeEmail(e.target.value)}
                        placeholder="Enter any email address (registered or not)"
                        required
                      />
                      <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
                        💡 Works for anyone - they'll get an email to join LoopFund and your group
                      </p>
                    </div>

                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Personal Message (Optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal message to your invitation..."
                        rows={3}
                        className="w-full px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text resize-none font-body text-body"
                        maxLength={500}
                      />
                      <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
                        {message.length}/500 characters
                      </p>
                    </div>

                    <LoopFundButton
                      type="submit"
                      disabled={isLoading || !inviteeEmail.trim()}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    >
                      {isLoading ? 'Sending...' : 'Send Invitation'}
                    </LoopFundButton>
                  </form>
                ) : inviteType === 'public' ? (
                  /* Public Invite Link */
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-gold-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Users className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                        Public Invite Link
                      </h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        Anyone with this link can join your group
                      </p>
                    </div>

                    {!publicInviteLink ? (
                      <LoopFundButton
                        onClick={generatePublicLink}
                        disabled={isLoading}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                      >
                        {isLoading ? 'Generating...' : 'Generate Invite Link'}
                      </LoopFundButton>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg">
                          <input
                            type="text"
                            value={publicInviteLink}
                            readOnly
                            className="flex-1 bg-transparent font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-300 border-none outline-none"
                          />
                          <button
                            onClick={() => copyToClipboard(publicInviteLink)}
                            className="p-2 rounded transition-colors"
                          >
                            {copied ? (
                              <CheckCircle className="w-4 h-4 text-loopfund-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-loopfund-neutral-500" />
                            )}
                          </button>
                        </div>
                        
                        <LoopFundButton
                          onClick={refreshPublicLink}
                          variant="secondary"
                          size="lg"
                          className="w-full"
                          icon={<RefreshCw className="w-4 h-4" />}
                        >
                          Generate New Link
                        </LoopFundButton>
                      </div>
                    )}
                  </div>
                ) : inviteType === 'qr' ? (
                  /* QR Code */
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <QrCode className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                        QR Code Invitation
                      </h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        Generate a QR code for easy group sharing
                      </p>
                    </div>

                    {!publicInviteLink ? (
                      <div className="text-center">
                        <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                          First generate a public invite link to create a QR code
                        </p>
                        <LoopFundButton
                          onClick={generatePublicLink}
                          variant="primary"
                          size="lg"
                          icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Generating...' : 'Generate Public Link'}
                        </LoopFundButton>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-block p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl shadow-loopfund">
                            {qrCodeDataUrl ? (
                              <img
                                id="qr-code"
                                src={qrCodeDataUrl}
                                alt="QR Code for group invitation"
                                className="w-48 h-48 rounded-lg"
                                onError={(e) => {
                                  console.error('QR code image failed to load');
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-48 h-48 flex items-center justify-center bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface rounded-lg">
                                <div className="text-center">
                                  <motion.div
                                    className="w-8 h-8 border-2 border-loopfund-emerald-500 border-t-transparent rounded-full mx-auto mb-2"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                                    Generating QR Code...
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {qrCodeDataUrl && (
                          <div className="text-center mb-4">
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              Scan this QR code to join the group
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-center space-x-3">
                          <LoopFundButton
                            onClick={downloadQR}
                            variant="primary"
                            size="md"
                            icon={<Download className="w-4 h-4" />}
                            disabled={!qrCodeDataUrl}
                          >
                            Download QR
                          </LoopFundButton>
                          <LoopFundButton
                            onClick={() => copyToClipboard(publicInviteLink)}
                            variant="secondary"
                            size="md"
                            icon={<Copy className="w-4 h-4" />}
                          >
                            Copy Link
                          </LoopFundButton>
                        </div>
                        
                        {!qrCodeDataUrl && (
                          <div className="text-center">
                            <LoopFundButton
                              onClick={generateQRCode}
                              variant="primary"
                              size="lg"
                              icon={<QrCode className="w-4 h-4" />}
                              className="w-full"
                            >
                              Generate QR Code
                            </LoopFundButton>
                            <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                              Click to generate QR code for easy sharing
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </LoopFundCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteModal; 