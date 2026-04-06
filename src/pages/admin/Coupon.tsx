import { useEffect, useMemo, useState } from "react";
import {
  Plus, Edit2, X, Tag, Percent, DollarSign,
  Calendar, Users, ToggleLeft, ToggleRight,
  Search, Filter, CheckCircle2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { FilterDropdown } from "../../components/shared/FilterDropdown";
import * as yup from "yup";
import { createCoupon, getCoupons, updateCoupon, updateCouponStatus } from "../../services/adminServices";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { useFeedback } from "../../hooks/useFeedback";

type DiscountType = "percentage" | "amount";
const discountTypes = ["percentage", "amount"] as const;

type FormData = {
  description: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  minCost: number;
  expiresAt: Date;
  isActive: boolean;
  usageLimit: number;
};

interface Coupon {
  id: string;
  description: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minCost: number;
  expiresAt: Date;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: string;
}

const couponSchema = yup.object().shape({
  description: yup.string().trim().min(5).max(200).required(),
  code: yup.string().trim().min(3).max(15).matches(/^[A-Za-z0-9]+$/, "Code must be alphanumeric").required(),
  discountType: yup.mixed<DiscountType>().oneOf(discountTypes).required(),
  discountValue: yup.number().positive().required().when("discountType", {
    is: "percentage",
    then: (s) => s.max(25, "Percentage discount cannot exceed 25%"),
    otherwise: (s) => s.max(750, "Amount discount cannot exceed 750"),
  }),
  maxDiscount: yup.number().nullable().min(0),
  minCost: yup.number().positive().required(),
  expiresAt: yup.date().min(new Date(), "Expiry must be in the future").required(),
  isActive: yup.boolean().required(),
  usageLimit: yup.number().min(1).required(),
});

/* ── Shared input style ── */
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
  transition: "border-color 0.15s ease",
} as React.CSSProperties;

const labelCls = "block text-xs font-semibold uppercase tracking-widest mb-1.5";

