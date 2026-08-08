import React, { useState } from 'react';
import toast from 'react-hot-toast';

import SuperAdminSidebar from '../components/SuperAdminSidebar';

const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Platform Settings</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden flex min-h-[500px]">
          {/* Settings Sidebar */}
          <div className="w-64 bg-gray-100 border-r border-gray-200">
            <nav className="flex flex-col p-4">
              <button
                onClick={() => setActiveTab('general')}
                className={`text-left px-4 py-3 rounded-md mb-2 transition-colors ${activeTab === 'general' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                General Configuration
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`text-left px-4 py-3 rounded-md mb-2 transition-colors ${activeTab === 'security' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Security & Access
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'notifications' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Notifications
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8">
            <form onSubmit={handleSave}>

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">General Configuration</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input type="text" defaultValue="Learnify LMS" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input type="email" defaultValue="support@learnify.com" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-500">Temporarily disable access to the platform for all non-admin users.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Security & Access</h2>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Force Two-Factor Authentication (Admins)</h4>
                      <p className="text-sm text-gray-500">Require all admins to setup 2FA on their next login.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (Minutes)</label>
                    <input type="number" defaultValue="60" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Admin Notifications</h2>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                      <span className="text-gray-700 font-medium">New User Registrations</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                      <span className="text-gray-700 font-medium">System Error Alerts (Critical)</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                      <span className="text-gray-700 font-medium">Daily Analytics Report</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors">
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
