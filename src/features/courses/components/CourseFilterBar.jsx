import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, SlidersHorizontal } from 'lucide-react';

const categories = ["All", "Web Development", "Design", "Data Science", "Marketing", "Business", "Photography"];

const CourseFilterBar = ({ selectedCategory, setSelectedCategory, sortBy, setSortBy }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-2 lg:p-3 bg-gray-800/40 rounded-[2rem] border border-gray-700/50 backdrop-blur-xl shadow-2xl relative z-10"
        >
            {/* Categories List */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-4 w-full md:w-auto">
                <LayoutGrid className="text-gray-500 mr-2 flex-shrink-0" size={20} />
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`relative px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
                                isSelected ? 'text-gray-900' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {isSelected && (
                                <motion.div 
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    );
                })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4 px-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-700/50 pt-4 md:pt-0">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm whitespace-nowrap">
                    <SlidersHorizontal size={18} /> Sort By:
                </div>
                <div className="relative">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-gray-900/50 border border-gray-700/50 text-gray-200 font-bold text-xs uppercase tracking-widest py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 cursor-pointer hover:bg-gray-800/80 transition-colors"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title A-Z</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseFilterBar;
