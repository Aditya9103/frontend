import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, FileText, Trash2, Plus, ArrowLeft, ChevronRight, Video, List } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures, isLoading } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);
    const activeLecture = lectures?.[currentVideo];

    async function onLectureDelete(courseId, lectureId) {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            await dispatch(deleteCourseLecture({ courseId, lectureId }));
            await dispatch(getCourseLectures(courseId));
        }
    }

    useEffect(() => {
        if (!state) {
            navigate("/courses");
            return;
        }
        dispatch(getCourseLectures(state._id));
    }, [dispatch, navigate, state]);

    return (
        <HomeLayout>
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 lg:px-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black font-outfit text-white tracking-tight">{state?.title}</h1>
                                <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mt-1">Course Player</p>
                            </div>
                        </div>

                        {role === "ADMIN" && (
                            <button
                                onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                className="btn-modern btn-primary-modern"
                            >
                                <Plus size={18} /> Add New Lecture
                            </button>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Video Player Section */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="relative group rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black aspect-video">
                                <AnimatePresence mode="wait">
                                    {lectures && lectures.length > 0 ? (
                                        <motion.video
                                            key={activeLecture?._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            src={activeLecture?.lecture?.secure_url}
                                            className="w-full h-full object-contain"
                                            controls
                                            controlsList="nodownload"
                                            autoPlay
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
                                            <Video size={64} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold italic">No video content available</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Lecture Info */}
                            <div className="p-8 glass-card rounded-3xl border border-slate-800 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black font-outfit text-white">
                                            {activeLecture?.title || "Welcome to the Course"}
                                        </h2>
                                        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">Module {currentVideo + 1}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700">
                                            <FileText size={18} /> Resources
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed text-lg italic">
                                    {activeLecture?.description || "Select a lecture from the list to start learning."}
                                </p>
                            </div>
                        </div>

                        {/* Playlist Sidebar */}
                        <aside className="space-y-6">
                            <div className="glass-card rounded-3xl border border-slate-800 flex flex-col h-[700px]">
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <List className="text-emerald-500" size={20} />
                                        <h3 className="text-xl font-black font-outfit">Playlist</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg">
                                        {lectures?.length || 0} Lectures
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-slate-500 font-bold italic">Loading modules...</div>
                                    ) : (
                                        lectures?.map((lecture, idx) => (
                                            <div key={lecture._id} className="relative group">
                                                <button
                                                    onClick={() => setCurrentVideo(idx)}
                                                    className={`w-full p-4 rounded-2xl flex items-start gap-4 transition-all duration-300 border ${
                                                        idx === currentVideo
                                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                                                    }`}
                                                >
                                                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                                                        idx === currentVideo ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
                                                    }`}>
                                                        {idx === currentVideo ? <Play size={14} fill="currentColor" /> : idx + 1}
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <h4 className="font-bold line-clamp-1 leading-tight">{lecture.title}</h4>
                                                        <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">12:45 • Video Module</p>
                                                    </div>
                                                    <ChevronRight size={18} className={`mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${idx === currentVideo ? 'opacity-100' : ''}`} />
                                                </button>
                                                
                                                {role === "ADMIN" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onLectureDelete(state?._id, lecture?._id);
                                                        }}
                                                        className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;

