import {  useEffect, useMemo, useState } from "react";
import { Plus, Edit2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  addCategory,
  getCategories,
  toggleCategoryStatus,
  updateCategory,
} from "../../services/adminServices";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { toast } from "react-toastify";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import * as yup from "yup";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 20 characters")
    .matches(/[a-zA-Z]/, "Name must contain at least one letter")
    .required("Name is required")
    .transform((value) =>
      value
        ? value
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(
              (word: string) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
            )
            .join(" ")
        : value
    ),
  description: yup
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description must be less than 200 characters")
    .required("Description is required"),
  isActive: yup.boolean().required(),
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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");

  // ✅ confirmation state
  const [confirmState, setConfirmState] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await dispatch(
          getCategories({
            page,
            search,
            status,
            limit: 5,
          })
        ).unwrap();

        setCategories(response.data.categories ?? []);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch, page, search, status]);

  const openModal = (item?: Category) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        isActive: item.isActive,
      });
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
    try {
      const cleaned = await categorySchema.validate(formData, {
        abortEarly: false,
      });
      setLoading(true);

      const response = await dispatch(
        addCategory(cleaned)
      ).unwrap();

      setCategories((prev) => [response.data, ...prev]);
      closeModal();
      toast.success("Category added successfully!");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
      } else {
        toast.error(err as string);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingItem) return;

    try {
      const cleaned = await categorySchema.validate(formData, {
        abortEarly: false,
      });
      setLoading(true);

      await dispatch(
        updateCategory({
          id: editingItem.id,
          ...cleaned,
        })
      ).unwrap();

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingItem.id
            ? { ...cat, ...cleaned }
            : cat
        )
      );

      closeModal();
      toast.success("Category updated successfully!");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
      } else {
        toast.error(err as string);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- Status toggle ----------
  const requestToggleStatus = (id: string, isActive: boolean) => {
    setConfirmState({ id, isActive });
  };

  const confirmToggleStatus = async () => {
    if (!confirmState) return;

    try {
      setActionLoading(true);

      await dispatch(
        toggleCategoryStatus({ id: confirmState.id })
      ).unwrap();

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === confirmState.id
            ? { ...cat, isActive: !cat.isActive }
            : cat
        )
      );

      toast.success(
        `Category ${
          confirmState.isActive ? "blocked" : "activated"
        } successfully`
      );
    } catch (error) {
      toast.error(error as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const columns = useMemo<Column<Category>[]>(
    () => [
      { header: "Name", accessor: "name" },
      { header: "Description", accessor: "description" },
      {
        header: "Status",
        render: (row) => (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              row.isActive
                ? "bg-teal-100 text-teal-700"
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal(row)}
              className="p-1.5 text-gray-600 hover:bg-teal-50 rounded"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                requestToggleStatus(row.id, row.isActive)
              }
              className={`px-2 py-1 text-xs rounded ${
                row.isActive
                  ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {row.isActive ? "Off" : "On"}
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Categories
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Organize your courses into categories
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar
          placeholder="Search categories"
          value={search}
          onSearch={setSearch}
        />
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

      {/* Table */}
      <Table columns={columns} data={categories} loading={loading} />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Category name"
                className="w-full border rounded p-2"
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={3}
                placeholder="Description"
                className="w-full border rounded p-2"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked,
                    })
                  }
                />
                Active
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingItem
                      ? handleEditCategory
                      : handleAddCategory
                  }
                  className="px-4 py-2 bg-teal-600 text-white rounded"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmState}
        title={
          confirmState?.isActive
            ? "Block Category"
            : "Activate Category"
        }
        description={
          confirmState?.isActive
            ? "This category will no longer be available for course assignment."
            : "This category will be re-enabled and available for courses."
        }
        confirmText={confirmState?.isActive ? "Block" : "Activate"}
        destructive={confirmState?.isActive}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
