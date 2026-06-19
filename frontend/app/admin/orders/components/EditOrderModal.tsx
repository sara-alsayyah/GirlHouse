"use client";

import { useEffect, useState } from "react";
import { AdminOrder } from "../../types/orders";
import { X } from "lucide-react";

interface Props {
  order: AdminOrder | null;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (updatedOrder: AdminOrder) => void;
}

export function EditOrderModal({ order, isOpen, onCancel, onSave }: Props) {
  const [formData, setFormData] = useState<AdminOrder | null>(null);

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  if (!isOpen || !formData) return null;

  const statusColors = {
    pending: "bg-red-100 text-red-800 border-red-300",
    paid: "bg-yellow-100 text-yellow-800 border-yellow-300",
    shipped: "bg-blue-100 text-blue-800 border-blue-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      >
        {/* Modal Container */}
        <div
          className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl transform transition-all animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-[#4b343a]">Edit Order</h2>
              <p className="text-sm text-gray-500 mt-1">
                Order #{formData.id || "N/A"}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Customer Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer_email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#ead9dd] px-4 py-3 text-[#4b343a] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                  placeholder="customer@example.com"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AdminOrder["status"],
                    })
                  }
                  className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895] ${statusColors[formData.status as keyof typeof statusColors] || "bg-white"}`}
                >
                  <option value="pending" className="bg-white text-gray-800">
                    Pending
                  </option>
                  <option value="paid" className="bg-white text-gray-800">
                    Paid
                  </option>
                  <option value="shipped" className="bg-white text-gray-800">
                    Shipped
                  </option>
                  <option value="delivered" className="bg-white text-gray-800">
                    Delivered
                  </option>
                </select>
              </div>

              {/* Items Count */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Items Count
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.items_count}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      items_count: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-[#ead9dd] px-4 py-3 text-[#4b343a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                  placeholder="0"
                />
              </div>

              {/* Total Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Total Price
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_price: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#ead9dd] px-4 pl-8 py-3 text-[#4b343a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Order Summary</span>
                <span className="text-[#4b343a] font-medium">
                  {formData.items_count} item
                  {formData.items_count !== 1 ? "s" : ""} • $
                  {Number(formData.total_price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 text-[#4b343a] font-medium rounded-xl border border-[#ead9dd] hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="w-full sm:w-auto px-6 py-3 text-white font-medium rounded-xl bg-[#b78895] hover:bg-[#a07582] transition-all duration-200 hover:shadow-lg hover:shadow-[#b78895]/30 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Add Tailwind animation classes if not already present */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        .slide-in-from-bottom-4 {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
