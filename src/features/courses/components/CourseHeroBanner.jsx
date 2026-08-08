import { motion } from 'framer-motion';
import React from 'react';

const CourseHeroBanner = ({ state }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 space-y-8"
        >
            <div className="space-y-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-block px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs uppercase tracking-widest rounded-full"
                >
                    {state?.category || "Course"}
                </motion.div>
                
                <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                    {state?.title}
                </h1>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                    <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
                    About this course
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                    {/* If description is plain text, we render it. If it contains newlines, we map them */}
                    {state?.description?.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CourseHeroBanner;
