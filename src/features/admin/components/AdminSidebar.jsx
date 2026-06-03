import React from "react";
import { FiHome, FiBookOpen, FiPlusSquare, FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../auth/redux/AuthSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Create Course', path: '/course/create', icon: <FiPlusSquare /> },
    { name: 'Create Blog', path: '/blog/create', icon: <FiBookOpen /> },
  ];

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 border-r border-gray-800 flex-shrink-0">
      <h2 className="text-3xl font-semibold text-white">LMS<span className="text-blue-500">Admin</span></h2>
      
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-5 text-gray-200 transition-colors transform rounded-md hover:bg-gray-800 hover:text-gray-100 ${
                  isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="mx-2 text-xl">{item.icon}</span>
                <span className="mx-2 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center px-4 -mx-2 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-400 transition-colors transform rounded-md hover:bg-red-500 hover:text-white"
          >
            <FiLogOut className="text-xl" />
            <span className="mx-2 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
