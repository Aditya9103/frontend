import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { Users, CreditCard, DollarSign, PlusCircle, Layout, Book, Settings, ArrowUpRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);
    const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);
    const myCourses = useSelector((state) => state?.course?.courseData);

    const userData = {
        labels: ["Registered User", "Enrolled User"],
        datasets: [
            {
                data: [allUsersCount || 0, subscribedCount || 0],
                backgroundColor: ["rgba(16, 185, 129, 0.6)", "rgba(59, 130, 246, 0.6)"],
                borderColor: ["#10b981", "#3b82f6"],
                borderWidth: 2,
                hoverOffset: 15
            },
        ]
    };

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Sales / Month",
                data: monthlySalesRecord || [],
                backgroundColor: "rgba(16, 185, 129, 0.4)",
                borderColor: "#10b981",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            }
        ]
    };

    async function onCourseDelete(id) {
        if (window.confirm("Are you sure you want to delete the course?")) {
            const res = await dispatch(deleteCourse(id));
            if (res?.payload?.success) {
                await dispatch(getAllCourses());
            }
        }
    }

    useEffect(() => {
        (async () => {
            await dispatch(getAllCourses());
            await dispatch(getStatsData());
            await dispatch(getPaymentRecord());
        })();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
                {/* Sidebar - Integrated */}
                <aside className="w-full lg:w-72 bg-slate-900/50 border-r border-slate-800 p-8 flex flex-col gap-10">
                    <div className="space-y-2">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Management</p>
                        <nav className="flex flex-col gap-2">
                            <button className="flex items-center gap-4 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/20">
                                <Layout size={20} /> Overview
                            </button>
                            <button onClick={() => navigate("/courses")} className="flex items-center gap-4 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-bold transition-all">
                                <Book size={20} /> Courses
                            </button>
                            <button className="flex items-center gap-4 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-bold transition-all">
                                <Users size={20} /> Users
                            </button>
                            <button className="flex items-center gap-4 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-bold transition-all">
                                <Settings size={20} /> Settings
                            </button>
                        </nav>
                    </div>

                    <div className="mt-auto p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl text-white space-y-4 shadow-xl shadow-emerald-500/20">
                        <h4 className="font-black font-outfit">Need help?</h4>
                        <p className="text-xs text-white/80 font-medium">Check out our documentation for admin guides.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all backdrop-blur-md">
                            View Docs
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-x-hidden">
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black font-outfit tracking-tight">Admin <span className="text-emerald-500">Dashboard</span></h1>
                            <p className="text-slate-400 font-medium italic mt-1 text-sm">Welcome back! Here's what's happening today.</p>
                        </div>
                        <button 
                            onClick={() => navigate("/course/create")}
                            className="btn-modern btn-primary-modern"
                        >
                            <PlusCircle size={20} /> Create New Course
                        </button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Users", value: allUsersCount || 0, icon: <Users className="text-blue-400" />, trend: "+12%" },
                            { label: "Subscribers", value: subscribedCount || 0, icon: <CreditCard className="text-emerald-400" />, trend: "+5%" },
                            { label: "Active Subs", value: allPayments?.count || 0, icon: <DollarSign className="text-amber-400" />, trend: "+2%" },
                            { label: "Total Revenue", value: `₹${(allPayments?.count || 0) * 499}`, icon: <ArrowUpRight className="text-rose-400" />, trend: "+18%" },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 glass-card rounded-3xl space-y-4 border border-slate-800 hover:border-slate-700 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                        {stat.trend}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-black uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-black font-outfit mt-1">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 p-8 glass-card rounded-3xl border border-slate-800 space-y-6">
                            <h3 className="text-xl font-black font-outfit">Sales Performance</h3>
                            <div className="h-[350px]">
                                <Bar data={salesData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } }, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>

                        <div className="p-8 glass-card rounded-3xl border border-slate-800 space-y-8 flex flex-col items-center">
                            <h3 className="text-xl font-black font-outfit self-start">User Distribution</h3>
                            <div className="w-full max-w-[250px] aspect-square">
                                <Pie data={userData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12, weight: 'bold' }, padding: 20 } } } }} />
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black font-outfit">Active Courses</h3>
                            <button onClick={() => navigate("/courses")} className="text-emerald-400 text-sm font-bold hover:underline">View All</button>
                         </div>

                         <div className="overflow-x-auto glass-card rounded-3xl border border-slate-800">
                             <table className="w-full text-left">
                                 <thead>
                                     <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                                         <th className="px-8 py-5">Title</th>
                                         <th className="px-8 py-5">Category</th>
                                         <th className="px-8 py-5">Instructor</th>
                                         <th className="px-8 py-5 text-center">Lectures</th>
                                         <th className="px-8 py-5">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-800">
                                     {myCourses?.map((course) => (
                                         <tr key={course._id} className="hover:bg-slate-900/30 transition-colors group">
                                             <td className="px-8 py-6">
                                                 <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1 max-w-[250px]">
                                                     {course?.title}
                                                 </span>
                                             </td>
                                             <td className="px-8 py-6">
                                                 <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20">
                                                     {course?.category}
                                                 </span>
                                             </td>
                                             <td className="px-8 py-6 text-slate-400 font-bold italic text-sm">{course?.createdBy}</td>
                                             <td className="px-8 py-6 text-center font-black text-emerald-500">{course?.numberOfLectures}</td>
                                             <td className="px-8 py-6">
                                                 <div className="flex items-center gap-4">
                                                     <button
                                                         title="View"
                                                         className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                                                         onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                                                     >
                                                         <BsCollectionPlayFill size={18} />
                                                     </button>
                                                     <button
                                                         title="Delete"
                                                         className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                                         onClick={() => onCourseDelete(course?._id)}
                                                     >
                                                         <BsTrash size={18} />
                                                     </button>
                                                 </div>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                </main>
            </div>
        </HomeLayout>
    );
}

export default AdminDashboard;