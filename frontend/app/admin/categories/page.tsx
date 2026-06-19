"use client";

import { useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { CategoriesStats } from "./components/CategoriesStats";
import { CategoriesFilters } from "./components/CategoriesFilters";
import { CategoriesTable } from "./components/CategoriesTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditCategoryModal } from "./components/EditCategoryModal";
import { AdminCategory } from "../types/categories";
import { categoriesMock, categoriesStats } from "../data/categoriesMock";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);
  const filteredCategories = useMemo(() => {
    return categoriesMock.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleDelete = () => {
    console.log("Delete order:", categoryToDelete);

    // Later:
    // await deleteOrder(orderToDelete)

    setCategoryToDelete(null);
  };

  const handleSaveCategory = (updatedCategory: AdminCategory) => {
    console.log("Updated category:", updatedCategory);

    // Later:
    // await updateCategory(updatedCategory.id, updatedCategory);

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

        <CategoriesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CategoriesTable
          categories={filteredCategories}
          onDeleteClick={setCategoryToDelete}
          onEditClick={setSelectedCategory}
        />
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
