import { Play } from 'lucide-react';
import React from 'react';

const PlaylistTab = ({ lectures, currentVideo, setCurrentVideo }) => {
    return (
        <div className="xl:hidden space-y-4">
            {lectures?.map((lecture, index) => (
                <div key={lecture._id} onClick={() => setCurrentVideo(index)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${currentVideo === index ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-black/50 border-white/5 hover:bg-white/5'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentVideo === index ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-500'}`}>
                        <Play size={18} fill={currentVideo === index ? "currentColor" : "none"} className={currentVideo === index ? 'ml-1' : ''} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{lecture.sectionTitle || `Module ${index + 1}`}</p>
                        <h3 className={`font-bold text-sm ${currentVideo === index ? 'text-yellow-500' : 'text-gray-300'}`}>{lecture.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlaylistTab;
