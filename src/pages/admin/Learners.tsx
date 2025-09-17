import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getLearners, toggleLearnerStatus } from "../../redux/services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";

type Learner = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  profilePic?: string;
};

export default function ManageLearners() {
  const { loading, errorMsg } = useSelector(
    (state: RootState) => state.status.admin
  );

  const dispatch = useDispatch<AppDispatch>();

  const [learners, setLearners] = useState<Learner[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const response = await dispatch(
          getLearners({ page, search, status, limit: 5 })
        ).unwrap();

        setLearners(response.learners ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch learners:", err);
      }
    };

    fetchLearners();

    return () => {
      dispatch(clearAdminStatus())
    }
  }, [dispatch, page, search, status]);


  const handleToggleStatus = async (payload: { id: string }) => {
    console.log('prev');

    await dispatch(toggleLearnerStatus(payload)).unwrap();
    console.log('follows');

    const updatedLearners = learners.map((learner) =>
      learner.id === payload.id
        ? { ...learner, isActive: !learner.isActive }
        : learner
    );
    setLearners(updatedLearners)
  }


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

          {/* Name */}
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      render: (row) => (
        <span
          className={row.isActive ? "text-green-600 font-medium" : "text-red-600 font-medium"}
        >
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus({ id: row.id })}
          className={`px-3 py-1 rounded text-white ${row.isActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {row.isActive ? "Block" : "Unblock"}
        </button>
      ),
    },
  ];


  if (loading) return <p>Loading learners...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Learners</h1>

      <div className="flex gap-3 mb-4">
        <SearchBar
          value={search}
          placeholder="Search learners..."
          onSearch={(query) => {
            setSearch(query);
          }}
        />


        <FilterDropdown
          value={status}
          onChange={(newStatus) => {
            setStatus(newStatus);
            setPage(1);
          }}
        />
      </div>

      <Table<Learner> columns={columns} data={learners} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
