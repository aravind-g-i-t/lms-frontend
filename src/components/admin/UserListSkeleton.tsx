export const UserListSkeleton = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden animate-pulse">
      {/* Header */}
      <div className="mb-4">
        <div className="h-6 w-48 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded" />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-10 w-full md:w-64 bg-gray-200 rounded" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-300 rounded" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-8 w-20 bg-gray-300 rounded" />
              <div className="h-8 w-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <div className="h-8 w-8 bg-gray-300 rounded" />
        <div className="h-8 w-8 bg-gray-300 rounded" />
        <div className="h-8 w-8 bg-gray-300 rounded" />
      </div>
    </div>
  );
};