import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../redux/NotificationSlice';

// Notification type → color/icon mapping
const TYPE_CONFIG = {
  USER_REGISTERED:     { color: 'bg-violet-500',  dot: 'bg-violet-400' },
  ENROLLMENT_CREATED:  { color: 'bg-emerald-500', dot: 'bg-emerald-400' },
  LECTURE_COMPLETED:   { color: 'bg-blue-500',    dot: 'bg-blue-400' },
  COURSE_COMPLETED:    { color: 'bg-amber-500',   dot: 'bg-amber-400' },
  QUIZ_SUBMITTED:      { color: 'bg-cyan-500',    dot: 'bg-cyan-400' },
  ASSIGNMENT_SUBMITTED:{ color: 'bg-rose-500',    dot: 'bg-rose-400' },
  ASSIGNMENT_GRADED:   { color: 'bg-orange-500',  dot: 'bg-orange-400' },
};

const getConfig = (type) => TYPE_CONFIG[type] ?? { color: 'bg-slate-500', dot: 'bg-slate-400' };

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { list, unreadCount, loading } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch on first open
  useEffect(() => {
    if (open && list.length === 0) dispatch(fetchNotifications());
  }, [open]);

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    dispatch(markNotificationRead(id));
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-slate-300" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full px-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-[380px] max-h-[520px] flex flex-col
                       bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl
                       shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <p className="text-white font-semibold font-outfit text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <p className="text-slate-400 text-xs">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllNotificationsRead())}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {loading && list.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="animate-spin text-slate-500" />
                </div>
              ) : list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Bell size={28} className="text-slate-700" />
                  <p className="text-slate-500 text-sm">All caught up!</p>
                </div>
              ) : (
                <ul>
                  {list.map((n) => {
                    const cfg = getConfig(n.type);
                    return (
                      <motion.li
                        key={n._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 
                                    hover:bg-white/5 transition-colors cursor-default
                                    ${!n.read ? 'bg-white/[0.03]' : ''}`}
                      >
                        {/* Color dot */}
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot} ${n.read ? 'opacity-30' : ''}`} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-200'}`}>
                            {n.message}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>

                        {/* Mark read */}
                        {!n.read && (
                          <button
                            onClick={(e) => handleMarkRead(n._id, e)}
                            className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-emerald-400 transition-colors"
                            title="Mark as read"
                          >
                            <Check size={13} />
                          </button>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <button
                onClick={() => { dispatch(fetchNotifications()); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
