import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';

const ContributionCharts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Monthly Trend
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your contribution pattern over time
            </p>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-center space-x-2">
          {data.monthlyStats?.slice(0, 6).map((month, index) => {
            const maxValue = Math.max(...data.monthlyStats.map(m => m.total || 0));
            const height = maxValue > 0 ? ((month.total || 0) / maxValue) * 200 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:scale-110"
                     style={{ height: `${height}px` }}>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ${(month.total || 0).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Contribution Methods Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Payment Methods
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              How you prefer to contribute
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.paymentMethods ? (
            data.paymentMethods.map((item, index) => {
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500'
              ];
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.method}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback to default payment methods if no data
            [
              { method: 'Bank Transfer', percentage: 0, color: 'from-blue-500 to-cyan-500' },
              { method: 'Card Payment', percentage: 0, color: 'from-purple-500 to-pink-500' },
              { method: 'Cash', percentage: 0, color: 'from-green-500 to-emerald-500' },
              { method: 'Other', percentage: 0, color: 'from-orange-500 to-red-500' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.method}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContributionCharts; 