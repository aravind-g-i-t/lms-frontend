import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "../../redux/store";
import { getCoursesForAdmin, updateCourseVerification, } from "../../services/adminServices";

type CourseStatus = "draft" | "published" | "archived";
type VerificationStatus = "not_verified" | "under_review" | "verified" | "rejected" | "blocked";

export interface Course {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  }
  instructor: {
    id: string;
    name: string
  };
  status: CourseStatus;
  thumbnail: string | null;
  price: number;
  isActive: boolean;
  verification: {
    status: VerificationStatus,
  }
}

type StatusLabel = "All" | "Published" | "Draft" | "Archived";
type VerStatusLabel = "All" | "Verified" | "Rejected" | "Under Review" | "Not Verified" | "Blocked";

const statusMap: Record<string, string | undefined> = {
  "All": undefined,
  "Draft": "draft",
  "Published": "published",
  "Archived": "archived",
};

const verificationStatusMap: Record<string, string | undefined> = {
  "All": undefined,
  "Verified": "verified",
  "Not Verified": "not_verified",
  "Under Review": "under_review",
  "Rejected": "rejected",
  "Blocked": "blocked"
};

export default function ManageCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusLabel>("All");
  const [verStatus, setVerStatus] = useState<VerStatusLabel>("All");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"block" | "unblock" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [selectedId,setSelectedId]= useState<string|null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getCoursesForAdmin({
            page,
            search,
            status: statusMap[status],
            verificationStatus: verificationStatusMap[verStatus],
            limit: 5
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
  }, [dispatch, page, search, status, verStatus]);

  const handleCourseApproval = async () => {
    try {
      if (!modalType||!selectedId) return;

      const statusMap = {
        block: "blocked",
        unblock: "verified",
      } as const;

      const result = await dispatch(
        updateCourseVerification({
          courseId:selectedId,
          status: statusMap[modalType],
          remarks: remarks.trim() || null,
        })
      ).unwrap();

      const updated = courses.map((course) => {
        if (course.id === selectedId) {
          course.verification = result.verification
        }
        return course
      });
      setCourses(updated)

      setModalOpen(false);
      setRemarks("");
      setModalType(null);
      toast.success(`Course ${modalType.replace("_", " ") + "ed"} successfully.`);
    } catch (error) {
      toast.error(error as string);
    }
  };

  const columns: Column<Course>[] = [
    {
      header: "Title",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.thumbnail || "/images/learning.png"}
            alt={row.title}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">
              {row.category.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Instructor",
      render: (row) => (
        <Link to={``}>{row.instructor.name}</Link>
      )
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${row.status === "published"
          ? "bg-teal-100 text-teal-700"
          : row.status === "draft"
            ? "bg-gray-100 text-gray-600"
            : "bg-red-100 text-red-700"
          }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Verification",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${row.verification.status === "verified"
            ? "bg-teal-100 text-teal-700 border border-teal-200"
            : row.verification.status === "rejected"
              ? "bg-red-100 text-red-700 border border-red-200"
              : row.verification.status === "under_review"
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : row.verification.status === "blocked"
                  ? "bg-gray-200 text-red-800 border border-red-300"
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
      header: "Price",
      render: (row) => (
        <span className="text-xs text-gray-700">
          ₹{row.price}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {(row.verification.status === "verified" || row.verification.status === "blocked") && (
            

            <button
              onClick={() => {
                setModalOpen(true);
                setSelectedId(row.id)
                if(row.verification.status === "verified"){
                  setModalType("block")
                }else{
                  setModalType("unblock")
                }
              }}
              className={`px-2 py-1 text-xs rounded ${row.verification.status === "verified"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                }`}
            >
              {row.verification.status === "verified" ? "Block" : "Unblock"}
            </button>
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
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teal-700">Manage Courses</h1>
          <p className="text-sm text-teal-600 mt-1">
            Browse and administer all courses on the platform.
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
          <div className="flex gap-3 flex-wrap">
            <FilterDropdown<StatusLabel>
              label="Course Status"
              value={status}
              options={["All", "Published", "Draft", "Archived"]}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
            />
            <FilterDropdown<VerStatusLabel>
              label="Verification"
              value={verStatus}
              options={["All", "Verified", "Rejected", "Under Review", "Not Verified", "Blocked"]}
              onChange={(val) => {
                setVerStatus(val);
                setPage(1);
              }}
            />
          </div>
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2 capitalize">
              {modalType === "block" && "Block Course"}
              {modalType === "unblock" && "Unblock Course"}
            </h3>
            <p className="mb-4">
              {modalType === "block"
                ? "Please provide a reason for blocking this course."
                : "Are you sure you want to unblock this course?"}
            </p>

            {(modalType === "block") && (
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
                onClick={handleCourseApproval}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  (modalType === "block") && remarks.trim() === ""
                }
              >
                {modalType === "block"
                  ? "Block"
                  : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
