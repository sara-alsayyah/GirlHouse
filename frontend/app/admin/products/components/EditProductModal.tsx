"use client";

import { useEffect, useState } from "react";
import { AdminCategory, AdminProduct } from "../../types/products";
import { resolveMediaUrl } from "@/app/lib/api";
import { X } from "lucide-react";

interface Props {
  product: AdminProduct | null;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (updatedProduct: AdminProduct) => void;
  categories: AdminCategory[];
}

const emptyProduct: AdminProduct = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  stock: 0,
  image: "",
  slug: "",
  category: {
    id: 0,
    name: "",
    slug: "",
  },
  created_at: "",
};

export function EditProductModal({
  product,
  isOpen,
  onCancel,
  onSave,
  categories,
}: Props) {
  const [formData, setFormData] = useState<AdminProduct>(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(emptyProduct);
    }
    setImageFile(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      >
        {/* MODAL */}
        <div
          className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-[#4b343a]">
                {product ? "Edit Product" : "Create Product"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {product ? "Update product details" : "Add new product"}
              </p>
            </div>

            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* FORM */}
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category?.id ?? 0}
                onChange={(e) => {
                  const selected = categories.find(
                    (c) => c.id === Number(e.target.value)
                  );

                  if (selected) {
                    setFormData({
                      ...formData,
                      category: selected,
                    });
                  }
                }}
                className="w-full border rounded-xl p-3"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* STOCK */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 min-h-[100px]"
              />
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

{/* IMAGE PREVIEW */}
{(imageFile || formData.image) && (
  <div className="p-3 border rounded-xl bg-gray-50">
    <img
      src={
        imageFile
          ? URL.createObjectURL(imageFile)
          : resolveMediaUrl(formData.image) ?? "/placeholder.png"
      }
      alt={formData.name}
      className="h-20 w-20 object-cover rounded-lg"
    />
  </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave({
                  ...formData,
                  image: imageFile
                    ? URL.createObjectURL(imageFile)
                    : formData.image,
                })
              }
              className="px-4 py-2 bg-[#b78895] text-white rounded-xl"
            >
              {product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}