/**
 * hasPermission.js — Client-side permission check helpers
 *
 * Mirrors the backend's RolePermissions model for UI-layer gating:
 * hiding/showing buttons, protecting routes, conditional rendering.
 *
 * IMPORTANT: these helpers are for UX only — never for security enforcement.
 * The backend's authorize() middleware is the authoritative gate.
 * A user cannot bypass the backend by manipulating Redux state.
 *
 * Usage:
 *   import { hasPermission, hasAnyPermission } from '@/shared/utils/hasPermission';
 *
 *   // Route guard
 *   <RequirePermission perm={Perms.COURSE_EDIT}>
 *     <ManageCurriculum />
 *   </RequirePermission>
 *
 *   // Conditional UI
 *   {hasPermission(user.permissions, Perms.COURSE_CREATE) && <PublishButton />}
 */

/**
 * Returns true if the user has the specific permission.
 *
 * @param {string[]} userPermissions - from Redux auth state (user.permissions)
 * @param {string}   permission      - e.g. 'course:edit'
 */
export const hasPermission = (userPermissions = [], permission) =>
  Array.isArray(userPermissions) && userPermissions.includes(permission);

/**
 * Returns true if the user has at least one of the given permissions.
 * Use for UI that's accessible to multiple roles (e.g. both ADMIN and SUPER_ADMIN).
 *
 * @param {string[]} userPermissions
 * @param {string[]} permissions     - any match returns true
 */
export const hasAnyPermission = (userPermissions = [], permissions = []) =>
  permissions.some((p) => hasPermission(userPermissions, p));

/**
 * Returns true if the user has ALL the given permissions.
 *
 * @param {string[]} userPermissions
 * @param {string[]} permissions     - all must match
 */
export const hasAllPermissions = (userPermissions = [], permissions = []) =>
  permissions.every((p) => hasPermission(userPermissions, p));

/**
 * Permission constants — mirrors backend's permissions.constants.js.
 * Keep in sync when new permissions are added to the backend registry.
 */
export const Perms = {
  // Courses
  COURSE_CREATE:        'course:create',
  COURSE_EDIT:          'course:edit',
  COURSE_DELETE:        'course:delete',
  COURSE_PUBLISH:       'course:publish',
  COURSE_VIEW_DRAFTS:   'course:view_drafts',

  // Users
  USER_VIEW:            'user:view',
  USER_MANAGE:          'user:manage',
  USER_BAN:             'user:ban',

  // Analytics
  ANALYTICS_VIEW:       'analytics:view',

  // Payments
  PAYMENT_VIEW:         'payment:view',
  PAYMENT_REFUND:       'payment:refund',

  // Content
  BLOG_CREATE:          'blog:create',
  BLOG_MODERATE:        'blog:moderate',

  // Grading
  GRADE_ASSIGN:         'grade:assign',

  // System
  SYSTEM_HEALTH:        'system:health',
  AUDIT_LOG_VIEW:       'audit_log:view',
  AUDIT_LOG_DELETE:     'audit_log:delete',
};
