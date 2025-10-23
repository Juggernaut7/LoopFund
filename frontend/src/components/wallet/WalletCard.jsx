import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ArrowUpLeft } from 'lucide-react';
import { LoopFundCard } from '../ui';

const WalletCard = ({ wallet, onAddMoney, onViewTransactions, onWithdraw }) => {
  console.log('💳 WalletCard received wallet:', wallet);
  console.log('💰 WalletCard balance:', wallet?.balance);
  
  if (!wallet) {
    return (
      <LoopFundCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-loopfund-neutral-100 rounded-full">
            <Wallet className="w-6 h-6 text-loopfund-neutral-500" />
          </div>
          <div>
            <h3 className="font-display text-h4 text-loopfund-neutral-900">
              Loading Wallet...
            </h3>
            <p className="font-body text-body-sm text-loopfund-neutral-600">
              Please wait
            </p>
          </div>
        </div>
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-loopfund-neutral-300 border-t-loopfund-emerald-600 rounded-full animate-spin mx-auto"></div>
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
    <LoopFundCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-loopfund-emerald-100 rounded-full">
            <Wallet className="w-6 h-6 text-loopfund-emerald-600" />
          </div>
          <div>
            <h3 className="font-display text-h4 text-loopfund-neutral-900">
              LoopFund Wallet
            </h3>
            <p className="font-body text-body-sm text-loopfund-neutral-600">
              Your digital wallet
            </p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 bg-loopfund-emerald-100 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-loopfund-emerald-600 rounded-full"></div>
          <span className="font-body text-body-sm text-loopfund-emerald-700">Active</span>
        </div>
      </div>

      {/* Balance Section */}
      <div className="mb-6">
        <div className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Available Balance</div>
        <div className="text-4xl font-display font-bold text-loopfund-neutral-900 mb-2">
          {formatCurrency(wallet.balance || 0)}
        </div>
        <div className="font-body text-body-sm text-loopfund-neutral-500">
          {wallet.currency} • Updated just now
        </div>
      </div>

      {/* Recent Transaction */}
      {wallet.transactions && wallet.transactions.length > 0 && (
        <div className="mb-6 p-4 bg-loopfund-neutral-50 rounded-xl border border-loopfund-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-body-sm font-medium text-loopfund-neutral-700">
              Last Transaction
            </span>
            <span className="font-body text-body-sm text-loopfund-neutral-500">
              {new Date(wallet.transactions[wallet.transactions.length - 1].timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-body-sm text-loopfund-neutral-600 truncate">
              {wallet.transactions[wallet.transactions.length - 1].description}
            </span>
            <span className={`font-body text-body-sm font-medium ${
              wallet.transactions[wallet.transactions.length - 1].amount > 0 
                ? 'text-loopfund-emerald-600' 
                : 'text-loopfund-neutral-500'
            }`}>
              {wallet.transactions[wallet.transactions.length - 1].amount > 0 ? '+' : ''}
              {formatCurrency(wallet.transactions[wallet.transactions.length - 1].amount)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onAddMoney}
          className="px-4 py-3 bg-loopfund-emerald-100 hover:bg-loopfund-emerald-200 rounded-xl font-body text-body-sm font-medium text-loopfund-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 border border-loopfund-emerald-200"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          onClick={onWithdraw}
          className="px-4 py-3 bg-loopfund-neutral-100 hover:bg-loopfund-neutral-200 rounded-xl font-body text-body-sm font-medium text-loopfund-neutral-700 transition-all duration-200 flex items-center justify-center space-x-2 border border-loopfund-neutral-200"
        >
          <ArrowUpLeft className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
        <button
          onClick={onViewTransactions}
          className="px-4 py-3 bg-loopfund-neutral-100 hover:bg-loopfund-neutral-200 rounded-xl font-body text-body-sm font-medium text-loopfund-neutral-700 transition-all duration-200 flex items-center justify-center space-x-2 border border-loopfund-neutral-200"
        >
          <TrendingDown className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>
    </LoopFundCard>
  );
};

export default WalletCard;