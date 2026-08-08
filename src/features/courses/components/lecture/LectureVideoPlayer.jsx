import { AnimatePresence,motion } from 'framer-motion';
import { Bookmark, HelpCircle, Subtitles,Video } from 'lucide-react';
import React from 'react';

const LectureVideoPlayer = ({
    lectures,
    currentVideo,
    videoRef,
    state,
    handleTimeUpdate,
    handleLoadedMetadata,
    showCaptions,
    setShowCaptions,
    activeQuiz,
    setActiveQuiz,
    quizAnswers,
    handleQuizAnswer,
    handleQuizSubmit,
    formatTime,
    playbackRate,
    handleSpeedChange,
    handleAddBookmark
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-video bg-black rounded-[2rem] border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden group flex-shrink-0">
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none opacity-50 mix-blend-screen"></div>
                
                <AnimatePresence mode="wait">
                    {lectures?.length > 0 ? (
                        <motion.video
                            key={lectures[currentVideo]?._id}
                            ref={videoRef}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            initial={{ opacity: 0, scale: 0.98 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            src={lectures[currentVideo]?.lecture?.secure_url}
                            poster={state?.thumbnail?.secure_url}
                            autoPlay
                            className="relative w-full h-full object-contain z-10"
                            controls controlsList="nodownload" disablePictureInPicture
                        ></motion.video>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4 relative z-10">
                            <Video size={64} className="animate-pulse" />
                            <p className="text-xl font-bold font-outfit uppercase tracking-widest">No Content</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* CC Overlay */}
                {showCaptions && lectures?.length > 0 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-2xl text-sm font-medium max-w-[80%] text-center z-20 shadow-2xl">
                        <p className="italic">
                            {videoRef.current?.currentTime > 10 ? "[ Speaker is explaining the core concept of this module ]" : "[ Introduction to the lecture topic ]"}
                        </p>
                    </div>
                )}

                {/* In-Video Quiz Overlay */}
                <AnimatePresence>
                    {activeQuiz && (
                        <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(24px)" }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 p-6">
                            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 max-w-md w-full space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center border border-yellow-500/30">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-yellow-500/80 uppercase tracking-widest">Knowledge Check</p>
                                        <p className="text-sm font-bold text-white">at {formatTime(activeQuiz.timestamp)}</p>
                                    </div>
                                </div>
                                <p className="text-xl font-black font-outfit text-white leading-tight">{activeQuiz.question}</p>
                                <div className="space-y-3">
                                    {activeQuiz.options?.map((option, idx) => (
                                        <button key={idx} onClick={() => handleQuizAnswer(activeQuiz.timestamp, idx)} className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition-all ${quizAnswers[activeQuiz.timestamp] === idx ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30'}`}>
                                            <span className="mr-3 text-xs font-black uppercase opacity-50">{String.fromCharCode(65 + idx)}.</span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleQuizSubmit} className="flex-1 py-4 bg-yellow-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all">Submit Answer</button>
                                    <button onClick={() => { setActiveQuiz(null); if (videoRef.current) videoRef.current.play(); }} className="py-4 px-6 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Skip</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interactive Toolbar */}
            {lectures?.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/5 border border-white/10 rounded-[1.5rem] backdrop-blur-xl gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Speed</span>
                        <div className="flex bg-black/50 rounded-xl p-1 gap-1 border border-white/5">
                            {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                                <button key={rate} onClick={() => handleSpeedChange(rate)} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${playbackRate === rate ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}>
                                    {rate}x
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        <button onClick={handleAddBookmark} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 text-gray-300 hover:text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            <Bookmark size={14} /> Bookmark Moment
                        </button>
                        <button onClick={() => setShowCaptions(!showCaptions)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${showCaptions ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                            <Subtitles size={14} /> Captions {showCaptions ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureVideoPlayer;
