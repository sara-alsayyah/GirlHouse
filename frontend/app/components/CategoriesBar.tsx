"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { asArray, getPublicCategories } from "@/app/lib/api";
import type { Category } from "@/app/lib/types";

function capitalizeWords(text: string) {
  return text.toLowerCase().split(" ").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function CategoriesBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  useEffect(() => {
    getPublicCategories().then((data) => setCategories(asArray(data))).catch(() => setCategories([]));
  }, []);

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
  }

  const items = [{ id: 0, slug: "", name: "All" }, ...categories];

  return (
    <nav aria-label="Product categories" className=" brand-font w-full min-w-0">
      <div className="category-scroll flex min-w-0 items-center gap-1 overflow-x-auto px-1 py-2">
        {items.map((category) => {
          const active = activeCategory === category.slug;
          return (
            <button
              key={category.id || "all"}
              type="button"
              onClick={() => setCategory(category.slug)}
              className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#956773] ${active ? "bg-[#f3e3e6] text-[#79515b]" : "text-[#4b343a] hover:bg-[#f8eef0] hover:text-[#956773]"}`}
              aria-current={active ? "page" : undefined}
            >
              {category.id ? capitalizeWords(category.name) : category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
