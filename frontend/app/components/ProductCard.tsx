"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Product } from "@/app/lib/types";
import { getProductImageUrl, money } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";
import { EyeIcon, HeartIcon } from "@/app/components/icons";

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
  setQuickViewProduct,
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

  const handleQuickView = () => {
    if (!product) return;

    try {
      setQuickViewProduct(product);
    } catch (err) {
      console.error("Quick view failed:", err);
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
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden bg-transparent"
    >
      {/* IMAGE */}
      <div className={`relative  overflow-hidden ${featured ? "md:w-[52%]" : ""}`}>
        <Link
  href={`/products/${product.slug}`}
  className={`relative block overflow-hidden ${
    featured ? "md:w-[52%]" : ""
  }`}
>
        {imageSrc ? (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={product.name}
            className={` inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.04] ${
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

        <div className="absolute right-4 top-4 flex flex-col gap-2">
{/* Wishlist */}
<div className="absolute right-4 top-4">
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      handleWishlist();
    }}
    className=" p-2transition hover:scale-110"
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
      <div className="brand-font mt-4 flex flex-col items-center text-center gap-2">

        <div className="space-y-4">

          <div className="flex items-start justify-between gap-4">
            <div>
            <Link
  href={`/products/${product.slug}`}
  className="text-base font-medium"
>
  {product.name}
</Link>
           
              <p className="mt-2 text-lg font-semibold">
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
            className="gold-button px-5 py-3 text-sm uppercase tracking-[0.16em]"
          >
            {loading ? "Adding..." : "Quick add"}
          </motion.button>

        </div>

      </div>
    </motion.article>
  );
}
