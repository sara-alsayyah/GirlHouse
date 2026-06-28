"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { CategoriesStats } from "./components/CategoriesStats";
import { CategoriesFilters } from "./components/CategoriesFilters";
import { CategoriesTable } from "./components/CategoriesTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditCategoryModal } from "./components/EditCategoryModal";
import { AdminCategory } from "../types/categories";
import {
  adminGetCategories,
  adminGetProducts,
  asArray,
  deleteCategory,
  getApiErrorMessage,
  getCategoriesStats,
  getStoredAccessToken,
  updateCategory,
} from "@/app/lib/api";
import type { AdminProduct } from "../types/products";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to manage categories.");
      setLoading(false);
      return;
    }

    Promise.all([adminGetCategories(token), adminGetProducts(token)])
      .then(([categoriesPayload, productsPayload]) => {
        setCategories(asArray(categoriesPayload));
        setProducts(asArray(productsPayload));
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, categories]);

  const categoriesStats = useMemo(() => getCategoriesStats(categories, products), [categories, products]);
  

  const handleDelete = async () => {
    const token = getStoredAccessToken();
    if (!token || categoryToDelete === null) return;
    try {
      await deleteCategory(token, categoryToDelete);
      setCategories((current) => current.filter((category) => category.id !== categoryToDelete));
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
    setCategoryToDelete(null);
  };

  const handleSaveCategory = async (updatedCategory: AdminCategory) => {
    const token = getStoredAccessToken();
    if (!token) return;
    try {
      const saved = await updateCategory(token, updatedCategory.id, { name: updatedCategory.name });
      setCategories((current) => current.map((category) => (category.id === saved.id ? saved : category)));
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
    setSelectedCategory(null);
  };
  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Categories</h1>

          <p className="mt-2 text-[#8f727a]">Manage product categories</p>
        </div>

        <CategoriesStats stats={categoriesStats} />

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <CategoriesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />
        ) : (
          <CategoriesTable
          categories={filteredCategories}
          onDeleteClick={setCategoryToDelete}
          onEditClick={setSelectedCategory}
          />
        )}
      </div>
      <ConfirmDeleteModal
        isOpen={categoryToDelete !== null}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
      />
      <EditCategoryModal
        isOpen={selectedCategory !== null}
        category={selectedCategory}
        onCancel={() => setSelectedCategory(null)}
        onSave={handleSaveCategory}
      />
    </AdminContainer>
  );
}
