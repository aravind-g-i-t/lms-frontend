import { useEffect, useState } from "react";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { getBusinesses, toggleBusinessStatus } from "../../redux/services/adminServices";
import { Pagination } from "../../components/shared/Pagination";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { clearAdminStatus } from "../../redux/slices/statusSlice";

type Business = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  planName:string;
  employeeCount:number;
  profilePic?: string;
};

export default function ManageBusinesses() {
  const { loading, errorMsg } = useSelector(
    (state: RootState) => state.status.admin
  );

  const dispatch = useDispatch<AppDispatch>();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await dispatch(
          getBusinesses({ page, search, status, limit: 5 })
        ).unwrap();

        setBusinesses(response.businesses ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
      }
    };

    fetchBusinesses();
    return()=>{
      dispatch(clearAdminStatus())
    }
  }, [dispatch, page, search, status]);


  const handleToggleStatus = async (payload: { id: string }) => {
      console.log('prev');
      
      await dispatch(toggleBusinessStatus(payload)).unwrap();
      console.log('follows');
      
      const updatedBusinesses = businesses.map((business) =>
        business.id === payload.id
          ? { ...business, isActive: !business.isActive }
          : business
      );
      setBusinesses(updatedBusinesses)
    }

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
    { header: "Employees", accessor: "employeeCount" },
    { header: "Plan", accessor: "planName" },
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

  if (loading) return <p>Loading businesses...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Businesses</h1>

      <div className="flex gap-3 mb-4">
        <SearchBar
          value={search}
          placeholder="Search businesses..."
          onSearch={(query) => {
            setSearch(query);
          }}
        />



        <FilterDropdown
          value={status}
          onChange={(newStatus) => {
            setStatus(newStatus);
            setPage(1); // reset page on filter change
          }}
        />
      </div>

      <Table<Business> columns={columns} data={businesses} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
