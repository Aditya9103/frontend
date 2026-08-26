/**
 * PlaylistTab — Phase 5 updated
 * Shows per-lecture completion checkmark and a thin progress bar for in-progress lectures.
 * Accepts courseProgress prop (from userData.progress) to derive per-lecture watchedPercent.
 */
import { CheckCircle2, Play } from 'lucide-react';

const PlaylistTab = ({ lectures, currentVideo, setCurrentVideo, courseProgress }) => {
    const getLectureProgress = (lectureId) => {
        return courseProgress?.lectures?.find(l => l.lectureId === lectureId);
    };

    return (
        <div className="xl:hidden space-y-3">
            {lectures?.map((lecture, index) => {
                const lp = getLectureProgress(lecture._id);
                const pct = lp?.watchedPercent || 0;
                const isCompleted = lp?.completed || pct >= 90;
                const isActive = currentVideo === index;

                return (
                    <div
                        key={lecture._id}
                        onClick={() => setCurrentVideo(index)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                            isActive
                                ? 'bg-yellow-500/10 border-yellow-500/50'
                                : isCompleted
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-black/50 border-white/5 hover:bg-white/5'
                        }`}
                    >
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive
                                ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 text-gray-500'
                        }`}>
                            {isCompleted && !isActive
                                ? <CheckCircle2 size={18} />
                                : <Play size={18} fill={isActive ? 'currentColor' : 'none'} className={isActive ? 'ml-1' : ''} />
                            }
                        </div>

                        {/* Text + progress */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                                {lecture.sectionTitle || `Module ${index + 1}`}
                            </p>
                            <h3 className={`font-bold text-sm truncate ${
                                isActive ? 'text-yellow-500' : isCompleted ? 'text-emerald-400' : 'text-gray-300'
                            }`}>
                                {lecture.title}
                            </h3>
                            {/* Phase 5: thin progress bar for in-progress lectures */}
                            {pct > 0 && !isCompleted && (
                                <div className="mt-1.5 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PlaylistTab;
