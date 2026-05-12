import { motion } from "framer-motion";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Key, Lock, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { changePassword } from '../../Redux/Slices/AuthSlice';

function ChangePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userPassword, setUserPassword] = useState({
        oldPassword: "",
        newPassword: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserPassword({
            ...userPassword,
            [name]: value,
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error("All fields are mandatory");
            return;
        }

        if (userPassword.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        toast.loading("Updating password...");
        const res = await dispatch(changePassword(userPassword));
        if (res?.payload?.success) {
            toast.success("Password updated successfully!");
            navigate('/user/profile');
        }

        setUserPassword({
            oldPassword: "",
            newPassword: "",
        });
    }

    return (
        <HomeLayout>
            <div className="min-h-screen py-32 px-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={onFormSubmit}
                        className="glass-card bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/5 border border-white dark:border-slate-800 space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)} 
                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-black font-outfit text-slate-900 dark:text-white">Security</h1>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center">
                                <ShieldCheck size={40} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Your Password</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="oldPassword">
                                    Current Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        name="oldPassword"
                                        id="oldPassword"
                                        placeholder="Enter your current password"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        value={userPassword.oldPassword}
                                        onChange={handleUserInput}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="newPassword">
                                    New Secure Password
                                </label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder="Create a new password"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        value={userPassword.newPassword}
                                        onChange={handleUserInput}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} /> Update Password
                        </button>

                        <Link to="/user/profile" className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
                            Return to Safety
                        </Link>
                    </form>
                </motion.div>
            </div>
        </HomeLayout>
    );
}

export default ChangePassword;
