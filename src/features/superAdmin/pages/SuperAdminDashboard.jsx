import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import superAdminService from '../../../core/services/superAdmin.service';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    newUsersToday: 0,
    activeSessions: 0
  });

  const fetchStats = async () => {
    try {
      const response = await superAdminService.getSuperAdminStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard title="Total Admins" value={stats.totalAdmins} color="bg-purple-500" />
          <StatCard title="New Users Today" value={stats.newUsersToday} color="bg-green-500" />
          <StatCard title="Active Sessions" value={stats.activeSessions} color="bg-orange-500" />
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Activity charts will be rendered here...</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-transparent hover:border-blue-500 transition-all duration-300">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
        <div className={`w-8 h-8 rounded-full ${color}`}></div>
      </div>
      <div className="mx-5">
        <h4 className="text-2xl font-semibold text-gray-700">{value}</h4>
        <div className="text-gray-500">{title}</div>
      </div>
    </div>
  </div>
);

export default SuperAdminDashboard;
