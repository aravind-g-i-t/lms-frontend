import { useEffect, useRef, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import {
  getInstructorData,
  getInstructors,
  toggleInstructorStatus,
  updateInstructorVerificationStatus,
} from "../../services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { toast } from "react-toastify";
import FallbackUI from "../../components/shared/FallbackUI";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import { UserListSkeleton } from "../../components/admin/UserListSkeleton";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";

type Instructor = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
  verification: {
    status: string;
    remarks: string | null;
  };
};

type InstructorView = {
  name: string;
  email: string;
  verification: {
    status: "Not Submitted" | "Under Review" | "Verified" | "Rejected";
    remarks: string | null;
  };
  profilePic: string | null;
  joiningDate: Date | null;
  website: string | null;
  bio: string | null;
  hasPassword: boolean;
  designation: string | null;
  expertise: string[];
  resume: string | null;
  rating: number | null;
  identityProof: string | null;
};

type Status = "All" | "Active" | "Blocked";
type VerificationStatus =
  | "All"
  | "Not Submitted"
  | "Under Review"
  | "Verified"
  | "Rejected";

export default function ManageInstructors() {
  const dispatch = useDispatch<AppDispatch>();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("All");

  const [newVerificationStatus, setNewVerificationStatus] =
    useState<"Verified" | "Rejected">("Verified");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [instructorView, setInstructorView] =
    useState<InstructorView | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetchFailure, setFetchFailure] = useState(false);

  const remarksRef = useRef<HTMLInputElement>(null);
  const [idProofModal, setIdProofModal] = useState(false);

  // ✅ Confirmation state
  const [confirmState, setConfirmState] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getInstructors({ page, search, status, limit: 5, verificationStatus })
        ).unwrap();

        setInstructors(response.data.instructors ?? []);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (err) {
        setFetchFailure(true);
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [dispatch, page, search, status, verificationStatus]);

  // ---------- Block / Unblock ----------
  const handleRequestToggle = (id: string, isActive: boolean) => {
    setConfirmState({ id, isActive });
  };

  const handleConfirmToggle = async () => {
    if (!confirmState) return;

    try {
      setActionLoading(true);

      await dispatch(
        toggleInstructorStatus({ id: confirmState.id })
      ).unwrap();

      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor.id === confirmState.id
            ? { ...instructor, isActive: !instructor.isActive }
            : instructor
        )
      );

      toast.success(
        `Instructor ${
          confirmState.isActive ? "blocked" : "unblocked"
        } successfully`
      );
    } catch (error) {
      toast.error(error as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  // ---------- View ----------
  const handleViewInstructor = async (id: string) => {
    try {
      const response = await dispatch(getInstructorData({ id })).unwrap();
      setInstructorView(response.data.instructor);
      setSelectedId(id);
    } catch (error) {
      toast.error(error as string);
    }
  };

  // ---------- Verification ----------
  const updateVerificationStatus = async () => {
    if (!selectedId) return;

    const remarks = remarksRef.current?.value || null;

    try {
      await dispatch(
        updateInstructorVerificationStatus({
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

      setInstructorView((prev) =>
        prev ? { ...prev, verification } : prev
      );

      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor.id === selectedId
            ? { ...instructor, verification }
            : instructor
        )
      );
    } catch (error) {
      toast.error(error as string);
    }
  };

  const columns: Column<Instructor>[] = [
    {
      header: "Instructor",
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
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleRequestToggle(row.id, row.isActive)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              row.isActive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {row.isActive ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => handleViewInstructor(row.id)}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <UserListSkeleton />;
  if (fetchFailure) return <FallbackUI />;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold text-foreground">Manage Instructors</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all registered instructors</p>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            value={search}
            placeholder="Search instructors..."
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

      {/* Table - Scrollable */}
      <div className="flex-1 overflow-auto mb-4">
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <Table<Instructor> columns={columns} data={instructors} />
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
      {instructorView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-xl p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Instructor Details</h2>
              <button
                onClick={() => setInstructorView(null)}
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
                  src={instructorView.profilePic || "/images/default-profile.jpg"}
                  alt={instructorView.name}
                  className="w-24 h-24 rounded-full border-4 border-primary/10 object-cover shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{instructorView.name}</h3>
                  <p className="text-muted-foreground mb-2">{instructorView.email}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold mt-1 ${instructorView.verification.status === "Verified"
                      ? "bg-success/10 text-success"
                      : instructorView.verification.status === "Rejected"
                        ? "bg-destructive/10 text-destructive"
                        : instructorView.verification.status === "Under Review"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {instructorView.verification.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Joining Date</p>
                    <p className="text-foreground font-medium">
                      {instructorView.joiningDate
                        ? new Date(instructorView.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Designation</p>
                    <p className="text-foreground font-medium">{instructorView.designation || "—"}</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Website</p>
                    <p className="text-foreground font-medium">
                      {instructorView.website ? (
                        <a
                          href={instructorView.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline"
                        >
                          {instructorView.website}
                        </a>
                      ) : "—"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Rating</p>
                    <p className="text-foreground font-medium">
                      {instructorView.rating !== null ? `${instructorView.rating}/5` : "—"}
                    </p>
                  </div>
                  {instructorView.verification.remarks && (
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Remarks</p>
                      <p className="text-foreground">{instructorView.verification.remarks}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Expertise</p>
                  <p className="text-foreground font-medium">
                    {instructorView.expertise.length > 0 ? instructorView.expertise.join(", ") : "—"}
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bio</p>
                  <p className="text-foreground">{instructorView.bio || "No bio available"}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Resume</p>
                  <p className="text-foreground">
                    {instructorView.resume ? (
                      <a
                        href={instructorView.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        View Resume
                      </a>
                    ) : "—"}
                  </p>
                </div>

                {/* Identity Proof Section */}
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Identity Proof</p>
                  {instructorView.identityProof ? (
                    <img
                      src={instructorView.identityProof}
                      alt="Identity Proof"
                      className="w-48 h-auto rounded-md border shadow-sm cursor-pointer"
                      onClick={() => setIdProofModal(true)}
                    />
                  ) : (
                    <p className="text-foreground">Not submitted</p>
                  )}
                </div>

                <ReactModal
                  isOpen={idProofModal}
                  onRequestClose={() => setIdProofModal(false)}
                  className="bg-white rounded-2xl shadow-lg max-w-3xl w-full mx-auto p-6 outline-none relative"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
                  ariaHideApp={false}
                >
                  <button
                    onClick={() => setIdProofModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <h2 className="text-xl font-semibold mb-4">Government ID Proof</h2>

                  {instructorView.identityProof?.endsWith(".pdf") ? (
                    <iframe
                      src={instructorView.identityProof}
                      className="w-full h-[500px] rounded-lg border"
                      title="ID Proof PDF"
                    />
                  ) : (
                    <img
                      src={instructorView.identityProof || ""}
                      alt="Government ID Proof"
                      className="max-h-[500px] mx-auto rounded-lg border"
                    />
                  )}
                </ReactModal>
              </div>

              {/* Manage Verification */}
              {instructorView.verification.status === "Under Review" && (
                <div className="mt-6 pt-6 border-t border-border bg-secondary/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Manage Verification Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Change Status
                      </label>
                      <select
                        value={newVerificationStatus}
                        onChange={(e) => setNewVerificationStatus(e.target.value as "Verified" | "Rejected")}
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
       <ConfirmDialog
        open={!!confirmState}
        title={
          confirmState?.isActive ? "Block Instructor" : "Unblock Instructor"
        }
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