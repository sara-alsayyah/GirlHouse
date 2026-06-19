"use client";

import { useMemo, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";
import { ProductsStats } from "./components/ProductsStats";
import { ProductsFilters } from "./components/ProductsFilters";
import { ProductsTable } from "./components/ProductsTable";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditProductModal } from "./components/EditProductModal";
import { AdminProduct } from "../types/products";
import { productsMock, productsStats } from "../data/productsMock";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const categories = useMemo(() => {
    const unique = new Set(productsMock.map((p) => p.category));
    return Array.from(unique);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsMock.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  const handleDelete = () => {
    console.log("Delete product:", productToDelete);

    // Later:
    // await deleteOrder(orderToDelete)

    setProductToDelete(null);
  };

  const handleSaveProduct = (updatedProduct: AdminProduct) => {
    console.log("Updated product:", updatedProduct);

    // Later:
    // await updateProduct(updatedProduct.id, updatedProduct);

    setSelectedProduct(null);
  };
  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Products</h1>

          <p className="mt-2 text-[#8f727a]">Manage your store products</p>
        </div>

        <ProductsStats stats={productsStats} />

        <ProductsFilters
          searchTerm={searchTerm}
          category={category}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          categories={categories}
        />

        <ProductsTable
          products={filteredProducts}
          onDeleteClick={setProductToDelete}
          onEditClick={setSelectedProduct}
        />
      </div>
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
      />
    </AdminContainer>
  );
}
