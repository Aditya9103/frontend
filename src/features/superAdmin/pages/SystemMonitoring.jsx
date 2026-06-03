import React, { useEffect, useState } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import superAdminService from '../../../core/services/superAdmin.service';
import toast from 'react-hot-toast';

const SystemMonitoring = () => {
  const [health, setHealth] = useState(null);

  const fetchHealth = async () => {
    try {
      const response = await superAdminService.getSystemHealth();
      if (response.data.success) {
        setHealth(response.data.health);
      }
    } catch (error) {
      toast.error('Failed to load system health');
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (!health) return <div className="p-10">Loading System Health...</div>;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">System Monitoring</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Server Uptime</h3>
            <p className="text-3xl text-blue-600">{(health.uptime / 3600).toFixed(2)} hours</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Database Status</h3>
            <p className={`text-3xl ${health.dbState === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
              {health.dbState}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">CPU Architecture</h3>
            <p className="text-xl text-gray-600">{health.cpu.model}</p>
            <p className="text-md text-gray-500 mt-1">{health.cpu.cores} Cores</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Memory Usage</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Total Memory</span>
                <span>{formatBytes(health.memory.total)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Free Memory</span>
                <span>{formatBytes(health.memory.free)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(health.memory.free / health.memory.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>App Allocated (RSS)</span>
                <span>{formatBytes(health.memory.appAllocated)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(health.memory.appAllocated / health.memory.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemMonitoring;
