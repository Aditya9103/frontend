import { motion } from "framer-motion";
import { 
    ArrowRight, 
    BookOpen,
    Calendar, 
    CheckCircle, 
    Clock, 
    Layout, 
    Play, 
    Target, 
    TrendingUp, 
    Trophy,
    Zap} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import CertificateCard from "../../../shared/components/CertificateCard";
import { getLearnerDashboardData } from "../../superAdmin/redux/DashboardSlice";

const ProgressRing = ({ percentage, color = "yellow" }) => {
    const validPercentage = isNaN(percentage) || percentage === null ? 0 : Number(percentage);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle
                    className="text-gray-200 dark:text-gray-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="48"
                    cy="48"
                />
                <circle
                    className={`text-${color}-500 transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="48"
                    cy="48"
                />
            </svg>
            <span className="absolute text-lg font-black font-outfit text-gray-900 dark:text-white">{percentage}%</span>
        </div>
    );
};

const LearnerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { learnerData, loading } = useSelector((state) => state.dashboard);
    const { data: userData } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getLearnerDashboardData());
    }, [dispatch]);

    if (loading && !learnerData) {
        return (
            <HomeLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-yellow-500 font-black uppercase tracking-widest text-xs">Assembling your workspace...</p>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    const {
        continueLearning,
        upcomingDeadlines,
        recommendedNextLessons,
        overallProgress,
        weakTopics,
        recentlyWatched,
        streak,
        estimatedCompletionTime,
        sectionMastery
    } = learnerData || {};

    const formatDuration = (seconds) => {
        if (!seconds) return "0m";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <HomeLayout>
            <div className="min-h-screen pt-28 pb-20 px-6 lg:px-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto space-y-12">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl md:text-5xl font-black font-outfit text-gray-900 dark:text-white"
                            >
                                Welcome back, <span className="text-yellow-500">{userData?.fullName?.split(' ')[0]}!</span>
                            </motion.h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Ready to continue your learning journey?</p>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-xl shadow-orange-500/10 border border-gray-100 dark:border-gray-800 cursor-default"
                        >
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center relative">
                                <Zap size={24} fill="currentColor" className="animate-pulse" />
                                <div className="absolute inset-0 bg-orange-500/20 rounded-2xl animate-ping opacity-20"></div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Streak</p>
                                <p className="text-xl font-black text-orange-500">{streak?.count || 0} Days 🔥</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-10">
                            
                            {/* Continue Learning */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <Play size={24} className="text-yellow-500" /> Continue Learning
                                </h2>
                                {continueLearning ? (
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="relative overflow-hidden group bg-yellow-600 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-yellow-500/20"
                                    >
                                        <div className="relative z-10 space-y-6">
                                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                                Resume where you left off
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black">{continueLearning.courseId?.title}</h3>
                                                <p className="text-yellow-100 font-medium italic">Current Lesson: Module {continueLearning.lectureId}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-2 text-yellow-100 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                                    <Clock size={14} /> {formatDuration(estimatedCompletionTime)} to complete
                                                </div>
                                                <div className="flex items-center gap-2 text-yellow-100 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                                    <Target size={14} /> {sectionMastery?.find(s => s.mastery < 100)?.mastery || 0}% section progress
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => navigate("/course/displaylectures", { state: continueLearning.courseId })}
                                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-yellow-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                            >
                                                <Play size={18} fill="currentColor" /> Resume Course
                                            </button>
                                        </div>
                                        {/* Abstract background shapes */}
                                        <div className="absolute top-0 right-0 -trangray-y-1/2 trangray-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 trangray-y-1/2 -trangray-x-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl"></div>
                                    </motion.div>
                                ) : (
                                    <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem] text-center space-y-4">
                                        <BookOpen size={48} className="mx-auto text-gray-300" />
                                        <p className="text-gray-500 font-bold italic">No active courses. Explore our catalog to start learning!</p>
                                        <button onClick={() => navigate("/courses")} className="text-yellow-500 font-black uppercase tracking-widest text-xs hover:underline">Browse Courses</button>
                                    </div>
                                )}
                            </section>

                            {/* Recommended Next Lessons */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <Target size={24} className="text-yellow-500" /> Recommended for You
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendedNextLessons?.length > 0 ? recommendedNextLessons.map((rec, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg shadow-yellow-500/5 space-y-4 cursor-pointer"
                                            onClick={() => navigate("/course/displaylectures", { state: { _id: rec.courseId, title: rec.courseTitle } })}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase rounded-lg">{rec.reason}</span>
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-400"><Play size={16} /></div>
                                            </div>
                                            <h4 className="font-black text-gray-900 dark:text-white leading-tight">{rec.lecture?.title}</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rec.courseTitle}</p>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full p-8 bg-gray-100 dark:bg-gray-900/50 rounded-3xl text-center">
                                            <p className="text-gray-500 italic font-medium">Keep learning to unlock personalized recommendations!</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Recently Watched */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <Clock size={24} className="text-yellow-500" /> Recently Watched
                                </h2>
                                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                                    {recentlyWatched?.length > 0 ? recentlyWatched.map((item, i) => (
                                        <div key={i} className="min-w-[280px] p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.courseId?.title}</p>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate">Lecture {item.lectureId}</h4>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                                                    <Clock size={12} /> {Math.floor(item.timestamp / 60)}m left
                                                </div>
                                                <button onClick={() => navigate("/course/displaylectures", { state: item.courseId })} className="text-yellow-500 font-black text-[10px] uppercase tracking-widest hover:underline">Resume</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 italic">No recent history.</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-10">
                            
                            {/* Overall Progress */}
                            <section className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-yellow-500/5 space-y-6 text-center">
                                <h2 className="text-xl font-black font-outfit text-gray-900 dark:text-white">Mastery Status</h2>
                                <ProgressRing percentage={overallProgress} />
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 italic">"Progress is a process!"</p>
                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <p className="text-xl font-black text-yellow-500">{userData?.progress?.length || 0}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enrolled</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-blue-500">{userData?.progress?.filter(p => p.completedLectures?.length > 0).length || 0}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In Progress</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section-wise Mastery */}
                            {sectionMastery?.length > 0 && (
                                <section className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-yellow-500/5 space-y-6">
                                    <h2 className="text-xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                        <Target size={20} className="text-yellow-500" /> Section Mastery
                                    </h2>
                                    <div className="space-y-4">
                                        {sectionMastery.map((section, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                    <span className="truncate max-w-[150px]">{section.title}</span>
                                                    <span>{section.mastery}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${section.mastery}%` }}
                                                        className="h-full bg-yellow-500 rounded-full"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Upcoming Deadlines */}
                            <section className="space-y-6">
                                <h2 className="text-xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <Calendar size={20} className="text-orange-500" /> Upcoming Deadlines
                                </h2>
                                <div className="space-y-4">
                                    {upcomingDeadlines?.length > 0 ? upcomingDeadlines.map((deadline, i) => (
                                        <div key={i} className="group p-4 bg-white dark:bg-gray-900 border-l-4 border-l-orange-500 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">{deadline.type}</p>
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">{deadline.title}</h4>
                                                    <p className="text-[10px] text-gray-400 italic mt-1">{deadline.courseTitle}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-900 dark:text-white">{new Date(deadline.dueDate).toLocaleDateString()}</p>
                                                    <p className="text-[9px] font-bold text-gray-400">Due Date</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 bg-gray-100 dark:bg-gray-900/50 rounded-3xl text-center space-y-2">
                                            <Trophy size={32} className="mx-auto text-yellow-500 opacity-20" />
                                            <p className="text-gray-400 text-xs italic font-bold">No pressing deadlines. Enjoy the calm!</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Weak Topics */}
                            <section className="space-y-6">
                                <h2 className="text-xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                    <TrendingUp size={20} className="text-rose-500" /> Focus Areas
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {weakTopics?.length > 0 ? weakTopics.map((topic, i) => (
                                        <span key={i} className="px-4 py-2 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-full border border-rose-500/20">{topic}</span>
                                    )) : (
                                        <div className="w-full p-8 bg-gray-100 dark:bg-gray-900/50 rounded-3xl text-center">
                                            <CheckCircle size={32} className="mx-auto text-yellow-500 opacity-20 mb-2" />
                                            <p className="text-gray-400 text-xs italic font-bold">Your performance looks solid across all topics!</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Phase 5: Certificates */}
                            {userData?.progress?.filter((p) => p.completed)?.length > 0 && (
                                <section className="space-y-4">
                                    <h2 className="text-xl font-black font-outfit text-gray-900 dark:text-white flex items-center gap-3">
                                        <Trophy size={20} className="text-amber-500" /> Your Certificates
                                    </h2>
                                    <div className="space-y-3">
                                        {userData.progress
                                            .filter((p) => p.completed)
                                            .map((p) => (
                                                <CertificateCard
                                                    key={p.courseId}
                                                    userId={userData._id}
                                                    courseId={p.courseId}
                                                    courseTitle={p.courseTitle || `Course ${p.courseId?.slice(-6)}`}
                                                    date={p.completedAt}
                                                />
                                            ))
                                        }
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default LearnerDashboard;
