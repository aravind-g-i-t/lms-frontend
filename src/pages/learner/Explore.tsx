import { Search, Star, SlidersHorizontal } from "lucide-react";
import LearnerNav from "../../components/learner/LearnerNav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCoursesForLearners } from "../../redux/services/learnerServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { getCategoryOptions } from "../../redux/services/instructorServices";
import { formatDuration } from "../../utils/formats";

type CourseLevel = "beginner" | "intermediate" | "advanced";
type Category = { id: string; name: string; };
interface Course {
  id: string;
  title: string;
  instructor: { name: string; id: string; };
  category: Category;
  price: number;
  rating: number | null;
  duration: number;
  level: CourseLevel;
  description: string;
  thumbnail: string;
  totalRatings: string;
  isEnrolled:boolean;
  enrolledAt:Date |null;
}

const Explore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(9999999);
  const [minDuration, setMinDuration] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount,setTotalCount]= useState(1)

  const levels: CourseLevel[] = ["beginner", "intermediate", "advanced"];
  const ratings = [5, 4, 3, 2, 1];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const result = await dispatch(
          getCoursesForLearners({
            limit: 6,
            search,
            page,
            categoryIds,
            levels: selectedLevels,
            priceRange: [minPrice, maxPrice],
            durationRange: [minDuration * 60*60, maxDuration * 60*60],
            minRating,
            sort,
          })
        ).unwrap();
        setCourses(result.courses);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.totalCount)
        setError("");
      } catch (error) {
        toast.error(error as string);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [search, page, categoryIds, selectedLevels, minPrice, maxPrice, minRating, sort, minDuration, maxDuration, dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(getCategoryOptions()).unwrap();
        setCategories(response.data.categories);
      } catch (err) {
        toast.error(err as string);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const toggleCategorySelection = (categoryId: string) =>
    setCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );

  const toggleLevelSelection = (level: CourseLevel) =>
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );

  const clearFilters = () => {
    setCategoryIds([]);
    setSelectedLevels([]);
    setMinPrice(0);
    setMaxPrice(9999999);
    setMinDuration(0);
    setMaxDuration(50);
    setMinRating(0);
    setSearch("");
  };

  const filterCount =
    categoryIds.length +
    selectedLevels.length +
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < 9999999 ? 1 : 0) +
    (minDuration > 0 ? 1 : 0) +
    (maxDuration < 9999 ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50">
      <LearnerNav />
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-700 shadow focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
          </div>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="text-gray-600 w-5 h-5" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white shadow font-semibold"
            >
              <option value="latest">Latest</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Popularity</option>
              <option value="price_low">Lowest Price</option>
              <option value="price_high">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Responsive Sidebar + Courses */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white p-5 rounded-2xl shadow-xl border space-y-7 sticky top-10 h-fit">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded hover:bg-teal-100 font-medium shadow"
                  aria-label="Clear all filters"
                >
                  Clear All
                </button>
              </div>
              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={categoryIds.includes(cat.id)}
                        onChange={() => toggleCategorySelection(cat.id)}
                        className="text-teal-700 focus:ring-teal-500 accent-teal-600"
                      />
                      <span className="group-hover:text-teal-700 transition">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Levels */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Difficulty</h4>
                <div className="space-x-2 flex flex-wrap">
                  {levels.map((lvl) => (
                    <label key={lvl} className={`flex items-center gap-1 text-xs capitalize border rounded px-2 py-1 cursor-pointer ${selectedLevels.includes(lvl) ? "bg-teal-100 border-teal-400" : "bg-gray-50 border-gray-200"}`}>
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(lvl)}
                        onChange={() => toggleLevelSelection(lvl)}
                        className="hidden"
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Minimum Rating</h4>
                <div className="flex gap-2 flex-wrap">
                  {ratings.map((r) => (
                    <label key={r} className={`flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer ${minRating === r ? "bg-yellow-50 border-yellow-300" : "bg-gray-50 border-gray-200"}`}>
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="hidden"
                      />
                      <span className="flex items-center">
                        {Array.from({ length: r }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </span>
                      <span>& up</span>
                    </label>
                  ))}
                  <button
                    className={`text-xs px-2 py-1 rounded border font-medium ${minRating === 0 ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-gray-50 text-gray-600 border-gray-200"} ml-2`}
                    onClick={() => setMinRating(0)}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {/* Price */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Price Range (₹)</h4>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={minPrice}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded border text-sm text-gray-700 shadow focus:border-teal-400"
                    placeholder="Min"
                    aria-label="Minimum price"
                  />
                  <span className="mx-1 text-gray-400">–</span>
                  <input
                    type="number"
                    min={minPrice}
                    step={10}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded border text-sm text-gray-700 shadow focus:border-teal-400"
                    placeholder="Max"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              {/* Duration */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Duration (hours)</h4>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={maxDuration}
                    step={1}
                    value={minDuration}
                    onChange={e => setMinDuration(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded border text-sm text-gray-700 shadow focus:border-teal-400"
                    placeholder="Min"
                    aria-label="Minimum duration"
                  />
                  <span className="mx-1 text-gray-400">–</span>
                  <input
                    type="number"
                    min={minDuration}
                    max={9999}
                    step={1}
                    value={maxDuration}
                    onChange={e => setMaxDuration(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded border text-sm text-gray-700 shadow focus:border-teal-400"
                    placeholder="Max"
                    aria-label="Maximum duration"
                  />
                </div>
              </div>
              {filterCount > 0 && <div className="text-xs mt-3 text-teal-600 font-medium">{filterCount} filters applied</div>}
            </div>
          </div>

          {/* Cards grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-3 text-gray-600 font-medium">
              Showing {courses.length} of {totalCount} courses
            </div>
            {loading && (
              <div className="text-center py-10 text-gray-400 animate-pulse">Loading courses...</div>
            )}
            {error && (
              <div className="text-center py-10 text-red-500">{error}</div>
            )}
            {!loading && !error && (
              <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
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

                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Badges */}
                        <div className="flex gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm
                            ${course.level === "beginner" ? "bg-blue-50 text-blue-600" :
                              course.level === "intermediate" ? "bg-purple-100 text-purple-800" :
                                "bg-orange-100 text-orange-900"}`}>
                            {course.level}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{course.category.name}</span>
                        </div>
                        {/* Title and Instructor */}
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-700 line-clamp-1 mb-1" title={course.title}>
                          {course.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
                          By <span className="font-semibold text-gray-700 truncate max-w-[120px]" title={course.instructor.name}>{course.instructor.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-1">{course.description}</p>
                        {/* Info Row */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg fill="currentColor" className="w-4 h-4 text-teal-400" viewBox="0 0 20 20"><path d="M10 2a8 8 0 108 8 8 8 8 0 00-8-8zm0 14.5A6.5 6.5 0 1116.5 10 6.51 6.51 0 0110 16.5zm.75-6.44L13 9.25a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75h2.25a.75.75 0 000-1.5H10.75V10.06z"/></svg>
                            {formatDuration(course.duration)}
                          </span>
                          <span className="text-teal-600 font-extrabold text-base">₹{course.price}</span>
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {course.rating ? Number(course.rating).toFixed(1) : "N/A"}
                            <span className="ml-1 text-gray-500">({course.totalRatings ?? 0})</span>
                          </span>
                        </div>
                        <button className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition shadow">
                          View Course
                        </button>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">No courses found.</div>
                )}
              </div>
            )}
            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {[...Array(totalPages).keys()].map((p) => (
                <button
                  key={p + 1}
                  className={`px-3 py-2 rounded-lg font-semibold transition
                    ${page === p + 1
                      ? "bg-teal-600 text-white shadow-lg border-teal-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-300 border-gray-200"}
                  `}
                  style={page === p + 1 ? { boxShadow: "0 0 0 2px #14b8a6" } : {}}
                  onClick={() => setPage(p + 1)}
                  aria-label={`Go to page ${p + 1}`}
                >
                  {p + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
