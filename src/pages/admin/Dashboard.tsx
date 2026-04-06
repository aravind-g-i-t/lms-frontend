import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { getAdminDashboard } from "../../services/adminServices";
import { useFeedback } from "../../hooks/useFeedback";
import { BookOpen, GraduationCap, Star, Users, TrendingUp, ShoppingCart, ArrowUpRight } from "lucide-react";

interface Stats {
  totalCourses: number;
  activeLearners: number;
  activeInstructors: number;
  totalRevenue: { totalGrossRevenue: number; instructorShare: number; companyRevenue: number };
  newLearnersThisMonth: number;
  newInstructorsThisMonth: number;
  totalEnrollments: number;
}

interface TopCourse {
  id: string;
  title: string;
  enrollmentCount: number;
  rating: number | null;
}

interface TopInstructor {
  instructorId: string;
  name: string;
  profilePic: string | null;
  enrollments: number;
}

interface MonthlyRevenue {
  year: number;
  month: number;
  totalGrossAmount: number;
  instructorShare: number;
  companyRevenue: number;
}

type RevenueMode = "gross" | "platform" | "instructor";

const REVENUE_MODES: {
  key: RevenueMode;
  label: string;
  field: keyof MonthlyRevenue;
  color: string;
  hoverColor: string;
  gradient: string;
  hoverGradient: string;
  pill: string;
  pillText: string;
}[] = [
  {
    key: "gross",
    label: "Gross",
    field: "totalGrossAmount",
    color: "#0d9488",
    hoverColor: "#0f766e",
    gradient: "linear-gradient(to top, #0d9488, #5eead4)",
    hoverGradient: "linear-gradient(to top, #0f766e, #2dd4bf)",
    pill: "#ccfbf1",
    pillText: "#0f766e",
  },
  {
    key: "platform",
    label: "Platform",
    field: "companyRevenue",
    color: "#0369a1",
    hoverColor: "#075985",
    gradient: "linear-gradient(to top, #0369a1, #38bdf8)",
    hoverGradient: "linear-gradient(to top, #075985, #0ea5e9)",
    pill: "#e0f2fe",
    pillText: "#0369a1",
  },
  {
    key: "instructor",
    label: "Instructor",
    field: "instructorShare",
    color: "#7c3aed",
    hoverColor: "#6d28d9",
    gradient: "linear-gradient(to top, #7c3aed, #c4b5fd)",
    hoverGradient: "linear-gradient(to top, #6d28d9, #a78bfa)",
    pill: "#ede9fe",
    pillText: "#7c3aed",
  },
];

