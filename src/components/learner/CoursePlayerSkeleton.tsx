const CoursePlayerSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col animate-pulse">
      {/* Top Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-gray-600 rounded" />
          <div className="hidden sm:block">
            <div className="h-4 w-48 bg-gray-600 rounded mb-1" />
            <div className="h-3 w-32 bg-gray-700 rounded" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-teal-500 rounded-full" />
          </div>
          <div className="h-3 w-8 bg-gray-600 rounded" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video Skeleton */}
          <div className="bg-black flex items-center justify-center h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-gray-700" />
          </div>

          {/* Chapter Navigation */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="h-9 w-28 bg-gray-700 rounded-lg" />
            <div className="h-9 w-40 bg-gray-700 rounded-lg" />
            <div className="h-9 w-28 bg-gray-700 rounded-lg" />
          </div>

          {/* Chapter Content */}
          <div className="flex-1 overflow-y-auto bg-gray-850">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <div>
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-3" />
                <div className="h-4 w-full bg-gray-700 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-700 rounded" />
              </div>

              <div className="flex gap-4">
                <div className="h-3 w-24 bg-gray-700 rounded" />
                <div className="h-3 w-32 bg-gray-700 rounded" />
              </div>

              <div className="border-b border-gray-700 mt-6" />

              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-700 rounded" />
                <div className="h-4 w-5/6 bg-gray-700 rounded" />
                <div className="h-4 w-4/6 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 bg-gray-800 border-r border-gray-700 flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="h-4 w-32 bg-gray-600 rounded mb-2" />
            <div className="h-3 w-40 bg-gray-700 rounded" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded" />
                <div className="h-3 w-2/3 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayerSkeleton;
