import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getInstructorVerifications } from "../../redux/services/adminServices"; // ✅ new service
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";

type InstructorVerification = {
  id: string;
  name: string;
  email: string;
  status: "All"|"Pending" | "Verified" | "Rejected";
  remarks: string | null;
  appliedOn: Date;
  profilePic: string | null;
};

export default function Verifications() {
  const { loading, errorMsg } = useSelector(
    (state: RootState) => state.status.admin
  );

  const dispatch = useDispatch<AppDispatch>();

  const [verifications, setVerifications] = useState<InstructorVerification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "All" | "Pending" | "Verified" | "Rejected"
  >("All");

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const response = await dispatch(
          getInstructorVerifications({ page, search, status, limit: 5 })
        ).unwrap();

        setVerifications(response.instructorVerifications ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch verifications:", err);
      }
    };

    fetchVerifications();

    return () => {
      dispatch(clearAdminStatus());
    };
  }, [dispatch, page, search, status]);

  const columns: Column<InstructorVerification>[] = [
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
      render: (row) => {
        let color = "text-gray-600";
        if (row.status === "Pending") color = "text-yellow-600";
        if (row.status === "Under review") color = "text-blue-600";
        if (row.status === "Verified") color = "text-green-600";
        if (row.status === "Rejected") color = "text-red-600";

        return <span className={color}>{row.status}</span>;
      },
    },
    {
      header: "Remarks",
      render: (row) => (
        <span className="text-gray-700">
          {row.remarks ? row.remarks : "-"}
        </span>
      ),
    },
    {
      header: "Applied On",
      render: (row) => (
        <span className="text-gray-500">
          {new Date(row.appliedOn).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (loading) return <p>Loading verification requests...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Instructor Verification Requests</h1>

      <div className="flex gap-3 mb-4">
        <SearchBar
          value={search}
          placeholder="Search instructors..."
          onSearch={(query) => {
            setSearch(query);
          }}
        />

        <FilterDropdown
          value={status}
          options={[
            "All",
            "Pending",
            "Under review",
            "Verified",
            "Rejected",
          ]}
          onChange={(newStatus) => {
            setStatus(newStatus as any);
            setPage(1);
          }}
        />
      </div>

      <Table<InstructorVerification> columns={columns} data={verifications} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
