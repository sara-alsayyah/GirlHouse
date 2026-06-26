"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import type { Product } from "@/app/lib/types";
import { commerceCategories } from "@/app/lib/categories";

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
  const [price, setPrice] = useState<[number, number]>([0, 500]);
  const [availability, setAvailability] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

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
        setHasNext(false);
        setHasPrev(false);
        setError("We could not load products right now. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, category, price, availability, ordering]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPrice([0, 500]);
    setAvailability("all");
    setOrdering("-created_at");
    setPage(1);
  }

  const filterControls = (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Search</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Dress, abaya, heels..."
          className="w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--gold-deep)]"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Category</span>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--gold-deep)]"
        >
          <option value="">All categories</option>
          {commerceCategories.map((item, index) => (
            <option key={`${item.slug}-${index}`} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Price range</p>
        <input
          type="range"
          min={0}
          max={500}
          value={price[1]}
          onChange={(event) => {
            setPrice([price[0], Number(event.target.value)]);
            setPage(1);
          }}
          className="mt-2 w-full accent-[#b78895]"
          aria-label="Maximum price"
        />
        <p className="text-sm text-[var(--muted)]">${price[0]} - ${price[1]}</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Availability</span>
        <select
          value={availability}
          onChange={(event) => {
            setAvailability(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--gold-deep)]"
        >
          <option value="all">All</option>
          <option value="in_stock">In stock</option>
          <option value="sold_out">Sold out</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Sort by</span>
        <select
          value={ordering}
          onChange={(event) => {
            setOrdering(event.target.value);
            setPage(1);
          }}
          className="w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--gold-deep)]"
        >
          <option value="-created_at">Newest</option>
          <option value="price">Price low to high</option>
          <option value="-price">Price high to low</option>
        </select>
      </label>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full rounded-full border border-[rgba(143,108,29,0.18)] px-4 py-3 text-sm transition hover:text-[var(--gold-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-deep)]"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-deep)] sm:tracking-[0.36em]">
          The collection
        </p>
        <h1 className="section-heading mt-4 text-4xl sm:text-5xl">
          Discover your next favorite piece.
        </h1>
      </section>

      <button
        type="button"
        onClick={() => setOpenFilters(true)}
        className="gold-button mt-4 w-full rounded-full py-3 lg:hidden"
      >
        Filters & Sorting
      </button>

      <section className="mt-8 grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="luxury-card hidden h-fit rounded-[34px] p-5 lg:block">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Filters</p>
          <div className="mt-5">{filterControls}</div>
        </aside>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="luxury-card h-[480px] animate-pulse rounded-[28px] bg-white/70" />
            ))
          ) : error ? (
            <div className="luxury-card rounded-[28px] p-8 text-sm text-[var(--muted)] sm:col-span-2 lg:col-span-3">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="luxury-card rounded-[28px] p-8 text-sm text-[var(--muted)] sm:col-span-2 lg:col-span-3">
              No products found. Try clearing filters or searching another style.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      <div className="mt-10 flex justify-center gap-4">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-full border px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => setPage((current) => current + 1)}
          className="gold-button rounded-full px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {openFilters ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close filters"
            onClick={() => setOpenFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpenFilters(false)}
              className="mb-6 text-sm text-gray-500"
            >
              Close
            </button>
            {filterControls}
            <button
              type="button"
              onClick={() => setOpenFilters(false)}
              className="gold-button mt-5 w-full rounded-full py-3"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </PageReveal>
  );
}
