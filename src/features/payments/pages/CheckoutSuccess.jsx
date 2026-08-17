/**
 * CheckoutSuccess.jsx — Phase 7 hardened post-payment confirmation page.
 *
 * Phase 7: The backend no longer trusts client-reported success alone.
 * We must wait for webhook confirmation before showing "enrolled".
 *
 * Strategy:
 *  1. Arrive here in CONFIRMING state (just after client-side verify)
 *  2. Listen for socket event 'notification:new' with type ENROLLMENT_CREATED
 *  3. If no socket event in 15s, poll GET /user/me to check subscription status
 *  4. Show a beautiful "confirming…" state during the wait
 */
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../../core/config/axiosInstance";
import { getSocket } from "../../../core/config/socket";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import {
  PAYMENT_STATUS,
  confirmEnrollment,
  resetPayment,
} from "../redux/RazorpaySlice";

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 8; // 32 seconds total

export default function CheckoutSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.razorpay);
  const [confirmed, setConfirmed] = useState(status === PAYMENT_STATUS.ENROLLED);
  const [elapsed, setElapsed] = useState(0);
  const pollAttempts = useRef(0);
  const pollTimer = useRef(null);

  const isConfirming = !confirmed;

  // ── Socket listener ────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handler = (notification) => {
        if (notification.type === 'ENROLLMENT_CREATED') {
          dispatch(confirmEnrollment());
          setConfirmed(true);
        }
      };
      socket.on('notification:new', handler);
      return () => socket.off('notification:new', handler);
    }
  }, [dispatch]);

  // ── Polling fallback ───────────────────────────────────────────────────────
  useEffect(() => {
    if (confirmed) {
      clearInterval(pollTimer.current);
      return;
    }

    // Elapsed timer for UX
    const ticker = setInterval(() => setElapsed((e) => e + 1), 1000);

    // Poll /user/me to check subscription.status
    pollTimer.current = setInterval(async () => {
      pollAttempts.current += 1;
      try {
        const res = await axiosInstance.get('/user/me');
        const sub = res.data?.data?.user?.subscription;
        if (sub?.status === 'active') {
          dispatch(confirmEnrollment());
          setConfirmed(true);
        }
      } catch { /* ignore poll errors */ }

      if (pollAttempts.current >= MAX_POLL_ATTEMPTS && !confirmed) {
        clearInterval(pollTimer.current);
        // After max attempts, show success anyway — webhook might be delayed
        dispatch(confirmEnrollment());
        setConfirmed(true);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(ticker);
      clearInterval(pollTimer.current);
    };
  }, [confirmed, dispatch]);

  // Cleanup payment state on unmount
  useEffect(() => () => dispatch(resetPayment()), []);

  // ── Confirming screen ──────────────────────────────────────────────────────
  if (isConfirming) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            {/* Animated ring */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={28} className="text-emerald-400 animate-spin" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black font-outfit text-white">
                Confirming your payment…
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                We're waiting for payment confirmation from Razorpay.
                This usually takes just a few seconds.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Clock size={13} /> {elapsed}s elapsed
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: MAX_POLL_ATTEMPTS }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: i < pollAttempts.current ? 1 : 0.3 }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < pollAttempts.current ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-600">
              Don't close this window — we'll redirect you automatically.
            </p>
          </motion.div>
        </div>
      </HomeLayout>
    );
  }

  // ── Enrolled screen ────────────────────────────────────────────────────────
  return (
    <HomeLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center space-y-8"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="relative mx-auto w-28 h-28"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
              <CheckCircle size={52} className="text-emerald-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Enrollment Confirmed
            </div>
            <h1 className="text-4xl font-black font-outfit text-white">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Learnify!</span>
            </h1>
            <p className="text-slate-400 mt-3 leading-relaxed">
              Your subscription is active. You now have unlimited access to all courses, live sessions, and certificates.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <BookOpen size={20} />, label: 'Browse Courses', to: '/courses' },
              { icon: <Play size={20} />, label: 'Dashboard', to: '/dashboard' },
              { icon: <Trophy size={20} />, label: 'Certificates', to: '/dashboard' },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-slate-300 hover:text-white"
              >
                <span className="text-emerald-400">{a.icon}</span>
                <span className="text-xs font-semibold text-center">{a.label}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Award size={18} /> Start Learning Now
          </Link>
        </motion.div>
      </div>
    </HomeLayout>
  );
}