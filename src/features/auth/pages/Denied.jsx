/**
 * Denied.jsx — 403 Access Denied page
 *
 * Accepts an optional `reason` via React Router's location.state
 * (e.g. "Missing permission: course:edit") for context-specific messaging.
 * Falls back to a generic "Access Denied" copy if no reason is provided.
 */
import { ArrowLeft, Home,ShieldOff } from 'lucide-react';
import { useLocation,useNavigate } from 'react-router-dom';

function Denied() {
  const navigate = useNavigate();
  const location = useLocation();
  const reason = location.state?.reason;

  // Go back if there's history, otherwise go home
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-[#0f172a] px-6">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mb-8">
        <ShieldOff size={48} className="text-rose-500" />
      </div>

      {/* Heading */}
      <h1 className="text-8xl font-black text-white tracking-tight mb-4">403</h1>
      <p className="text-xl font-semibold text-gray-300 mb-2">Access Denied</p>

      {/* Contextual reason (shown only if provided) */}
      {reason && (
        <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
          {reason}
        </p>
      )}
      {!reason && (
        <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
          You don&apos;t have permission to view this page.
          If you believe this is a mistake, please contact your administrator.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
        >
          <Home size={18} /> Home
        </button>
      </div>
    </main>
  );
}

export default Denied;