export default function ManageCoupons() {
  const dispatch = useDispatch<AppDispatch>();
  const feedback = useFeedback();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<FormData>({
    description: "", code: "", discountType: "percentage",
    discountValue: 0, maxDiscount: null, minCost: 0,
    expiresAt: new Date(), isActive: true, usageLimit: 1,
  });

  const [confirmState, setConfirmState] = useState<{ id: string; isActive: boolean } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const isActive = status === "Active" ? true : status === "Inactive" ? false : undefined;
        const response = await dispatch(getCoupons({ page, search, limit: 5, isActive })).unwrap();
        setCoupons(response.data.coupons ?? []);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (err) {
        feedback.error("Error", err as string);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [dispatch, page, search, status, feedback]);

  const openModal = (item?: Coupon) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        description: item.description, code: item.code, discountType: item.discountType,
        discountValue: item.discountValue, maxDiscount: item.maxDiscount, minCost: item.minCost,
        expiresAt: item.expiresAt, isActive: item.isActive, usageLimit: item.usageLimit,
      });
    } else {
      setEditingItem(null);
      setFormData({ description: "", code: "", discountType: "percentage", discountValue: 0, maxDiscount: null, minCost: 0, expiresAt: new Date(), isActive: true, usageLimit: 1 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };

  const handleAddCoupon = async () => {
    try {
      const validated = await couponSchema.validate(formData, { abortEarly: false });
      const response = await dispatch(createCoupon(validated)).unwrap();
      setCoupons([response.data, ...coupons]);
      feedback.success("Success", "Coupon added successfully!");
      closeModal();
    } catch (err) {
      if (err instanceof yup.ValidationError) feedback.error("Validation Error", err.errors[0]);
      else feedback.error("Error", err as string);
    }
  };

  const handleEditCoupon = async () => {
    if (!editingItem) return;
    try {
      const validated = await couponSchema.validate(formData, { abortEarly: false });
      await dispatch(updateCoupon({ id: editingItem.id, ...validated })).unwrap();
      setCoupons(coupons.map((c) => c.id === editingItem.id ? { ...c, ...validated } : c));
      feedback.success("Success", "Coupon updated successfully!");
      closeModal();
    } catch (err) {
      if (err instanceof yup.ValidationError) feedback.error("Validation Error", err.errors[0]);
      else feedback.error("Error", err as string);
    }
  };

  const confirmToggleStatus = async () => {
    if (!confirmState) return;
    try {
      setActionLoading(true);
      await dispatch(updateCouponStatus(confirmState.id)).unwrap();
      setCoupons((prev) => prev.map((c) => c.id === confirmState.id ? { ...c, isActive: !c.isActive } : c));
      feedback.success("Success", `Coupon ${confirmState.isActive ? "deactivated" : "activated"} successfully`);
    } catch (err) {
      feedback.error("Error", err as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const formatExpiry = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const isExpired = (date: Date) => new Date(date) < new Date();

  const columns = useMemo<Column<Coupon>[]>(() => [
    {
      header: "Coupon",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: row.isActive ? "#ccfbf1" : "#f1f5f9" }}
          >
            <Tag className="w-4 h-4" style={{ color: row.isActive ? "#0d9488" : "#94a3b8" }} />
          </div>
          <div>
            <p
              className="text-sm font-black tracking-widest"
              style={{ color: "#0f172a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}
            >
              {row.code}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 max-w-[180px] truncate">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Discount",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: row.discountType === "percentage" ? "#ede9fe" : "#fef3c7" }}
          >
            {row.discountType === "percentage"
              ? <Percent className="w-3 h-3" style={{ color: "#7c3aed" }} />
              : <DollarSign className="w-3 h-3" style={{ color: "#d97706" }} />
            }
          </span>
          <span className="text-sm font-bold" style={{ color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
            {row.discountType === "percentage" ? `${row.discountValue}%` : `₹${row.discountValue}`}
          </span>
          {row.maxDiscount && (
            <span className="text-xs text-slate-400">
              (max ₹{row.maxDiscount})
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Min Cost",
      render: (row) => (
        <span className="text-sm font-semibold" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>
          ₹{row.minCost.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Usage",
      render: (row) => {
        const pct = row.usageLimit > 0 ? (row.usageCount / row.usageLimit) * 100 : 0;
        return (
          <div className="min-w-[80px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
                {row.usageCount}/{row.usageLimit}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "#e2e8f0" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: pct >= 90 ? "#f87171" : pct >= 60 ? "#fbbf24" : "#0d9488",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Expires",
      render: (row) => {
        const expired = isExpired(row.expiresAt);
        return (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: expired ? "#ef4444" : "#64748b" }}
          >
            <Calendar className="w-3.5 h-3.5" />
            {formatExpiry(row.expiresAt)}
          </span>
        );
      },
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: row.isActive ? "#d1fae5" : "#f1f5f9",
            color: row.isActive ? "#065f46" : "#64748b",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.isActive ? "#10b981" : "#94a3b8" }} />
          {row.isActive ? "Active" : "Inactive"}
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
              ? <><ToggleLeft className="w-3.5 h-3.5" /> Deactivate</>
              : <><ToggleRight className="w-3.5 h-3.5" /> Activate</>
            }
          </button>
        </div>
      ),
    },
  ], []);

  /* ── focus helper ── */
  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#0d9488";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.10)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.boxShadow = "none";
  };

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
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-500 mb-1">Admin</p>
            <h1 className="text-4xl md:text-5xl font-black" style={{ color: "#0f172a", letterSpacing: "-1.5px" }}>
              Manage Coupons
            </h1>
            <p className="text-sm text-slate-400 mt-1">Create and manage discount coupons for learners</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "#0d9488", boxShadow: "0 4px 12px rgba(13,148,136,0.25)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
          >
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
        >
          {/* Card toolbar */}
          <div
            className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-teal-500" />
              <span className="font-bold" style={{ color: "#0f172a" }}>Coupon List</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", minWidth: 220 }}
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <SearchBar
                  placeholder="Search code or description…"
                  value={search}
                  onSearch={(q) => { setSearch(q); setPage(1); }}
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <FilterDropdown
                  label="Status"
                  value={status}
                  options={["All", "Active", "Inactive"]}
                  onChange={(v) => { setStatus(v as "All" | "Active" | "Inactive"); setPage(1); }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <Table data={coupons} columns={columns} loading={loading} />
          </div>

          {/* Empty state */}
          {/* {!loading && coupons.length === 0 && (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#f0fdfa" }}
              >
                <Tag className="w-8 h-8 text-teal-300" />
              </div>
              <p className="font-semibold text-slate-500">No coupons found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or create a new coupon.</p>
            </div>
          )} */}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-center" style={{ borderTop: "1px solid #f1f5f9" }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CREATE / EDIT MODAL
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
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#ccfbf1" }}>
                  {editingItem ? <Edit2 className="w-4 h-4 text-teal-600" /> : <Plus className="w-4 h-4 text-teal-600" />}
                </div>
                <div>
                  <h2 className="font-black text-base" style={{ color: "#0f172a", letterSpacing: "-0.3px" }}>
                    {editingItem ? "Edit Coupon" : "New Coupon"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingItem ? `Editing ${editingItem.code}` : "Fill in the details below"}
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

            {/* Form body */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: "68vh" }}>

              {/* Description */}
              <div>
                <label className={labelCls} style={{ color: "#475569" }}>Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputCls, resize: "none" }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="Brief description of this coupon…"
                />
              </div>

              {/* Code */}
              <div>
                <label className={labelCls} style={{ color: "#475569" }}>Coupon Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  style={{ ...inputCls, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", fontWeight: 700 }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="e.g. SAVE20"
                />
              </div>

              {/* Discount type + value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: "#475569" }}>Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                    style={inputCls}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="amount">Fixed Amount ₹</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={{ color: "#475569" }}>
                    Value {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    style={inputCls}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Max Discount (percentage only) */}
              {formData.discountType === "percentage" && (
                <div>
                  <label className={labelCls} style={{ color: "#475569" }}>
                    Max Discount Cap (₹) <span className="font-normal normal-case tracking-normal text-slate-300">optional</span>
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount ?? ""}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value === "" ? null : Number(e.target.value) })}
                    style={inputCls}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    placeholder="Leave blank for no cap"
                  />
                </div>
              )}

              {/* Min cost + Usage limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} style={{ color: "#475569" }}>Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minCost}
                    onChange={(e) => setFormData({ ...formData, minCost: Number(e.target.value) })}
                    style={inputCls}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: "#475569" }}>Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    style={inputCls}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className={labelCls} style={{ color: "#475569" }}>Expiry Date</label>
                <input
                  type="date"
                  value={new Date(formData.expiresAt).toISOString().slice(0, 10)}
                  onChange={(e) => setFormData({ ...formData, expiresAt: new Date(e.target.value) })}
                  style={inputCls}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              {/* Active toggle */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: formData.isActive ? "#ccfbf1" : "#f1f5f9" }}>
                    <Users className="w-4 h-4" style={{ color: formData.isActive ? "#0d9488" : "#94a3b8" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>Active Status</p>
                    <p className="text-xs text-slate-400">Learners can use this coupon</p>
                  </div>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="transition-all"
                >
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
                  onClick={editingItem ? handleEditCoupon : handleAddCoupon}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: "#0d9488" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#0f766e")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#0d9488")}
                >
                  {editingItem
                    ? <><CheckCircle2 className="w-4 h-4" /> Update Coupon</>
                    : <><Plus className="w-4 h-4" /> Create Coupon</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.isActive ? "Deactivate Coupon" : "Activate Coupon"}
        description={
          confirmState?.isActive
            ? "This coupon will no longer be usable by learners."
            : "This coupon will become active and usable again."
        }
        confirmText={confirmState?.isActive ? "Deactivate" : "Activate"}
        destructive={confirmState?.isActive}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}