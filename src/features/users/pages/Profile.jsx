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

import HomeLayout from "../../../shared/layouts/HomeLayout";
import { getUserData, logout } from "../../auth/redux/AuthSlice";
import { cancelCourseBundle } from "../../payments/redux/RazorpaySlice";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.data);

    async function handleCancellation() {
        if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

        const res = await dispatch(cancelCourseBundle());
        await dispatch(getUserData());
    }

    async function handleLogout() {
        const res = await dispatch(logout());
        if (res?.payload?.success) navigate("/");
    }

    return (
        <HomeLayout>

            <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-gray-900 transition-colors duration-500">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Left: Profile Summary Card */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50 text-center space-y-6">
                            <div className="relative inline-block">
                                <div className="w-40 h-40 rounded-full border-4 border-gray-600 p-2 bg-gray-800 shadow-xl">
                                    <img
                                        src={userData?.avatar?.secure_url}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                {userData?.role === "ADMIN" && (
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-gray-900 shadow-lg">
                                        Pro Admin
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold tracking-wide text-gray-100 capitalize">
                                    {userData?.fullName}
                                </h3>
                                <p className="text-yellow-500 font-semibold text-sm">Learning Enthusiast</p>
                            </div>

                            <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-700/50">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-100">{userData?.streak?.count || 0}</p>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Day Streak</p>
                                </div>
                                <div className="w-px h-8 bg-gray-700/50"></div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-100">{userData?.progress?.length || 0}</p>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Courses</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold text-sm uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <LogOut size={18} /> Sign Out Account
                            </button>
                        </div>
                    </div>

                    {/* Right: Detailed Info & Actions */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50 space-y-8">
                            <h2 className="text-2xl font-bold tracking-wide text-gray-100 flex items-center gap-3">
                                <UserCircle size={28} className="text-yellow-500" /> Account Details
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-6 p-5 bg-gray-900/50 rounded-xl border border-gray-700/50 transition-all hover:border-yellow-500/50 group">
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Primary Email</p>
                                        <p className="font-semibold text-gray-200">{userData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-5 bg-gray-900/50 rounded-xl border border-gray-700/50 transition-all hover:border-yellow-500/50 group">
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition-colors">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">User Role</p>
                                        <p className="font-semibold text-gray-200">{userData?.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-5 bg-gray-900/50 rounded-xl border border-gray-700/50 transition-all hover:border-yellow-500/50 group">
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition-colors">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Subscription Status</p>
                                            <p className={`font-bold uppercase text-sm ${userData?.subscription?.status === "active" ? "text-green-500" : "text-yellow-500"}`}>
                                                {userData?.subscription?.status === "active" ? "Verified Active" : "Inactive / Free"}
                                            </p>
                                        </div>
                                        {userData?.subscription?.status === "active" && (
                                            <button
                                                onClick={handleCancellation}
                                                className="px-4 py-2 bg-red-500/10 text-red-500 text-xs font-bold uppercase rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
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
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg"
                                >
                                    <LayoutDashboard size={18} /> Learner Dashboard
                                </Link>
                                <Link
                                    to="/user/editprofile"
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-gray-200 border border-gray-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-700 transition-all shadow-lg"
                                >
                                    <Settings size={18} /> Update Profile
                                </Link>
                                <Link
                                    to="/changepassword"
                                    className="md:col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-gray-200 border border-gray-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-700 transition-all shadow-lg"
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
