import { useEffect, useState } from "react";
import { Plus, Edit2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { addCategory, getCategories, toggleCategoryStatus, updateCategory } from "../../redux/services/adminServices";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { toast } from "react-toastify";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import * as yup from "yup";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 20 characters")
    .matches(/^[a-zA-Z0-9 ]*$/, "Name can only contain letters, numbers, and spaces")
    .matches(/[a-zA-Z]/, "Name must contain at least one letter")

    .required("Name is required"),
  description: yup
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description must be less than 200 characters")
    .required("Description is required"),
  isActive: yup.boolean(),
});


interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}



export default function ManageCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getCategories({
            page,
            search: search,
            status,
            limit: 5
          })
        ).unwrap();

        setCategories(response.categories ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        toast.error(err as string)
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

  }, [dispatch, page, search, status]);



  const openModal = (item?: Category) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "", isActive: true });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", isActive: true });
  };

  const handleAddCategory = async () => {
    const isValid = await categorySchema.isValid(formData, { abortEarly: false });
    if (!isValid) {
      const validationErrors = await categorySchema.validate(formData, { abortEarly: false }).catch(err => err.errors);
      // validationErrors.forEach((message: string) => toast.error(message));
      toast.error(validationErrors[0])
      return;
    }

    setLoading(true);
    const { name, description, isActive } = formData;
    try {
      const response = await dispatch(addCategory({ name, description, isActive })).unwrap();
      setCategories([response.data, ...categories]);
      closeModal();
      toast.success("Category added successfully!");
    } finally {
      setLoading(false);
    }
  };



  const handleEditCategory = async () => {
  if (!editingItem) return;

  const isValid = await categorySchema.isValid(formData, { abortEarly: false });
    if (!isValid) {
      const validationErrors = await categorySchema.validate(formData, { abortEarly: false }).catch(err => err.errors);
      toast.error(validationErrors[0])
      // validationErrors.forEach((message: string) => toast.error(message));
      return;
    }

  setLoading(true);
  try {
    const response = await dispatch(updateCategory({ id: editingItem.id, ...formData })).unwrap();
    setCategories(categories.map((cat) => (cat.id === editingItem.id ? { ...cat, ...formData } : cat)));
    closeModal();
    toast.success(response.message || "Category updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update category");
  } finally {
    setLoading(false);
  }
};



  // const handleDelete = (id: string) => {
  //   if (window.confirm("Are you sure you want to delete this category?")) {
  //     setCategories(categories.filter((cat) => cat.id !== id));
  //   }
  // };

  const toggleStatus = async (id: string) => {
    await dispatch(toggleCategoryStatus({ id })).unwrap();
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)));
  };

  // const filteredCategories = categories.filter(
  //   (cat) =>
  //     cat.name.toLowerCase().includes(search.toLowerCase()) ||
  //     cat.description.toLowerCase().includes(search.toLowerCase())
  // );

  const columns: Column<Category>[] = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Status",
      render: (row: Category) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
          {row.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row: Category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal(row)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleStatus(row.id)}
            className={`px-2 py-1 text-xs rounded ${row.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
          >
            {row.isActive ? "On" : "Off"}
          </button>
          {/* <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
          <p className="text-sm text-gray-600 mt-1">Organize your courses into categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Search */}
        <SearchBar placeholder="Search categories" value={search} onSearch={(query) => setSearch(query)} />
        <FilterDropdown
          label="Status"
          value={status}
          options={["All", "Active", "Blocked"]}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
        />
      </div>
      <br />


      {/* ✅ Reusable Table */}
      <Table columns={columns} data={categories} loading={loading} />
      <br />

      {/* Paginatgion */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  maxLength={20}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter category description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  maxLength={200}
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleEditCategory : handleAddCategory}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
