import React from 'react';
import Layout from '../components/layout/Layout';

const ContributionsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Contributions & Payments
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            This page will contain contribution history, payment processing, and transaction management.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ContributionsPage; 