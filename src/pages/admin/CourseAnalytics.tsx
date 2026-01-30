import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Award,
  Star,
  BarChart3,
  Activity,
} from "lucide-react";
// import { getCourseAnalytics } from "../../services/adminServices";
import FallbackUI from "../../components/shared/FallbackUI";


type CourseLevel = "beginner" | "intermediate" | "advanced"
type CourseStatus = "draft" | "published" | "archived"


export interface CourseAnalyticsDTO {
  course: {
    id: string;
    title: string;
    level: CourseLevel;
    status: CourseStatus;
    price: number;
    thumbnail: string | null;
    rating: number | null;
    totalRatings: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };

  enrollmentStats: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
    trend: {
      date: string;
      enrollments: number;
      revenue: number;
    }[];
  };

  progressStats: {
    averageProgress: number;
    moduleAnalytics: {
      moduleId: string;
      title: string;
      completionRate: number;
      chapters: {
        chapterId: string;
        title: string;
        completionRate: number;
        averageTimeSpent: number;
        dropoffRate: number;
      }[];
    }[];
  };

  quizStats: {
    totalAttempts: number;
    passed: number;
    failed: number;
    notAttended: number;
    passRate: number;
    averageScore: number;
  } | null;

  topPerformers: {
    learnerId: string;
    learnerName: string;
    progressPercentage: number;
  }[];

  recentEnrollments: {
    learnerId: string;
    learnerName: string;
    enrolledAt: Date;
    progressPercentage: number;
  }[];
}


const MOCK_COURSE_ANALYTICS: CourseAnalyticsDTO = {
  course: {
    id: "course_mern_001",
    title: "Full Stack Web Development (MERN)",
    level: "beginner",
    status: "published",
    price: 1499,
    thumbnail: "/images/mern-course.png",
    rating: 4.4,
    totalRatings: 532,
    ratingDistribution: {
      5: 312,
      4: 141,
      3: 52,
      2: 17,
      1: 10,
    },
  },

  enrollmentStats: {
    total: 1248,
    active: 986,
    completed: 412,
    completionRate: 33.0,

    trend: [
      {
        date: "2025-01-01",
        enrollments: 120,
        revenue: 120 * 1499,
      },
      {
        date: "2025-01-08",
        enrollments: 180,
        revenue: 180 * 1499,
      },
      {
        date: "2025-01-15",
        enrollments: 240,
        revenue: 240 * 1499,
      },
      {
        date: "2025-01-22",
        enrollments: 310,
        revenue: 310 * 1499,
      },
      {
        date: "2025-01-29",
        enrollments: 398,
        revenue: 398 * 1499,
      },
    ],
  },

  progressStats: {
    averageProgress: 58,

    moduleAnalytics: [
      {
        moduleId: "mod_html",
        title: "HTML & CSS Fundamentals",
        completionRate: 82,
        chapters: [
          {
            chapterId: "ch_html",
            title: "HTML Basics",
            completionRate: 90,
            averageTimeSpent: 1530,
            dropoffRate: 10,
          },
          {
            chapterId: "ch_css",
            title: "CSS Basics",
            completionRate: 84,
            averageTimeSpent: 2040,
            dropoffRate: 16,
          },
        ],
      },
      {
        moduleId: "mod_js",
        title: "JavaScript Deep Dive",
        completionRate: 64,
        chapters: [
          {
            chapterId: "ch_js",
            title: "JavaScript Fundamentals",
            completionRate: 72,
            averageTimeSpent: 3060,
            dropoffRate: 28,
          },
          {
            chapterId: "ch_async",
            title: "Async JavaScript",
            completionRate: 58,
            averageTimeSpent: 3570,
            dropoffRate: 42,
          },
        ],
      },
      {
        moduleId: "mod_backend",
        title: "Backend with Node & MongoDB",
        completionRate: 49,
        chapters: [
          {
            chapterId: "ch_node",
            title: "Node & Express",
            completionRate: 54,
            averageTimeSpent: 3230,
            dropoffRate: 46,
          },
        ],
      },
    ],
  },

  quizStats: {
    totalAttempts: 742,
    passed: 527,
    failed: 143,
    notAttended: 72,
    passRate: (527 / 742) * 100,
    averageScore: 68.4,
  },

  topPerformers: [
    { learnerId: "l1", learnerName: "Arjun Menon", progressPercentage: 100 },
    { learnerId: "l2", learnerName: "Sneha R", progressPercentage: 98 },
    { learnerId: "l3", learnerName: "Rahul K", progressPercentage: 96 },
    { learnerId: "l4", learnerName: "Anjali S", progressPercentage: 93 },
    { learnerId: "l5", learnerName: "Vishnu P", progressPercentage: 91 },
  ],

  recentEnrollments: [
    {
      learnerId: "r1",
      learnerName: "Akash N",
      enrolledAt: new Date("2025-01-30"),
      progressPercentage: 12,
    },
    {
      learnerId: "r2",
      learnerName: "Meera K",
      enrolledAt: new Date("2025-01-29"),
      progressPercentage: 34,
    },
    {
      learnerId: "r3",
      learnerName: "Suresh P",
      enrolledAt: new Date("2025-01-28"),
      progressPercentage: 67,
    },
    {
      learnerId: "r4",
      learnerName: "Nithya R",
      enrolledAt: new Date("2025-01-27"),
      progressPercentage: 81,
    },
  ],
};

const CourseAnalytics = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<CourseAnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] =
    useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        // const res = await dispatch(
        //   getCourseAnalytics({ courseId, timeRange })
        // ).unwrap();
        setAnalytics(MOCK_COURSE_ANALYTICS);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dispatch, courseId, timeRange]);



  if (loading) return <div className="p-10 text-white">Loading…</div>;
  if (!analytics) return <FallbackUI />;

  const { course, enrollmentStats, progressStats, quizStats } = analytics;

  const maxEnrollments = Math.max(
    ...enrollmentStats.trend.map(t => t.enrollments),
    1
  );


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-xs text-gray-400 capitalize">
                {course.level} · {course.status}
              </p>
            </div>
          </div>

          {/* Time Range */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded text-sm ${timeRange === r
                  ? "bg-cyan-600"
                  : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {r === "all" ? "All" : r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Metric
            icon={<Users />}
            label="Enrollments"
            value={enrollmentStats.total.toString()}
            sub={`${enrollmentStats.active} active`}
          />
          <Metric
            icon={<Award />}
            label="Completion Rate"
            value={`${enrollmentStats.completionRate.toFixed(1)}%`}
            sub={`${enrollmentStats.completed} completed`}
          />
          <Metric
            icon={<TrendingUp />}
            label="Revenue"
            value={`₹${(
              enrollmentStats.total * course.price
            ).toLocaleString()}`}
          />
          <Metric
            icon={<Star />}
            label="Rating"
            value={course.rating?.toFixed(1) ?? "—"}
            sub={`${course.totalRatings} ratings`}
          />
        </div>

        {/* Enrollment Trend */}
        <section className="bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="text-cyan-400" />
            Enrollment Trend
          </h2>

          {/* Chart Area */}
          <div className="h-48 flex items-end gap-4">
            {enrollmentStats.trend.map((t) => {
              const heightPercent = (t.enrollments / maxEnrollments) * 100;

              return (
                <div
                  key={t.date}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  {/* Bar container MUST have fixed height */}
                  <div className="w-full h-40 flex items-end">
                    <div
                      className="
                w-full
                bg-cyan-500
                rounded-t-lg
                transition-all
                duration-500
                hover:bg-cyan-400
              "
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-xs mt-2 text-gray-400">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </section>


        {/* Module Analytics */}
        <section className="bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Module Performance</h2>

          <div className="space-y-4">
            {progressStats.moduleAnalytics.map((mod) => (
              <div
                key={mod.moduleId}
                className="border border-white/10 rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{mod.title}</h3>
                  <span className="text-cyan-400">
                    {mod.completionRate.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  {mod.chapters.map((ch) => (
                    <div
                      key={ch.chapterId}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <span>{ch.title}</span>
                      <span>{ch.completionRate.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz */}
        {quizStats && (
          <section className="bg-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Activity className="text-emerald-400" />
              Quiz Performance
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Attempts: {quizStats.totalAttempts}</div>
              <div>Pass Rate: {quizStats.passRate.toFixed(1)}%</div>
              <div>Passed: {quizStats.passed}</div>
              <div>Failed: {quizStats.failed}</div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const Metric = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
    <div className="flex justify-between items-start mb-3">
      <div className="text-cyan-400">{icon}</div>
    </div>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);

export default CourseAnalytics;
