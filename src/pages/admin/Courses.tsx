import { useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { getCoursesForAdmin, updateCourseVerification } from "../../services/adminServices";
import { useFeedback } from "../../hooks/useFeedback";
import {
  Star, StarHalf, BookOpen, Search, Filter,
  Eye, ShieldOff, ShieldCheck, X, AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type CourseStatus = "draft" | "published" | "archived";
type VerificationStatus = "not_verified" | "under_review" | "verified" | "rejected" | "blocked";

export interface Course {
  id: string;
  title: string;
  category: { id: string; name: string };
  instructor: { id: string; name: string };
  status: CourseStatus;
  thumbnail: string | null;
  price: number;
  isActive: boolean;
  verification: { status: VerificationStatus };
  rating: number | null;
  enrollmentCount: number;
}

type StatusLabel    = "All" | "Published" | "Draft" | "Archived";
type VerStatusLabel = "All" | "Verified" | "Rejected" | "Under Review" | "Not Verified" | "Blocked";

const statusMap: Record<string, string | undefined> = {
  All: undefined, Draft: "draft", Published: "published", Archived: "archived",
};
const verificationStatusMap: Record<string, string | undefined> = {
  All: undefined, Verified: "verified", "Not Verified": "not_verified",
  "Under Review": "under_review", Rejected: "rejected", Blocked: "blocked",
};

/* ── Badge helpers ── */
const COURSE_STATUS_STYLE: Record<CourseStatus, { bg: string; color: string; dot: string }> = {
  published: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  draft:     { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  archived:  { bg: "#fee2e2", color: "#991b1b", dot: "#f87171" },
};
const VER_STATUS_STYLE: Record<VerificationStatus, { bg: string; color: string; dot: string }> = {
  verified:    { bg: "#d1fae5", color: "#065f46",  dot: "#10b981" },
  under_review:{ bg: "#fef3c7", color: "#92400e",  dot: "#fbbf24" },
  rejected:    { bg: "#fee2e2", color: "#991b1b",  dot: "#f87171" },
  blocked:     { bg: "#f1f5f9", color: "#991b1b",  dot: "#f87171" },
  not_verified:{ bg: "#f1f5f9", color: "#64748b",  dot: "#94a3b8" },
};

/* ── Star rating renderer ── */
function StarRating({ rating }: { rating: number | null }) {
  const val = rating ?? 0;
  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          val >= i ? (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
          ) : val >= i - 0.5 ? (
            <StarHalf key={i} size={12} className="fill-amber-400 text-amber-400" />
          ) : (
            <Star key={i} size={12} className="text-slate-200" />
          )
        ))}
      </div>
      <span className="text-xs font-semibold" style={{ color: "#64748b", fontFamily: "'DM Mono', monospace" }}>
        {rating ? rating.toFixed(1) : "N/A"}
      </span>
    </div>
  );
}

