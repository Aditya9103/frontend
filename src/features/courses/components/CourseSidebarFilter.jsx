import { AnimatePresence,motion } from 'framer-motion';
import { ChevronRight, FilterX, LayoutGrid, Menu,SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

const categories = ["All", "Web Development", "Design", "Data Science", "Marketing", "Business", "Photography"];

const CourseSidebarFilter = ({ selectedCategory, setSelectedCategory, sortBy, setSortBy }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="space-y-8">
            {/* Sort Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal size={14} /> Sort By
                </h3>
                <div className="flex flex-col gap-2">
                    {[
                        { id: 'newest', label: 'Newest First' },
                        { id: 'oldest', label: 'Oldest First' },
                        { id: 'title', label: 'Title A-Z' }
                    ].map(option => (
                        <button
                            key={option.id}
                            onClick={() => {
                                setSortBy(option.id);
                                setIsMobileOpen(false);
                            }}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                sortBy === option.id 
                                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                                    : 'text-gray-400 hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            {option.label}
                            {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Categories Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid size={14} /> Categories
                </h3>
                <div className="flex flex-col gap-1">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsMobileOpen(false);
                                }}
                                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                                    isSelected 
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black shadow-lg shadow-yellow-500/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 font-semibold'
                                }`}
                            >
                                <span>{cat}</span>
                                <ChevronRight 
                                    size={16} 
                                    className={`transition-transform duration-300 ${isSelected ? 'text-gray-900 translate-x-1' : 'text-gray-600 group-hover:text-white group-hover:translate-x-1'}`} 
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== "All" || sortBy !== "newest") && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                        setSelectedCategory("All");
                        setSortBy("newest");
                        setIsMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                >
                    <FilterX size={14} /> Clear Filters
                </motion.button>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Fixed Sidebar */}
            <motion.aside 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block w-72 flex-shrink-0 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-4"
            >
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-6 shadow-2xl">
                    <SidebarContent />
                </div>
            </motion.aside>

            {/* Mobile Slide-out Drawer */}
            <div className="lg:hidden w-full flex justify-end mb-6">
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-full text-white font-bold text-sm shadow-lg hover:border-yellow-500 transition-colors"
                >
                    <Menu size={18} /> Filters & Sorting
                </button>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-gray-900 border-r border-gray-800 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black text-white">Filters</h2>
                                <button onClick={() => setIsMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white">
                                    <ChevronRight size={20} className="rotate-180" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CourseSidebarFilter;
