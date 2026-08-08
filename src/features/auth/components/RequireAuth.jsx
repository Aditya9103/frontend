/**
 * RequireAuth.jsx — Route guard component
 *
 * Blocks access to protected routes based on authentication state and
 * fine-grained permissions (RBAC model matching the backend's authorize() middleware).
 *
 * Rendering logic:
 *  1. While authCheckComplete === false (silent refresh in-flight on mount):
 *     show a full-screen spinner — avoids flashing the Denied/Login page
 *     before the session is actually confirmed as invalid.
 *  2. Once the check completes:
 *     - Not logged in → <Navigate to="/login" state={{ from: location }} />
 *       (preserves the intended route for post-login redirect)
 *     - Logged in, but missing a required permission → <Navigate to="/denied" />
 *       (passes reason so Denied.jsx can show context-specific messaging)
 *     - Logged in + authorized → <Outlet /> (render child routes)
 *
 * Props:
 *   allowedPermissions {string[]}  (preferred) — permission strings from Perms constant
 *   allowedRoles       {string[]}  (legacy, tracked) — role strings, for routes not yet
 *                                  migrated to the permission model. Will be removed once
 *                                  RBAC_MIGRATION.md exceptions are fully closed.
 *
 * Usage (preferred):
 *   <Route element={<RequireAuth allowedPermissions={[Perms.COURSE_EDIT]} />}>
 *     <Route path="/manage-curriculum" element={<ManageCurriculum />} />
 *   </Route>
 *
 * Usage (legacy):
 *   <Route element={<RequireAuth allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
 *     ...
 *   </Route>
 */
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { hasPermission } from '../../../shared/utils/hasPermission';

function RequireAuth({ allowedPermissions = [], allowedRoles = [] }) {
  const { isLoggedIn, role, permissions, authCheckComplete } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // ── 1. Auth check still in-flight (silent refresh on mount) ─────────────────
  if (!authCheckComplete) {
    return (
      <div
        role="status"
        aria-label="Checking authentication…"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── 2. Not authenticated ─────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 3. Permission check (preferred path) ────────────────────────────────────
  if (allowedPermissions.length > 0) {
    const granted = allowedPermissions.some((perm) =>
      hasPermission(permissions, perm)
    );
    if (!granted) {
      return (
        <Navigate
          to="/denied"
          state={{ reason: `Missing permission: ${allowedPermissions.join(' or ')}` }}
          replace
        />
      );
    }
  }

  // ── 4. Legacy role check (tracked, to be migrated per RBAC_MIGRATION.md) ────
  if (allowedPermissions.length === 0 && allowedRoles.length > 0) {
    const roleGranted =
      role === 'SUPER_ADMIN' || // SUPER_ADMIN bypasses all role checks
      allowedRoles.includes(role);
    if (!roleGranted) {
      return <Navigate to="/denied" replace />;
    }
  }

  return <Outlet />;
}

export default RequireAuth;