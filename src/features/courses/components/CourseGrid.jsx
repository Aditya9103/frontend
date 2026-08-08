import { AnimatePresence,motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import React from 'react';

import CourseCard from '../../../shared/components/CourseCard';
import { CourseCardSkeleton } from '../../../shared/components/Skeleton';

const CourseGrid = ({ isLoading, filteredCourses, setSearchQuery, setSelectedCategory }) => {
    return (
        <main className="max-w-7xl mx-auto w-full mb-24 relative z-10">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                    >
                        {[...Array(6)].map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </motion.div>
                ) : filteredCourses.length > 0 ? (
                    <motion.div 
                        key="grid"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                    >
                        {filteredCourses.map((element) => (
                            <motion.div 
                                key={element._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                            >
                                <CourseCard data={element} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-32 bg-gray-800/30 backdrop-blur-xl rounded-[3rem] border border-gray-700/50 shadow-2xl max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-8 text-yellow-500 border border-gray-700/50 shadow-lg">
                            <Filter size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">No matching courses</h2>
                        <p className="text-gray-400 font-medium text-lg max-w-md mx-auto">We couldn't find any courses matching your current filters. Try adjusting your search criteria.</p>
                        <button 
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-yellow-500 font-bold text-sm uppercase tracking-widest hover:bg-white/10 hover:text-yellow-400 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default CourseGrid;
