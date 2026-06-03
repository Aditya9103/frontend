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

import AdminSidebar from "../components/AdminSidebar";
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
                borderColor: ["white"],
                borderWidth: 2
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
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="flex flex-col gap-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Dashboard Overview
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl w-full">
                        <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-300">
                            <div className="w-80 h-80">
                                <Pie data={userData} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <div className="flex items-center justify-between p-6 gap-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-500">Registered Users</p>
                                        <h3 className="text-4xl font-bold text-gray-800">{allUsersCount || 0}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-yellow-100">
                                        <FaUsers className="text-yellow-600 text-3xl" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 gap-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-500">Subscribed Users</p>
                                        <h3 className="text-4xl font-bold text-gray-800">{subscribedCount || 0}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-100">
                                        <FaUsers className="text-green-600 text-3xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-300">
                            <div className="h-80 w-full relative">
                                <Bar className="absolute bottom-0 h-80 w-full" data={salesData} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <div className="flex items-center justify-between p-6 gap-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-500">Subscription Count</p>
                                        <h3 className="text-4xl font-bold text-gray-800">{allPayments?.count || 0}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <FcSalesPerformance className="text-blue-600 text-3xl" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 gap-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-500">Total Revenue</p>
                                        <h3 className="text-4xl font-bold text-gray-800">₹{(allPayments?.count || 0) * 499}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-100">
                                        <GiMoneyStack className="text-green-600 text-3xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl w-full flex flex-col gap-6 mb-10 bg-white rounded-lg p-8 shadow-md border border-gray-100">
                        <div className="flex w-full items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Courses Overview
                            </h2>

                            <button
                                onClick={() => navigate("/course/create")}
                                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg py-2 px-6 font-medium text-white shadow-sm"
                            >
                                Create New Course
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lectures</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myCourses?.map((course, idx) => (
                                        <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{idx + 1}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                <p className="text-gray-900 font-medium whitespace-no-wrap">{course?.title}</p>
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {course?.category}
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {course?.createdBy}
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                {course?.numberOfLectures}
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">
                                                <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={course?.description}>
                                                    {course?.description}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors"
                                                        onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                                                        title="View Lectures"
                                                    >
                                                        <BsCollectionPlayFill className="text-xl" />
                                                    </button>
                                                    <button
                                                        className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 p-2 rounded-md transition-colors"
                                                        onClick={() => navigate(`/course/manage/${course?._id}`, { state: { ...course } })}
                                                        title="Manage Curriculum (Tasks)"
                                                    >
                                                        <FiBookOpen className="text-xl" />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                                                        onClick={() => onCourseDelete(course?._id)}
                                                        title="Delete Course"
                                                    >
                                                        <BsTrash className="text-xl" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;