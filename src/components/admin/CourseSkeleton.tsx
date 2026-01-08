const CourseSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>

      {/* Header */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-wrap gap-8">
            {/* Left */}
            <div className="flex-1 space-y-4 min-w-[60%]">
              <div className="flex gap-3">
                <div className="h-6 w-24 bg-gray-700 rounded-full" />
                <div className="h-6 w-32 bg-gray-700 rounded-full" />
              </div>

              <div className="h-10 w-3/4 bg-gray-700 rounded" />
              <div className="h-6 w-32 bg-gray-700 rounded" />

              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded" />
                <div className="h-4 w-5/6 bg-gray-700 rounded" />
                <div className="h-4 w-4/6 bg-gray-700 rounded" />
              </div>

              <div className="flex gap-6 mt-4">
                <div className="h-4 w-24 bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-700 rounded" />
                <div className="h-4 w-28 bg-gray-700 rounded" />
              </div>
            </div>

            {/* Right preview */}
            <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[420px]">
              <div className="aspect-video bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 w-48 bg-gray-300 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
              </div>
            </div>
          ))}

          {/* Modules skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 w-56 bg-gray-300 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 mb-3 bg-gray-50"
              >
                <div className="h-4 w-2/3 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-5 w-40 bg-gray-300 rounded mb-4" />
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-gray-200 rounded mb-2"
              />
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-5 w-40 bg-gray-300 rounded mb-4" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 rounded mb-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;
