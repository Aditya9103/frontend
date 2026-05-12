import { LogOut, Menu, User, X, BookOpen, LayoutDashboard, Phone, Info, Home, Moon, Sun, Eye, EyeOff, Flame, Users, TrendingUp, Newspaper } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Footer from '../Components/Footer';
import { logout } from '../Redux/Slices/AuthSlice';

function HomeLayout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Theme States
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isNightShift, setIsNightShift] = useState(false);

    const { isLoggedIn, role, data: userData } = useSelector((state) => state?.auth);
    const streakCount = userData?.streak?.count || 0;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        // Initial Theme Load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }

        return () => window.removeEventListener('scroll', handleScroll);
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

    async function handleLogout(e) {
        e.preventDefault();
        const res = await dispatch(logout());
        if(res?.payload?.success) navigate("/");
        setIsMenuOpen(false);
    }

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Courses', path: '/courses', icon: <BookOpen size={18} /> },
        { name: 'Mentors', path: '/mentors', icon: <Users size={18} /> },
        { name: 'Stories', path: '/success-stories', icon: <TrendingUp size={18} /> },
        { name: 'Blog', path: '/blog', icon: <Newspaper size={18} /> },
        { name: 'About', path: '/about', icon: <Info size={18} /> },
        { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
    ];

    if (isLoggedIn) {
        if (role === 'ADMIN') {
            navLinks.splice(2, 0, { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> });
        } else {
            navLinks.splice(2, 0, { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> });
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-400 transition-colors duration-500">
            {/* Horizontal Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 glass-nav shadow-lg' : 'py-6 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="group flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black font-outfit tracking-tighter group-hover:text-emerald-400 transition-colors">
                            LEARN<span className="text-emerald-500">IFY</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                className={`flex items-center gap-2 font-semibold transition-all duration-300 hover:text-emerald-400 ${location.pathname === link.path ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        {/* Theme Controls */}
                        <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800">
                            <button 
                                onClick={toggleDarkMode}
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                className={`p-2 rounded-xl transition-all duration-300 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'bg-white text-emerald-500 shadow-md'}`}
                            >
                                <Sun size={18} />
                            </button>
                            <button 
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-xl transition-all duration-300 ${!isDarkMode ? 'text-slate-500' : 'bg-slate-800 text-emerald-400 shadow-md'}`}
                            >
                                <Moon size={18} />
                            </button>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                            <button 
                                onClick={toggleNightShift}
                                title="Night Shift (Blue Light Filter)"
                                className={`p-2 rounded-xl transition-all duration-300 ${isNightShift ? 'bg-orange-500/20 text-orange-500 shadow-inner' : 'text-slate-500 hover:text-emerald-500'}`}
                            >
                                {isNightShift ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 font-bold transition-colors">Login</Link>
                                <Link to="/signup">
                                    <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                                        Join Now
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                {/* Streak Counter */}
                                {streakCount > 0 && (
                                    <div 
                                        title={`${streakCount} Day Learning Streak!`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl cursor-help animate-pulse-slow"
                                    >
                                        <Flame size={18} className="text-orange-500 fill-orange-500" />
                                        <span className="text-sm font-black text-orange-500">{streakCount}</span>
                                    </div>
                                )}
                                
                                <Link to="/user/profile" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-emerald-500 hover:border-emerald-500 transition-all">
                                    <User size={20} />
                                </Link>
                                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                    <LogOut size={22} />
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Mobile Toggle */}
                    <button className="lg:hidden p-2 text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden absolute top-full left-0 right-0 glass-nav border-t border-slate-800 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-4 px-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 text-lg font-bold text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-800 my-2"></div>
                        {!isLoggedIn ? (
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-3 text-center font-bold text-slate-300 bg-slate-800 rounded-xl">Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="py-3 text-center font-bold text-white bg-emerald-500 rounded-xl">Signup</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/user/profile" onClick={() => setIsMenuOpen(false)} className="py-3 text-center font-bold text-slate-300 bg-slate-800 rounded-xl flex items-center justify-center gap-2">
                                    <User size={18} /> Profile
                                </Link>
                                <button onClick={handleLogout} className="py-3 text-center font-bold text-rose-400 bg-rose-500/10 rounded-xl flex items-center justify-center gap-2 border border-rose-500/20">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-24 min-h-[calc(100vh-200px)]">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default HomeLayout;