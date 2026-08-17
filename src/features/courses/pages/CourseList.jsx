import { X } from "lucide-react";
import { useEffect, useMemo,useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import CourseGrid from "../components/CourseGrid";
import CourseHero from "../components/CourseHero";
import CourseSidebarFilter from "../components/CourseSidebarFilter";
import { getAllCourses } from "../redux/CourseSlice";

function CourseList() {
    const dispatch = useDispatch();
    const { courseData, isLoading } = useSelector((state) => state.course);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    // Phase 8: cache notice — dismiss once per session
    const [showCacheNotice, setShowCacheNotice] = useState(
        !sessionStorage.getItem('catalog_notice_dismissed')
    );

    const dismissCacheNotice = () => {
        sessionStorage.setItem('catalog_notice_dismissed', '1');
        setShowCacheNotice(false);
    };

    useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch]);

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
            <div className="min-h-screen pt-28 pb-12 px-4 lg:px-8 bg-gray-900 transition-colors duration-500 relative overflow-hidden">
                {/* Background ambient light */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="flex flex-col gap-12 relative z-10 max-w-[1600px] mx-auto">
                    <CourseHero 
                        courseCount={courseData?.length || 0} 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                    />

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <CourseSidebarFilter 
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />

                        {/* Phase 8: Stale cache notice */}
                        {showCacheNotice && (
                            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                                <span>⏱ Newly published courses may take up to 5 minutes to appear due to catalog caching.</span>
                                <button onClick={dismissCacheNotice} className="flex-shrink-0 text-amber-400 hover:text-amber-200 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <div className="flex-1 w-full">
                            <CourseGrid 
                                isLoading={isLoading}
                                filteredCourses={filteredCourses}
                                setSearchQuery={setSearchQuery}
                                setSelectedCategory={setSelectedCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseList;