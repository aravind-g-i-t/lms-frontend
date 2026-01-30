import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { getAdminDashboard } from "../../services/adminServices";
import { toast } from "react-toastify";


interface Stats{
  totalCourses: number;
  activeLearners: number;
  activeInstructors: number;
}

interface RecentEnrollment {
  id: string;
  learner: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    title: string;
  };
  amount: number;
  enrolledAt: Date | null;
}

interface TopCourse {
  id: string;
  title: string;
  enrollmentCount: number;
  rating: number | null;
}

interface MonthlyRevenue {
  year: number;
  month: number; // 1–12
  totalGrossAmount: number;
  instructorShare: number;
  companyRevenue: number;
}

/* =======================
   MOCK DATA
======================= */

// const adminStats: Stats = {
//   totalCourses: 156,
//   activeLearners: 3842,
//   activeInstructors: 89,
// };

// const adminRevenue: MonthlyRevenue[] = [
//   { year: 2025, month: 11, totalGrossAmount: 45000, instructorShare: 31500, companyRevenue: 13500 },
//   { year: 2025, month: 12, totalGrossAmount: 52000, instructorShare: 36400, companyRevenue: 15600 },
//   { year: 2026, month: 1, totalGrossAmount: 48000, instructorShare: 33600, companyRevenue: 14400 },
//   { year: 2026, month: 2, totalGrossAmount: 61000, instructorShare: 42700, companyRevenue: 18300 },
//   { year: 2026, month: 3, totalGrossAmount: 58000, instructorShare: 40600, companyRevenue: 17400 },
//   { year: 2026, month: 4, totalGrossAmount: 72000, instructorShare: 50400, companyRevenue: 21600 },
// ];

// const recentEnrollments: RecentEnrollment[] = [
//   {
//     id: "e1",
//     learner: { id: "l1", name: "Sarah Johnson" },
//     course: { id: "c1", title: "Advanced React Patterns" },
//     amount: 149,
//     enrolledAt: new Date(),
//   },
//   {
//     id: "e2",
//     learner: { id: "l2", name: "Michael Chen" },
//     course: { id: "c2", title: "Machine Learning Fundamentals" },
//     amount: 199,
//     enrolledAt: new Date(),
//   },
//   {
//     id: "e3",
//     learner: { id: "l3", name: "Emma Williams" },
//     course: { id: "c3", title: "UI/UX Design Masterclass" },
//     amount: 129,
//     enrolledAt: new Date(),
//   },
// ];

// const topCourses: TopCourse[] = [
//   { id: "c1", title: "Full Stack Web Development", enrollmentCount: 842, rating: 4.8 },
//   { id: "c2", title: "Machine Learning A-Z", enrollmentCount: 756, rating: 4.7 },
//   { id: "c3", title: "AWS Solutions Architect", enrollmentCount: 623, rating: 4.9 },
//   { id: "c4", title: "Digital Marketing Mastery", enrollmentCount: 589, rating: 4.6 },
// ];

/* =======================
   ADMIN DASHBOARD
======================= */

const AdminDashboard = () => {
  const dispatch =useDispatch<AppDispatch>()
  const [animate, setAnimate] = useState(false);
  const [recentEnrollments,setRecentEnrollments]=useState<RecentEnrollment[]>([]);
  const [topCourses,setTopCourses]=useState<TopCourse[]>([]);
  const [adminRevenue,setAdminRevenue]=useState<MonthlyRevenue[]>([]);
  const [adminStats,setAdminStats]=useState<Stats|null>(null);


  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          // setLoading(true);
          const response= await dispatch(getAdminDashboard()).unwrap();
          console.log(response);
          
          setTopCourses(response.data.topCourses);
          setAdminRevenue(response.data.revenueData)
          setRecentEnrollments(response.data.recentEnrollments)
          setAdminStats(response.data.stats)
          // setLoading(false);
        } catch (err) {
          toast.error(err as string);
          // setLoading(false);
        }
      };
  
      fetchDashboardData();
    }, [dispatch]);

  const maxRevenue = useMemo(
    () => Math.max(...adminRevenue.map(r => r.companyRevenue)),
    [adminRevenue]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-black mb-10 bg-gradient-to-r from-teal-900 via-teal-700 to-teal-900 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        {/* Stats */}
        {!!adminStats && <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Courses" value={adminStats.totalCourses} />
          <StatCard label="Active Learners" value={adminStats.activeLearners} />
          <StatCard label="Active Instructors" value={adminStats.activeInstructors} />
        </div>}

        {/* Revenue */}
        <section className="bg-white rounded-2xl p-8 border border-teal-100 shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6">Revenue (Company Share)</h2>

          <div className="flex items-end gap-4 h-64">
            {adminRevenue.map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full">
                <div className="w-full h-full bg-slate-100 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-teal-600 to-teal-400 transition-all"
                    style={{
                      height: animate
                        ? `${(r.companyRevenue / maxRevenue) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500 mt-2">
                  {new Date(r.year, r.month - 1).toLocaleString("en-US", {
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Top Courses */}
          <section className="bg-white rounded-2xl p-8 border border-teal-100 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Top Courses</h2>

            {topCourses.map(course => (
              <div
                key={course.id}
                className="border-l-4 border-teal-500 pl-4 py-3 mb-4"
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-slate-600">
                  {course.enrollmentCount} enrollments · ⭐ {course.rating?.toFixed(1) ?? "N/A"}
                </p>
              </div>
            ))}
          </section>

          {/* Recent Enrollments */}
          <section className="bg-white rounded-2xl p-8 border border-teal-100 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Recent Enrollments</h2>

            {recentEnrollments.map(e => (
              <div
                key={e.id}
                className="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{e.learner.name}</p>
                  <p className="text-xs text-slate-500">{e.course.title}</p>
                </div>
                <span className="font-bold text-emerald-600">
                  ₹{e.amount.toFixed()}
                </span>
              </div>
            ))}
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* =======================
   SMALL COMPONENT
======================= */

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-xl p-6 border border-teal-100 shadow-sm">
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className="text-3xl font-black text-teal-700">{value}</p>
  </div>
);