const formatINR = (value: number): string => {
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value}`;
};

const AVATAR_COLORS = ["#0d9488", "#0369a1", "#7c3aed", "#db2777", "#ea580c"];

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();
  const [animate, setAnimate] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [revenueMode, setRevenueMode] = useState<RevenueMode>("gross");
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [topInstructors, setTopInstructors] = useState<TopInstructor[]>([]);
  const [adminRevenue, setAdminRevenue] = useState<MonthlyRevenue[]>([]);
  const [adminStats, setAdminStats] = useState<Stats | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dispatch(getAdminDashboard()).unwrap();
        setTopCourses(response.data.topCourses);
        setTopInstructors(response.data.topInstructors ?? []);
        setAdminRevenue(response.data.monthlyRevenue);
        setAdminStats(response.data.stats);
      } catch (err) {
        feedback.error("Error", err as string);
      }
    };
    fetchDashboardData();
  }, [dispatch, feedback]);

  const activeMode = REVENUE_MODES.find((m) => m.key === revenueMode)!;
  const getValue = useCallback((r: MonthlyRevenue) => r[activeMode.field] as number, [activeMode.field]);

  const maxRevenue = useMemo(
    () => Math.max(...adminRevenue.map((r) => getValue(r)), 1),
    [adminRevenue, getValue]
  );
  const totalRevenue = useMemo(
    () => adminRevenue.reduce((sum, r) => sum + getValue(r), 0),
    [adminRevenue, getValue]
  );
  const avgRevenue = useMemo(
    () => (adminRevenue.length ? totalRevenue / adminRevenue.length : 0),
    [totalRevenue, adminRevenue]
  );

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');

        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(13,148,136,0.12); }

        .growth-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .growth-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }

        .bar-col { transition: transform 0.15s ease; }
        .bar-col:hover { transform: scaleX(1.04); }

        .bar-fill {
          transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, background 0.3s ease;
        }

        .rev-pill {
          transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .rev-pill:hover { transform: translateY(-1px); }
        .rev-pill:active { transform: translateY(0px); }

        .course-row { transition: background 0.15s ease, transform 0.15s ease; }
        .course-row:hover { background: #f0fdfa; transform: translateX(4px); }

        .instructor-row { transition: background 0.15s ease, transform 0.15s ease; }
        .instructor-row:hover { background: #faf5ff; transform: translateX(4px); }

        .tooltip {
          animation: fadeUp 0.15s ease;
          pointer-events: none;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .bar-track { transition: background 0.15s ease; }

        .revenue-breakdown-bar {
          transition: width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">
              Overview
            </p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
            >
              Admin Dashboard
            </h1>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* ── Primary Stats ── */}
        {!!adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard icon={<BookOpen color="teal" className="h-6 w-6" />} label="Total Courses"       value={adminStats.totalCourses}       color="#0d9488" />
            <StatCard icon={<Users color="teal" className="h-6 w-6" />}    label="Active Learners"     value={adminStats.activeLearners}     color="#0369a1" />
            <StatCard icon={<GraduationCap color="teal" className="h-6 w-6" />} label="Active Instructors" value={adminStats.activeInstructors} color="#7c3aed" />
          </div>
        )}

        {/* ── Growth & Enrollment Stats ── */}
        {!!adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* New Learners This Month */}
            <div
              className="growth-card rounded-2xl p-6 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                border: "1px solid #99f6e4",
                boxShadow: "0 2px 12px rgba(13,148,136,0.08)",
              }}
            >
              <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: "#0d9488" }}
              >
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#0f766e" }}>
                  New Learners
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  +{adminStats.newLearnersThisMonth.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#0f766e" }}>this month</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#0d9488" }} />
              </div>
            </div>

            {/* New Instructors This Month */}
            <div
              className="growth-card rounded-2xl p-6 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #faf5ff, #ede9fe)",
                border: "1px solid #ddd6fe",
                boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
              }}
            >
              <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: "#7c3aed" }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#7c3aed" }}>
                  New Instructors
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  +{adminStats.newInstructorsThisMonth.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#7c3aed" }}>this month</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#7c3aed" }} />
              </div>
            </div>

            {/* Total Enrollments */}
            <div
              className="growth-card rounded-2xl p-6 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                border: "1px solid #bfdbfe",
                boxShadow: "0 2px 12px rgba(3,105,161,0.08)",
              }}
            >
              <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: "#0369a1" }}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#0369a1" }}>
                  Total Enrollments
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  {adminStats.totalEnrollments.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#0369a1" }}>all time</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#0369a1" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Revenue Breakdown Banner ── */}
        {!!adminStats && (
          <section
            className="rounded-2xl p-7 mb-10"
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#5eead4" }}>
                  Revenue Breakdown
                </p>
                <h2 className="text-xl font-bold text-white" style={{ letterSpacing: "-0.5px" }}>
                  All-Time Revenue
                </h2>
              </div>
              <p className="text-3xl font-black" style={{ color: "#ffffff", fontFamily: "'DM Mono', monospace", letterSpacing: "-1px" }}>
                {formatINR(adminStats.totalRevenue.totalGrossRevenue)}
              </p>
            </div>

            {/* Stacked bar */}
            <div className="w-full rounded-xl overflow-hidden flex h-4 mb-5" style={{ background: "#1e293b" }}>
              {adminStats.totalRevenue.totalGrossRevenue > 0 && (() => {
                const gross = adminStats.totalRevenue.totalGrossRevenue;
                const platformPct = (adminStats.totalRevenue.companyRevenue / gross) * 100;
                const instructorPct = (adminStats.totalRevenue.instructorShare / gross) * 100;
                return (
                  <>
                    <div
                      className="revenue-breakdown-bar h-full"
                      style={{
                        width: animate ? `${platformPct}%` : "0%",
                        background: "linear-gradient(90deg, #0369a1, #38bdf8)",
                        transitionDelay: "0.2s",
                      }}
                    />
                    <div
                      className="revenue-breakdown-bar h-full"
                      style={{
                        width: animate ? `${instructorPct}%` : "0%",
                        background: "linear-gradient(90deg, #7c3aed, #c4b5fd)",
                        transitionDelay: "0.4s",
                      }}
                    />
                  </>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RevenueBreakdownItem
                label="Gross Revenue"
                value={formatINR(adminStats.totalRevenue.totalGrossRevenue)}
                color="#5eead4"
                dotColor="#0d9488"
                pct={100}
              />
              <RevenueBreakdownItem
                label="Platform Share"
                value={formatINR(adminStats.totalRevenue.companyRevenue)}
                color="#38bdf8"
                dotColor="#0369a1"
                pct={
                  adminStats.totalRevenue.totalGrossRevenue > 0
                    ? Math.round((adminStats.totalRevenue.companyRevenue / adminStats.totalRevenue.totalGrossRevenue) * 100)
                    : 0
                }
              />
              <RevenueBreakdownItem
                label="Instructor Share"
                value={formatINR(adminStats.totalRevenue.instructorShare)}
                color="#c4b5fd"
                dotColor="#7c3aed"
                pct={
                  adminStats.totalRevenue.totalGrossRevenue > 0
                    ? Math.round((adminStats.totalRevenue.instructorShare / adminStats.totalRevenue.totalGrossRevenue) * 100)
                    : 0
                }
              />
            </div>
          </section>
        )}

        {/* ── Revenue Chart ── */}
        <section
          className="rounded-2xl p-8 mb-10"
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                Monthly Revenue
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Last {adminRevenue.length} months</p>
            </div>
            <div className="flex gap-6">
              <MiniStat label="Total"       value={formatINR(totalRevenue)} color={activeMode.color} />
              <MiniStat label="Avg / month" value={formatINR(avgRevenue)}   color={activeMode.color} />
              <MiniStat label="Peak"        value={formatINR(maxRevenue)}   color={activeMode.color} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {REVENUE_MODES.map((mode) => {
              const isActive = revenueMode === mode.key;
              return (
                <button
                  key={mode.key}
                  className="rev-pill text-xs font-semibold px-4 py-1.5 rounded-full"
                  style={{
                    background: isActive ? mode.pill : "#f8fafc",
                    color: isActive ? mode.pillText : "#94a3b8",
                    boxShadow: isActive ? `0 0 0 1.5px ${mode.color}44` : "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onClick={() => {
                    setAnimate(false);
                    setRevenueMode(mode.key);
                    setTimeout(() => setAnimate(true), 50);
                  }}
                >
                  {mode.label}
                </button>
              );
            })}
            <span
              className="ml-auto text-xs font-medium flex items-center gap-1.5"
              style={{ color: activeMode.color }}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: activeMode.color, boxShadow: `0 0 6px ${activeMode.color}88` }}
              />
              {activeMode.label} share
            </span>
          </div>

          {adminRevenue.length === 0 ? (
            <p className="text-center text-slate-400 py-16">No revenue data available.</p>
          ) : (
            <div className="flex items-end gap-2 md:gap-3" style={{ height: 240 }}>
              {adminRevenue.map((r, i) => {
                const val = getValue(r);
                const pct = (val / maxRevenue) * 100;
                const isHovered = hoveredBar === i;
                const monthLabel = new Date(r.year, r.month - 1).toLocaleString("en-US", { month: "short" });

                return (
                  <div
                    key={i}
                    className="bar-col flex-1 flex flex-col items-center h-full relative cursor-pointer select-none"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {isHovered && (
                      <div
                        className="tooltip absolute z-10 rounded-xl px-3 py-2 text-center shadow-xl"
                        style={{
                          bottom: "calc(100% - 24px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#0f172a",
                          color: "#fff",
                          minWidth: 120,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <p
                          className="text-xs font-semibold mb-0.5"
                          style={{
                            color: activeMode.gradient.includes("5eead4")
                              ? "#5eead4"
                              : activeMode.gradient.includes("38bdf8")
                              ? "#38bdf8"
                              : "#c4b5fd",
                          }}
                        >
                          {monthLabel} {r.year}
                        </p>
                        <p className="text-base font-bold">{formatINR(val)}</p>
                        <p className="text-xs text-slate-400">{activeMode.label} share</p>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-700 text-left space-y-0.5">
                          <p className="text-xs" style={{ color: "#5eead4" }}>Gross: {formatINR(r.totalGrossAmount)}</p>
                          <p className="text-xs" style={{ color: "#38bdf8" }}>Platform: {formatINR(r.companyRevenue)}</p>
                          <p className="text-xs" style={{ color: "#c4b5fd" }}>Instructor: {formatINR(r.instructorShare)}</p>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: -6,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid #0f172a",
                          }}
                        />
                      </div>
                    )}

                    <div
                      className="bar-track w-full rounded-xl relative overflow-hidden"
                      style={{
                        height: "100%",
                        background: isHovered ? `${activeMode.pill}` : "#f8fafc",
                      }}
                    >
                      <div
                        className="bar-fill absolute bottom-0 w-full rounded-xl"
                        style={{
                          height: animate ? `${pct}%` : "0%",
                          opacity: animate ? 1 : 0,
                          background: isHovered ? activeMode.hoverGradient : activeMode.gradient,
                          transitionDelay: `${i * 60}ms`,
                        }}
                      />
                      {animate && pct > 18 && (
                        <div
                          className="absolute w-full text-center"
                          style={{
                            bottom: `calc(${pct}% + 6px)`,
                            fontSize: 10,
                            fontWeight: 600,
                            color: isHovered ? activeMode.color : "#64748b",
                            fontFamily: "'DM Mono', monospace",
                            transition: "color 0.15s ease",
                          }}
                        >
                          {formatINR(val)}
                        </div>
                      )}
                    </div>

                    <span
                      className="mt-2 text-xs font-semibold"
                      style={{ color: isHovered ? activeMode.color : "#94a3b8" }}
                    >
                      {monthLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Bottom Row: Top Courses + Top Instructors ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Top Courses */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Top Courses
            </h2>
            {topCourses.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No course data available.</p>
            )}
            {topCourses.map((course, i) => (
              <div
                key={course.id}
                className="course-row flex items-center gap-4 px-3 py-3 rounded-xl mb-2"
              >
                <span
                  className="text-xl font-black w-7 text-center shrink-0"
                  style={{
                    color:
                      i === 0 ? "#26a585" : i === 1 ? "#2cb394" : i === 2 ? "#2fc9a5" : "#27e7ba",
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" style={{ color: "#0f172a" }}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {course.enrollmentCount.toLocaleString("en-IN")} enrollments
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-4 w-4 text-amber-400" fill="#fbbf24" />
                  <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                    {course.rating?.toFixed(1) ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Top Instructors */}
          <section
            className="rounded-2xl p-8"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Top Instructors
            </h2>
            {topInstructors.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No instructor data available.</p>
            )}
            {topInstructors.map((instructor, i) => (
              <div
                key={instructor.instructorId}
                className="instructor-row flex items-center gap-4 px-3 py-3 rounded-xl mb-2"
              >
                {/* Avatar */}
                {instructor.profilePic ? (
                  <img
                    src={instructor.profilePic}
                    alt={instructor.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid ${AVATAR_COLORS[i % AVATAR_COLORS.length]}33` }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {instructor.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Rank badge */}
                <span
                  className="text-sm font-black w-5 text-center shrink-0"
                  style={{ color: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" style={{ color: "#0f172a" }}>
                    {instructor.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {instructor.enrollments.toLocaleString("en-IN")} students enrolled
                  </p>
                </div>

                {/* Enrollment bar */}
                <div className="shrink-0 w-20">
                  <div className="w-full rounded-full h-1.5" style={{ background: "#f1f5f9" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: animate
                          ? `${Math.min(100, (instructor.enrollments / (topInstructors[0]?.enrollments || 1)) * 100)}%`
                          : "0%",
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
                        transitionDelay: `${i * 80 + 300}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ── Sub-components ── */

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactElement;
  label: string;
  value: number;
  color: string;
}) => (
  <div
    className="stat-card rounded-2xl p-6"
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}66` }}
      />
    </div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
    <p
      className="text-4xl font-black"
      style={{ color, letterSpacing: "-1.5px", fontFamily: "'DM Mono', monospace" }}
    >
      {value.toLocaleString("en-IN")}
    </p>
  </div>
);

const MiniStat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div className="text-right">
    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
    <p
      className="text-sm font-bold"
      style={{ color: color ?? "#0f172a", fontFamily: "'DM Mono', monospace" }}
    >
      {value}
    </p>
  </div>
);

const RevenueBreakdownItem = ({
  label,
  value,
  color,
  dotColor,
  pct,
}: {
  label: string;
  value: string;
  color: string;
  dotColor: string;
  pct: number;
}) => (
  <div
    className="rounded-xl p-4"
    style={{ background: "#1e293b" }}
  >
    <div className="flex items-center gap-2 mb-2">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}88` }}
      />
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
        {label}
      </span>
    </div>
    <p className="text-xl font-black mb-1" style={{ color, fontFamily: "'DM Mono', monospace" }}>
      {value}
    </p>
    {pct < 100 && (
      <p className="text-xs" style={{ color: "#64748b" }}>{pct}% of gross</p>
    )}
  </div>
);