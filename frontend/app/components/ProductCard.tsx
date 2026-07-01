"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Product } from "@/app/lib/types";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";
import { EyeIcon, HeartIcon } from "@/app/components/icons";

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product | null | undefined;
  featured?: boolean;
}) {
  if (!product) return null;

  const {
    addProductToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useStore();

  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageSrc = resolveMediaUrl(product.image);

  const [loading, setLoading] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = async () => {
    try {
      setLoading(true);
      await addProductToCart(product, imageRef.current ?? undefined);
    } catch (err) {
      console.error("Quick add failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = () => {
    try {
      setQuickViewProduct(product);
    } catch (err) {
      console.error("Quick view failed:", err);
    }
  };

  const handleWishlist = async () => {
    try {
      await toggleWishlist(product);
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden bg-transparent"
    >
      {/* IMAGE */}
      <div className={`relative overflow-hidden ${featured ? "md:w-[52%]" : ""}`}>
        {imageSrc ? (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={product.name}
            className={`w-full object-contain transition duration-500 group-hover:scale-[1.04] ${
              featured ? "h-full min-h-[360px]" : "h-[280px] sm:h-[320px]"
            }`}
          />
        ) : (
          <div
            className={`flex items-end bg-[radial-gradient(circle_at_top,#fff8de,#d5b14c_45%,#b88722_100%)] ${
              featured ? "h-full min-h-[360px]" : "h-[280px] sm:h-[320px]"
            }`}
          />
        )}

        {/* CATEGORY */}
        <div className="absolute left-4 top-4 rounded-full border border-white/40 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--gold-deep)]">
          {product.category?.name ?? "Curated"}
        </div>

        {/* ACTIONS */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">

     <button
  type="button"
  onClick={handleWishlist}
  className="p-2 transition hover:scale-110"
>
  <HeartIcon
    className={`h-6 w-6 ${
      wishlisted ? "fill-red-500 text-red-500" : "text-[#b78895]"
    }`}
  />
</button>
          <button
  type="button"
  onClick={handleQuickView}
  className="p-2 transition hover:scale-110"
>
  <EyeIcon className="h-5 w-5" />
</button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex flex-col items-center text-center gap-2">

        <div className="space-y-4">

          <div className="flex items-start justify-between gap-4">

            <div>
             

            <Link
  href={`/products/${product.slug}`}
  className="text-base font-medium"
>
  {product.name}
</Link>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-[var(--gold-deep)]">
                {money(product.price)}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {product.stock > 0 ? "In stock" : "Sold out"}
              </p>
            </div>

          </div>

          <p
            className={`text-[var(--muted)] ${
              featured
                ? "text-sm leading-7"
                : "line-clamp-2 text-sm leading-6"
            }`}
          >
            {product.description ||
              "An elevated essential chosen for its quiet richness and modern refinement."}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3">

          <Link
            href={`/products/${product.slug}`}
            className=" border border-[rgba(143,108,29,0.18)] px-4 py-2 text-sm hover:text-[var(--gold-deep)]"
          >
            Details
          </Link>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAdd}
            disabled={loading}
            className="gold-button px-5 py-3 text-sm uppercase tracking-[0.16em]"
          >
            {loading ? "Adding..." : "Quick add"}
          </motion.button>

        </div>

      </div>
    </motion.article>
  );
}