import {
  Users,
  BookOpen,
  CheckCircle,
  Calendar,
  ChevronDown,
  Award,
  Clock,
  GraduationCap,
  Search,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "../../components/shared/Pagination";
import { getLearnerEnrollmentsForInstructor } from "../../services/instructorServices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import { formatDuration } from "../../utils/formats";
import { useNavigate } from "react-router-dom";

/* =====================================================
   TYPES (NEW STRUCTURE - flat enrollments)
===================================================== */

type EnrollmentStatus = "pending" | "active" | "cancelled" | "completed";

// interface Stats {
//   totalStudents: number;
//   completedStudents: number;
//   totalRevenue: number;
//   averageProgress: number;
// }

interface Enrollment {
  id: string;
  courseTitle: string;
  grossAmount: number;
  duration: number;
  thumbnail: string;
  paidAmount: number;
  progressPercentage: number;
  enrolledAt: Date;
  status: EnrollmentStatus;
  completedAt: Date;
  cancelledAt: Date;
  courseId:string
}

interface Learner {
  id: string;
  learner: {
    name: string;
    email: string;
    profilePic: string;
  };
  enrollments: Enrollment[];
}

/* =====================================================
   DERIVED UI TYPE FOR DISPLAY
===================================================== */

interface StudentSummary {
  learner: {
    id: string;
    name: string;
    email: string;
    profilePic: string;
  };
  enrollments: Enrollment[];
  totalCourses: number;
  completedCourses: number;
  totalRevenue: number;
  averageProgress: number;
}

/* =====================================================
   PAGE
===================================================== */

const InstructorStudentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  // const [stats, setStats] = useState<Stats>({
  //   totalStudents: 0,
  //   completedStudents: 0,
  //   totalRevenue: 0,
  //   averageProgress: 0,
  // });

  const [page, setPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  const limit = 5

  /* =====================================================
     TRANSFORM API DATA -> STUDENT SUMMARY
  ===================================================== */

  const transformLearnersToStudents = (learners: Learner[]): StudentSummary[] => {
    console.log(learners);
    return learners.map((learner) => {

      const enrollments = learner.enrollments;

      const totalCourses = enrollments.length;
      const completedCourses = enrollments.filter((e) => e.status === "completed").length;

      const totalRevenue = enrollments.reduce(
        (sum, e) => sum + e.paidAmount || 0,
        0
      );

      const averageProgress =
        enrollments.length > 0
          ? Math.round(
            enrollments.reduce(
              (sum, e) => sum + e.progressPercentage || 0,
              0
            ) / enrollments.length
          )
          : 0;
      console.log(totalCourses)
      console.log(completedCourses);
      console.log(totalRevenue);
      console.log(averageProgress);


      return {
        learner: {
          id: learner.id,
          name: learner.learner.name,
          email: learner.learner.email,
          profilePic: learner.learner.profilePic,
        },
        enrollments,
        totalCourses,
        completedCourses,
        totalRevenue,
        averageProgress,
      };
    });
  };

  /* =====================================================
     FETCH STATS
  ===================================================== */


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page on new search
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);


  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await dispatch(getLearnerStatsForInstructor()).unwrap();
  //       if (response.data) {
  //         setStats(response.data);
  //       }
  //     } catch (err) {
  //       toast.error(err as string);
  //     }
  //   };
  //   fetchStats();
  // }, [dispatch]);

  /* =====================================================
     FETCH LEARNERS
  ===================================================== */

  useEffect(() => {
    const fetchLearners = async () => {
      setLoading(true);
      try {
        const response = await dispatch(
          getLearnerEnrollmentsForInstructor({
            search: debouncedSearch,
            page,
            limit,
          })
        ).unwrap();
        console.log(response.data);


        if (response.data.learners) {
          const transformedStudents = transformLearnersToStudents(response.data.learners || []);
          console.log(transformedStudents);

          setStudents(transformedStudents);
          setTotalStudents(response.data.total || 1);
          setTotalPages(Math.ceil(response.data.total / limit))
        }
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchLearners();
  }, [dispatch, page, debouncedSearch]);

  /* =====================================================
     UTILITY FUNCTIONS
  ===================================================== */

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const relativeTime = (date: Date | null) => {
    if (!date) return "N/A";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    return diff === 0 ? "Today" : `${diff}d ago`;
  };

 


  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
        <div className="relative">
          <div className="animate-spin h-16 w-16 border-4 border-teal-200 border-t-teal-600 rounded-full" />
          <div className="absolute inset-0 animate-ping h-16 w-16 border-4 border-teal-300 rounded-full opacity-20" />
        </div>
      </div>
    );
  }

  /* =====================================================
     UI RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          font-family: 'Onest', system-ui, -apple-system, sans-serif;
        }
        
        .metric-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .metric-card:hover {
          transform: translateY(-4px);
        }
        
        .student-row {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .student-row:hover {
          transform: translateX(4px);
        }
        
        .enrollment-card {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .progress-bar {
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          to {
            left: 100%;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* HEADER with decorative elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -top-8 right-20 w-32 h-32 bg-cyan-100 rounded-full blur-3xl opacity-20" />

          <div className="relative">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg shadow-teal-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">My Students</h1>
            </div>
            <p className="text-slate-600 text-lg ml-14">Track learners across your courses</p>
          </div>
        </div>

        {/* STATS GRID with enhanced cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            gradient="from-violet-500 to-purple-600"
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            trend="+12%"
            trendPositive
          />
          <StatCard
            title="Active Learners"
            value={students}
            icon={TrendingUp}
            gradient="from-blue-500 to-cyan-600"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            trend="+8%"
            trendPositive
          />
          <StatCard
            title="Completed"
            value={stats.completedStudents}
            icon={CheckCircle}
            gradient="from-emerald-500 to-teal-600"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            trend="+5%"
            trendPositive
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={BarChart3}
            gradient="from-amber-500 to-orange-600"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            trend="+23%"
            trendPositive
          />
        </div> */}

        {/* <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 p-5 shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20" />
          <div className="relative flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Multi-Course Enrollments</p>
              <p className="text-sm text-blue-700 leading-relaxed">
                Students may enroll in multiple courses. Expand each student row to view detailed
                progress, quiz scores, and payment information across all their enrollments.
              </p>
            </div>
          </div>
        </div> */}

        {/* MAIN LIST CARD with glass morphism */}
        <div className="glass-card rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* FILTER TABS with enhanced design */}
          <div className="p-6 border-b border-slate-200/50 bg-white/50">
            <div className="flex items-center justify-between mb-4">


              <h2 className="text-xl font-bold text-slate-900">Students Directory</h2>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{totalStudents} students</span>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search learners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* <div className="flex space-x-2">
              {(["all", "active", "completed"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${
                      filter === key
                        ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }
                  `}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div> */}
          </div>

          {/* STUDENTS LIST */}
          <div className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((student, idx) => {
                const isOpen = expanded === student.learner.id;

                return (
                  <div
                    key={student.learner.id}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className="enrollment-card"
                  >
                    {/* STUDENT SUMMARY ROW */}
                    <div
                      onClick={() => setExpanded(isOpen ? null : student.learner.id)}
                      className="student-row p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-teal-50/30 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        {/* LEFT: Avatar + Info */}
                        <div className="flex items-center space-x-5">
                          {/* Avatar */}
                          <div className="relative group">
                            {student.learner.profilePic ? (
                              <img
                                src={student.learner.profilePic}
                                alt={student.learner.name}
                                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-100 group-hover:ring-teal-100 transition-all"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold ring-4 ring-slate-100 group-hover:ring-teal-100 transition-all shadow-lg">
                                {student.learner.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                          </div>

                          {/* Info */}
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">
                                {student.learner.name}
                              </h3>
                              {student.completedCourses > 0 && (
                                <div className="px-2 py-0.5 bg-emerald-100 rounded-full flex items-center space-x-1">
                                  <Award className="w-3 h-3 text-emerald-600" />
                                  <span className="text-xs font-semibold text-emerald-700">
                                    {student.completedCourses} completed
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{student.learner.email}</p>

                            {/* Mini stats */}
                            <div className="flex items-center space-x-4 mt-2 text-xs">
                              <span className="flex items-center space-x-1 text-slate-600">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="font-medium">{student.totalCourses} courses</span>
                              </span>
                              {/* <span className="flex items-center space-x-1 text-slate-600">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="font-medium">{student.activeCourses} active</span>
                              </span> */}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Stats + Expand */}
                        <div className="flex items-center space-x-6">
                          {/* Revenue */}
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Revenue</p>
                            <p className="text-xl font-bold text-slate-900">
                              {formatCurrency(student.totalRevenue)}
                            </p>
                          </div>

                          {/* Progress */}
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-2">Avg Progress</p>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="progress-bar h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"
                                  style={{ width: `${student.averageProgress}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-slate-700 w-10">
                                {student.averageProgress}%
                              </span>
                            </div>
                          </div>




                          {/* Expand Icon */}
                          <div
                            className={`p-2 rounded-xl transition-all duration-200 ${isOpen
                              ? "bg-teal-100 text-teal-600 rotate-180"
                              : "bg-slate-100 text-slate-400"
                              }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED ENROLLMENTS */}
                    {isOpen && (
                      <div className="bg-gradient-to-b from-slate-50 to-white px-6 pb-6 pt-2 space-y-3">
                        <div className="flex items-center space-x-2 mb-3">
                          <BookOpen className="w-4 h-4 text-slate-500" />
                          <h4 className="text-sm font-semibold text-slate-700">
                            Course Enrollments ({student.enrollments.length})
                          </h4>
                        </div>

                        {student.enrollments.map((e, eIdx) => {
                          
                          const progress = e.progressPercentage || 0;
                          const paidAmount = e.paidAmount || 0;

                          return (
                            <div
                              key={e.id}
                              style={{ animationDelay: `${eIdx * 50}ms` }}
                              className="enrollment-card bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all hover:border-teal-200"
                            >
                              <div className="flex items-start justify-between">
                                {/* LEFT: Course Info */}
                                <div className="flex items-start space-x-4 flex-1">
                                  <img
                                    src={e.thumbnail}
                                    alt={e.courseTitle}
                                    className="w-24 h-16 object-cover rounded-lg border-2 border-slate-100 shadow-sm"
                                  />

                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h5 className="font-bold text-slate-900">{e.courseTitle}</h5>
                                      {/* <span
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1 ${statusConfig.className}`}
                                      >
                                        <div
                                          className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                                        />
                                        <StatusIcon className="w-3 h-3" />
                                        <span>{statusConfig.label}</span>
                                      </span> */}
                                    </div>

                                    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                                      <span className="flex items-center space-x-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Enrolled {relativeTime(e.enrolledAt)}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{formatDuration(e.duration)} min</span>
                                      </span>
                                    </div>

                                    {e.status === "active" && (
                                      <div>
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                          <span className="text-slate-600 font-medium">
                                            Progress
                                          </span>
                                          <span className="text-teal-600 font-bold">
                                            {progress}%
                                          </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div
                                            className="progress-bar h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-full shimmer"
                                            style={{ width: `${progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {e.status === "completed" && e.completedAt && (
                                      <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span className="font-medium">
                                          Completed {relativeTime(e.completedAt)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* RIGHT: Payment */}
                                <button
                                  onClick={() => navigate("/instructor/messages",{
                                    state: { 
                                      learnerId: student.learner.id,
                                      courseId:e.courseId
                                     }
                                })}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-600 transition-all"
                                  title="Message learner for this course"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                </button>

                                <div className="text-right ml-4">
                                  <p className="text-xs text-slate-500 mb-1">Paid Amount</p>
                                  <p className="text-2xl font-bold text-slate-900">
                                    {formatCurrency(paidAmount)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-16 text-center">
                <div className="inline-flex p-6 bg-slate-100 rounded-full mb-4">
                  <Users className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No students found</h3>
                {/* <p className="text-slate-500">
                  {filter === "all"
                    ? "You don't have any students yet"
                    : `No ${filter} students to display`}
                </p> */}
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {students.length > 0 && (
            <div className="p-6 border-t border-slate-200/50 bg-white/50">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorStudentsPage;

/* =====================================================
   ENHANCED STAT CARD
===================================================== */

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ElementType;
//   gradient: string;
//   iconBg: string;
//   iconColor: string;
//   trend?: string;
//   trendPositive?: boolean;
// }

// const StatCard = ({
//   title,
//   value,
//   icon: Icon,
//   gradient,
//   iconBg,
//   iconColor,
//   trend,
//   trendPositive,
// }: StatCardProps) => (
//   <div className="metric-card group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50">
//     {/* Gradient overlay on hover */}
//     <div
//       className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
//     />

//     {/* Decorative blur */}
//     <div
//       className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}
//     />

//     <div className="relative">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 ${iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
//           <Icon className={`w-6 h-6 ${iconColor}`} />
//         </div>
//         {trend && (
//           <span
//             className={`text-xs font-bold px-2 py-1 rounded-lg ${trendPositive
//               ? "text-emerald-600 bg-emerald-50"
//               : "text-rose-600 bg-rose-50"
//               }`}
//           >
//             {trend}
//           </span>
//         )}
//       </div>

//       <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
//       <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
//     </div>
//   </div>
// );