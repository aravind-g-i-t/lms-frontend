import { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getLearners, toggleLearnerStatus } from "../../services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import FallbackUI from "../../components/shared/FallbackUI";
import { UserListSkeleton } from "../../components/admin/UserListSkeleton";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { useFeedback } from "../../hooks/useFeedback";
import {
  Users, Search, Filter,
  ShieldOff, ShieldCheck,
} from "lucide-react";

type Learner = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
};

type Status = "All" | "Active" | "Blocked";

export default function ManageLearners() {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();

  const [learners, setLearners] = useState<Learner[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [loading, setLoading] = useState(false);
  const [fetchFailure, setFetchFailure] = useState(false);
  const [confirmState, setConfirmState] = useState<{ id: string; isActive: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [totalCount,setTotalCount]= useState(0)

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getLearners({ page, search, status, limit: 5 })).unwrap();
        setLearners(response.data.learners ?? []);
        setTotalPages(response.data.totalPages ?? 1);
        setTotalCount(response.data.totalCount ?? 0);
      } catch (err) {
        setFetchFailure(true);
        feedback.error("Error", err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, [dispatch, page, search, status, feedback]);

  const handleRequestToggle = useCallback((id: string, isActive: boolean) => {
    setConfirmState({ id, isActive });
  }, []);

  const handleConfirmToggle = async () => {
    if (!confirmState) return;
    try {
      setActionLoading(true);
      await dispatch(toggleLearnerStatus({ id: confirmState.id })).unwrap();
      setLearners((prev) =>
        prev.map((l) => l.id === confirmState.id ? { ...l, isActive: !l.isActive } : l)
      );
      feedback.success("Success", `Learner ${confirmState.isActive ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      feedback.error("Error", error as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const columns = useMemo<Column<Learner>[]>(() => [
    {
      header: "Learner",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={row.profilePic || "/images/default-profile.jpg"}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid #ccfbf1" }}
            />
            {/* online dot */}
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: row.isActive ? "#10b981" : "#f87171" }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: row.isActive ? "#d1fae5" : "#fee2e2",
            color: row.isActive ? "#065f46" : "#991b1b",
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
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => handleRequestToggle(row.id, row.isActive)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: row.isActive ? "#fee2e2" : "#d1fae5",
            color: row.isActive ? "#991b1b" : "#065f46",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {row.isActive
            ? <><ShieldOff  className="w-3.5 h-3.5" /> Block</>
            : <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</>
          }
        </button>
      ),
    },
  ], [handleRequestToggle]);

  if (loading) return <UserListSkeleton />;
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
              Manage Learners
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View and manage all registered learners on the platform
            </p>
          </div>
          <span
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            <Users className="w-4 h-4" />
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
              <Users className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>Learner List</span>
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
                  placeholder="Search learners…"
                  onSearch={(q) => { setSearch(q); setPage(1); }}
                />
              </div>

              {/* Filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown<Status>
                  label="Status"
                  value={status}
                  options={["All", "Active", "Blocked"]}
                  onChange={(newStatus) => { setStatus(newStatus); setPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table<Learner> columns={columns} data={learners} />
          </div>

          {/* Empty state */}
          {!loading && learners.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <Users className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">No learners found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter.</p>
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
        title={confirmState?.isActive ? "Block Learner" : "Unblock Learner"}
        description={
          confirmState?.isActive
            ? "This learner will no longer be able to access the platform."
            : "This learner will regain full access to the platform."
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