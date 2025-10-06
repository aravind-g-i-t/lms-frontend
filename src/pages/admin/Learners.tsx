import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getLearnerData, getLearners, toggleLearnerStatus } from "../../redux/services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";
import FallbackUI from "../../components/shared/FallbackUI";
import { toast } from "react-toastify";

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
  const [loading,setLoading]=useState(false);
  const [fetchFailure,setFetchFailure]=useState(false);

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
      }finally{
        setLoading(false)
      }
    };

    fetchLearners();

    return () => {
      dispatch(clearAdminStatus());
    };
  }, [dispatch, page, search, status]);

  const handleToggleStatus = async (payload: { id: string }) => {
    try {
      await dispatch(toggleLearnerStatus(payload)).unwrap();
    const updatedLearners = learners.map((learner) =>
      learner.id === payload.id ? { ...learner, isActive: !learner.isActive } : learner
    );
    setLearners(updatedLearners);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const handleViewLearner = async (id: string) => {
    try {
      const response = await dispatch(getLearnerData({ id })).unwrap();
    setLearnerView(response.learner);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const columns: Column<Learner>[] = [
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
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${row.isActive ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}
          >
            {row.isActive ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => handleViewLearner(row.id)}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading learners...</p>;

  if(fetchFailure) return(
    <FallbackUI/>
  )
  return (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Learners</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered learners
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6 transition-all hover:shadow-md">
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

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-all hover:shadow-md">
        <Table<Learner> columns={columns} data={learners} />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* View Modal */}
      {learnerView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xl p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Learner Details</h2>
              <button
                onClick={() => setLearnerView(null)}
                className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                ✕
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
                  {/* <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mt-1 ${
                      learnerView.isActive
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {learnerView.isActive ? "Active" : "Blocked"}
                  </span> */}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                {/* <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Courses Enrolled
                  </p>
                  <p className="text-foreground font-medium">
                    {learnerView.courses?.length || 0}
                  </p>
                </div> */}
              </div>

              {/* Recent Activity */}
              {/* <div className="space-y-4 mb-6">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Recent Activity
                  </p>
                  <p className="text-foreground">
                    {learnerView.activity || "No recent activity"}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);


}
