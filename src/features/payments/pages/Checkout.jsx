/**
 * Checkout.jsx — Phase 7 hardened checkout page.
 *
 * Phase 7 changes:
 *  - Generates a UUID v4 idempotency key before opening Razorpay
 *  - Stores the key in Redux and sends it with the verify call
 *  - After client-side verify: navigates to /checkout/success (CONFIRMING state)
 *  - CheckoutSuccess polls/listens until enrolled (webhook-confirmed)
 */
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  RefreshCw,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import {
  PAYMENT_STATUS,
  getRazorPayId,
  purchaseCourseBundle,
  resetPayment,
  setIdempotencyKey,
  setPaymentStatus,
  verifyUserPayment,
} from "../redux/RazorpaySlice";

const FEATURES = [
  { icon: <Zap size={16} />, text: "Unlimited course access for 1 year" },
  { icon: <Star size={16} />, text: "Expert-led live sessions & recordings" },
  { icon: <CheckCircle size={16} />, text: "Official certificates on completion" },
  { icon: <RefreshCw size={16} />, text: "Cancel anytime within 14 days for a refund" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { key: razorpayKey, subscription_id, status, idempotencyKey } = useSelector(
    (s) => s.razorpay
  );
  const { data: userData } = useSelector((s) => s.auth);

  const isLoading = status === PAYMENT_STATUS.INITIATING || !razorpayKey;

  useEffect(() => {
    async function load() {
      await dispatch(getRazorPayId());
      await dispatch(purchaseCourseBundle());
      // Phase 7: generate idempotency key once per checkout session
      dispatch(setIdempotencyKey(uuidv4()));
    }
    load();
    return () => dispatch(resetPayment());
  }, []);

  async function handleSubscription(e) {
    e.preventDefault();
    if (!razorpayKey || !subscription_id) {
      toast.error("Payment not initialised. Please refresh.");
      return;
    }

    dispatch(setPaymentStatus(PAYMENT_STATUS.PAYMENT_OPEN));

    const options = {
      key: razorpayKey,
      subscription_id,
      name: "Learnify Platform",
      description: "Annual Learning Subscription",
      image: "/logo.png",
      prefill: {
        name: userData?.fullName || "",
        email: userData?.email || "",
      },
      theme: { color: "#10b981" },
      modal: {
        ondismiss: () => {
          dispatch(setPaymentStatus(PAYMENT_STATUS.IDLE));
        },
      },
      handler: async function (response) {
        const paymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          razorpay_subscription_id: response.razorpay_subscription_id,
        };
        // Phase 7: pass idempotency key from Redux state
        const res = await dispatch(
          verifyUserPayment({ paymentData, idempotencyKey })
        );
        if (!res.error) {
          navigate("/checkout/success");
        } else {
          navigate("/checkout/fail");
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Plan Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={12} /> Most Popular Plan
              </div>
              <h1 className="text-4xl font-black font-outfit text-white leading-tight">
                Unlock Your Full
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {" "}Learning Potential
                </span>
              </h1>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                One subscription. Every course. Unlimited growth. Join 15,000+ learners already on their path.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="flex items-center gap-3 text-slate-300 text-sm"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    {f.icon}
                  </span>
                  {f.text}
                </motion.li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield size={14} className="text-emerald-500" /> 256-bit SSL
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock size={14} className="text-emerald-500" /> Razorpay Secured
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw size={14} className="text-emerald-500" /> 14-day refund
              </div>
            </div>
          </motion.div>

          {/* Right — Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-emerald-900/20 flex flex-col gap-6"
          >
            {/* Pricing */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">Annual Subscription</p>
              <div className="mt-2 flex items-end justify-center gap-1">
                <span className="text-5xl font-black font-outfit text-white">₹499</span>
                <span className="text-slate-400 text-sm mb-2">/year</span>
              </div>
              <p className="text-emerald-400 text-xs mt-1">Save 60% vs monthly billing</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Platform Access (12 months)</span>
                <span className="text-white">₹499</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Discount Applied</span>
                <span className="text-emerald-400">-₹749</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between font-bold">
                <span className="text-white">Total Today</span>
                <span className="text-white">₹499</span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              onClick={handleSubscription}
              disabled={isLoading || status === PAYMENT_STATUS.CONFIRMING}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-3
                         bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20
                         transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Preparing checkout…
                </>
              ) : (
                <>
                  <CreditCard size={18} /> Pay ₹499 Securely
                </>
              )}
            </motion.button>

            <p className="text-center text-xs text-slate-600 flex items-center justify-center gap-1">
              <Lock size={11} /> Secured by Razorpay · 256-bit encryption
            </p>

            {/* Loading state skeleton */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 size={12} className="animate-spin" />
                Fetching payment details…
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </HomeLayout>
  );
}