/**
 * ActivityLogs.jsx — Phase 9 premium two-tab view
 *
 * Tab 1 — Engagement Events:  login, enrollment, quiz, lecture completion
 * Tab 2 — Audit Trail:        admin actions, permission changes, deletions
 *
 * Features:
 *   - Color-coded action badges (green=create, blue=view, orange=update, red=delete/auth)
 *   - Search/filter by action or email
 *   - Auto-refresh every 30s
 *   - Clean-up old logs (90d) with confirmation
 */
import { motion } from 'framer-motion';
import {
  Activity,
  AlertOctagon,
  BookOpen,
  Clock,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import superAdminService from '../../../core/services/superAdmin.service';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

// ── Action colour mapping ──────────────────────────────────────────────────────
const ACTION_COLOR = {
  LOGIN:         'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  LOGOUT:        'bg-slate-500/10 text-slate-400 border-slate-500/20',
  SIGNUP:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ENROLL:        'bg-violet-500/10 text-violet-400 border-violet-500/20',
  QUIZ:          'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LECTURE:       'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  COURSE:        'bg-teal-500/10 text-teal-400 border-teal-500/20',
  DELETE:        'bg-rose-500/10 text-rose-400 border-rose-500/20',
  PERMISSION:    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  default:       'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const getActionColor = (action = '') => {
  const key = Object.keys(ACTION_COLOR).find((k) => action.toUpperCase().includes(k));
  return ACTION_COLOR[key] || ACTION_COLOR.default;
};

// ── Audit vs Engagement classifier ────────────────────────────────────────────
const AUDIT_ACTIONS = ['DELETE', 'PERMISSION', 'BAN', 'ADMIN', 'ROLE', 'UPDATE_SETTINGS', 'APPROVE', 'REJECT'];
const isAudit = (log) => AUDIT_ACTIONS.some((a) => (log.action || '').toUpperCase().includes(a));

// ── Log row ────────────────────────────────────────────────────────────────────
const LogRow = ({ log }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-800/50 hover:bg-white/2 transition-colors"
  >
    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
      <div className="flex items-center gap-1.5">
        <Clock size={11} />
        {new Date(log.createdAt).toLocaleString()}
      </div>
    </td>
    <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">
      <div className="flex items-center gap-1.5">
        <User size={11} className="text-gray-500 flex-shrink-0" />
        {log.userId?.email || log.userId?.fullName || 'System'}
      </div>
    </td>
    <td className="px-4 py-3">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${getActionColor(log.action)}`}>
        {log.action}
      </span>
    </td>
    <td className="px-4 py-3 text-xs text-gray-400">{log.module}</td>
    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.description}</td>
    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{log.ip}</td>
  </motion.tr>
);

const ActivityLogs = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('engagement'); // 'engagement' | 'audit'
  const [search, setSearch] = useState('');
  const [logCount, setLogCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await superAdminService.getActivityLogs();
      if (response.data?.success) {
        setAllLogs(response.data.logs || []);
        setLastRefresh(new Date());
      }
    } catch {
      if (!silent) toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto-refresh every 30s
    const interval = setInterval(() => fetchLogs(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let base = allLogs.filter(activeTab === 'audit' ? isAudit : (l) => !isAudit(l));
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (l) =>
          (l.action || '').toLowerCase().includes(q) ||
          (l.userId?.email || '').toLowerCase().includes(q) ||
          (l.module || '').toLowerCase().includes(q) ||
          (l.description || '').toLowerCase().includes(q)
      );
    }
    return base;
  }, [allLogs, activeTab, search]);

  const handleCleanup = async () => {
    try {
      const res = await superAdminService.requestLogDeletion({ days: 90 });
      if (res.data?.success) {
        setLogCount(res.data.count);
        if (res.data.count > 0) {
          if (window.confirm(`Found ${res.data.count} logs older than 90 days. Approve deletion?`)) {
            const delRes = await superAdminService.executeLogDeletion({ dateLimit: res.data.dateLimit });
            toast.success(delRes.data.message);
            fetchLogs();
            setLogCount(0);
          }
        } else {
          toast.success('No old logs to delete.');
        }
      }
    } catch {
      toast.error('Failed to check logs.');
    }
  };

  const TABS = [
    { id: 'engagement', label: 'Engagement', icon: <Zap size={14} />, count: allLogs.filter((l) => !isAudit(l)).length },
    { id: 'audit',      label: 'Audit Trail', icon: <ShieldAlert size={14} />, count: allLogs.filter(isAudit).length },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Activity size={24} className="text-yellow-500" />
                <h1 className="text-2xl font-black font-outfit">System Activity Logs</h1>
              </div>
              <p className="text-xs text-gray-500">
                Last refreshed: {lastRefresh.toLocaleTimeString()} · auto-refreshes every 30s
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchLogs()}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-yellow-500/40 transition-all"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={handleCleanup}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all"
              >
                <Trash2 size={14} /> Clean Up Old Logs
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black/20' : 'bg-white/10'}`}>
                  {tab.count}
                </span>
              </button>
            ))}

            {/* Search */}
            <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs…"
                className="bg-transparent text-sm text-white outline-none placeholder:text-gray-600 w-48"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <RefreshCw size={24} className="animate-spin mr-3" /> Loading logs…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600 gap-3">
              <BookOpen size={40} className="opacity-20" />
              <p className="font-bold">No {activeTab === 'audit' ? 'audit' : 'engagement'} logs found.</p>
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead className="sticky top-0 bg-gray-950 z-10">
                <tr className="border-b border-gray-800">
                  {['Timestamp', 'User', 'Action', 'Module', 'Description', 'IP'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => <LogRow key={log._id} log={log} />)}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        <div className="flex-shrink-0 px-8 py-3 border-t border-gray-800 text-xs text-gray-600">
          Showing {filtered.length} of {allLogs.length} total logs
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
