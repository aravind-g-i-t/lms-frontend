export const QuizSkeleton = () => (
  <div className="min-h-screen bg-gray-900 p-6 animate-pulse">
    <div className="h-6 w-40 bg-gray-700 rounded mb-6" />
    <div className="h-3 w-full bg-gray-700 rounded mb-2" />
    <div className="h-3 w-5/6 bg-gray-700 rounded mb-6" />

    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-700 rounded mb-3" />
    ))}
  </div>
);
