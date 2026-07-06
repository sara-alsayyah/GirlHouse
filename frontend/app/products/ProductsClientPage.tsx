"use client";

import { useEffect, useState } from "react";
import { getProducts, getPublicCategories, asArray } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import type { Product, Category } from "@/app/lib/types";
import { CategoriesBar } from "@/app/components/CategoriesBar";

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


  const [price, setPrice] = useState<[number, number]>([0, 500]);
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
    <PageReveal className="mx-auto max-w-7xl px-6 pt-2 pb-28 lg:px-10 bg-[#e4e0ce]">
      <div className="sticky top-[130px] z-30">

      <CategoriesBar />
      </div>
  {/* HERO */}
    <section className="relative mt-16 lg:mt-24 h-[600px] overflow-hidden">
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
  <div className="relative z-10 flex h-full items-center justify-center">
    <div className="text-center text-white">
           <h1 className="brand-font text-6xl font-light shine-gold">
         NEW COLLECTION
        </h1>

        <p className="arabic-font mt-4 text-lg">
          حيث تلتقي الأناقة بالاحتشام
        </p>
    </div>
  </div>
</section>

      {/* ======================
          MAIN LAYOUT
      ====================== */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[280px,1fr]">

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