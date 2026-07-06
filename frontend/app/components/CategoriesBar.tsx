"use client";

import { useEffect, useState } from "react";
import { getPublicCategories, asArray } from "@/app/lib/api";
import type { Category } from "@/app/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export function CategoriesBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";

  useEffect(() => {
    getPublicCategories()
      .then((data) => setCategories(asArray(data)))
      .catch(() => setCategories([]));
  }, []);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="sticky top-[120px] z-40 bg-[#e4e0ce]/95 backdrop-blur-md">
      <div className="flex justify-center gap-8 overflow-x-auto px-4 py-3">

        <button
          onClick={() => setCategory("")}
          className={`brand-font relative whitespace-nowrap px-4 py-3 text-sm transition ${
            activeCategory === "" ? "text-[#B78895]" : "text-[#1c1c1c]"
          }`}
        >
          All
          {activeCategory === "" && (
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#B78895]" />
          )}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`brand-font relative whitespace-nowrap px-4 py-3 text-sm transition ${
              activeCategory === cat.slug
                ? "text-[#B78895]"
                : "text-[#000] hover:text-[#B78895]"
            }`}
          >
            {cat.name}

            {activeCategory === cat.slug && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#B78895]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}