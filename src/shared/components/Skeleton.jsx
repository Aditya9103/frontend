import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}></div>
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="p-6 glass-card rounded-[2.5rem] space-y-6">
      <Skeleton className="aspect-video w-full rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
};

export const LectureSkeleton = () => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

export default Skeleton;
