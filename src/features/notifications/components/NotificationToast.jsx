import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, CheckCircle, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSocket } from '../../../core/config/socket';
import { pushNotification } from '../redux/NotificationSlice';

const ICONS = {
  ENROLLMENT_CREATED:   <BookOpen size={16} className="text-emerald-400" />,
  LECTURE_COMPLETED:    <CheckCircle size={16} className="text-blue-400" />,
  COURSE_COMPLETED:     <Award size={16} className="text-amber-400" />,
  QUIZ_SUBMITTED:       <Star size={16} className="text-cyan-400" />,
  ASSIGNMENT_GRADED:    <Zap size={16} className="text-orange-400" />,
};

/**
 * NotificationToast — real-time socket notification toasts.
 * Mount once in HomeLayout / AdminLayout.
 */
export default function NotificationToast() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((s) => s.auth);
  const [activeToasts, setActiveToasts] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const socket = getSocket();
    if (!socket) return;

    const handler = (notification) => {
      dispatch(pushNotification(notification));
      const toastId = notification._id ?? `t-${Date.now()}`;
      setActiveToasts((prev) => [...prev, { ...notification, toastId }]);
      setTimeout(() => {
        setActiveToasts((prev) => prev.filter((t) => t.toastId !== toastId));
      }, 5000);
    };

    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [isLoggedIn, dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((t) => (
          <motion.div
            key={t.toastId}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3
                       bg-[#0f172a]/95 backdrop-blur-xl border border-white/10
                       rounded-xl shadow-2xl shadow-black/40 max-w-[320px]"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              {ICONS[t.type] ?? <Zap size={16} className="text-slate-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium leading-relaxed">{t.message}</p>
              <p className="text-slate-500 text-[10px] mt-0.5 capitalize">
                {t.type?.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
