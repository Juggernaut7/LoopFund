import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, QrCode, Users, Mail, MessageCircle, Link as LinkIcon, Download } from 'lucide-react';
import QRCode from 'qrcode';
import LoopFundCard from '../ui/LoopFundCard';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundInput from '../ui/LoopFundInput';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

const InviteModal = ({ isOpen, onClose, groupId, groupName, currentMembers = [] }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteMethod, setInviteMethod] = useState('link');
  const [emailInvites, setEmailInvites] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (isOpen && groupId) {
      generateInviteData();
    }
  }, [isOpen, groupId]);

  useEffect(() => {
    if (isOpen && groupId && inviteLink) {
      generateQRCode();
    }
  }, [isOpen, groupId, inviteLink]);

  // Regenerate QR code when switching to QR tab
  useEffect(() => {
    if (inviteMethod === 'qr' && inviteLink && !qrCodeDataUrl) {
      generateQRCode();
    }
  }, [inviteMethod, inviteLink, qrCodeDataUrl]);

  const generateInviteData = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join/${groupId}`;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setInviteLink(link);
    setInviteCode(code);
  };

  const generateQRCode = async () => {
    try {
      if (!inviteLink) {
        console.warn('No invite link available for QR code generation');
        return;
      }
      
      const dataUrl = await QRCode.toDataURL(inviteLink, {
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
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setQrCodeDataUrl('');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addEmailField = () => {
    setEmailInvites([...emailInvites, '']);
  };

  const removeEmailField = (index) => {
    if (emailInvites.length > 1) {
      setEmailInvites(emailInvites.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emailInvites];
    newEmails[index] = value;
    setEmailInvites(newEmails);
  };

  const sendEmailInvites = async () => {
    setIsLoading(true);
    const validEmails = emailInvites.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Send email invitations to each email address
      const results = [];
      for (const email of validEmails) {
        try {
          const response = await fetch(`${API_BASE_URL}/invitations/email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              inviteeEmail: email.trim(),
              groupId: groupId,
              message: `You've been invited to join "${groupName}" on LoopFund!`
            })
          });

          const data = await response.json();
          
          if (response.ok && data.success) {
            results.push({ email, success: true, message: data.message });
          } else {
            results.push({ email, success: false, error: data.error || 'Failed to send invitation' });
          }
        } catch (error) {
          results.push({ email, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        // Reset form
        setEmailInvites(['']);
        setInviteMethod('link');
        
        if (failed.length === 0) {
          alert(`Successfully sent ${successful.length} email invitation(s)!`);
        } else {
          alert(`Sent ${successful.length} invitation(s) successfully. ${failed.length} failed: ${failed.map(f => f.email).join(', ')}`);
        }
      } else {
        throw new Error(`All invitations failed: ${failed.map(f => `${f.email}: ${f.error}`).join(', ')}`);
      }
    } catch (error) {
      console.error('Failed to send invites:', error);
      alert('Failed to send email invitations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupName} on LoopFund`,
          text: `I'm inviting you to join our savings group "${groupName}" on LoopFund!`,
          url: inviteLink
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard(inviteLink);
    }
  };

  const downloadQR = () => {
    if (!qrCodeDataUrl) {
      console.error('No QR code available for download');
      return;
    }
    
    try {
      // Create a temporary link element to download the QR code
      const link = document.createElement('a');
      link.download = `loopfund-invite-${groupName.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = qrCodeDataUrl;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('QR code download initiated');
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <LoopFundCard variant="elevated" className="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
              <div>
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Invite Members
                </h2>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Invite friends and family to join "{groupName}"
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-loopfund-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Method Tabs */}
              <div className="flex space-x-1 mb-6 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-lg p-1">
                {[
                  { id: 'link', label: 'Invite Link', icon: LinkIcon },
                  { id: 'qr', label: 'QR Code', icon: QrCode },
                  { id: 'email', label: 'Email Invites', icon: Mail },
                  { id: 'share', label: 'Share', icon: Share2 }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setInviteMethod(method.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-body text-body-sm font-medium transition-all duration-200 ${
                      inviteMethod === method.id
                        ? 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
                        : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                    }`}
                  >
                    <method.icon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Current Members */}
              <div className="mb-6 p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-4 h-4 text-loopfund-neutral-500" />
                  <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                    Current Members ({currentMembers.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMembers.map((member, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-full font-body text-body-xs text-loopfund-neutral-700 dark:text-loopfund-neutral-300 border border-loopfund-neutral-200 dark:border-loopfund-neutral-600"
                    >
                      {member.name || member.email}
                    </div>
                  ))}
                </div>
              </div>

              {/* Method Content */}
              <div className="space-y-6">
                {/* Invite Link */}
                {inviteMethod === 'link' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Invite Link
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text font-body text-body-sm"
                        />
                        <LoopFundButton
                          onClick={() => copyToClipboard(inviteLink)}
                          variant={copied ? "success" : "primary"}
                          size="sm"
                          icon={copied ? null : <Copy className="w-4 h-4" />}
                        >
                          {copied ? 'Copied!' : ''}
                        </LoopFundButton>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Invite Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={inviteCode}
                          readOnly
                          className="flex-1 px-3 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text font-body text-body-sm font-mono text-center"
                        />
                        <LoopFundButton
                          onClick={() => copyToClipboard(inviteCode)}
                          variant="secondary"
                          size="sm"
                          icon={<Copy className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code */}
                {inviteMethod === 'qr' && (
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
                        onClick={() => copyToClipboard(inviteLink)}
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
                          variant="outline"
                          size="sm"
                          icon={<QrCode className="w-4 h-4" />}
                        >
                          Generate QR Code
                        </LoopFundButton>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Invites */}
                {inviteMethod === 'email' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Email Addresses
                      </label>
                      <div className="space-y-3">
                        {emailInvites.map((email, index) => (
                          <div key={index} className="flex space-x-2">
                            <LoopFundInput
                              type="email"
                              value={email}
                              onChange={(e) => updateEmail(index, e.target.value)}
                              placeholder="Enter email address"
                              className="flex-1"
                            />
                            {emailInvites.length > 1 && (
                              <LoopFundButton
                                onClick={() => removeEmailField(index)}
                                variant="danger"
                                size="sm"
                                icon={<X className="w-4 h-4" />}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={addEmailField}
                        className="mt-3 font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium"
                      >
                        + Add another email
                      </button>
                    </div>
                    
                    <LoopFundButton
                      onClick={sendEmailInvites}
                      disabled={isLoading || emailInvites.every(email => email.trim() === '')}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? 'Sending...' : 'Send Invites'}
                    </LoopFundButton>
                  </div>
                )}

                {/* Share */}
                {inviteMethod === 'share' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Share2 className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                        Share Your Group
                      </h3>
                      <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                        Share this group with friends and family using your preferred method
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        onClick={shareInvite}
                        className="flex flex-col items-center space-y-2 p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-700 rounded-lg transition-colors"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Share2 className="w-6 h-6 text-loopfund-emerald-600" />
                        <span className="font-body text-body-sm font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                          Native Share
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => copyToClipboard(inviteLink)}
                        className="flex flex-col items-center space-y-2 p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-700 rounded-lg transition-colors"
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Copy className="w-6 h-6 text-loopfund-coral-600" />
                        <span className="font-body text-body-sm font-medium text-loopfund-coral-700 dark:text-loopfund-coral-300">
                          Copy Link
                        </span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteModal; 