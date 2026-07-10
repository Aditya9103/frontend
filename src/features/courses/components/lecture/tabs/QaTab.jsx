import React from 'react';
import { MessageSquare, Send, User as UserIcon, Clock } from 'lucide-react';

const QaTab = ({
    discussions,
    questionInput,
    setQuestionInput,
    handlePostQuestion,
    replyInputs,
    setReplyInputs,
    handlePostReply,
    seekToTime,
    formatTime,
    userData
}) => {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4 flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><MessageSquare size={20} /></div>
                <div>
                    <h2 className="text-xl font-black font-outfit text-white">Community Q&A</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Discuss with Peers & Mentors</p>
                </div>
            </div>

            {/* Input Box fixed at top */}
            <div className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 focus-within:border-yellow-500/50 transition-all flex-shrink-0 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-black flex-shrink-0">
                    {userData?.fullName?.charAt(0) || <UserIcon size={16} />}
                </div>
                <input 
                    type="text" 
                    value={questionInput} 
                    onChange={(e) => setQuestionInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handlePostQuestion()}
                    placeholder="Ask a question about this lecture..." 
                    className="flex-1 bg-transparent px-2 text-sm outline-none text-white placeholder:text-gray-500"
                />
                <button onClick={handlePostQuestion} disabled={!questionInput.trim()} className="px-6 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed font-black text-[10px] uppercase tracking-widest flex-shrink-0">
                    Post
                </button>
            </div>

            {/* Scrollable Discussions List */}
            <div className="space-y-6">
                {discussions.map((disc) => (
                    <div key={disc._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center font-black flex-shrink-0">
                                {disc.user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="font-bold text-gray-200 text-sm truncate">{disc.user?.fullName || 'Anonymous'}</span>
                                    <span className="text-[10px] text-gray-500 font-medium">
                                        {new Date(disc.createdAt).toLocaleDateString()}
                                    </span>
                                    {disc.timestamp !== null && (
                                        <button onClick={() => seekToTime(disc.timestamp)} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-black flex items-center gap-1 hover:bg-yellow-500 hover:text-black transition-all">
                                            <Clock size={10} /> {formatTime(disc.timestamp)}
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{disc.question}</p>
                            </div>
                        </div>

                        {disc.replies?.length > 0 && (
                            <div className="ml-14 space-y-3">
                                {disc.replies.map((reply, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-black/30 p-3.5 rounded-xl border border-white/5">
                                        <div className="w-8 h-8 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                                            {reply.user?.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-300 truncate">{reply.user?.fullName || 'Anonymous'}</span>
                                                <span className="text-[10px] text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 break-words whitespace-pre-wrap">{reply.reply}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="ml-14 flex gap-2">
                            <input 
                                type="text" 
                                value={replyInputs[disc._id] || ""}
                                onChange={(e) => setReplyInputs({...replyInputs, [disc._id]: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && handlePostReply(disc._id)}
                                placeholder="Write a reply..." 
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:border-yellow-500/50 transition-all text-white"
                            />
                            <button onClick={() => handlePostReply(disc._id)} disabled={!replyInputs[disc._id]?.trim()} className="px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 flex items-center justify-center flex-shrink-0">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                {discussions.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <MessageSquare size={48} className="opacity-20" />
                        <p className="font-bold">No questions yet. Be the first to start a discussion!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QaTab;