export default function ManageCourses() {
  const dispatch  = useDispatch<AppDispatch>();
  const feedback  = useFeedback();
  const navigate  = useNavigate();

  const [courses,    setCourses]    = useState<Course[]>([]);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState<StatusLabel>("All");
  const [verStatus,  setVerStatus]  = useState<VerStatusLabel>("All");
  const [loading,    setLoading]    = useState(false);

  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalType,  setModalType]  = useState<"block" | "unblock" | null>(null);
  const [remarks,    setRemarks]    = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [totalCount,setTotalCount]= useState(0)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getCoursesForAdmin({
            page, search,
            status: statusMap[status],
            verificationStatus: verificationStatusMap[verStatus],
            limit: 5,
          })
        ).unwrap();
        setCourses(response.data.courses ?? []);
        setTotalPages(response.data.pagination.totalPages ?? 1);
        setTotalCount(response.data.pagination.totalCount ?? 0);
      } catch (err) {
        feedback.error("Error", err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch, page, search, status, verStatus, feedback]);

  const openModal = (course: Course, type: "block" | "unblock") => {
    setSelectedId(course.id);
    setSelectedCourse(course);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setRemarks("");
    setModalType(null);
    setSelectedId(null);
    setSelectedCourse(null);
  };

  const handleCourseApproval = async () => {
    try {
      if (!modalType || !selectedId) return;
      const newStatus = modalType === "block" ? "blocked" : "verified";
      const result = await dispatch(
        updateCourseVerification({ courseId: selectedId, status: newStatus, remarks: remarks.trim() || null })
      ).unwrap();
      setCourses(courses.map((c) => c.id === selectedId ? { ...c, verification: result.data.verification } : c));
      closeModal();
      feedback.success("Success", `Course ${modalType}ed successfully.`);
    } catch (error) {
      feedback.error("Error", error as string);
    }
  };

  const columns = useMemo<Column<Course>[]>(() => [
    {
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid #e2e8f0" }}>
            {row.thumbnail ? (
              <img src={row.thumbnail} alt={row.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#f0fdfa,#e0f2fe)" }}>
                <BookOpen className="w-5 h-5 text-teal-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate max-w-[180px]" style={{ color: "#0f172a" }}>
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
        <Link
          to={`/admin/instructor/${row.instructor.id}`}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
        >
          {row.instructor.name}
        </Link>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const s = COURSE_STATUS_STYLE[row.status];
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: s.bg, color: s.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Verification",
      render: (row) => {
        const v = VER_STATUS_STYLE[row.verification.status];
        const label = row.verification.status.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: v.bg, color: v.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.dot }} />
            {label}
          </span>
        );
      },
    },
    {
      header: "Rating",
      render: (row) => <StarRating rating={row.rating} />,
    },
    {
      header: "Enrolled",
      render: (row) => (
        <span className="text-sm font-semibold" style={{ color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
          {row.enrollmentCount.toLocaleString("en-IN")}
        </span>
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
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {(row.verification.status === "verified" || row.verification.status === "blocked") && (
            <button
              onClick={() => openModal(row, row.verification.status === "verified" ? "block" : "unblock")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: row.verification.status === "verified" ? "#fee2e2" : "#d1fae5",
                color:      row.verification.status === "verified" ? "#991b1b" : "#065f46",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {row.verification.status === "verified"
                ? <><ShieldOff  className="w-3.5 h-3.5" /> Block</>
                : <><ShieldCheck className="w-3.5 h-3.5" /> Unblock</>
              }
            </button>
          )}
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
        .modal-enter { animation: modalIn 0.2s ease; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
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
              Manage Courses
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse and administer all courses on the platform
            </p>
          </div>
          <span
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
            style={{ background: "#ccfbf1", color: "#0f766e" }}
          >
            <BookOpen className="w-4 h-4" />
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
              <BookOpen className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>Course List</span>
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
                  placeholder="Search courses…"
                  onSearch={(q) => { setSearch(q); setPage(1); }}
                />
              </div>

              {/* Course status filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown<StatusLabel>
                  label="Status"
                  value={status}
                  options={["All", "Published", "Draft", "Archived"]}
                  onChange={(val) => { setStatus(val); setPage(1); }}
                />
              </div>

              {/* Verification filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown<VerStatusLabel>
                  label="Verification"
                  value={verStatus}
                  options={["All", "Verified", "Rejected", "Under Review", "Not Verified", "Blocked"]}
                  onChange={(val) => { setVerStatus(val); setPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table<Course> columns={columns} data={courses} loading={loading} />
          </div>

          {/* Empty state */}
          {!loading && courses.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <BookOpen className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">No courses found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-center" style={{ borderTop: "1px solid #f1f5f9" }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BLOCK / UNBLOCK MODAL
      ══════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="modal-enter w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #f1f5f9" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: modalType === "block" ? "#fee2e2" : "#d1fae5" }}
                >
                  {modalType === "block"
                    ? <AlertTriangle className="w-5 h-5" style={{ color: "#991b1b" }} />
                    : <CheckCircle2  className="w-5 h-5" style={{ color: "#065f46" }} />
                  }
                </div>
                <div>
                  <h3 className="font-black text-base" style={{ color: "#0f172a", letterSpacing: "-0.3px" }}>
                    {modalType === "block" ? "Block Course" : "Unblock Course"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalType === "block" ? "This will hide the course from learners" : "This will restore course visibility"}
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

            <div className="px-6 py-5 space-y-4">
              {/* Course preview */}
              {selectedCourse && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ border: "1px solid #e2e8f0" }}>
                    {selectedCourse.thumbnail ? (
                      <img src={selectedCourse.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "#f0fdfa" }}>
                        <BookOpen className="w-4 h-4 text-teal-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>
                      {selectedCourse.title}
                    </p>
                    <p className="text-xs text-slate-400">{selectedCourse.instructor.name}</p>
                  </div>
                </div>
              )}

              {/* Remarks — required for block */}
              {modalType === "block" && (
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: "#475569" }}
                  >
                    Reason for blocking <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Explain why this course is being blocked…"
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#0f172a",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.10)"; }}
                    onBlur={e  => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
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
                  onClick={handleCourseApproval}
                  disabled={modalType === "block" && remarks.trim() === ""}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: modalType === "block" ? "#dc2626" : "#0d9488" }}
                  onMouseEnter={e => {
                    if (!(e.currentTarget as HTMLButtonElement).disabled)
                      e.currentTarget.style.background = modalType === "block" ? "#b91c1c" : "#0f766e";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = modalType === "block" ? "#dc2626" : "#0d9488";
                  }}
                >
                  {modalType === "block"
                    ? <><ShieldOff  className="w-4 h-4" /> Confirm Block</>
                    : <><ShieldCheck className="w-4 h-4" /> Confirm Unblock</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}