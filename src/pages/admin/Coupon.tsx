import {  useEffect, useMemo, useState } from "react";
import { Plus, Edit2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { Table } from "../../components/shared/Table";
import type { Column } from "../../components/shared/Table";
import { SearchBar } from "../../components/shared/SearchBar";
import { Pagination } from "../../components/shared/Pagination";
import { FilterDropdown } from "../../components/shared/FilterDropdown";

import * as yup from "yup";
import { toast } from "react-toastify";
import { createCoupon, getCoupons, updateCoupon, updateCouponStatus } from "../../services/adminServices";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";

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
}

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

  code: yup
    .string()
    .trim()
    .min(3)
    .max(15)
    .matches(/^[A-Za-z0-9]+$/, "Code must be alphanumeric")
    .required(),

  discountType: yup
    .mixed<DiscountType>()
    .oneOf(discountTypes)
    .required(),

  discountValue: yup.number().positive().required(),

  maxDiscount: yup.number().required().nullable().min(0),

  minCost: yup.number().positive().required(),

  expiresAt: yup
    .date()
    .min(new Date(), "Expiry must be in the future")
    .required(),

  isActive: yup.boolean().required(),

  usageLimit: yup.number().min(1).required(),
});

export default function ManageCoupons() {
  const dispatch = useDispatch<AppDispatch>();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<FormData>({
    description: "",
    code: "",
    discountType: "",
    discountValue: 0,
    maxDiscount: null as number | null,
    minCost: 0,
    expiresAt: new Date(),
    isActive: true,
    usageLimit: 1,
  });

  const [confirmState, setConfirmState] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        console.log(status);
        
        let isActive:undefined|boolean=undefined;
        if(status==="Active"){
          isActive=true
        }else if(status==="Inactive"){
          isActive=false
        }

        const response = await dispatch(
          getCoupons({
            page,
            search,
            limit: 5,
            isActive
          })
        ).unwrap();

        setCoupons(response.data.coupons ?? []);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [dispatch, page, search, status]);

  const openModal = (item?: Coupon) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        description: item.description,
        code: item.code,
        discountType: item.discountType,
        discountValue: item.discountValue,
        maxDiscount: item.maxDiscount,
        minCost: item.minCost,
        expiresAt: item.expiresAt,
        isActive: item.isActive,
        usageLimit: item.usageLimit,
      });
    } else {
      setEditingItem(null);
      setFormData({
        description: "",
        code: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscount: null,
        minCost: 0,
        expiresAt: new Date,
        isActive: true,
        usageLimit: 1,
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleAddCoupon = async () => {
    try {
      const validated = await couponSchema.validate(formData, {
        abortEarly: false,
      });

      const response = await dispatch(createCoupon(validated)).unwrap();

      setCoupons([response.data, ...coupons]);
      toast.success("Coupon added!");

      closeModal();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
      } else toast.error(err as string);
    }
  };

  const handleEditCoupon = async () => {
    if (!editingItem) return;

    try {
      const validated = await couponSchema.validate(formData, {
        abortEarly: false,
      });

      const response = await dispatch(
        updateCoupon({ id: editingItem.id, ...validated })
      ).unwrap();

      setCoupons(
        coupons.map((c) =>
          c.id === editingItem.id ? { ...c, ...validated } : c
        )
      );

      toast.success(response.message || "Coupon updated!");
      closeModal();
    } catch (err) {
      if (err instanceof yup.ValidationError) toast.error(err.errors[0]);
      else toast.error(err as string);
    }
  };

  const requestToggleStatus = (id: string, isActive: boolean) => {
    setConfirmState({ id, isActive });
  };

  const confirmToggleStatus = async () => {
    if (!confirmState) return;

    try {
      setActionLoading(true);

      await dispatch(
        updateCouponStatus(confirmState.id)
      ).unwrap();

      setCoupons((prev) =>
        prev.map((c) =>
          c.id === confirmState.id
            ? { ...c, isActive: !c.isActive }
            : c
        )
      );

      toast.success(
        `Coupon ${
          confirmState.isActive ? "deactivated" : "activated"
        } successfully`
      );
    } catch (err) {
      toast.error(err as string);
    } finally {
      setActionLoading(false);
      setConfirmState(null);
    }
  };

  const columns=useMemo<Column<Coupon>[]>(() =>  [
    { header: "Code", accessor: "code" },

    {
      header: "Discount",
      render: (row) => (
        <span>
          {row.discountType === "percentage"
            ? `${row.discountValue}%`
            : `₹${row.discountValue}`}
        </span>
      ),
    },

    { header: "Min Cost", accessor: "minCost" },
    { header: "Usage", render: (row) => `${row.usageCount}/${row.usageLimit}` },

    {
      header: "Status",
      render: (row) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${row.isActive
            ? "bg-teal-100 text-teal-700"
            : "bg-red-100 text-red-700"
            }`}
        >
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
            className="p-1.5 text-gray-600 hover:bg-teal-50 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => requestToggleStatus(row.id, row.isActive)}
            className={`px-2 py-1 text-xs rounded ${row.isActive
              ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
          >
            {row.isActive ? "On" : "Off"}
          </button>
        </div>
      ),
    },
  ],[]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Coupons
          </h1>
          <p className="text-sm text-gray-600">
            Create and organize discount coupons
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SearchBar
          placeholder="Search coupon code or description"
          value={search}
          onSearch={setSearch}
        />

        <FilterDropdown
          label="Status"
          value={status}
          options={["All", "Active", "Inactive"]}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>

      <Table data={coupons} columns={columns} loading={loading} />

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
          <div className="
  bg-white 
  rounded-xl 
  shadow-xl 
  w-full 
  max-w-md 
  max-h-[80vh] 
  overflow-hidden 
  border border-gray-200
">

            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? "Edit Coupon" : "Add Coupon"}
              </h2>

              <button onClick={closeModal}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Description */}
              <div>
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Code */}
              <div>
                <label className="text-sm font-semibold">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-sm font-semibold">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as DiscountType,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="text-sm font-semibold">Discount Value</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Max Discount */}
              {formData.discountType === "percentage" && (
                <div>
                  <label className="text-sm font-semibold">Max Discount</label>
                  <input
                    type="number"
                    value={formData.maxDiscount ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscount:
                          e.target.value === ""
                            ? null
                            : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border rounded"
                  />
                </div>
              )}

              {/* Min Cost */}
              <div>
                <label className="text-sm font-semibold">Minimum Cost</label>
                <input
                  type="number"
                  value={formData.minCost}
                  onChange={(e) =>
                    setFormData({ ...formData, minCost: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="text-sm font-semibold">Expires At</label>
                <input
                  type="date"
                  value={new Date(formData.expiresAt).toISOString().slice(0, 10)}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: new Date(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="text-sm font-semibold">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm border rounded"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <label>Active</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleEditCoupon : handleAddCoupon}
                  className="px-4 py-2 bg-teal-600 text-white rounded"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!confirmState}
        title={
          confirmState?.isActive
            ? "Deactivate Coupon"
            : "Activate Coupon"
        }
        description={
          confirmState?.isActive
            ? "This coupon will no longer be usable."
            : "This coupon will become active again."
        }
        confirmText={
          confirmState?.isActive ? "Deactivate" : "Activate"
        }
        destructive={confirmState?.isActive}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
