import { motion } from "framer-motion";
import { 
    User, 
    Mail, 
    ShieldCheck, 
    CreditCard, 
    LayoutDashboard, 
    Key, 
    Settings,
    LogOut,
    Flame,
    CheckCircle,
    UserCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData, logout } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.data);

    async function handleCancellation() {
        if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
        
        toast.loading("Initiating cancellation...");
        const res = await dispatch(cancelCourseBundle());
        await dispatch(getUserData());
        
        if (res?.payload?.success) {
            toast.success("Cancellation completed!");
        }
    }

    async function handleLogout() {
        const res = await dispatch(logout());
        if (res?.payload?.success) navigate("/");
    }

    return (
        <HomeLayout>
            <div className="min-h-screen py-32 px-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Left: Profile Summary Card */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="glass-card bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/5 border border-white dark:border-slate-800 text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="w-40 h-40 rounded-full border-4 border-emerald-500/20 p-2 bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl">
                                    <img
                                        src={userData?.avatar?.secure_url}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900"
                                    />
                                </div>
                                {userData?.role === "ADMIN" && (
                                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white dark:border-slate-900 shadow-lg">
                                        Pro Admin
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black font-outfit text-slate-900 dark:text-white capitalize">
                                    {userData?.fullName}
                                </h3>
                                <p className="text-emerald-500 font-bold italic text-sm">Learning Enthusiast</p>
                            </div>

                            <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{userData?.streak?.count || 0}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{userData?.progress?.length || 0}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Courses</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full py-4 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/5 rounded-2xl transition-all"
                            >
                                <LogOut size={16} /> Sign Out Account
                            </button>
                        </div>
                    </div>

                    {/* Right: Detailed Info & Actions */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="glass-card bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/5 border border-white dark:border-slate-800 space-y-8">
                            <h2 className="text-xl font-black font-outfit text-slate-900 dark:text-white flex items-center gap-3">
                                <UserCircle size={24} className="text-emerald-500" /> Account Details
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30 group">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{userData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30 group">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Role</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{userData?.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30 group">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Status</p>
                                            <p className={`font-black uppercase text-xs ${userData?.subscription?.status === "active" ? "text-emerald-500" : "text-slate-400"}`}>
                                                {userData?.subscription?.status === "active" ? "Verified Active" : "Inactive / Free"}
                                            </p>
                                        </div>
                                        {userData?.subscription?.status === "active" && (
                                            <button 
                                                onClick={handleCancellation}
                                                className="px-4 py-2 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                Cancel Plan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link 
                                    to="/dashboard" 
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                                >
                                    <LayoutDashboard size={18} /> Learner Dashboard
                                </Link>
                                <Link 
                                    to="/user/editprofile" 
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    <Settings size={18} /> Update Profile
                                </Link>
                                <Link 
                                    to="/changepassword" 
                                    className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    <Key size={18} /> Security & Password
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </HomeLayout>
    );
}

export default Profile;