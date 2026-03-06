import { useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  getCoursesForAdmin,
  getInstructors,
  updateCourseVerification,
  updateInstructorVerificationStatus,
} from "../../services/adminServices";
import { useFeedback } from "../../hooks/useFeedback";
import {
  BookOpen,
  GraduationCap,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";

type VerificationStatus =
  | "not_verified"
  | "under_review"
  | "verified"
  | "rejected"
  | "blocked";

type TabType = "courses" | "instructors";

interface Course {
  id: string;
  title: string;
  category: { id: string; name: string };
  instructor: { id: string; name: string };
  thumbnail: string | null;
  price: number;
  verification: { status: VerificationStatus };
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
  verification: { status: string; remarks: string | null };
}

export default function Verifications() {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalTarget, setModalTarget] = useState<Course | Instructor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "courses") {
          const response = await dispatch(
            getCoursesForAdmin({ page, search, verificationStatus: "under_review", limit: 5 })
          ).unwrap();
          setCourses(response.data.courses ?? []);
          setTotalPages(response.data.pagination.totalPages ?? 1);
        } else {
          const response = await dispatch(
            getInstructors({ page, search, limit: 5, verificationStatus: "Under Review", status: "All" })
          ).unwrap();
          setInstructors(response.data.instructors ?? []);
          setTotalPages(response.data.totalPages ?? 1);
        }
      } catch (err) {
        feedback.error("Error", err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, page, search, activeTab, feedback]);

  const handleCourseVerification = async () => {
    try {
      if (!modalType || !selectedId) return;
      const newStatus = modalType === "approve" ? "verified" : "rejected";
      const result = await dispatch(
        updateCourseVerification({ courseId: selectedId, status: newStatus, remarks: remarks.trim() || null })
      ).unwrap();
      setCourses(courses.map((c) => c.id === selectedId ? { ...c, verification: result.data.verification } : c));
      closeModal();
      feedback.success("Success", `Course ${modalType === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      feedback.error("Error", error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleInstructorVerification = async () => {
    try {
      if (!modalType || !selectedId) return;
      const newStatus = modalType === "approve" ? "Verified" : "Rejected";
      await dispatch(
        updateInstructorVerificationStatus({ id: selectedId, status: newStatus, remarks: remarks.trim() || null })
      ).unwrap();
      setInstructors(instructors.map((i) =>
        i.id === selectedId ? { ...i, verification: { status: newStatus, remarks: remarks.trim() } } : i
      ));
      closeModal();
      feedback.success("Success", `Instructor ${modalType === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (error) {
      feedback.error("Error", error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setRemarks("");
    setModalType(null);
    setSelectedId(null);
    setModalTarget(null);
  };

  const openModal = (id: string, type: "approve" | "reject", target: Course | Instructor) => {
    setSelectedId(id);
    setModalType(type);
    setModalTarget(target);
    setModalOpen(true);
  };

  /* ── Table columns ── */
  const courseColumns = useMemo<Column<Course>[]>(() => [
    {
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
            style={{ border: "1px solid #e2e8f0" }}>
            {row.thumbnail ? (
              <img src={row.thumbnail} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#f0fdfa,#e0f2fe)" }}>
                <BookOpen className="w-5 h-5 text-teal-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate max-w-[200px]" style={{ color: "#0f172a" }}>
              {row.title}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{row.category.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Instructor",
      render: (row) => (
        <Link to={`/admin/instructor/${row.instructor.id}`}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
          {row.instructor.name}
        </Link>
      ),
    },
    {
      header: "Price",
      render: (row) => (
        <span className="text-sm font-bold" style={{ color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
          ₹{row.price.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "#fef3c7", color: "#92400e" }}>
          <Clock className="w-3 h-3" /> Under Review
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row.id, "approve", row)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#d1fae5", color: "#065f46" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#a7f3d0")}
            onMouseLeave={e => (e.currentTarget.style.background = "#d1fae5")}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => openModal(row.id, "reject", row)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#fee2e2", color: "#991b1b" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fecaca")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fee2e2")}
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
          <button
            onClick={() => navigate(`/admin/courses/${row.id}`)}
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

  const instructorColumns = useMemo<Column<Instructor>[]>(() => [
    {
      header: "Instructor",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"
            style={{ border: "2px solid #ccfbf1" }}>
            <img
              src={row.profilePic || "/images/default-profile.jpg"}
              className="w-full h-full object-cover"
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
      header: "Account",
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: row.isActive ? "#d1fae5" : "#f1f5f9",
            color: row.isActive ? "#065f46" : "#64748b",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.isActive ? "#10b981" : "#94a3b8" }} />
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "KYC Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "#fef3c7", color: "#92400e" }}>
          <Clock className="w-3 h-3" /> Under Review
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row.id, "approve", row)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#d1fae5", color: "#065f46" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#a7f3d0")}
            onMouseLeave={e => (e.currentTarget.style.background = "#d1fae5")}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => openModal(row.id, "reject", row)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#fee2e2", color: "#991b1b" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fecaca")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fee2e2")}
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
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

  /* ── Modal target label ── */
  const modalTargetName = modalTarget
    ? "title" in modalTarget
      ? (modalTarget as Course).title
      : (modalTarget as Instructor).name
    : "";

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
        .tab-btn { transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease; }
        .modal-enter { animation: modalIn 0.2s ease; }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">
              Admin
            </p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
            >
              Verification Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review and approve pending courses and instructor KYC submissions
            </p>
          </div>
          <span
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            <Clock className="w-4 h-4" />
            Pending Review
          </span>
        </div>

        {/* ── Tab strip ── */}
        <div className="flex gap-3 mb-6">
          {([
            { key: "courses",     label: "Course Verifications",     icon: <BookOpen      className="w-4 h-4" /> },
            { key: "instructors", label: "Instructor Verifications",  icon: <GraduationCap className="w-4 h-4" /> },
          ] as const).map(({ key, label, icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setPage(1); setSearch(""); }}
                className="tab-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: active ? "#0d9488" : "#ffffff",
                  color: active ? "#ffffff" : "#64748b",
                  border: active ? "1px solid #0d9488" : "1px solid #e2e8f0",
                  boxShadow: active ? "0 4px 12px rgba(13,148,136,0.20)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {icon}
                {label}
                {/* <span
                  className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "#f0fdfa",
                    color: active ? "#ffffff" : "#0d9488",
                  }}
                >
                  {key === "courses" ? courses.length : instructors.length}
                </span> */}
              </button>
            );
          })}
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
        >
          {/* Card header with search */}
          <div
            className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>
                {activeTab === "courses" ? "Pending Courses" : "Pending Instructors"}
              </span>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-sm"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <SearchBar
                value={search}
                placeholder={`Search ${activeTab}…`}
                onSearch={(query) => { setSearch(query); setPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            {activeTab === "courses" && (
              <Table<Course> columns={courseColumns} data={courses} loading={loading} />
            )}
            {activeTab === "instructors" && (
              <Table<Instructor> columns={instructorColumns} data={instructors} loading={loading} />
            )}
          </div>

          {/* Empty state */}
          {!loading && (activeTab === "courses" ? courses : instructors).length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <CheckCircle2 className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">
                No pending {activeTab} to review right now.
              </p>
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

      {/* ══════════════════════════════════════════
          CONFIRMATION MODAL
      ══════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="modal-enter w-full max-w-md rounded-2xl p-6"
            style={{ background: "#ffffff", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: modalType === "approve" ? "#d1fae5" : "#fee2e2",
                  }}
                >
                  {modalType === "approve"
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: "#065f46" }} />
                    : <AlertTriangle className="w-5 h-5" style={{ color: "#991b1b" }} />
                  }
                </div>
                <div>
                  <h3 className="font-black text-lg" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                    {modalType === "approve" ? "Approve" : "Reject"}{" "}
                    {activeTab === "courses" ? "Course" : "Instructor"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalType === "approve" ? "This will make it live" : "This will block publication"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Target info */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "#ccfbf1" }}
              >
                {activeTab === "courses"
                  ? <BookOpen className="w-4 h-4 text-teal-600" />
                  : <GraduationCap className="w-4 h-4 text-teal-600" />
                }
              </div>
              <p className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>
                {modalTargetName}
              </p>
            </div>

            {/* Remarks — shown for both but required label only for reject */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Remarks {modalType === "reject" && <span className="text-red-400">*</span>}
                {modalType === "approve" && <span className="font-normal normal-case tracking-normal ml-1 text-slate-300">(optional)</span>}
              </label>
              <textarea
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.15s ease",
                }}
                rows={3}
                placeholder={
                  modalType === "approve"
                    ? "Add an optional note…"
                    : "Explain why this is being rejected…"
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                onFocus={e => (e.currentTarget.style.borderColor = "#0d9488")}
                onBlur={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
              >
                Cancel
              </button>
              <button
                onClick={activeTab === "courses" ? handleCourseVerification : handleInstructorVerification}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                style={{
                  background: modalType === "approve" ? "#0d9488" : "#dc2626",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = modalType === "approve" ? "#0f766e" : "#b91c1c")}
                onMouseLeave={e => (e.currentTarget.style.background = modalType === "approve" ? "#0d9488" : "#dc2626")}
              >
                {modalType === "approve"
                  ? <><CheckCircle2 className="w-4 h-4" /> Confirm Approval</>
                  : <><XCircle className="w-4 h-4" /> Confirm Rejection</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}