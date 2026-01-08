const DashboardContentSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Section header */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-300 rounded" />
        <div className="h-4 w-72 bg-gray-200 rounded" />
      </div>

      {/* Cards / list items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-4 space-y-4"
          >
            {/* Thumbnail */}
            <div className="h-32 w-full bg-gray-200 rounded-lg" />

            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-300 rounded" />

            {/* Subtitle */}
            <div className="h-3 w-1/2 bg-gray-200 rounded" />

            {/* Meta row */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContentSkeleton;
