import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useNotifications } from '../../context/NotificationsContext';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { unreadCount } = useNotifications();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar}
          unreadCount={unreadCount}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <TopNav 
            toggleSidebar={toggleSidebar} 
            isCollapsed={isSidebarCollapsed}
            unreadCount={unreadCount}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 