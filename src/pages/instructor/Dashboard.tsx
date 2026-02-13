import {
  BookOpen,
  Users,
  TrendingUp,
  // DollarSign,
  Calendar,
  Clock,
  Video,
  Star,
  Eye,
  // FileText,
  // Activity,
  // Award,
  // ArrowUp,
  // ArrowDown,
  // IndianRupee,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { getInstructorDashboard } from '../../services/instructorServices';

interface DashboardStats {
  totalCourses: number;
  totalEnrollments: number;
  totalEarnings: number;
  pendingEarnings: number;
  averageRating: number;
  totalRatings: number;
  upcomingLiveSessions: number;
}

// interface RecentActivity {
//   id: string;
//   type: 'enrollment' | 'review' | 'earning' | 'live_session';
//   message: string;
//   timestamp: Date;
//   metadata?: {
//     courseTitle?: string;
//     amount?: number;
//     rating?: number;
//     learnerName?: string;
//   };
// }

interface Course {
  id: string;
  title: string;
  enrollmentCount: number;
  rating: number|null;
  thumbnail: string;
}

interface Session {
  id: string;
  courseTitle: string;
  scheduledAt: Date;
  durationInMinutes: number;
  status: string;
}

const InstructorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats|null>(null);

  const [upcomingSessions,setUpcomingSessions]=useState<Session[]|null>(null);

  const [topCourses,setTopCourses]=useState<Course[]|null>(null);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response= await dispatch(getInstructorDashboard()).unwrap();
        setStats(response.data.stats);
        setTopCourses(response.data.topCourses)
        setUpcomingSessions(response.data.upcomingSessions)
        setLoading(false);
      } catch (err) {
        toast.error(err as string);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // const formatRelativeTime = (date: Date) => {
  //   const now = new Date();
  //   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  //   if (diffInSeconds < 60) return 'Just now';
  //   if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  //   if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  //   return `${Math.floor(diffInSeconds / 86400)}d ago`;
  // };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  // const getActivityIcon = (type: string) => {
  //   switch (type) {
  //     case 'enrollment':
  //       return <Users className="w-4 h-4" />;
  //     case 'review':
  //       return <Star className="w-4 h-4" />;
  //     case 'earning':
  //       return <DollarSign className="w-4 h-4" />;
  //     case 'live_session':
  //       return <Video className="w-4 h-4" />;
  //     default:
  //       return <Activity className="w-4 h-4" />;
  //   }
  // };

  // const getActivityColor = (type: string) => {
  //   switch (type) {
  //     case 'enrollment':
  //       return 'bg-blue-100 text-blue-600';
  //     case 'review':
  //       return 'bg-yellow-100 text-yellow-600';
  //     case 'earning':
  //       return 'bg-green-100 text-green-600';
  //     case 'live_session':
  //       return 'bg-purple-100 text-purple-600';
  //     default:
  //       return 'bg-gray-100 text-gray-600';
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  if(!stats) return

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
        </div>
        {/* <Link
          to="/instructor/courses/create"
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Create Course
        </Link> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            {/* <span className="flex items-center text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              12%
            </span> */}
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Courses</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            {/* <span className="flex items-center text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              18%
            </span> */}
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Enrollments</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments.toLocaleString()}</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            {/* <span className="flex items-center text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              23%
            </span> */}
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Pending: {formatCurrency(stats.pendingEarnings)}
          </p>
        </div>

        {/* Average Rating */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            {/* <span className="flex items-center text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              0.3
            </span> */}
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Average Rating</h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{stats.averageRating?stats.averageRating.toFixed(1):"N/A"}</p>
            <span className="text-gray-500 ml-2 text-sm">/ 5.0</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{stats.totalRatings} ratings</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Courses */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Performing Courses</h2>
            <Link
              to="/instructor/courses"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </Link>
          </div>

          {topCourses && topCourses.length &&<div className="space-y-4">
            {topCourses.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrollmentCount}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {course.rating?course.rating.toFixed(1):"N/A"}
                    </div>
                    {/* <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {formatCurrency(course.earnings)}
                    </div> */}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>}
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/instructor/activity"
            className="block mt-6 text-center text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View All Activity
          </Link>
        </div> */}
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Live Sessions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Live Sessions</h2>
            <Link
              to="/instructor/live-sessions"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </Link>
          </div>

          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg mr-4">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.courseTitle}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateTime(session.scheduledAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.durationInMinutes} min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming sessions scheduled</p>
              <Link
                to="/instructor/live-sessions"
                className="inline-block mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Schedule a Session
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/instructor/courses/create"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors group"
            >
              <BookOpen className="w-8 h-8 text-gray-400 group-hover:text-teal-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                Create Course
              </span>
            </Link>

            <Link
              to="/instructor/live-sessions"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <Video className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                Schedule Session
              </span>
            </Link>

            <Link
              to="/instructor/wallet"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                View Earnings
              </span>
            </Link>

            <Link
              to="/instructor/courses"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <Eye className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                My Courses
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;