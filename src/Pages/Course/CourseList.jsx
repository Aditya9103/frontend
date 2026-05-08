import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from 'lucide-react';

import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";

function CourseList() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);

    async function loadCourses() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen pt-20 px-6 lg:px-20 flex flex-col gap-16 text-white bg-slate-950">
                <header className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl lg:text-6xl font-black font-outfit leading-tight tracking-tight">
                        Explore Courses by <br />
                        <span className="text-gradient italic">Industry Experts</span>
                    </h1>
                    <div className="w-24 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-xl text-slate-400 font-medium">
                        Discover world-class curriculum designed to help you master new skills and accelerate your career growth.
                    </p>

                    <div className="w-full max-w-xl relative mt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for courses, skills, or instructors..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-100 font-medium shadow-2xl"
                        />
                    </div>
                </header>

                <main className="mb-24">
                    {courseData?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                            {courseData.map((element) => (
                                <CourseCard key={element._id} data={element} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 glass-card rounded-3xl">
                            <h2 className="text-2xl font-bold text-slate-400 italic">No courses found matching your criteria.</h2>
                        </div>
                    )}
                </main>
            </div>
        </HomeLayout>
    );
}

export default CourseList;