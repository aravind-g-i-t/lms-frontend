import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, Search, Star } from "lucide-react";
import { toast } from "react-toastify";

import type { AppDispatch } from "../../redux/store";
import { formatDuration } from "../../utils/formats";
import { getFavourites, removeFromFavourites } from "../../services/learnerServices";

interface FavouriteCourse {
  id: string;
  title: string;
  thumbnail: string | null;
  level: string;
  category: { name: string };
  instructor: { id: string; name: string };
  description: string;
  duration: number;
  price: number;
  rating: number | null;
  totalRatings: number | null;
  isFavourite: boolean;
}

const MyFavourites = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [courses, setCourses] = useState<FavouriteCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Fetch favourites
  useEffect(() => {
    const fetchFavs = async () => {
      try {
        setLoading(true);

        const result = await dispatch(
          getFavourites({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
          })
        ).unwrap();
        console.log(result);
        
        setCourses(result.data.courses);
        setTotalPages(result.data.pagination.totalPages);
        
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [dispatch, currentPage, debouncedSearch,totalPages]);

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Remove favourite
  const handleRemoveFromFavourites = async (courseId: string) => {
    try {
      await dispatch(removeFromFavourites({courseId})).unwrap();
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success("Removed from favourites");
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <div className="space-y-6">

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search favourites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          No favourite courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border hover:shadow-teal-400/40 hover:shadow-2xl hover:-translate-y-1 hover:border-teal-400 transition-transform flex flex-col group overflow-hidden relative w-full"
              title={course.title}
            >
              {/* Thumbnail */}
              <div className="relative w-full">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover transition group-hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-teal-50 text-teal-200">
                    No image
                  </div>
                )}

                <div className="absolute top-2 right-2 z-10">
                  <Heart
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromFavourites(course.id);
                    }}
                    className="w-6 h-6 text-red-500 fill-red-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Badges */}
                <div className="flex gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm 
                    ${
                      course.level === "beginner"
                        ? "bg-blue-50 text-blue-600"
                        : course.level === "intermediate"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-orange-100 text-orange-900"
                    }`}
                  >
                    {course.level}
                  </span>

                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                    {course.category.name}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-lg text-gray-900 group-hover:text-teal-700 line-clamp-1 mb-1"
                  title={course.title}
                >
                  {course.title}
                </h3>

                <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
                  By{" "}
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                    {course.instructor.name}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-1">
                  {course.description}
                </p>

                {/* Info */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      fill="currentColor"
                      className="w-4 h-4 text-teal-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm0 14.5A6.5 6.5 0 1116.5 10 6.51 6.51 0 0110 16.5zm.75-6.44L13 9.25a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75h2.25a.75.75 0 000-1.5H10.75V10.06z" />
                    </svg>
                    {formatDuration(course.duration)}
                  </span>

                  <span className="text-teal-600 font-extrabold text-base">
                    ₹{course.price}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {course.rating ? Number(course.rating).toFixed(1) : "N/A"}
                    <span className="ml-1 text-gray-500">
                      ({course.totalRatings ?? 0})
                    </span>
                  </span>
                </div>

                {/* View Button */}
                <Link to={`/course/${course.id}`}>
                  <button className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition shadow">
                    View Course
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!!totalPages && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyFavourites;
