"use client";

import { useEffect, useState } from "react";
import { getProducts, adminGetCategories, asArray, getStoredAccessToken } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import type { Product } from "@/app/lib/types";
import type { AdminCategory } from "@/app/admin/types/categories";

type ProductResponse = Awaited<ReturnType<typeof getProducts>>;

function readProducts(response: ProductResponse) {
  return Array.isArray(response) ? response : response.results;
}

export function ProductsClientPage({
  initialSearch,
  initialCategory,
}: {
  initialSearch: string;
  initialCategory: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const [category, setCategory] = useState(initialCategory ?? "");
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [price, setPrice] = useState<[number, number]>([0, 500]);
  const [availability, setAvailability] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
/* =========================
     LOAD CATEGORIES (FIXED)
  ========================== */
  useEffect(() => {
    const token = getStoredAccessToken();

    if (!token) {
      setCategories([]);
      return;
    }

    adminGetCategories(token)
      .then((data) => setCategories(asArray(data)))
      .catch(() => setCategories([]));
  }, []);

  /* ======================
     PRODUCTS FETCH
  ====================== */
  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      ordering,
    });

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category__slug", category);

    params.set("min_price", String(price[0]));
    params.set("max_price", String(price[1]));

    if (availability === "in_stock") params.set("in_stock", "true");
    if (availability === "sold_out") params.set("in_stock", "false");

    setLoading(true);
    setError(null);

    getProducts(`?${params.toString()}`)
      .then((response) => {
        setProducts(readProducts(response));
        setHasNext(Boolean(!Array.isArray(response) && response.next));
        setHasPrev(Boolean(!Array.isArray(response) && response.previous));
      })
      .catch(() => {
        setProducts([]);
        setError("We could not load products right now.");
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, category, price, availability, ordering]);

 
  return (
    <PageReveal className="mx-auto max-w-7xl px-6 pt-6 pb-28 lg:px-10">

  {/* HERO */}
  <section className="relative mt-16 lg:mt-24 h-[500px] overflow-hidden">
    <img
      src="http://127.0.0.1:8001/media/products/hero.png"
      alt="Girl House Collection"
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-black/30" />

    <div className="relative z-10 flex h-full items-center justify-center">
      <div className="text-center text-white">

        <h1 className="text-6xl font-light">
         NEW COLLECTION
        </h1>

        <p className="mt-4 text-lg">
          حيث تلتقي الأناقة بالاحتشام
        </p>
      </div>
    </div>
  </section>

  {/* Rest of page */}
      <div className="sticky top-[92px] z-40 border-b border-[#F1E5E5] bg-white/70 backdrop-blur-xl">
        <div className="flex gap-2 justify-center overflow-x-auto px-4 py-3">

          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`whitespace-nowrap px-4 py-2 text-xs border ${
              category === ""
                ? "bg-[#B78895] text-white"
                : "border-[#F1E5E5]"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.slug);
                setPage(1);
              }}
              className={`whitespace-nowrap  px-4 py-2 text-xs border ${
                category === cat.slug
                  ? "bg-[#B78895] text-white"
                  : "border-[#F1E5E5]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ======================
          MOBILE FILTER BUTTON
      ====================== */}
      <button
        onClick={() => setOpenFilters(true)}
        className="mt-6 w-full rounded-full bg-[#B78895] py-3 text-white lg:hidden"
      >
        Filters
      </button>

      {/* ======================
          MAIN LAYOUT
      ====================== */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[280px,1fr]">

        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-3xl border border-[#F1E5E5] bg-white p-6">
           
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-[#F6EFEA]" />
            ))
          ) : error ? (
            <div className="col-span-full text-center text-sm text-red-500">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-sm text-[#6B5B5B]">
              No products found
            </div>
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}

        </div>
      </section>

      {/* ======================
          PAGINATION
      ====================== */}
      <div className="mt-14 flex items-center justify-center gap-4">
        <button
          disabled={!hasPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full border px-5 py-2 disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-sm">Page {page}</div>

        <button
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full bg-[#B78895] px-5 py-2 text-white"
        >
          Next
        </button>
      </div>

    </PageReveal>
  );
}