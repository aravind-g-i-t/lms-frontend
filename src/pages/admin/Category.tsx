import { useEffect, useMemo, useState } from "react";
import {
  Plus, Edit2, X, LayoutGrid,
  Search, Filter, CheckCircle2,
  ToggleLeft, ToggleRight,
} from "lucide-react";
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
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import * as yup from "yup";
import { useFeedback } from "../../hooks/useFeedback";

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
        ? value.trim().split(" ").filter(Boolean)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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

const inputCls = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
} as React.CSSProperties;

const labelCls = "block text-xs font-semibold uppercase tracking-widest mb-1.5";

export default function ManageCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"All" | "Active" | "Blocked">("All");
  const [confirmState, setConfirmState] = useState<{ id: string; isActive: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getCategories({ page, search, status, limit: 5 })).unwrap();
        setCategories(response.data.categories ?? []);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (err) {
        feedback.error("Error", err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [dispatch, page, search, status, feedback]);

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
    try {
      const cleaned = await categorySchema.validate(formData, { abortEarly: false });
      setLoading(true);
      const response = await dispatch(addCategory(cleaned)).unwrap();
      setCategories((prev) => [response.data, ...prev]);
      closeModal();
      feedback.success("Category Added", "Category added successfully!");
    } catch (err) {
      if (err instanceof yup.ValidationError) feedback.error("Validation Error", err.errors[0]);
      else feedback.error("Error", err as string);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingItem) return;
    try {
      const cleaned = await categorySchema.validate(formData, { abortEarly: false });
      setLoading(true);
      await dispatch(updateCategory({ id: editingItem.id, ...cleaned })).unwrap();
      setCategories((prev) =>
        prev.map((cat) => cat.id === editingItem.id ? { ...cat, ...cleaned } : cat)
      );
      closeModal();
      feedback.success("Category Updated", "Category updated successfully!");
    } catch (err) {
      if (err instanceof yup.ValidationError) feedback.error("Validation Error", err.errors[0]);
      else feedback.error("Error", err as string);
    } finally {
      setLoading(false);
    }
  };

  const confirmToggleStatus = async () => {
    if (!confirmState) return;
    try {
      setActionLoading(true);
      await dispatch(toggleCategoryStatus({ id: confirmState.id })).unwrap();
      setCategories((prev) =>
        prev.map((cat) => cat.id === confirmState.id ? { ...cat, isActive: !cat.isActive } : cat)
      );
      feedback.success("Success", `Category ${confirmState.isActive ? "blocked" : "activated"} successfully`);
    } catch (error) {
      feedback.error("Error", error as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#0d9488";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.10)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.boxShadow = "none";
  };

  const columns = useMemo<Column<Category>[]>(() => [
    {
      header: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: row.isActive ? "#ccfbf1" : "#f1f5f9" }}
          >
            <LayoutGrid className="w-4 h-4" style={{ color: row.isActive ? "#0d9488" : "#94a3b8" }} />
          </div>
          <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>{row.name}</p>
        </div>
      ),
    },
    {
      header: "Description",
      render: (row) => (
        <p className="text-sm text-slate-500 max-w-sm truncate">{row.description}</p>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: row.isActive ? "#d1fae5" : "#fee2e2",
            color: row.isActive ? "#065f46" : "#991b1b",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: row.isActive ? "#10b981" : "#f87171" }}
          />
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
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "#f0fdfa", color: "#0d9488" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ccfbf1")}
            onMouseLeave={e => (e.currentTarget.style.background = "#f0fdfa")}
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmState({ id: row.id, isActive: row.isActive })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: row.isActive ? "#fee2e2" : "#d1fae5",
              color: row.isActive ? "#991b1b" : "#065f46",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {row.isActive
              ? <><ToggleLeft  className="w-3.5 h-3.5" /> Block</>
              : <><ToggleRight className="w-3.5 h-3.5" /> Activate</>
            }
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div
      className="min-h-full p-6 md:p-10"
      style={{
        background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0f9ff 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
        .modal-enter { animation: modalIn 0.2s ease; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">Admin</p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
            >
              Manage Categories
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Organize your course catalogue into structured categories
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "#0d9488", boxShadow: "0 4px 12px rgba(13,148,136,0.25)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          {/* Toolbar */}
          <div
            className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>Category List</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: 220 }}
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <SearchBar
                  placeholder="Search categories…"
                  value={search}
                  onSearch={(q) => { setSearch(q); setPage(1); }}
                />
              </div>

              {/* Filter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown
                  label="Status"
                  value={status}
                  options={["All", "Active", "Blocked"]}
                  onChange={(val) => {
                    setStatus(val as "All" | "Active" | "Blocked");
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table columns={columns} data={categories} loading={loading} />
          </div>

          {/* Empty state */}
          {!loading && categories.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <LayoutGrid className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">No categories found</p>
              <p className="text-sm text-slate-400 mt-1">
                Try adjusting your search or create a new category.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-6 py-4 flex justify-center"
              style={{ borderTop: "1px solid #f1f5f9" }}
            >
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="modal-enter w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #f1f5f9" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#ccfbf1" }}
                >
                  {editingItem
                    ? <Edit2 className="w-4 h-4 text-teal-600" />
                    : <Plus  className="w-4 h-4 text-teal-600" />
                  }
                </div>
                <div>
                  <h2
                    className="font-black text-base"
                    style={{ color: "#0f172a", letterSpacing: "-0.3px" }}
                  >
                    {editingItem ? "Edit Category" : "New Category"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingItem ? `Editing "${editingItem.name}"` : "Fill in the details below"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">

              {/* Name */}
              <div>
                <label className={labelCls} style={{ color: "#475569" }}>Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputCls}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="e.g. Web Development"
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls} style={{ color: "#475569" }}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputCls, resize: "none" }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="Brief description of this category…"
                />
              </div>

              {/* Active toggle */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: formData.isActive ? "#ccfbf1" : "#f1f5f9" }}
                  >
                    <LayoutGrid
                      className="w-4 h-4"
                      style={{ color: formData.isActive ? "#0d9488" : "#94a3b8" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>Active Status</p>
                    <p className="text-xs text-slate-400">Category is available for course assignment</p>
                  </div>
                </div>
                <button onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                  {formData.isActive
                    ? <ToggleRight className="w-8 h-8" style={{ color: "#0d9488" }} />
                    : <ToggleLeft  className="w-8 h-8" style={{ color: "#94a3b8" }} />
                  }
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleEditCategory : handleAddCategory}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: "#0d9488" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
                >
                  {editingItem
                    ? <><CheckCircle2 className="w-4 h-4" /> Update Category</>
                    : <><Plus         className="w-4 h-4" /> Create Category</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.isActive ? "Block Category" : "Activate Category"}
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