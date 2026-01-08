const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const CourseOverviewSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar placeholder */}
      <div className="h-16 bg-white border-b" />

      {/* Hero section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left hero content */}
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-32 bg-gray-700" />
              <Skeleton className="h-10 w-3/4 bg-gray-700" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                <Skeleton className="h-4 w-40 bg-gray-700" />
              </div>
              <Skeleton className="h-5 w-full bg-gray-700" />
              <Skeleton className="h-5 w-5/6 bg-gray-700" />

              <div className="flex gap-6 mt-4">
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
                <Skeleton className="h-4 w-28 bg-gray-700" />
              </div>
            </div>

            {/* Preview card */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>

            {/* Course content */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-56" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="flex gap-2 flex-wrap">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 space-y-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverviewSkeleton;
