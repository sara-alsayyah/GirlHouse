"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { asArray, getProducts } from "@/app/lib/api";
import type { Product } from "@/app/lib/types";
import { SearchIcon } from "./icons";

export function HeaderSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const nextQuery = deferredQuery.trim();
    if (nextQuery.length < 2) { setSuggestions([]); return; }
    const timer = window.setTimeout(() => {
      getProducts(`?search=${encodeURIComponent(nextQuery)}&page=1`).then((response) => setSuggestions(asArray(response).slice(0, 5))).catch(() => setSuggestions([]));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [deferredQuery]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
    onClose();
  }

  return (
    <div className="relative w-full">
      <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-[20px] border border-[#e3cfd3] bg-white p-2 shadow-[0_20px_60px_rgba(75,52,58,0.12)]">
        <SearchIcon className="ml-2 h-5 w-5 shrink-0 text-[#956773]" />
        <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder={pathname === "/products" ? "Search by product name" : "Search the collection"} className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-[var(--foreground)] outline-none placeholder:text-[#8f727a]" aria-label="Search products" />
        <button type="submit" className="gold-button shrink-0 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]">Search</button>
      </form>
      {showSuggestions && query.trim().length >= 2 ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-[20px] border border-[#e3cfd3] bg-white shadow-[0_24px_70px_rgba(75,52,58,0.16)]">
          {suggestions.length ? suggestions.map((product) => <Link key={product.id} href={`/products/${product.slug}`} onClick={onClose} className="flex items-center justify-between gap-4 border-b border-[#f0e3e5] px-5 py-4 last:border-b-0 hover:bg-[#fff7f8]"><div><p className="text-sm font-medium text-[#4b343a]">{product.name}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8f727a]">{product.category.name}</p></div><span className="text-xs font-medium uppercase tracking-[0.12em] text-[#956773]">View</span></Link>) : <p className="px-5 py-4 text-sm text-[#8f727a]">No matching products yet.</p>}
        </div>
      ) : null}
    </div>
  );
}
