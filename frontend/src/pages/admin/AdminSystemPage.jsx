import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Globe, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download, 
  Settings, 
  Shield, 
  Cpu, 
  HardDrive, 
  Wifi, 
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminSystemPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock system data
  const systemData = {
    server: {
      status: 'online',
      uptime: '99.98%',
      responseTime: '245ms',
      requestsPerSecond: 1234,
      cpuUsage: 45,
      memoryUsage: 67,
      diskUsage: 23
    },
    database: {
      status: 'healthy',
      connections: 156,
      queryTime: '12ms',
      size: '2.4GB',
      backupStatus: 'completed',
      lastBackup: '2 hours ago'
    },
    network: {
      status: 'stable',
      bandwidth: '1.2GB/s',
      latency: '45ms',
      packetLoss: '0.01%',
      activeConnections: 892
    },
    api: {
      status: 'healthy',
      responseTime: '89ms',
      errorRate: '0.02%',
      requestsPerMinute: 45600,
      endpoints: 24
    }
  };

  const systemAlerts = [
    { id: 1, type: 'info', message: 'Database backup completed successfully', time: '2 hours ago', severity: 'low' },
    { id: 2, type: 'warning', message: 'High memory usage detected', time: '15 minutes ago', severity: 'medium' },
    { id: 3, type: 'success', message: 'System performance optimized', time: '1 hour ago', severity: 'low' },
    { id: 4, type: 'error', message: 'API endpoint timeout', time: '5 minutes ago', severity: 'high' }
  ];

  const performanceMetrics = [
    { name: 'CPU Usage', value: 45, max: 100, color: 'bg-blue-500' },
    { name: 'Memory Usage', value: 67, max: 100, color: 'bg-green-500' },
    { name: 'Disk Usage', value: 23, max: 100, color: 'bg-purple-500' },
    { name: 'Network Load', value: 78, max: 100, color: 'bg-orange-500' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('System data refreshed successfully');
    }, 1000);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Server className="w-8 h-8 text-synergy-500" />
              System Health
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Monitor system performance, health status, and infrastructure metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* System Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Server Status</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {systemData.server.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">{systemData.server.uptime}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">uptime</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Database Health</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {systemData.database.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-blue-600">{systemData.database.queryTime}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">avg query time</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">API Performance</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {systemData.api.status === 'healthy' ? 'Healthy' : 'Issues'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Activity className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-purple-600">{systemData.api.responseTime}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">avg response</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Network Status</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {systemData.network.status === 'stable' ? 'Stable' : 'Unstable'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-sm font-medium text-emerald-600">{systemData.network.latency}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">latency</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* System Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance
            </h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{metric.name}</span>
                    <span className="text-slate-900 dark:text-white">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${metric.color}`}
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </h3>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{alert.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Server Details */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.server.uptime}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Response Time</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.server.responseTime}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Requests/sec</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.server.requestsPerSecond}</span>
              </div>
            </div>
          </div>

          {/* Database Details */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Connections</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.database.connections}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Size</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.database.size}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Last Backup</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.database.lastBackup}</span>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Network Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Bandwidth</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.network.bandwidth}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Packet Loss</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.network.packetLoss}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active Connections</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{systemData.network.activeConnections}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Performance Trend
            </h3>
            <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400">Performance trend chart will be displayed here</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Resource Distribution
            </h3>
            <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400">Resource distribution chart will be displayed here</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemPage; 