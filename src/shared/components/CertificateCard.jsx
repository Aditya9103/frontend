/**
 * CertificateCard.jsx — Phase 5
 *
 * Displays a single certificate earned by the learner.
 * Fetches the PDF URL from the backend:  GET /api/v1/certificates/:userId/:courseId
 * The Download button opens the server-generated PDF directly.
 * No client-side jsPDF / html2canvas on this path.
 */
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';

import axiosInstance from '../../core/config/axiosInstance';

export default function CertificateCard({ userId, courseId, courseTitle, date }) {
  const [certUrl, setCertUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCertificate = async () => {
    if (certUrl) {
      window.open(certUrl, '_blank');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/certificates/${userId}/${courseId}`);
      const url = res.data?.data?.url || res.data?.data?.certificate?.url;
      if (url) {
        setCertUrl(url);
        window.open(url, '_blank');
      } else {
        setError('Certificate not available yet.');
      }
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to load certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
        <Award size={24} className="text-amber-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white truncate">{courseTitle}</p>
        {date && (
          <p className="text-xs text-slate-500 mt-0.5">
            Completed {new Date(date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        )}
        {error && <p className="text-xs text-rose-400 mt-0.5">{error}</p>}
      </div>

      {/* Download button */}
      <button
        onClick={fetchCertificate}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-black transition-all disabled:opacity-60"
        title="Download Certificate"
      >
        {loading
          ? <Loader2 size={14} className="animate-spin" />
          : certUrl
            ? <ExternalLink size={14} />
            : <Download size={14} />
        }
        {loading ? 'Loading' : certUrl ? 'View' : 'Download'}
      </button>
    </motion.div>
  );
}
