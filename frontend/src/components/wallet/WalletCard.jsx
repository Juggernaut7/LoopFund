import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { LoopFundCard } from '../ui';

const WalletCard = ({ wallet, onAddMoney, onViewTransactions }) => {
  console.log('💳 WalletCard received wallet:', wallet);
  console.log('💰 WalletCard balance:', wallet?.balance);
  
  if (!wallet) {
    return (
      <LoopFundCard variant="elevated" className="relative overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-loopfund-neutral-500" />
            </div>
            <div>
              <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Loading Wallet...
              </h3>
              <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Please wait
              </p>
            </div>
          </div>
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-loopfund-neutral-300 border-t-loopfund-emerald-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </LoopFundCard>
    );
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount) || amount === null || amount === undefined) {
      return '₦0.00';
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getRecentTransactionType = () => {
    if (!wallet.transactions || wallet.transactions.length === 0) return null;
    
    const recentTransaction = wallet.transactions[wallet.transactions.length - 1];
    return recentTransaction.type;
  };

  const recentTransactionType = getRecentTransactionType();

  return (
    <div className="relative">
      {/* Professional Wallet Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-loopfund-emerald-600 via-loopfund-emerald-700 to-loopfund-emerald-800 shadow-2xl">
        {/* Card Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Card Content */}
        <div className="relative p-6 text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-h4 text-white">
                  LoopFund Wallet
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Your digital wallet
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-body text-body-sm text-white/90">Active</span>
            </div>
          </div>

          {/* Balance Section */}
          <div className="mb-6">
            <div className="text-sm font-body text-white/80 mb-1">Available Balance</div>
            <div className="text-4xl font-display font-bold text-white mb-2">
              {formatCurrency(wallet.balance || 0)}
            </div>
            <div className="text-sm font-body text-white/70">
              {wallet.currency} • Updated just now
            </div>
          </div>

          {/* Recent Transaction */}
          {wallet.transactions && wallet.transactions.length > 0 && (
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-body-sm font-medium text-white/90">
                  Last Transaction
                </span>
                <span className="font-body text-body-sm text-white/70">
                  {new Date(wallet.transactions[wallet.transactions.length - 1].timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-body-sm text-white/80 truncate">
                  {wallet.transactions[wallet.transactions.length - 1].description}
                </span>
                <span className={`font-body text-body-sm font-medium ${
                  wallet.transactions[wallet.transactions.length - 1].amount > 0 
                    ? 'text-white' 
                    : 'text-white/70'
                }`}>
                  {wallet.transactions[wallet.transactions.length - 1].amount > 0 ? '+' : ''}
                  {formatCurrency(wallet.transactions[wallet.transactions.length - 1].amount)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onAddMoney}
              className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-body text-body-sm font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Add Money</span>
            </button>
            <button
              onClick={onViewTransactions}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-body text-body-sm font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
            >
              <TrendingDown className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Card Number/ID */}
        <div className="absolute bottom-4 right-4 text-white/60 font-mono text-xs">
          •••• {wallet._id?.slice(-4) || '0000'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
