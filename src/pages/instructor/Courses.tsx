import {
  Users,
  Plus,
  Edit,
  Star,
  Archive,
  Eye,
  Clock,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SearchBar } from '../../components/shared/SearchBar';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { getCoursesForInstructor } from '../../services/instructorServices';
import { toast } from 'react-toastify';
import { Pagination } from '../../components/shared/Pagination';
import { formatDuration } from '../../utils/formats';
import InstructorCoursesSkeleton from '../../components/instructor/InstructorCoursesSkeleton';

export type CourseStatus = "draft" | "published" | "archived";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type VerificationStatus = "not_verified" | "under_review" | "verified" | "rejected" | "blocked"

interface Course {
  id: string;
  title: string;
  enrollmentCount: number;
  level: CourseLevel;
  status: CourseStatus;
  duration: number; // in hours
  thumbnail: string;
  price: number;
  rating: number;
  createdAt: string;
  verification: {
    status: VerificationStatus
  }
}

const InstructorCourses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<Course[]>([])
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await dispatch(
          getCoursesForInstructor({
            page,
            search: searchQuery,
            status: selectedStatus,
            limit: 5
          })
        ).unwrap();
        console.log(response);

        setCourses(response.data.courses ?? []);
        setTotalPages(response.data.pagination.totalPages ?? 1);
        setCount(response.data.pagination.totalCount)
      } catch (err) {
        toast.error(err as string)
      }finally{
        setLoading(false)
      }
    };

    fetchCourses();

  }, [dispatch, page, searchQuery, selectedStatus]);

  const handleEdit = (id: string) => {
    navigate(`/instructor/courses/${id}/edit`)
  }

  const filteredCourses = selectedStatus === 'all'
    ? courses
    : courses.filter(course => course.status === selectedStatus);

  const getStatusConfig = (status: CourseStatus) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-gray-100 text-gray-800',
          icon: Edit
        };

      case 'published':
        return {
          label: 'Published',
          className: 'bg-green-100 text-green-800',
          icon: Eye
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-red-100 text-red-800',
          icon: Archive
        };
    }
  };

  const getLevelBadgeClass = (level: CourseLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
    }
  };

  // const getStatusCounts = () => {
  //   const counts: Record<'all' | CourseStatus, number> = {
  //     all: courses.length,
  //     draft: 0,
  //     under_review: 0,
  //     published: 0,
  //     archived: 0
  //   };

  //   courses.forEach(course => {
  //     counts[course.status]++;
  //   });

  //   return counts;
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
  return <InstructorCoursesSkeleton />;
}

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <Link to="/instructor/courses/create" className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Create New Course
        </Link>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <SearchBar
          value={searchQuery}
          placeholder="Search courses..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All' },
              { key: 'published', label: 'Published' },
              { key: 'draft', label: 'Draft' },
              { key: 'archived', label: 'Archived' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key as CourseStatus | 'all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedStatus === key
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {label} {(selectedStatus === key) ? "( " + count + " )" : ""}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const statusConfig = getStatusConfig(course.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-200">
                <img
                  src={course.thumbnail || '/images/learning.png'}
                  loading='lazy'
                  decoding='async'
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig.className}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeClass(course.level)}`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1.5 text-yellow-500 fill-yellow-500" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="font-semibold text-gray-500">{course.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Created {formatDate(course.createdAt)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 
             bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 
             transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={course.status === 'archived' || course.verification.status === "verified"}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <Link
                    to={`/instructor/courses/${course.id}/preview`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No courses found</div>
          <div className="text-gray-400 text-sm">
            {selectedStatus === 'all'
              ? "You haven't created any courses yet."
              : `No courses with "${getStatusConfig(selectedStatus as CourseStatus).label}" status.`
            }
          </div>
        </div>
      )}
      {/* Paginatgion */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>

  );
};

export default InstructorCourses;
