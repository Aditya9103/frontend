import { ArrowLeft, Award } from 'lucide-react';
import React from 'react';

const LectureHeader = ({ navigate, state, currentVideo, lecturesLength, overallProgress, handleDownloadCertificate }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-black font-outfit text-white leading-tight">{state?.title}</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                        Module {currentVideo + 1} of {lecturesLength || 0}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
                {overallProgress === 100 && (
                    <button onClick={handleDownloadCertificate} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold text-xs uppercase tracking-widest transition-all">
                        <Award size={16} /> Certificate
                    </button>
                )}
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Progress</span>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                    <span className="text-sm font-black text-white">{overallProgress}%</span>
                </div>
            </div>
        </div>
    );
};

export default LectureHeader;
