import React, { useEffect, useState, useMemo } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import superAdminService from '../../../core/services/superAdmin.service';
import toast from 'react-hot-toast';
import { FiSearch, FiX, FiCalendar, FiClock, FiShield, FiBook, FiAward, FiStar } from 'react-icons/fi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await superAdminService.getUsers();
      if (response.data.success) {
        setUsers(response.data.users.filter(u => u.role === 'USER'));
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(u => 
      u.fullName?.toLowerCase().includes(lowerQuery) || 
      u.email?.toLowerCase().includes(lowerQuery) ||
      u.authProvider?.toLowerCase().includes(lowerQuery)
    );
  }, [users, searchQuery]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
              placeholder="Search users by name, email or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User Info</th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Auth & Verification</th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Engagement</th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined On</th>
                  <th className="px-5 py-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-full w-full rounded-full object-cover border border-gray-300" 
                            src={user.avatar?.secure_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} 
                            alt={user.fullName} 
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-900 font-semibold whitespace-no-wrap">{user.fullName}</p>
                          <p className="text-gray-500 whitespace-no-wrap text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap capitalize font-medium">{user.authProvider || 'Email'}</p>
                      {user.isVerified ? (
                        <span className="text-green-600 text-xs font-bold flex items-center mt-1"><FiShield className="mr-1"/> Verified</span>
                      ) : (
                        <span className="text-orange-500 text-xs font-bold flex items-center mt-1">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="text-gray-700 whitespace-no-wrap text-xs">
                        <span className="font-semibold text-gray-900">{user.progress?.length || 0}</span> Courses
                      </p>
                      <p className="text-gray-700 whitespace-no-wrap text-xs mt-1">
                        <span className="font-semibold text-gray-900">{user.streak?.count || 0}</span> Day Streak
                      </p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-1.5 px-3 rounded text-xs transition-colors border border-blue-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 border-b border-gray-200 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                User Details
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Profile Overview */}
              <div className="flex items-center space-x-6 mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                <img 
                  src={selectedUser.avatar?.secure_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName)}&background=random`} 
                  alt={selectedUser.fullName}
                  className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                  <p className="text-gray-600 mb-2">{selectedUser.email}</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {selectedUser.isVerified ? 'Verified Account' : 'Unverified Account'}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold capitalize">
                      {selectedUser.authProvider || 'Email'} Auth
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Account Info */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center"><FiCalendar className="mr-2"/> Account Timestamps</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Joined On</span>
                      <span className="font-semibold text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Last Login</span>
                      <span className="font-semibold text-gray-900">{selectedUser.lastLoginDate ? new Date(selectedUser.lastLoginDate).toLocaleString() : 'Never'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-semibold text-gray-900">{new Date(selectedUser.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center"><FiStar className="mr-2"/> Engagement Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Learning Streak</span>
                      <span className="font-bold text-orange-600">{selectedUser.streak?.count || 0} Days</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Enrolled Courses</span>
                      <span className="font-semibold text-gray-900">{selectedUser.progress?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bookmarks / Notes</span>
                      <span className="font-semibold text-gray-900">{selectedUser.bookmarks?.length || 0} / {selectedUser.notes?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Subscriptions & Security */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 md:col-span-2">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center"><FiShield className="mr-2"/> Security & Subscription</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0 md:pr-4">
                      <span className="text-gray-600">Subscription Status</span>
                      <span className={`font-semibold ${selectedUser.subscription?.status === 'active' ? 'text-green-600' : 'text-gray-900'}`}>
                        {selectedUser.subscription?.status || 'Free Tier'}
                      </span>
                    </div>
                    <div className="flex justify-between md:pl-4">
                      <span className="text-gray-600">OTP Resend Count</span>
                      <span className="font-semibold text-gray-900">{selectedUser.otpResendCount || 0} times</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end sticky bottom-0">
              <button 
                onClick={() => setSelectedUser(null)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
