import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Play, CheckCircle, ChevronRight,
  Search, Grid, List, Star,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../redux/store';
import { getEnrollments } from '../../redux/services/learnerServices';
import { formatDuration } from '../../utils/formats';

type ViewMode = 'grid' | 'list';

interface EnrolledCourse {
  id: string;
  courseTitle: string;
  courseId: string;
  thumbnail: string | null;
  instructor: { id: string; name: string };
  progressPercentage: number;
  totalChapters: number;
  completedChapters: number;
  lastAccessedAt: Date | null;
  enrolledAt: Date;
  duration: number;
  rating: number | null;
}

const MyCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // ------------------------------------------
  // 🔥 DEBOUNCE LOGIC
  // ------------------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ------------------------------------------
  // 🔥 Fetch courses (debounced)
  // ------------------------------------------
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const result = await dispatch(
          getEnrollments({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined
          })
        ).unwrap();

        setCourses(result.enrollments);

        const totalCount = result.totalCount;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));

      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [dispatch, currentPage, debouncedSearch]);

  // Reset page when search or viewMode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-teal-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-gray-300';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">

      {/* Search + View Toggle */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Course list */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search</p>
          <Link to="/explore" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
            Explore Courses <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : viewMode === 'grid' ? (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-gradient-to-br from-teal-400 to-teal-600">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.courseTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}

                {course.progressPercentage === 100 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{course.courseTitle}</h3>
                <p className="text-sm text-gray-500 mb-3">by {course.instructor.name}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{course.completedChapters}/{course.totalChapters} chapters</span>
                    <span>{course.progressPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(course.progressPercentage)}`}
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(course.duration)}
                  </div>
                  {course.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {course.rating}
                    </div>
                  )}
                </div>

                <Link
                  to={`/learner/courses/${course.courseId}/learn`}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  <Play className="w-4 h-4" />
                  {course.progressPercentage === 0 ? 'Start Learning' :
                   course.progressPercentage === 100 ? 'Review' : 'Continue'}
                </Link>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* LIST VIEW */
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md">
              <div className="flex gap-4">

                <div className="w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.courseTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white opacity-50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{course.courseTitle}</h3>
                      <p className="text-sm text-gray-500 mb-2">by {course.instructor.name}</p>
                    </div>

                    {course.progressPercentage === 100 && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  <div className="mb-3 max-w-md">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{course.completedChapters}/{course.totalChapters} chapters</span>
                      <span>{course.progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(course.progressPercentage)}`}
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(course.duration)}</span>
                    <span className="text-xs text-gray-500">Last accessed: {formatDate(course.lastAccessedAt)}</span>

                    <Link
                      to={`/learner/courses/${course.courseId}/learn`}
                      className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      {course.progressPercentage === 0 ? 'Start' :
                       course.progressPercentage === 100 ? 'Review' : 'Continue'}
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default MyCourses;
