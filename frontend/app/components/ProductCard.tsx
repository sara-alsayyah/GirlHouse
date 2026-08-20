"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Product } from "@/app/lib/types";
import { getProductImageUrl, money } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";
import { HeartIcon } from "@/app/components/icons";

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product | null | undefined;
  featured?: boolean;
}) {
const {
  addProductToCart,
  toggleWishlist,
  isWishlisted,
} = useStore();

  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageSrc = getProductImageUrl(product);

  const [loading, setLoading] = useState(false);

  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleQuickAdd = async () => {
    if (!product) return;

    try {
      setLoading(true);
      await addProductToCart(product, null, 1);
    } catch (err) {
      console.error("Quick add failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    try {
      await toggleWishlist(product);
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  if (!product) return null;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex min-w-0 flex-col bg-transparent"
    >
      {/* IMAGE */}
      <div className={`relative overflow-hidden bg-[#f5f0ed] ${featured ? "md:w-[52%]" : "aspect-[3/4]"}`}>
        <Link
  href={`/products/${product.slug}`}
    className={`relative block h-full overflow-hidden ${
    featured ? "md:w-[52%]" : ""
  }`}
>
        {imageSrc ? (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={product.name}
            className={`inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.035] ${
              featured ? "min-h-[360px]" : ""
            }`}
          />
        ) : (
          <div
            className={`flex items-end bg-[radial-gradient(circle_at_top,#fff8de,#d5b14c_45%,#b88722_100%)] ${
              featured ? "h-full min-h-[360px]" : "h-full"
            }`}
          />
        )}

        <div className="absolute right-4 top-4 flex flex-col gap-2">
{/* Wishlist */}
<div className="absolute right-3 top-3 sm:right-4 sm:top-4">
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      handleWishlist();
    }}
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur transition hover:scale-110"
  >
    <HeartIcon
      className={`h-6 w-6 ${
        wishlisted
          ? "fill-red-500 text-red-500"
          : "text-[#b78895]"
      }`}
    />
  </button>
</div>

</div>
</Link>
      </div>

      {/* CONTENT */}
      <div className="brand-font mt-3 flex flex-col items-center gap-2 text-center sm:mt-4">

        <div className="w-full space-y-2">

          <div className="flex items-start justify-between gap-4">
            <div>
            <Link
  href={`/products/${product.slug}`}
  className="line-clamp-2 text-sm font-medium tracking-wide text-[#473238] sm:text-base"
>
  {product.name}
</Link>
           
              <p className="text-sm font-semibold text-[#8e5e6b] sm:text-base">
    {money(product.price)}
  </p>
         
 </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3">

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAdd}
            disabled={loading}
            className="mt-1 w-full border border-[#a77884] bg-transparent px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-[#704b55] transition hover:bg-[#956773] hover:text-white sm:text-xs"
          >
            {loading ? "Adding..." : "Quick add"}
          </motion.button>

        </div>

      </div>
    </motion.article>
  );
}
