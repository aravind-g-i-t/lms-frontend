import { useEffect, useRef, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import {
  getBusinessData,
  getBusinesses,
  toggleBusinessStatus,
  updateBusinessVerificationStatus,
} from "../../redux/services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import FallbackUI from "../../components/shared/FallbackUI";
import ReactModal from "react-modal";

type BusinessView = {
  name: string;
  email: string;
  joiningDate: Date;
  verification: {
    status: "Not Submitted" | "Under Review" | "Verified" | "Rejected";
    remarks: string | null;
  };
  businessDomain: string | null;
  website: string | null;
  location: string | null;
  profilePic: string | null;
  hasPassword: boolean;
  license: string | null;
};

type Business = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  planName: string;
  employeeCount: number;
  profilePic?: string;
  verification: {
    status: string;
    remarks: string | null;
  };
  license: string | null;
};

type Status = "All" | "Active" | "Blocked";
type VerificationStatus =
  | "All"
  | "Not Submitted"
  | "Under Review"
  | "Verified"
  | "Rejected";

export default function ManageBusinesses() {
  const dispatch = useDispatch<AppDispatch>();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("All");
  const [businessView, setBusinessView] = useState<BusinessView | null>(null);
  const [newVerificationStatus, setNewVerificationStatus] = useState<
    "Verified" | "Rejected"
  >("Verified");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const remarksRef = useRef<HTMLInputElement>(null);
  const [fetchFailure, setFetchFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getBusinesses({
            page,
            search,
            status,
            limit: 5,
            verificationStatus,
          })
        ).unwrap();

        setBusinesses(response.businesses ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        setFetchFailure(true);
        console.error("Failed to fetch businesses:", err);
        toast.error(err as string)
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
    return () => {
      dispatch(clearAdminStatus());
    };
  }, [dispatch, page, search, status, verificationStatus]);

  const handleToggleStatus = async (payload: { id: string }) => {
    try {
      await dispatch(toggleBusinessStatus(payload)).unwrap();

    const updatedBusinesses = businesses.map((business) =>
      business.id === payload.id
        ? { ...business, isActive: !business.isActive }
        : business
    );
    setBusinesses(updatedBusinesses);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const handleViewBusiness = async (id: string) => {
    try {
      const response = await dispatch(getBusinessData({ id })).unwrap();
    setBusinessView(response.business);
    setSelectedId(id);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const updateVerificationStatus = async () => {
    if (!selectedId) return;

    const remarks = remarksRef.current?.value || null;

    try {
      await dispatch(
      updateBusinessVerificationStatus({
        id: selectedId,
        remarks,
        status: newVerificationStatus,
      })
    ).unwrap();

    toast.success("Verification status updated successfully");

    const verification = {
      remarks,
      status: newVerificationStatus,
    };

    setBusinessView((prev) => (prev ? { ...prev, verification } : prev));

    const updatedBusinesses = businesses.map((b) => {
      if (b.id === selectedId) b.verification = verification;
      return b;
    });
    setBusinesses(updatedBusinesses);
    } catch (error) {
      toast.error(error as string)
    }
  };

  const closeModal = () => setBusinessView(null);

  const columns: Column<Business>[] = [
    {
      header: "Business",
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
        <span className={row.isActive ? "text-green-600" : "text-red-600"}>
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    { header: "Employees", accessor: "employeeCount" },
    { header: "Plan", accessor: "planName" },
    {
      header: "Verification",
      render: (row) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${row.verification.status === "Verified"
            ? "bg-green-100 text-green-700 border border-green-200"
            : row.verification.status === "Rejected"
              ? "bg-red-100 text-red-700 border border-red-200"
              : row.verification.status === "Under Review"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
        >
          {row.verification.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus({ id: row.id })}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm hover:shadow ${
              row.isActive
                ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
                : "bg-teal-600 hover:bg-teal-700 active:bg-teal-800"
            }`}
          >
            {row.isActive ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => handleViewBusiness(row.id)}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold transition-all shadow-sm hover:shadow"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Loading businesses...</p>;
  if (fetchFailure) return <FallbackUI />;

  return (
    <div className="h-full flex flex-col overflow-hidden">
  <div className="flex-shrink-0">
        {/* Header */}
        <div className="mb-4">
      <h1 className="text-2xl font-bold">
            Manage Businesses
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all registered businesses
          </p>
        </div>

        {/* Filters */}
    <div className="bg-card rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <SearchBar
              value={search}
              placeholder="Search businesses..."
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
              <FilterDropdown<VerificationStatus>
                label="Verification"
                value={verificationStatus}
                options={[
                  "All",
                  "Not Submitted",
                  "Under Review",
                  "Verified",
                  "Rejected",
                ]}
                onChange={(newStatus) => {
                  setVerificationStatus(newStatus);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
  <div className="flex-1 overflow-auto">
          <Table<Business> columns={columns} data={businesses} />
        </div>

        {/* Pagination */}
  <div className="flex-shrink-0 mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* Business View Modal */}
        {businessView && (
          <div className="fixed inset-0  flex items-center justify-center bg-white/50 backdrop-blur-xl p-4 animate-fade-in">
            <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Business Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Profile Section */}
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
                  <img
                    src={businessView.profilePic || "/images/default-profile.jpg"}
                    alt={businessView.name}
                    className="w-24 h-24 rounded-full border-4 border-primary/10 object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {businessView.name}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {businessView.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined:{" "}
                      {new Date(businessView.joiningDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Business Domain
                      </p>
                      <p className="text-foreground font-medium">
                        {businessView.businessDomain || "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Website
                      </p>
                      <p className="text-foreground font-medium">
                        {businessView.website || "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Location
                      </p>
                      <p className="text-foreground font-medium">
                        {businessView.location || "—"}
                      </p>
                    </div>
                    {/* License as a card */}
                    {businessView.license && (
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                          Business License
                        </p>
                        <button
                          onClick={() => setShowLicenseModal(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          View License
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Verification Status
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mt-1 ${businessView.verification.status === "Verified"
                          ? "bg-success/10 text-success"
                          : businessView.verification.status === "Rejected"
                            ? "bg-destructive/10 text-destructive"
                            : businessView.verification.status === "Under Review"
                              ? "bg-warning/10 text-warning"
                              : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {businessView.verification.status}
                      </span>
                    </div>
                    {businessView.verification.remarks && (
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                          Remarks
                        </p>
                        <p className="text-foreground">
                          {businessView.verification.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>



                {/* Verification Management */}
                {businessView.verification.status === "Under Review" && (
                  <div className="mt-6 pt-6 border-t border-border bg-secondary/10 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      Manage Verification Status
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Change Status
                        </label>
                        <select
                          value={newVerificationStatus}
                          onChange={(e) =>
                            setNewVerificationStatus(
                              e.target.value as "Verified" | "Rejected"
                            )
                          }
                          className="w-full md:w-auto px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="Verified">✓ Verified</option>
                          <option value="Rejected">✕ Rejected</option>
                        </select>
                      </div>

                      {newVerificationStatus === "Rejected" && (
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Rejection Remarks
                          </label>
                          <input
                            type="text"
                            ref={remarksRef}
                            maxLength={100}
                            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Enter reason for rejection..."
                          />
                        </div>
                      )}

                      <button
                        onClick={updateVerificationStatus}
                        className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                      >
                        Submit Status Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* License Modal */}
        <ReactModal
          isOpen={showLicenseModal}
          onRequestClose={() => setShowLicenseModal(false)}
          style={{
            content: {
              zIndex: 50,
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "80%",       // adjust width
              height: "80%",      // adjust height
              maxWidth: "900px",  // optional max width
              maxHeight: "90vh",  // optional max height
              padding: "1rem",
              borderRadius: "1rem",
              backgroundColor: "#1f2937" // match your theme
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.7)"
            }
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-xl">Business License</h2>
            <button
              onClick={() => setShowLicenseModal(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <iframe
            src={businessView?.license || ""}
            width="100%"
            height="100%"
            className="rounded-lg"
          />
        </ReactModal>
      </div>
    </div>
  );
}
