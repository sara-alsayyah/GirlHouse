"use client";

import { useEffect, useState } from "react";
import { AdminCategory } from "../../types/categories";
import { X } from "lucide-react";

interface Props {
  category: AdminCategory | null;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (updatedCategory: AdminCategory) => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onCancel,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<AdminCategory | null>(null);

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

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
          className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-2xl transform transition-all animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-[#4b343a]">
                Edit Category
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update category information
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
            {/* Category Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4b343a]">
                Category Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-[#ead9dd] px-4 py-3 text-[#4b343a] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                placeholder="Enter category name"
              />
              <p className="text-xs text-gray-400 mt-1">
                This is how the category will appear on your store
              </p>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4b343a]">
                Slug
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  /
                </span>
                <input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#ead9dd] px-4 pl-7 py-3 text-[#4b343a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b78895] focus:border-transparent hover:border-[#b78895]"
                  placeholder="category-slug"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                URL-friendly version of the category name (auto-generated from
                name)
              </p>
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
