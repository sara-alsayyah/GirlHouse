"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  getProduct,
  getProducts,
  getReviews,
  getProductImageUrl,
  money,
} from "@/app/lib/api";
import type { Product, Review } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";
import { ProductCard } from "@/app/components/ProductCard";
import { HeartIcon } from "@/app/components/icons";
import {
TruckIcon,
ShieldCheckIcon,
CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { CategoriesBar } from "@/app/components/CategoriesBar";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const { addProductToCart, addRecentlyViewed, toggleWishlist, openWishlist } = useStore();
  const addRecentlyViewedRef = useRef(addRecentlyViewed);
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    addRecentlyViewedRef.current = addRecentlyViewed;
  }, [addRecentlyViewed]);

  useEffect(() => {
    const slug = String(params.slug || "");
    let cancelled = false;

    if (!slug) return;

    void (async () => {
      try {
        const detail = await getProduct(params.slug);
        if (cancelled) return;

        if (!detail) {
          setProduct(null);
          return;
        }

        setProduct(detail);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedQuantity(1);

        const [feedback, relatedProducts] = await Promise.all([
          getReviews(detail.id),
          getProducts(`?category__slug=${detail.category?.slug ?? ""}&page=1`),
        ]);

        if (cancelled) return;

        setReviews(feedback || []);

        const safeRelated = Array.isArray(relatedProducts)
          ? relatedProducts
          : relatedProducts?.results ?? [];

        setRelated(safeRelated.filter((item) => item.slug !== detail.slug).slice(0, 4));
        addRecentlyViewedRef.current(detail);
      } catch {
        if (cancelled) return;
        setProduct(null);
        setReviews([]);
        setRelated([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="text-lg text-[var(--muted)]">Loading product...</p>
        </div>
      </PageReveal>
    );
  }

  if (!product) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="font-[var(--font-display)] text-3xl">Product not found.</p>
          <Link href="/products" className="mt-6 inline-block text-[var(--gold-deep)]">
            Back to products
          </Link>
        </div>
      </PageReveal>
    );
  }

 const imageSrc = getProductImageUrl(product);
  const colorOptionsByCategory: Record<string, { name: string; swatch: string }[]> = {
    women: [
      { name: "Champagne", swatch: "#d7be93" },
      { name: "Midnight", swatch: "#252840" },
      { name: "Rose dust", swatch: "#c79ea1" },
    ],
    beauty: [
      { name: "Glow", swatch: "#f0cf8f" },
      { name: "Soft nude", swatch: "#d8b6a1" },
      { name: "Pearl", swatch: "#efe8df" },
    ],
    bags: [
      { name: "Espresso", swatch: "#5f4637" },
      { name: "Cream", swatch: "#e7dbc6" },
      { name: "Onyx", swatch: "#1f1f1f" },
    ],
    shoes: [
      { name: "Jet black", swatch: "#111111" },
      { name: "Latte", swatch: "#c5a987" },
      { name: "Ruby", swatch: "#8f2136" },
    ],
    jewelry: [
      { name: "Gold", swatch: "#c99999" },
      { name: "Silver", swatch: "#c4c9cf" },
      { name: "Rose gold", swatch: "#d59d84" },
    ],
  };
  const sizeOptionsByCategory: Record<string, string[]> = {
    women: ["XS", "S", "M", "L"],
    shoes: ["36", "37", "38", "39", "40"],
    bags: ["Mini", "Medium", "Large"],
    beauty: ["30 ml", "50 ml", "100 ml"],
    jewelry: ["Adjustable", "Standard"],
    home: ["Single", "Set of 2"],
  };
  const colorOptions = colorOptionsByCategory[product.category?.slug] ?? [
    { name: "Signature", swatch: "#c99999" },
    { name: "Stone", swatch: "#d2cab9" },
  ];
  const sizeOptions = sizeOptionsByCategory[product.category?.slug] ?? ["Standard"];
  const activeColor = selectedColor ?? colorOptions[0].name;
  const activeSize = selectedSize ?? sizeOptions[0];
  const effectiveQuantity = selectedQuantity;
  const soldOut = product.stock <= 0;

  return (
    
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-16 pt-6">
      <div className="sticky top-[70px] z-40 bg-[#e4e0ce]/80 backdrop-blur-md">
  <CategoriesBar />
</div>
  <section className="flex flex-col lg:flex-row gap-0 items-stretch">

  {/* LEFT IMAGE */}
  <div className="w-full lg:w-[46%]">
    
    <div className="sticky top-32 h-[780px] bg-white flex items-center justify-center">

      {imageSrc ? (
        <img
          ref={imageRef}
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="h-full w-full bg-white" />
      )}

    </div>
  </div>

  {/* RIGHT CONTENT */}
  <div className="w-full lg:w-[54%]">

    <div className="h-[780px] bg-white p-10 overflow-y-auto space-y-6">

      <div className="pt-16">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-deep)]">
          {product.category?.name ?? "Curated drop"}
        </p>

        <h1 className="mt-3 text-5xl font-light tracking-wide">
          {product.name}
        </h1>

        <p className="mt-4 leading-7 text-[var(--muted)]">
          {product.description}
        </p>

        <p className="mt-6 text-3xl text-[var(--gold-deep)]">
          {money(product.price)}
        </p>
      </div>

      <div className="my-6 border-t border-[#ece3d8]" />

      {/* OPTIONS */}
      <div className="space-y-7">
        
        {/* COLOR */}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Color</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {colorOptions.map((option) => {
              const active = activeColor === option.name;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setSelectedColor(option.name)}
                  className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${
                    active
                      ? "border-[rgba(212,175,55,0.54)] bg-white/90"
                      : "border-[rgba(143,108,29,0.14)] bg-white/60"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: option.swatch }}
                  />
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* SIZE */}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Size</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {sizeOptions.map((size) => {
              const active = activeSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    active
                      ? "border-[rgba(212,175,55,0.54)] bg-white/90 text-[var(--gold-deep)]"
                      : "border-[rgba(143,108,29,0.14)] bg-white/60"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUANTITY */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border px-3 py-2">
          <button
            onClick={() => setSelectedQuantity((c) => Math.max(1, c - 1))}
          >
            -
          </button>

          <span>{selectedQuantity}</span>

          <button
            onClick={() =>
              setSelectedQuantity((c) => Math.min(product.stock, c + 1))
            }
          >
            +
          </button>
        </div>

        <p className="text-sm text-[var(--muted)]">
          Ready: <span className="font-medium">{selectedQuantity}</span>
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            addProductToCart(product, imageRef.current, selectedQuantity)
          }
          className="gold-button rounded-full px-6 py-3 text-sm uppercase"
        >
          Add to cart
        </motion.button>

        <button
          onClick={() => {
            void toggleWishlist(product);
            openWishlist();
          }}
          className="rounded-full border px-6 py-3 text-sm uppercase"
        >
          <HeartIcon className="h-4 w-4" />
        </button>

        <Link href="/checkout" className="rounded-full border px-6 py-3 text-sm uppercase">
          Checkout
        </Link>
      </div>

      {/* DELIVERY GRID */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="text-center">
          <TruckIcon className="mx-auto mb-2 h-7 w-7 text-[#c9a96e]" />
          <p className="text-sm font-medium">Delivery</p>
          <p className="text-xs text-gray-500">3–6 days</p>
        </div>

        <div className="text-center">
          <ShieldCheckIcon className="mx-auto mb-2 h-7 w-7 text-[#c9a96e]" />
          <p className="text-sm font-medium">Secure</p>
          <p className="text-xs text-gray-500">Protected checkout</p>
        </div>

        <div className="text-center">
          <CheckBadgeIcon className="mx-auto mb-2 h-7 w-7 text-[#c9a96e]" />
          <p className="text-sm font-medium">Authentic</p>
          <p className="text-xs text-gray-500">Verified quality</p>
        </div>
      </div>

    </div>
  </div>
</section>
          <div className="luxury-card rounded-[38px] p-8">
            <p className="text-xs uppercase text-[var(--muted)]">Reviews ({reviews.length})</p>
            <div className="mt-5 space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-[24px] border p-5">
                    <p className="text-sm font-medium">
                      {"★".repeat(Math.max(1, Math.min(5, review.rating)))} {review.rating}/5
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No reviews yet.</p>
              )}
            </div>
          </div>
 

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="section-heading text-3xl">You may also like</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </PageReveal>
  );
}
