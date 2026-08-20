"use client";

import { useEffect, useState } from "react";
import { getProducts, getPublicCategories, asArray } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import type { Product, Category } from "@/app/lib/types";

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
    const [categories, setCategories] = useState<Category[]>([]);


  const [availability, setAvailability] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


useEffect(() => {
  getPublicCategories()
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

    params.set("min_price", "0");
    params.set("max_price", "500");

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
  }, [page, debouncedSearch, category, availability, ordering]);

 
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setAvailability("all");
    setOrdering("-created_at");
    setPage(1);
  };

  return (
    <PageReveal className="mx-auto max-w-[1440px] bg-[#ffffff] px-4 pb-20 pt-3 sm:px-6 lg:px-10">
      <section className="relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:mt-24 lg:min-h-[520px]">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="http://127.0.0.1:8001/media/hero/hero.mp4" type="video/mp4" />
  </video>

  {/* dark overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* content */}
  <div className="relative z-10 flex min-h-[320px] items-center justify-center px-5 text-center sm:min-h-[420px] lg:min-h-[520px]">
    <div className="text-white">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.34em] text-white/80 sm:text-xs">Girl House presents</p>
           <h1 className="brand-font text-4xl font-light shine-gold sm:text-6xl lg:text-7xl">
         NEW COLLECTION
        </h1>

        <p className="arabic-font mt-4 text-sm sm:text-lg">
          حيث تلتقي الأناقة بالاحتشام
        </p>
    </div>
  </div>
</section>

      <section className="border-b border-[#e9dfe0] py-8 sm:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a67a7a]">The edit</p>
            <h2 className="brand-font mt-2 text-3xl tracking-wide text-[#48353a] sm:text-4xl">Shop the collection</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#7d6269]">Modern modest pieces, selected for everyday elegance.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[minmax(190px,1fr)_180px_180px_auto]">
          <label className="col-span-2 flex border-b border-[#cbb3b8] bg-[#fffdfb] sm:col-span-1">
            <span className="sr-only">Search products</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setDebouncedSearch(search.trim());
                  setPage(1);
                }
              }}
              className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[#a58f94]"
              placeholder="Search the collection"
            />
            <button type="button" onClick={() => { setDebouncedSearch(search.trim()); setPage(1); }} className="px-3 text-xs uppercase tracking-wider text-[#7d6269]">Search</button>
          </label>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="min-w-0 border-b border-[#cbb3b8] bg-[#fffdfb] px-3 py-3 text-sm text-[#5b434a] outline-none">
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </select>
          <select value={ordering} onChange={(event) => { setOrdering(event.target.value); setPage(1); }} className="min-w-0 border-b border-[#cbb3b8] bg-[#fffdfb] px-3 py-3 text-sm text-[#5b434a] outline-none">
            <option value="-created_at">New arrivals</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
          </select>
          <button type="button" onClick={resetFilters} className="border border-[#cbb3b8] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[#7d6269] transition hover:bg-[#f7edef]">Reset</button>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8d747a]">{loading ? "Loading pieces" : `${products.length} pieces`}</p>
          <div className="flex gap-2 text-xs text-[#8d747a]">
            {["all", "in_stock", "sold_out"].map((value) => (
              <button key={value} type="button" onClick={() => { setAvailability(value); setPage(1); }} className={`border-b pb-1 uppercase tracking-wider transition ${availability === value ? "border-[#956773] text-[#5b3c45]" : "border-transparent hover:border-[#d8c1c5]"}`}>
                {value === "all" ? "All" : value === "in_stock" ? "Available" : "Sold out"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-[#f6efea]" />
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
          className="border border-[#d7c5c7] px-5 py-3 text-xs uppercase tracking-wider transition hover:bg-[#f7edef] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-xs uppercase tracking-wider text-[#7d6269]">Page {page}</div>

        <button
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
          className="bg-[#956773] px-5 py-3 text-xs uppercase tracking-wider text-white transition hover:bg-[#7a4f5b] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </PageReveal>
  );
}
