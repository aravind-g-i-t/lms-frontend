import { useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getInstructors, toggleInstructorStatus } from "../../services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import FallbackUI from "../../components/shared/FallbackUI";
import { UserListSkeleton } from "../../components/admin/UserListSkeleton";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { useFeedback } from "../../hooks/useFeedback";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, Search, Filter,
  ShieldOff, ShieldCheck, Eye,
  CheckCircle2, XCircle, HelpCircle, Clock,
} from "lucide-react";

type Instructor = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
  verification: { status: string; remarks: string | null };
};

type Status             = "All" | "Active" | "Blocked";
type VerificationStatus = "All" | "Not Submitted" | "Under Review" | "Verified" | "Rejected";

/* ── Verification badge meta ── */
const VER_META: Record<string, { icon: React.ReactNode; bg: string; color: string; dot: string }> = {
  "Verified":      { icon: <CheckCircle2 className="w-3 h-3" />, bg: "#d1fae5", color: "#065f46",  dot: "#10b981" },
  "Under Review":  { icon: <Clock        className="w-3 h-3" />, bg: "#fef3c7", color: "#92400e",  dot: "#fbbf24" },
  "Rejected":      { icon: <XCircle      className="w-3 h-3" />, bg: "#fee2e2", color: "#991b1b",  dot: "#f87171" },
  "Not Submitted": { icon: <HelpCircle   className="w-3 h-3" />, bg: "#f1f5f9", color: "#64748b",  dot: "#94a3b8" },
};

export default function ManageInstructors() {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();
  const navigate = useNavigate();

  const [instructors,        setInstructors]        = useState<Instructor[]>([]);
  const [page,               setPage]               = useState(1);
  const [totalPages,         setTotalPages]         = useState(1);
  const [search,             setSearch]             = useState("");
  const [status,             setStatus]             = useState<Status>("All");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("All");
  const [loading,            setLoading]            = useState(false);
  const [fetchFailure,       setFetchFailure]       = useState(false);
  const [confirmState,       setConfirmState]       = useState<{ id: string; isActive: boolean } | null>(null);
  const [actionLoading,      setActionLoading]      = useState(false);
  const [totalCount,setTotalCount]= useState(0)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getInstructors({ page, search, status, limit: 4, verificationStatus })
        ).unwrap();
        setInstructors(response.data.instructors ?? []);
        setTotalPages(response.data.totalPages ?? 1);
        setTotalCount(response.data.totalCount ?? 0);
      } catch (err) {
        setFetchFailure(true);
        feedback.error("Error", err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, [dispatch, page, search, status, verificationStatus, feedback]);

  const handleConfirmToggle = async () => {
    if (!confirmState) return;
    try {
      setActionLoading(true);
      await dispatch(toggleInstructorStatus({ id: confirmState.id })).unwrap();
      setInstructors((prev) =>
        prev.map((i) => i.id === confirmState.id ? { ...i, isActive: !i.isActive } : i)
      );
      feedback.success("Success", `Instructor ${confirmState.isActive ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      feedback.error("Error", error as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const columns = useMemo<Column<Instructor>[]>(() => [
    {
      header: "Instructor",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={row.profilePic || "/images/default-profile.jpg"}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid #ccfbf1" }}
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: row.isActive ? "#10b981" : "#f87171" }}
            />
          </div>
          <div>
            <Link
              to={`/admin/instructor/${row.id}`}
              className="font-semibold text-sm text-teal-600 hover:text-teal-700 hover:underline"
            >
              {row.name}
            </Link>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Account",
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: row.isActive ? "#d1fae5" : "#fee2e2",
            color:      row.isActive ? "#065f46" : "#991b1b",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: row.isActive ? "#10b981" : "#f87171" }}
          />
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "KYC Status",
      render: (row) => {
        const meta = VER_META[row.verification.status] ?? VER_META["Not Submitted"];
        return (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.icon}
            {row.verification.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmState({ id: row.id, isActive: row.isActive })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: row.isActive ? "#fee2e2" : "#d1fae5",
              color:      row.isActive ? "#991b1b" : "#065f46",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {row.isActive
              ? <><ShieldOff  className="w-3.5 h-3.5" /> Block</>
              : <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</>
            }
          </button>
          <button
            onClick={() => navigate(`/admin/instructor/${row.id}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
            style={{ background: "#0d9488" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
        </div>
      ),
    },
  ], [navigate]);

  if (loading)      return <UserListSkeleton />;
  if (fetchFailure) return <FallbackUI />;

  return (
    <div
      className="min-h-full p-6 md:p-10"
      style={{
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">Admin</p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
            >
              Manage Instructors
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View and manage all registered instructors on the platform
            </p>
          </div>
          <span
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            <GraduationCap className="w-4 h-4" />
            {totalCount} total
          </span>
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
        >
          {/* Toolbar */}
          <div
            className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>Instructor List</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: 220 }}
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <SearchBar
                  value={search}
                  placeholder="Search instructors…"
                  onSearch={(q) => { setSearch(q); setPage(1); }}
                />
              </div>

              {/* Status filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown<Status>
                  label="Status"
                  value={status}
                  options={["All", "Active", "Blocked"]}
                  onChange={(v) => { setStatus(v); setPage(1); }}
                />
              </div>

              {/* Verification filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown<VerificationStatus>
                  label="Verification"
                  value={verificationStatus}
                  options={["All", "Not Submitted", "Under Review", "Verified", "Rejected"]}
                  onChange={(v) => { setVerificationStatus(v); setPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table<Instructor> columns={columns} data={instructors} />
          </div>

          {/* Empty state */}
          {!loading && instructors.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <GraduationCap className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">No instructors found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-6 py-4 flex justify-center"
              style={{ borderTop: "1px solid #f1f5f9" }}
            >
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.isActive ? "Block Instructor" : "Unblock Instructor"}
        description={
          confirmState?.isActive
            ? "This instructor will no longer be able to access the platform."
            : "This instructor will regain access to the platform."
        }
        confirmText={confirmState?.isActive ? "Block" : "Unblock"}
        destructive={confirmState?.isActive}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}