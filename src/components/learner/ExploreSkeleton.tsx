const ExploreSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="w-40 h-10 bg-gray-200 rounded-lg" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-5 rounded-2xl shadow-xl border space-y-6">
            <div className="h-5 w-32 bg-gray-300 rounded" />

            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-28 bg-gray-300 rounded" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                ))}
              </div>
            ))}

            <div className="h-8 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Course Grid */}
        <div className="w-full lg:w-3/4">
          <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-40 w-full bg-gray-200" />

                <div className="p-6 space-y-3">
                  {/* Badges */}
                  <div className="flex gap-2">
                    <div className="h-4 w-16 bg-gray-300 rounded-full" />
                    <div className="h-4 w-20 bg-gray-300 rounded-full" />
                  </div>

                  {/* Title */}
                  <div className="h-5 w-3/4 bg-gray-300 rounded" />

                  {/* Instructor */}
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  </div>

                  {/* Meta */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-300 rounded" />
                  </div>

                  {/* Rating */}
                  <div className="h-3 w-24 bg-gray-200 rounded mt-2" />

                  {/* Button */}
                  <div className="h-10 w-full bg-gray-300 rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 bg-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSkeleton;
