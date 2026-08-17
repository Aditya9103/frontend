/**
 * CheckoutFailure.jsx — Phase 7 state-aware payment failure page.
 *
 * Distinguishes:
 *   - FAILED status → payment was definitively rejected by Razorpay
 *   - Any other non-enrolled state → pending/unknown (should not be on this page normally)
 */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  HelpCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import { PAYMENT_STATUS } from "../redux/RazorpaySlice";

export default function CheckoutFailure() {
  const { status } = useSelector((s) => s.razorpay);
  const isPending = status !== PAYMENT_STATUS.FAILED && status !== PAYMENT_STATUS.IDLE;

  return (
    <HomeLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="relative mx-auto w-24 h-24"
          >
            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center
              ${isPending
                ? 'bg-amber-500/10 border border-amber-500/30'
                : 'bg-rose-500/10 border border-rose-500/30'}`}
            >
              {isPending
                ? <AlertTriangle size={42} className="text-amber-400" strokeWidth={1.5} />
                : <XCircle size={42} className="text-rose-400" strokeWidth={1.5} />}
            </div>
          </motion.div>

          {/* Message */}
          <div>
            <h1 className="text-3xl font-black font-outfit text-white">
              {isPending ? 'Payment Status Unclear' : 'Payment Unsuccessful'}
            </h1>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              {isPending
                ? "Your payment is pending confirmation. If money was deducted, it will be refunded automatically within 5–7 business days. Please check your email for updates."
                : "Your payment was not completed. No charges were made. You can try again or contact support if you're having trouble."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl
                         bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold
                         hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw size={16} /> Try Again
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl
                         bg-white/5 border border-white/10 text-slate-300 font-bold
                         hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={16} /> Go Home
            </Link>
            <a
              href="mailto:support@learnify.dev"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              <HelpCircle size={14} /> Contact support
            </a>
          </div>

          {/* Extra info for pending state */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-left"
            >
              <p className="text-amber-400 text-xs font-semibold mb-1">Why am I seeing this?</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Payment confirmation relies on a secure webhook from Razorpay. If the webhook was delayed or failed to reach our server, this page may appear even when the payment went through. Your access will be granted automatically once confirmed.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </HomeLayout>
  );
}