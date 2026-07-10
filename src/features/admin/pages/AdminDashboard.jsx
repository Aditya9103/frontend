import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";

import { deleteCourse, getAllCourses } from "../../courses/redux/CourseSlice";
import { getPaymentRecord } from "../../payments/redux/RazorpaySlice";
import { getStatsData } from "../../superAdmin/redux/StatSlice";
ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

function AdminDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);

    const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);


    const userData = {
        labels: ["Registered User", "Enrolled User"],
        datasets: [
            {
                label: "User Details",
                data: [allUsersCount || 0, subscribedCount || 0],
                backgroundColor: ["#EAB308", "#22C55E"], // yellow-500, green-500
                borderWidth: 0,
            },
        ]
    };

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Sales / Month",
                data: monthlySalesRecord || [],
                backgroundColor: ["#EF4444"], // red-500
                borderColor: ["transparent"],
                borderWidth: 0
            }
        ]
    }

    const myCourses = useSelector((state) => state?.course?.courseData);

    async function onCourseDelete(id) {
        if (window.confirm("Are you sure you want to delete the course ? ")) {
            const res = await dispatch(deleteCourse(id));
            if (res?.payload?.success) {
                await dispatch(getAllCourses());
            }
        }
    }


    useEffect(() => {
        (
            async () => {
                await dispatch(getAllCourses());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord())
            }
        )()
    }, [])

    return (
        <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-gray-100">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here is what is happening with your platform today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    {/* User Stats Card */}
                    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300">
                        <div className="w-full flex justify-center items-center h-64">
                            <Pie data={userData} options={{ maintainAspectRatio: false }} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div className="flex items-center justify-between p-5 gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Registered</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allUsersCount || 0}</h3>
                                </div>
                                <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                                    <FaUsers className="text-2xl" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Subscribed</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{subscribedCount || 0}</h3>
                                </div>
                                <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                                    <FaUsers className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Stats Card */}
                    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300">
                        <div className="h-64 w-full relative">
                            <Bar className="absolute bottom-0 h-64 w-full" data={salesData} options={{ maintainAspectRatio: false }} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div className="flex items-center justify-between p-5 gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Subscriptions</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allPayments?.count || 0}</h3>
                                </div>
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                                    <FcSalesPerformance className="text-2xl" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Revenue</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{(allPayments?.count || 0) * 499}</h3>
                                </div>
                                <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                                    <GiMoneyStack className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Table Card */}
                <div className="w-full flex flex-col mb-10 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="flex w-full items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-outfit text-gray-900 dark:text-gray-100">
                            Courses Overview
                        </h2>

                        <button
                            onClick={() => navigate("/course/create")}
                            className="bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-2 px-5 font-bold text-gray-900 shadow-sm"
                        >
                            + New Course
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                                    <th className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
                                    <th className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lectures</th>
                                    <th className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myCourses?.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                                            <p className="text-gray-900 dark:text-gray-100 font-bold whitespace-no-wrap">{course?.title}</p>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-xs">
                                                {course?.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {course?.createdBy}
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {course?.numberOfLectures}
                                        </td>
                                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="text-blue-500 hover:text-white bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 p-2 rounded-lg transition-colors border border-blue-100 dark:border-blue-500/20 hover:border-transparent"
                                                    onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                                                    title="View Lectures"
                                                >
                                                    <BsCollectionPlayFill className="text-lg" />
                                                </button>
                                                <button
                                                    className="text-purple-500 hover:text-white bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-500 p-2 rounded-lg transition-colors border border-purple-100 dark:border-purple-500/20 hover:border-transparent"
                                                    onClick={() => navigate(`/course/manage/${course?._id}`, { state: { ...course } })}
                                                    title="Manage Curriculum (Tasks)"
                                                >
                                                    <FiBookOpen className="text-lg" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-white bg-red-50 dark:bg-red-500/10 hover:bg-red-500 p-2 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 hover:border-transparent"
                                                    onClick={() => onCourseDelete(course?._id)}
                                                    title="Delete Course"
                                                >
                                                    <BsTrash className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!myCourses?.length && (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">No courses found. Create one to get started!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;