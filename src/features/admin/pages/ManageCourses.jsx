import React, { useEffect } from "react";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FiBookOpen } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteCourse, getAllCourses } from "../../courses/redux/CourseSlice";

function ManageCourses() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const myCourses = useSelector((state) => state?.course?.courseData);

    useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch]);

    async function onCourseDelete(e, id) {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete the course ? ")) {
            const res = await dispatch(deleteCourse(id));
            if (res?.payload?.success) {
                dispatch(getAllCourses());
            }
        }
    }

    return (
        <div className="max-w-7xl mx-auto w-full p-8">
            <div className="flex flex-col gap-8">
                <div className="flex w-full items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-gray-100">
                            Manage Courses
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Click on a course card to manage its curriculum, or use the quick actions.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/course/create")}
                        className="bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-2 px-5 font-bold text-gray-900 shadow-sm"
                    >
                        + New Course
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourses?.map((course) => (
                        <div
                            key={course._id}
                            onClick={() => navigate(`/course/manage/${course?._id}`, { state: { ...course } })}
                            className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
                        >
                            <div className="h-40 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                {course?.thumbnail?.secure_url ? (
                                    <img src={course.thumbnail.secure_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 font-bold text-xs shadow-sm backdrop-blur-sm">
                                        {course?.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{course?.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{course?.description}</p>
                                
                                <div className="mt-auto flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs uppercase tracking-wider text-gray-400">Instructor</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{course?.createdBy}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold text-xs uppercase tracking-wider text-gray-400">Lectures</span>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{course?.numberOfLectures}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="text-sm font-bold text-yellow-500 flex items-center gap-2 group-hover:text-yellow-600 transition-colors">
                                        Manage Curriculum <FiBookOpen />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:text-white bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 p-2 rounded-lg transition-colors border border-blue-100 dark:border-blue-500/20 hover:border-transparent"
                                            onClick={(e) => { e.stopPropagation(); navigate("/course/displaylectures", { state: { ...course } }); }}
                                            title="View Lectures"
                                        >
                                            <BsCollectionPlayFill className="text-lg" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-white bg-red-50 dark:bg-red-500/10 hover:bg-red-500 p-2 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 hover:border-transparent"
                                            onClick={(e) => onCourseDelete(e, course?._id)}
                                            title="Delete Course"
                                        >
                                            <BsTrash className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {!myCourses?.length && (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FiBookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Courses Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">You haven't created any courses yet. Start by creating a new course to manage its curriculum here.</p>
                        <button
                            onClick={() => navigate("/course/create")}
                            className="mt-6 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-3 px-6 font-bold text-gray-900 shadow-sm"
                        >
                            Create First Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCourses;
