"use client";

import { useEffect, useState } from "react";
import { AdminProduct } from "../../types/products";
import {
  X,
  Image as ImageIcon,
  DollarSign,
  Package,
  Tag,
  Layers,
} from "lucide-react";

interface Props {
  product: AdminProduct | null;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (updatedProduct: AdminProduct) => void;
}

export function EditProductModal({ product, isOpen, onCancel, onSave }: Props) {
  const [formData, setFormData] = useState<AdminProduct | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!isOpen || !formData) return null;

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
              <h2 className="text-2xl font-bold text-[#4b343a]">
                Edit Product
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update product details
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
              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Product Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#ead9dd] pl-10 pr-4 py-3 text-[#4b343a] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#ead9dd] pl-10 pr-4 py-3 text-[#4b343a] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                    placeholder="Enter category"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Price
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#ead9dd] pl-10 pr-4 py-3 text-[#4b343a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4b343a]">
                  Stock
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#ead9dd] pl-10 pr-4 py-3 text-[#4b343a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Image URL - Full Width */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4b343a]">
                Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={formData.image ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#ead9dd] pl-10 pr-4 py-3 text-[#4b343a] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Enter a valid image URL for the product
              </p>
            </div>

            {/* Image Preview (if image exists) */}
            {formData.image && (
              <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23b78895" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" /%3E%3Ccircle cx="8.5" cy="8.5" r="1.5" /%3E%3Cpath d="M21 15l-5-5L5 21" /%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4b343a]">
                      Image Preview
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                      {formData.image}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
