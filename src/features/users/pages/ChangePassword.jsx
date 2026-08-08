import { motion } from "framer-motion";
import { ArrowLeft, Key, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../../shared/layouts/HomeLayout';
import { changePassword } from '../../auth/redux/AuthSlice';

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

        const res = await dispatch(changePassword(userPassword));
        if (res?.payload?.success) {
            navigate('/user/profile');
        }

        setUserPassword({
            oldPassword: "",
            newPassword: "",
        });
    }

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-gray-900 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={onFormSubmit}
                        className="bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50 space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)} 
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold tracking-wide text-yellow-500">Security</h1>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-3xl flex items-center justify-center border border-yellow-500/20">
                                <ShieldCheck size={40} />
                            </div>
                            <p className="text-sm font-semibold text-gray-400">Update Your Password</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="oldPassword">
                                    Current Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        name="oldPassword"
                                        id="oldPassword"
                                        placeholder="Enter your current password"
                                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-sm font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500"
                                        value={userPassword.oldPassword}
                                        onChange={handleUserInput}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="newPassword">
                                    New Secure Password
                                </label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder="Create a new password"
                                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-sm font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500"
                                        value={userPassword.newPassword}
                                        onChange={handleUserInput}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                            <ShieldCheck size={18} /> Update Password
                        </button>

                        <Link to="/user/profile" className="block text-center text-sm font-semibold text-gray-400 hover:text-yellow-500 transition-colors">
                            Return to Safety
                        </Link>
                    </form>
                </motion.div>
            </div>
        </HomeLayout>
    );
}

export default ChangePassword;
