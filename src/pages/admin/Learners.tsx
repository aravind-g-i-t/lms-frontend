import { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getLearnerData, getLearners, toggleLearnerStatus } from "../../services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import FallbackUI from "../../components/shared/FallbackUI";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { UserListSkeleton } from "../../components/admin/UserListSkeleton";

type Learner = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
};

type LearnerView = {
  name: string;
  email: string;
  profilePic: string | null;
  joiningDate: Date | null;
  hasPassword: boolean;
};

type Status = "All" | "Active" | "Blocked";

export default function ManageLearners() {
  const dispatch = useDispatch<AppDispatch>();

  const [learners, setLearners] = useState<Learner[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [learnerView, setLearnerView] = useState<LearnerView | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchFailure, setFetchFailure] = useState(false);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        setLoading(true)
        const response = await dispatch(getLearners({ page, search, status, limit: 5 })).unwrap();
        setLearners(response.learners ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        setFetchFailure(true)
        console.error("Failed to fetch learners:", err);
        toast.error(err as string)
      } finally {
        setLoading(false)
      }
    };

    fetchLearners();


  }, [dispatch, page, search, status]);

  const handleToggleStatus = useCallback(async (payload: { id: string }) => {
    try {
      await dispatch(toggleLearnerStatus(payload)).unwrap();
      const updatedLearners = learners.map((learner) =>
        learner.id === payload.id ? { ...learner, isActive: !learner.isActive } : learner
      );
      setLearners(updatedLearners);
    } catch (error) {
      toast.error(error as string)
    }
  },[dispatch,learners]);

  const handleViewLearner = useCallback(async (id: string) => {
    try {
      const response = await dispatch(getLearnerData({ id })).unwrap();
      setLearnerView(response.learner);
    } catch (error) {
      toast.error(error as string)
    }
  },[dispatch]);

  const columns=useMemo< Column<Learner>[]>(() => [
    {
      header: "Learner",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.profilePic || "/images/default-profile.jpg"}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus({ id: row.id })}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              row.isActive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {row.isActive ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => handleViewLearner(row.id)}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700"
          >
            View
          </button>
        </div>
      ),
    },
  ],[handleToggleStatus,handleViewLearner]);

  if (loading) return <UserListSkeleton />;
  if (fetchFailure) return <FallbackUI />

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold text-foreground">Manage Learners</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all registered learners
        </p>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            value={search}
            placeholder="Search learners..."
            onSearch={(query) => setSearch(query)}
          />

          <div className="flex gap-3 flex-wrap">
            <FilterDropdown<Status>
              label="Status"
              value={status}
              options={["All", "Active", "Blocked"]}
              onChange={(newStatus) => {
                setStatus(newStatus);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table - Scrollable */}
      <div className="flex-1 overflow-auto mb-4">
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <Table<Learner> columns={columns} data={learners} />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-shrink-0 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* View Modal */}
      {learnerView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xl p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Learner Details</h2>
              <button
                onClick={() => setLearnerView(null)}
                className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
                <img
                  src={learnerView.profilePic || "/images/default-profile.jpg"}
                  alt={learnerView.name}
                  className="w-24 h-24 rounded-full border-4 border-primary/10 object-cover shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{learnerView.name}</h3>
                  <p className="text-muted-foreground mb-2">{learnerView.email}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Joining Date
                  </p>
                  <p className="text-foreground font-medium">
                    {learnerView.joiningDate
                      ? new Date(learnerView.joiningDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Account Type
                  </p>
                  <p className="text-foreground font-medium">
                    {learnerView.hasPassword ? "Email/Password" : "Google Sign-In"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}