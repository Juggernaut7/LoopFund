const dotenv = require('dotenv');
dotenv.config();

const paystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_ce1c926f9bdff293ede096b513d5f97605e4ccd7',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_5f5273cf3a91d04bd7b34b2204be02ab77111652',
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
  baseURL: 'https://api.paystack.co',
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  
  // Fee calculation settings
  feeSettings: {
    basePercentage: 0.02, // 2% base fee
    durationMultipliers: {
      1: 0.002,   // +0.2% for 1 month
      3: 0.005,   // +0.5% for 3 months
      6: 0.01,    // +1% for 6 months
      12: 0.015,  // +1.5% for 12 months
      24: 0.02    // +2% for 24 months
    },
    minFee: 500,  // Minimum fee in NGN
    maxFee: 10000 // Maximum fee in NGN
  },
  
  // Webhook events to handle
  webhookEvents: [
    'charge.success',
    'charge.failed',
    'transfer.success',
    'transfer.failed'
  ]
};

module.exports = paystackConfig; 