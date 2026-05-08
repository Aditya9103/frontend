import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

function CourseDescription() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const { role, data } = useSelector((state) => state.auth);

    return (
        <HomeLayout>
            <div className="min-h-screen pt-20 pb-12 px-4 md:px-20 flex flex-col items-center justify-center text-white">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-800/30 p-8 rounded-3xl glass shadow-2xl relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="overflow-hidden rounded-2xl shadow-2xl border border-slate-700/50">
                            <img 
                                className="w-full h-[350px] object-cover transform hover:scale-105 transition-transform duration-500"
                                alt="thumbnail"
                                src={state?.thumbnail?.secure_url}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <p className="text-emerald-400 font-bold text-2xl">{state?.numberOfLectures}</p>
                                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Lectures</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <p className="text-emerald-400 font-bold text-2xl italic">Expert</p>
                                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{state?.createdBy}</p>
                            </div>
                        </div>

                        { role === "ADMIN" || data?.subscription?.status === "active" ? (
                            <button 
                                onClick={() => navigate("/course/displaylectures", {state: {...state}})} 
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 active:scale-95"
                            >
                                Continue Learning
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate("/checkout")} 
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 active:scale-95"
                            >
                                Enroll Now
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 relative z-10 flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-emerald-400 leading-tight">
                            {state?.title}
                        </h1>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                Course Description
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {state?.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-8">
                            <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-100 italic">Full Lifetime Access</p>
                                    <p className="text-sm text-slate-500">Learn at your own pace, anytime, anywhere.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>

    );
}

export default CourseDescription;