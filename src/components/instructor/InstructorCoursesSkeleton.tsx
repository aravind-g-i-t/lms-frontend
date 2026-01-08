const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const InstructorCoursesSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-full max-w-md" />

      {/* Status tabs */}
      <div className="flex gap-6 border-b pb-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-20" />
        ))}
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl overflow-hidden shadow-sm"
          >
            {/* Thumbnail */}
            <Skeleton className="h-40 w-full rounded-none" />

            <div className="p-6 space-y-4">
              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Date */}
              <Skeleton className="h-3 w-32" />

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default InstructorCoursesSkeleton;
