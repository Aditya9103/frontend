import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, ChevronDown, Filter, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import { CourseCardSkeleton } from "../../Components/Skeleton";

function CourseList() {
    const dispatch = useDispatch();
    const { courseData, isLoading } = useSelector((state) => state.course);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const categories = ["All", "Web Development", "Design", "Data Science", "Marketing", "Business", "Photography"];

    async function loadCourses() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    // Advanced Filtering Logic
    const filteredCourses = useMemo(() => {
        let result = [...(courseData || [])];

        // 1. Search Filter
        if (searchQuery) {
            result = result.filter(course => 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(course => course.category === selectedCategory);
        }

        // 3. Sorting
        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [courseData, searchQuery, selectedCategory, sortBy]);

    return (
        <HomeLayout>
            <div className="min-h-screen pt-24 pb-12 px-6 lg:px-20 flex flex-col gap-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                
                {/* Header Section */}
                <header className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-black font-outfit leading-tight tracking-tight text-slate-900 dark:text-white">
                                Master New <span className="text-gradient">Skills</span>
                            </h1>
                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed italic">
                                Choose from over {courseData?.length || 0} world-class courses designed to accelerate your professional journey.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full lg:w-[450px] relative group">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses, mentors..."
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white font-bold shadow-xl shadow-slate-200/50 dark:shadow-none"
                            />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2 bg-white/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-200 dark:border-slate-800/50 backdrop-blur-xl">
                        {/* Categories List */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-4 w-full md:w-auto">
                            <LayoutGrid className="text-slate-400 mr-2 flex-shrink-0" size={18} />
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                        selectedCategory === cat 
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-4 px-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm whitespace-nowrap">
                                <SlidersHorizontal size={16} /> Sort By:
                            </div>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest focus:outline-none cursor-pointer hover:text-emerald-500 transition-colors"
                            >
                                <option value="newest" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">Newest First</option>
                                <option value="oldest" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">Oldest First</option>
                                <option value="title" className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">Title A-Z</option>
                            </select>
                        </div>
                    </div>
                </header>

                {/* Course Grid */}
                <main className="max-w-7xl mx-auto w-full mb-24">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                {[...Array(6)].map((_, i) => (
                                    <CourseCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12"
                            >
                                {filteredCourses.map((element) => (
                                    <CourseCard key={element._id} data={element} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
                            >
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                                    <Filter size={40} />
                                </div>
                                <h2 className="text-2xl font-black font-outfit text-slate-900 dark:text-white mb-2">No matching courses</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your filters or search keywords.</p>
                                <button 
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                    className="mt-8 text-emerald-500 font-black text-sm uppercase tracking-widest hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </HomeLayout>
    );
}

export default CourseList;