import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ShieldCheck, Edit3 } from 'lucide-react';

const CourseInfoSidebar = ({ state, role, isSubscribed, navigate }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[400px] flex-shrink-0"
        >
            <div className="sticky top-28 space-y-6">
                <div className="bg-gray-800/40 backdrop-blur-2xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                    <div className="relative rounded-2xl overflow-hidden mb-6 group">
                        <img
                            className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="thumbnail"
                            src={state?.thumbnail?.secure_url}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>

                    <div className="space-y-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Total Lectures</span>
                                <span className="bg-gray-900 px-3 py-1 rounded-lg text-yellow-500 font-bold border border-gray-700">{state?.numberOfLectures || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Instructor</span>
                                <span className="text-gray-200 font-semibold">{state?.createdBy}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-700/50 w-full" />

                        <div className="space-y-3 pt-2">
                            {role === "ADMIN" || isSubscribed ? (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/course/displaylectures", { state: { ...state } })} 
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-xl font-bold px-5 py-4 w-full shadow-lg shadow-yellow-500/20"
                                >
                                    <PlayCircle size={20} />
                                    Watch Lectures
                                </motion.button>
                            ) : (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/checkout")} 
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-xl font-bold px-5 py-4 w-full shadow-lg shadow-yellow-500/20"
                                >
                                    <ShieldCheck size={20} />
                                    Subscribe to Unlock
                                </motion.button>
                            )}
                            
                            {role === "ADMIN" && (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/course/manage/${state?._id}`, { state: { ...state } })} 
                                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold px-5 py-4 w-full transition-colors"
                                >
                                    <Edit3 size={20} />
                                    Manage Curriculum
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseInfoSidebar;
