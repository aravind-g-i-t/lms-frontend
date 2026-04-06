import { useEffect, useState, type ReactElement } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useFeedback } from "../../hooks/useFeedback";
import { DollarSign, CreditCard, TrendingUp, ArrowUpRight, ShoppingCart } from "lucide-react";
import { getRevenueList, getRevenueStats } from "../../services/adminServices";

interface RevenueStats {
  gross: number;
  platform: number;
  instructor: number;
  totalEnrollments: number;
  activeEnrollments: number;
  cancelledEnrollments: number;
}

interface RevenueItem {
  id: string;
  learnerName: string;
  courseTitle: string;
  amount: number;
  status: string;
  method: string;
  date: Date;
}

const formatINR = (value: number): string => {
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value}`;
};

const RevenuePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();

  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [transactions, setTransactions] = useState<RevenueItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // const [animate, setAnimate] = useState(false);
  const limit = 10;

  // useEffect(() => {
  //   const t = setTimeout(() => setAnimate(true), 100);
  //   return () => clearTimeout(t);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getRevenueStats()).unwrap();
        setStats(res.data);
        console.log(res.data);
      } catch (err) {
        feedback.error("Error", err as string);
      }
    };
    fetchData();
  }, [dispatch, feedback]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getRevenueList({ page, limit })).unwrap();
        setTransactions(res.data.enrollments);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        feedback.error("Error", err as string);
      }
    };
    fetchData();
  }, [dispatch, feedback, page]);

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

        .transaction-row { transition: background 0.15s ease, transform 0.15s ease; }
        .transaction-row:hover { background: #f0fdfa; transform: translateX(4px); }

        .status-badge {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .status-badge:hover { transform: scale(1.05); }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">
              Monetization
            </p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
            >
              Revenue Analytics
            </h1>
          </div>
          <span
            className="text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* ── Primary Revenue Stats ── */}
        {!!stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard
              icon={<DollarSign color="teal" className="h-6 w-6" />}
              label="Gross Revenue"
              value={formatINR(stats.gross)}
              color="#0d9488"
            />
            <StatCard
              icon={<CreditCard color="teal" className="h-6 w-6" />}
              label="Platform Share"
              value={formatINR(stats.platform)}
              color="#0369a1"
            />
            <StatCard
              icon={<TrendingUp color="teal" className="h-6 w-6" />}
              label="Instructor Share"
              value={formatINR(stats.instructor)}
              color="#7c3aed"
            />
          </div>
        )}

        {/* ── Enrollment Stats ── */}
        {!!stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* Total Enrollments */}
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
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#0f766e" }}>
                  Total Enrollments
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  {stats.totalEnrollments.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#0f766e" }}>all time</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#0d9488" }} />
              </div>
            </div>

            {/* Active Enrollments */}
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
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#0369a1" }}>
                  Active Enrollments
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  {stats.activeEnrollments.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#0369a1" }}>ongoing</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#0369a1" }} />
              </div>
            </div>

            {/* Cancelled Enrollments */}
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
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#7c3aed" }}>
                  Cancelled
                </p>
                <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
                  {stats.cancelledEnrollments.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "#7c3aed" }}>refunded</p>
              </div>
              <div className="ml-auto shrink-0">
                <ArrowUpRight className="h-5 w-5" style={{ color: "#7c3aed" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Recent Transactions ── */}
        <section
          className="rounded-2xl p-8"
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <h2 className="text-xl font-bold mb-6" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-center text-slate-400 py-10">
              No transactions found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                    <th className="pb-4 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Learner</th>
                    <th className="pb-4 font-semibold">Course</th>
                    <th className="pb-4 font-semibold">Amount</th>
                    <th className="pb-4 font-semibold">Method</th>
                    <th className="pb-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transaction-row border-b"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <td className="py-4" style={{ color: "#0f172a" }}>
                        {new Date(tx.date).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ color: "#0f172a" }}>{tx.learnerName}</td>
                      <td style={{ color: "#64748b" }} className="max-w-xs truncate">
                        {tx.courseTitle}
                      </td>
                      <td className="font-semibold" style={{ color: "#0f172a" }}>
                        {formatINR(tx.amount)}
                      </td>
                      <td style={{ color: "#64748b" }} className="capitalize">
                        {tx.method}
                      </td>
                      <td>
                        <StatusBadge status={tx.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: "#e2e8f0" }}>
              <p className="text-xs" style={{ color: "#64748b" }}>
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: page === 1 ? "#f1f5f9" : "#0d9488",
                    color: page === 1 ? "#cbd5e1" : "#ffffff",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={transactions.length < limit}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: transactions.length < limit ? "#f1f5f9" : "#0d9488",
                    color: transactions.length < limit ? "#cbd5e1" : "#ffffff",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default RevenuePage;

/* ── Components ── */

interface StatCardProps {
  icon: ReactElement;
  label: string;
  value: string;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div
    className="stat-card rounded-2xl p-6"
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(13,148,136,0.05)",
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="rounded-xl p-3" style={{ background: `${color}15` }}>
        {icon}
      </div>
    </div>
    <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#64748b" }}>
      {label}
    </p>
    <p className="text-3xl font-black" style={{ color: "#0f172a", letterSpacing: "-1px", fontFamily: "'DM Mono', monospace" }}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    success: { bg: "#dcfce7", text: "#166534" },
    pending: { bg: "#fef3c7", text: "#92400e" },
    failed: { bg: "#fee2e2", text: "#991b1b" },
    refunded: { bg: "#ede9fe", text: "#6d28d9" },
  };

  const config = statusConfig[status] || { bg: "#f1f5f9", text: "#475569" };

  return (
    <span
      className="px-3 py-1.5 rounded-full text-xs font-semibold status-badge inline-block"
      style={{
        background: config.bg,
        color: config.text,
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
