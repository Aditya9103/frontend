/**
 * Skeleton.jsx — Phase 8 enhanced skeleton system
 *
 * Phase 8 note: Cache hits are fast (~5ms), cache misses slower (~200ms+).
 * The skeleton prevents jarring inconsistency between the two cases.
 * All catalog and dashboard loads should use these skeletons.
 */

// ── Base Skeleton ──────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800/80 rounded-md ${className}`} />
);

// ── Course card skeleton (catalog / dashboard) ─────────────────────────────────
export const CourseCardSkeleton = () => (
  <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] space-y-5">
    <Skeleton className="aspect-video w-full rounded-3xl" />
    <div className="space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-9 w-28 rounded-xl" />
      <Skeleton className="h-5 w-14" />
    </div>
  </div>
);

// ── Lecture row skeleton (sidebar playlist) ────────────────────────────────────
export const LectureSkeleton = () => (
  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
    <Skeleton className="w-12 h-12 flex-shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

// ── Dashboard stat card skeleton ───────────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

// ── Notification skeleton ──────────────────────────────────────────────────────
export const NotificationSkeleton = () => (
  <div className="flex items-start gap-3 px-4 py-3">
    <Skeleton className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-2.5 w-1/4" />
    </div>
  </div>
);

// ── Generic catalog grid ───────────────────────────────────────────────────────
export const CatalogGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CourseCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
