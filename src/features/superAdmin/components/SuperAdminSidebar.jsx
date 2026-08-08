import React from 'react';
import { 
FiActivity,   FiHome, FiLogOut, 
  FiMonitor, FiSettings, 
FiShield, FiUsers} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../auth/redux/AuthSlice';

const SuperAdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate("/");
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/super-admin/dashboard', icon: <FiHome /> },
    { name: 'All Users', path: '/super-admin/users', icon: <FiUsers /> },
    { name: 'Admin Management', path: '/super-admin/admins', icon: <FiShield /> },
    { name: 'Activity Logs', path: '/super-admin/logs', icon: <FiActivity /> },
    { name: 'System Monitor', path: '/super-admin/system', icon: <FiMonitor /> },
    { name: 'Settings', path: '/super-admin/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 border-r border-gray-800">
      <h2 className="text-3xl font-semibold text-white">Super<span className="text-blue-500">Admin</span></h2>
      
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 mt-5 text-gray-200 transition-colors transform rounded-md hover:bg-gray-800 hover:text-gray-100 ${
                location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <span className="mx-2 text-xl">{item.icon}</span>
              <span className="mx-2 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center px-4 -mx-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-5 text-red-400 transition-colors transform rounded-md hover:bg-red-500 hover:text-white"
          >
            <FiLogOut className="text-xl" />
            <span className="mx-2 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
