"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { ProductsStats } from "./components/ProductsStats";
import { ProductsFilters } from "./components/ProductsFilters";
import { ProductsTable } from "./components/ProductsTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditProductModal } from "./components/EditProductModal";
import { AdminProduct } from "../types/products";
import {
  adminGetCategories,
  adminGetProducts,
  asArray,
  deleteProduct,
  getApiErrorMessage,
  getProductsStats,
  getStoredAccessToken,
  updateProduct,
  createProduct,
} from "@/app/lib/api";
import type { AdminCategory } from "../types/categories";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to manage products.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [productsPayload, categoriesPayload] = await Promise.all([
        adminGetProducts(token),
        adminGetCategories(token),
      ]);

      setProducts(asArray(productsPayload));
      setCategories(asArray(categoriesPayload));
      setError("");
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "all" || product.category.slug === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category, products]);

  const productsStats = useMemo(
    () => getProductsStats(products, categories),
    [products, categories]
  );

  const handleDelete = async () => {
    const token = getStoredAccessToken();
    if (!token || productToDelete === null) return;

    try {
      await deleteProduct(token, productToDelete);
      setProducts((current) =>
        current.filter((product) => product.id !== productToDelete)
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    }

    setProductToDelete(null);
  };

  const handleSaveProduct = async (updatedProduct: AdminProduct) => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const saved = await updateProduct(token, updatedProduct.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        category: updatedProduct.category.id,
      });

      setProducts((current) =>
        current.map((product) =>
          product.id === saved.id ? saved : product
        )
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    }

    setSelectedProduct(null);
  };

  const handleCreateProduct = async (newProduct: any) => {
    const token = getStoredAccessToken();
    if (!token) return;

    try {
      const created = await createProduct(token, newProduct);
      setProducts((current) => [...current, created]);
    } catch (error) {
      setError(getApiErrorMessage(error));
    }

    setIsCreateOpen(false);
  };

  return (
    <AdminContainer>
      <div className="space-y-8">

        {/* HEADER (ONLY ONE BUTTON HERE) */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#4b343a]">
              Products
            </h1>
            <p className="mt-2 text-[#8f727a]">
              Manage your store products
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl bg-[#4b343a] px-4 py-2 text-white"
          >
            Add Product
          </button>
        </div>

        <ProductsStats stats={productsStats} />

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        <ProductsFilters
          searchTerm={searchTerm}
          category={category}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          categories={categories.map((c) => c.slug)}
        />

        {loading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />
        ) : (
          <ProductsTable
            products={filteredProducts}
            onDeleteClick={setProductToDelete}
            onEditClick={setSelectedProduct}
          />
        )}
      </div>

      {/* MODALS */}
      <ConfirmDeleteModal
        isOpen={productToDelete !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />

      <EditProductModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onCancel={() => setSelectedProduct(null)}
        onSave={handleSaveProduct}
        categories={categories}
      />

   
      <EditProductModal
        isOpen={isCreateOpen}
        product={null}
        onCancel={() => setIsCreateOpen(false)}
        onSave={handleCreateProduct}
        categories={categories}
      />
    </AdminContainer>
  );
}