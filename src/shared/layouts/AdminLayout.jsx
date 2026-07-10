import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sun, Moon, EyeOff, Eye, User } from 'lucide-react';
import AdminSidebar from '../../features/admin/components/AdminSidebar';

function AdminLayout() {
    // Theme States
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isNightShift, setIsNightShift] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleNightShift = () => {
        const newMode = !isNightShift;
        setIsNightShift(newMode);
        if (newMode) {
            document.documentElement.classList.add('night-shift');
        } else {
            document.documentElement.classList.remove('night-shift');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden">
            <AdminSidebar />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Admin Header */}
                <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10 shrink-0">
                    <h2 className="text-xl font-bold font-outfit text-gray-800 dark:text-gray-100">
                        Admin Workspace
                    </h2>

                    <div className="flex items-center gap-6">
                        {/* Theme Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-950 p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <button 
                                onClick={toggleDarkMode}
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                className={`p-2 rounded-xl transition-all duration-300 ${isDarkMode ? 'text-gray-500 hover:text-white' : 'bg-white text-yellow-500 shadow-md border border-gray-200'}`}
                            >
                                <Sun size={18} />
                            </button>
                            <button 
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-xl transition-all duration-300 ${!isDarkMode ? 'text-gray-500' : 'bg-gray-800 text-yellow-400 shadow-md border border-gray-700'}`}
                            >
                                <Moon size={18} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                            <button 
                                onClick={toggleNightShift}
                                title="Night Shift (Blue Light Filter)"
                                className={`p-2 rounded-xl transition-all duration-300 ${isNightShift ? 'bg-orange-500/20 text-orange-500 shadow-inner' : 'text-gray-500 hover:text-yellow-500'}`}
                            >
                                {isNightShift ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Profile Icon */}
                        <Link to="/user/profile" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-yellow-500 hover:border-yellow-500 transition-all shadow-sm">
                            <User size={20} />
                        </Link>
                    </div>
                </header>

                {/* Main Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
