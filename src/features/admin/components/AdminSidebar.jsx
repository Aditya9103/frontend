import React from "react";
import { FiHome, FiBookOpen, FiPlusSquare, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { BookOpen } from "lucide-react";
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
    { name: 'Manage Course', path: '/admin/courses', icon: <FiBookOpen /> },
    { name: 'Create Blog', path: '/blog/create', icon: <FiBookOpen /> },
  ];

  return (
    <div className="flex flex-col w-72 h-screen px-6 py-8 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-colors duration-500">
      
      {/* Brand Logo */}
      <Link to="/" className="group flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black font-outfit tracking-tighter text-gray-900 dark:text-gray-100 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
              LEARN<span className="text-yellow-500">IFY</span>
          </span>
      </Link>
      
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Admin Panel</div>

      <div className="flex flex-col justify-between flex-1">
        <nav className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3.5 transition-all duration-300 rounded-xl group ${
                  isActive 
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-500/20 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className={`mx-2 text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="mx-2">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col space-y-2 mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link
            to="/"
            className="flex items-center px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-300 rounded-xl group"
          >
            <FiArrowLeft className="mx-2 text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="mx-2">Back to Site</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3.5 text-red-500 font-bold bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-xl group shadow-sm"
          >
            <FiLogOut className="mx-2 text-xl group-hover:scale-110 transition-transform" />
            <span className="mx-2">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
