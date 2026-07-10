import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const CourseHero = ({ courseCount, searchQuery, setSearchQuery }) => {
    return (
        <header className="flex flex-col gap-10 max-w-7xl mx-auto w-full relative z-10">
            {/* Ambient Glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-white">
                        Master New <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Skills</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
                        Choose from over <span className="text-yellow-500 font-bold">{courseCount}</span> world-class courses designed to accelerate your professional journey.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full lg:w-[450px] relative group"
                >
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={22} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses, mentors..."
                        className="w-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] py-4 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-gray-100 font-semibold shadow-2xl placeholder:text-gray-500"
                    />
                </motion.div>
            </div>
        </header>
    );
};

export default CourseHero;
