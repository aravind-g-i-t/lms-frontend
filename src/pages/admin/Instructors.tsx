import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getInstructors, toggleInstructorStatus } from "../../redux/services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";

type Instructor = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  profilePic?: string;
};

export default function ManageInstructors() {
  const { loading, errorMsg } = useSelector(
    (state: RootState) => state.status.admin
  );

  const dispatch = useDispatch<AppDispatch>();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await dispatch(
          getInstructors({ page, search, status, limit: 5 })
        ).unwrap();

        setInstructors(response.instructors ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      }
    };

    fetchInstructors();

    return()=>{
      dispatch(clearAdminStatus())
    }
  }, [dispatch, page, search, status]);


  const handleToggleStatus = async (payload: { id: string }) => {
      console.log('prev');
      
      await dispatch(toggleInstructorStatus(payload)).unwrap();
      console.log('follows');
      
      const updatedInstructors = instructors.map((instructor) =>
        instructor.id === payload.id
          ? { ...instructor, isActive: !instructor.isActive }
          : instructor
      );
      setInstructors(updatedInstructors)
    }

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

          {/* Name */}
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Status", 
      render:(row)=>(
        <span className={row.isActive ? "text-green-600" : "text-red-600"}>
        {row.isActive ? "Active" : "Blocked"}
      </span>
      )
    },
    { header: "Verification", 
      render:(row)=>(
        <span className={row.isVerified ? "text-green-600" : "text-red-600"}>
        {row.isVerified ? "Verified" : "Unverified"}
      </span>
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => handleToggleStatus({ id: row.id})}
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

  if (loading) return <p>Loading instructors...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Instructors</h1>

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
          onChange={(newStatus) => {
            setStatus(newStatus);
            setPage(1); 
          }}
        />
      </div>

      <Table<Instructor> columns={columns} data={instructors} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
