import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, QrCode, Users, Mail, MessageCircle, Link as LinkIcon, Download } from 'lucide-react';
import QRCode from 'qrcode';

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

  const generateInviteData = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join/${groupId}`;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setInviteLink(link);
    setInviteCode(code);
  };

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(inviteLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
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
    
    try {
      // TODO: Implement backend API call
      console.log('Sending invites to:', validEmails);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setEmailInvites(['']);
      setInviteMethod('link');
    } catch (error) {
      console.error('Failed to send invites:', error);
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
    const canvas = document.querySelector('#qr-code canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `loopfund-invite-${groupName}.png`;
      link.href = canvas.toDataURL();
      link.click();
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
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Invite Members
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Invite friends and family to join "{groupName}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Method Tabs */}
            <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {[
                { id: 'link', label: 'Invite Link', icon: LinkIcon },
                { id: 'qr', label: 'QR Code', icon: QrCode },
                { id: 'email', label: 'Email Invites', icon: Mail },
                { id: 'share', label: 'Share', icon: Share2 }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setInviteMethod(method.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    inviteMethod === method.id
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <method.icon className="w-4 h-4" />
                  <span>{method.label}</span>
                </button>
              ))}
            </div>

            {/* Current Members */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Members ({currentMembers.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentMembers.map((member, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-white dark:bg-slate-600 rounded-full text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Invite Link
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(inviteLink)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Invite Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inviteCode}
                        readOnly
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-mono text-center"
                      />
                      <button
                        onClick={() => copyToClipboard(inviteCode)}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code */}
              {inviteMethod === 'qr' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
                      <img
                        id="qr-code"
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="w-48 h-48 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={downloadQR}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download QR</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(inviteLink)}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Email Invites */}
              {inviteMethod === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Addresses
                    </label>
                    <div className="space-y-3">
                      {emailInvites.map((email, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            placeholder="Enter email address"
                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                          {emailInvites.length > 1 && (
                            <button
                              onClick={() => removeEmailField(index)}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addEmailField}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      + Add another email
                    </button>
                  </div>
                  
                  <button
                    onClick={sendEmailInvites}
                    disabled={isLoading || emailInvites.every(email => email.trim() === '')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Invites'}
                  </button>
                </div>
              )}

              {/* Share */}
              {inviteMethod === 'share' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Share2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Share Your Group
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Share this group with friends and family using your preferred method
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={shareInvite}
                      className="flex flex-col items-center space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Share2 className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Native Share
                      </span>
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(inviteLink)}
                      className="flex flex-col items-center space-y-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <Copy className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Copy Link
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteModal; 