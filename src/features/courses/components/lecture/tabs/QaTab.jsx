/**
 * QaTab.jsx — Phase 6 upgraded with:
 *   - Socket.IO live subscription: receives 'discussion:new' events for this lecture
 *   - Upvote questions (optimistic update)
 *   - Mark-answered by instructor/admin
 *   - Instructor badge on replies
 *   - "Answered" badge on resolved discussions
 */
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  ShieldCheck,
  ThumbsUp,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { getSocket } from '../../../../../core/config/socket';
import discussionService from '../../../../../core/services/discussion.service';

const QaTab = ({
  discussions: initialDiscussions,
  questionInput,
  setQuestionInput,
  handlePostQuestion,
  replyInputs,
  setReplyInputs,
  handlePostReply,
  seekToTime,
  formatTime,
  userData,
  courseId,
  lectureId,
}) => {
  // Local copy so we can push live socket updates without re-fetching
  const [discussions, setDiscussions] = useState(initialDiscussions || []);
  const [upvoting, setUpvoting] = useState({});

  // Keep in sync with parent re-fetches
  useEffect(() => {
    setDiscussions(initialDiscussions || []);
  }, [initialDiscussions]);

  // ── Socket: live discussion updates ────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !lectureId) return;

    const handleNewDiscussion = (data) => {
      if (data.lectureId !== lectureId) return;
      setDiscussions((prev) => {
        const exists = prev.some((d) => d._id === data._id);
        return exists
          ? prev.map((d) => (d._id === data._id ? data : d))
          : [data, ...prev];
      });
    };

    socket.on('discussion:new', handleNewDiscussion);
    socket.on('discussion:update', handleNewDiscussion);

    // Join the lecture room for scoped events
    socket.emit('join:lecture', { courseId, lectureId });
    return () => {
      socket.off('discussion:new', handleNewDiscussion);
      socket.off('discussion:update', handleNewDiscussion);
      socket.emit('leave:lecture', { courseId, lectureId });
    };
  }, [lectureId, courseId]);

  // ── Upvote handler ─────────────────────────────────────────────────────────
  const handleUpvote = async (discId) => {
    if (upvoting[discId]) return;
    setUpvoting((u) => ({ ...u, [discId]: true }));
    // Optimistic
    setDiscussions((prev) =>
      prev.map((d) =>
        d._id === discId
          ? { ...d, upvotes: (d.upvotes || 0) + 1 }
          : d
      )
    );
    try {
      await discussionService.upvoteQuestion(discId);
    } catch {
      // Revert on failure
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === discId
            ? { ...d, upvotes: Math.max(0, (d.upvotes || 1) - 1) }
            : d
        )
      );
      toast.error('Failed to upvote');
    } finally {
      setUpvoting((u) => ({ ...u, [discId]: false }));
    }
  };

  // ── Mark answered (instructor / admin only) ────────────────────────────────
  const canMarkAnswered = ['ADMIN', 'INSTRUCTOR', 'SUPER_ADMIN'].includes(userData?.role);

  const handleMarkAnswered = async (discId) => {
    try {
      await discussionService.markAnswered(discId);
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discId ? { ...d, resolved: true } : d))
      );
      toast.success('Marked as answered');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
          <MessageSquare size={20} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black font-outfit text-white">Community Q&A</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Discuss with Peers & Mentors</p>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Question input */}
      <div className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 focus-within:border-yellow-500/50 transition-all mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-black flex-shrink-0">
          {userData?.fullName?.charAt(0) || <UserIcon size={16} />}
        </div>
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handlePostQuestion()}
          placeholder="Ask a question about this lecture…"
          className="flex-1 bg-transparent px-2 text-sm outline-none text-white placeholder:text-gray-500"
        />
        <button
          onClick={handlePostQuestion}
          disabled={!questionInput.trim()}
          className="px-6 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed font-black text-[10px] uppercase tracking-widest flex-shrink-0 flex items-center gap-1.5"
        >
          <Send size={13} /> Post
        </button>
      </div>

      {/* Discussions */}
      <div className="space-y-5">
        <AnimatePresence initial={false}>
          {discussions.map((disc) => (
            <motion.div
              key={disc._id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`bg-white/5 border rounded-2xl p-5 space-y-4 ${disc.resolved ? 'border-emerald-500/20' : 'border-white/10'
                }`}
            >
              {/* Question row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-black flex-shrink-0">
                  {disc.user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-gray-200 text-sm truncate">{disc.user?.fullName || 'Anonymous'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(disc.createdAt).toLocaleDateString()}</span>
                    {disc.timestamp !== null && disc.timestamp !== undefined && (
                      <button
                        onClick={() => seekToTime(disc.timestamp)}
                        className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-black flex items-center gap-1 hover:bg-yellow-500 hover:text-black transition-all"
                      >
                        <Clock size={10} /> {formatTime(disc.timestamp)}
                      </button>
                    )}
                    {disc.resolved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black border border-emerald-500/20">
                        <CheckCircle2 size={10} /> Answered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{disc.question}</p>
                </div>

                {/* Upvote + mark answered */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => handleUpvote(disc._id)}
                    disabled={upvoting[disc._id]}
                    className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-yellow-400 transition-colors disabled:opacity-50"
                    title="Upvote"
                  >
                    <ThumbsUp size={14} />
                    <span className="text-[10px] font-bold">{disc.upvotes || 0}</span>
                  </button>
                  {canMarkAnswered && !disc.resolved && (
                    <button
                      onClick={() => handleMarkAnswered(disc._id)}
                      className="text-gray-500 hover:text-emerald-400 transition-colors"
                      title="Mark as Answered"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              {disc.replies?.length > 0 && (
                <div className="ml-14 space-y-3">
                  {disc.replies.map((reply, idx) => {
                    const isInstructor = ['ADMIN', 'INSTRUCTOR', 'SUPER_ADMIN'].includes(reply.user?.role);
                    return (
                      <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-xl border ${isInstructor ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-black/30 border-white/5'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${isInstructor ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {reply.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-300 truncate">{reply.user?.fullName || 'Anonymous'}</span>
                            {isInstructor && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded-full border border-yellow-500/20">
                                <ShieldCheck size={9} /> Instructor
                              </span>
                            )}
                            <span className="text-[10px] text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-400 break-words whitespace-pre-wrap">{reply.reply}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reply input */}
              <div className="ml-14 flex gap-2">
                <input
                  type="text"
                  value={replyInputs[disc._id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [disc._id]: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostReply(disc._id)}
                  placeholder="Write a reply…"
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:border-yellow-500/50 transition-all text-white placeholder:text-gray-600"
                />
                <button
                  onClick={() => handlePostReply(disc._id)}
                  disabled={!replyInputs[disc._id]?.trim()}
                  className="px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {discussions.length === 0 && (
          <div className="py-16 flex flex-col items-center text-gray-500 space-y-4">
            <MessageSquare size={48} className="opacity-20" />
            <p className="font-bold">No questions yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QaTab;
