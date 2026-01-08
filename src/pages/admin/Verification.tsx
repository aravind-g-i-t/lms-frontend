import { useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
// import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "../../redux/store";
import {
  getCoursesForAdmin,
  updateCourseVerification,
} from "../../services/adminServices";

type VerificationStatus =
  | "not_verified"
  | "under_review"
  | "verified"
  | "rejected"
  | "blocked";

export interface Course {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  thumbnail: string | null;
  price: number;
  verification: {
    status: VerificationStatus;
  };
}

// type VerStatusLabel =
//   | "All"
//   | "Verified"
//   | "Rejected"
//   | "Under Review"
//   | "Not Verified"
//   | "Blocked";



export default function Verifications() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
//   const [verStatus, setVerStatus] = useState<VerStatusLabel>("Under Review");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getCoursesForAdmin({
            page,
            search,
            verificationStatus:"under_review",
            limit: 5,
          })
        ).unwrap();

        setCourses(response.courses ?? []);
        setTotalPages(response.pagination.totalPages ?? 1);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [dispatch, page, search]);

  const handleCourseVerification = async () => {
    try {
      if (!modalType || !selectedId) return;

      const newStatus =
        modalType === "approve" ? "verified" : "rejected";

      const result = await dispatch(
        updateCourseVerification({
          courseId: selectedId,
          status: newStatus,
          remarks: remarks.trim() || null,
        })
      ).unwrap();

      const updated = courses.map((course) =>
        course.id === selectedId
          ? { ...course, verification: result.verification }
          : course
      );

      setCourses(updated);
      setModalOpen(false);
      setRemarks("");
      setModalType(null);

      toast.success(
        `Course ${modalType === "approve" ? "approved" : "rejected"} successfully.`
      );
    } catch (error) {
      toast.error(error as string);
    }
  };

  const columns=useMemo<Column<Course>[]>(() =>  [
    {
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.thumbnail || "/images/learning.png"}
            alt={row.title}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">{row.category.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Instructor",
      render: (row) => (
        <Link to={`/admin/instructors/${row.instructor.id}`} className="text-teal-600 hover:underline">
          {row.instructor.name}
        </Link>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            row.verification.status === "verified"
              ? "bg-teal-100 text-teal-700 border border-teal-200"
              : row.verification.status === "rejected"
              ? "bg-red-100 text-red-700 border border-red-200"
              : row.verification.status === "under_review"
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {row.verification.status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (x) => x.toUpperCase())}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.verification.status === "under_review" && (
            <>
              <button
                onClick={() => {
                  setModalOpen(true);
                  setSelectedId(row.id);
                  setModalType("approve");
                }}
                className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
              >
                Approve
              </button>

              <button
                onClick={() => {
                  setModalOpen(true);
                  setSelectedId(row.id);
                  setModalType("reject");
                }}
                className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => navigate(`/admin/courses/${row.id}`)}
            className="px-2 py-1 text-xs rounded bg-teal-600 text-white hover:bg-teal-700"
          >
            View
          </button>
        </div>
      ),
    },
  ],[navigate]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teal-700">Verification Center</h1>
          <p className="text-sm text-teal-600 mt-1">
            Review and verify courses, instructors, and businesses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            value={search}
            placeholder="Search courses..."
            onSearch={(query) => setSearch(query)}
          />
          
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mb-4">
        <Table<Course> columns={columns} data={courses} loading={loading} />
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2 capitalize">
              {modalType === "approve" && "Approve Course"}
              {modalType === "reject" && "Reject Course"}
            </h3>
            <p className="mb-4">
              {modalType === "reject"
                ? "Please provide a reason for rejecting this course."
                : "Are you sure you want to approve this course?"}
            </p>

            {modalType === "reject" && (
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setRemarks("");
                  setModalType(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCourseVerification}
                className={`px-4 py-2 rounded text-white ${
                  modalType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={modalType === "reject" && remarks.trim() === ""}
              >
                {modalType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
