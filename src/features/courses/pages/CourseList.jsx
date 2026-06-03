import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, ChevronDown, Filter, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import CourseCard from "../../../shared/components/CourseCard";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import { getAllCourses } from "../redux/CourseSlice";
import { CourseCardSkeleton } from "../../../shared/components/Skeleton";

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
            <div className="min-h-screen pt-24 pb-12 px-4 lg:px-8 flex flex-col gap-12 bg-gray-900 transition-colors duration-500">
                
                {/* Header Section */}
                <header className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-100">
                                Master New <span className="text-yellow-500">Skills</span>
                            </h1>
                            <p className="text-lg text-gray-300 font-medium max-w-2xl leading-relaxed italic">
                                Choose from over {courseData?.length || 0} world-class courses designed to accelerate your professional journey.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full lg:w-[450px] relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses, mentors..."
                                className="w-full bg-gray-800/80 border border-gray-700 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-gray-100 font-semibold shadow-lg placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-3 bg-gray-800/50 rounded-3xl border border-gray-700/50 backdrop-blur-md shadow-xl">
                        {/* Categories List */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-4 w-full md:w-auto">
                            <LayoutGrid className="text-gray-400 mr-2 flex-shrink-0" size={18} />
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                        selectedCategory === cat 
                                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 shadow-lg' 
                                            : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-700/50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-4 px-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm whitespace-nowrap">
                                <SlidersHorizontal size={16} /> Sort By:
                            </div>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-gray-100 font-bold text-xs uppercase tracking-widest focus:outline-none cursor-pointer hover:text-yellow-500 transition-colors"
                            >
                                <option value="newest" className="bg-gray-800 text-gray-100">Newest First</option>
                                <option value="oldest" className="bg-gray-800 text-gray-100">Oldest First</option>
                                <option value="title" className="bg-gray-800 text-gray-100">Title A-Z</option>
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
                                className="text-center py-32 bg-gray-800/50 backdrop-blur-md rounded-[3rem] border border-gray-700/50 shadow-2xl"
                            >
                                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 border border-gray-700">
                                    <Filter size={40} />
                                </div>
                                <h2 className="text-2xl font-bold tracking-wide text-gray-100 mb-2">No matching courses</h2>
                                <p className="text-gray-400 font-semibold">Try adjusting your filters or search keywords.</p>
                                <button 
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                    className="mt-8 text-yellow-500 font-bold text-sm uppercase tracking-widest hover:text-yellow-400 transition-colors"
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