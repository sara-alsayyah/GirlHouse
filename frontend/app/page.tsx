"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { asArray, getHeroSlides, getProducts, money, resolveMediaUrl } from "@/app/lib/api";
import type { Product } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import {
  TruckIcon,
  ShieldCheckIcon,
  ArrowUturnLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

import { useStore } from "@/app/providers/StoreProvider";

type HeroSlide = {
  image?: string;
};


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts("?page=1")
      .then((response) => setProducts(asArray(response)))
      .catch(() => setProducts([]));
  }, []);

  const mostPopular = products.slice(0, 5);

  const featuredCategories = [
    { name: "فساتين",        nameEn: "Dresses",     slug: "dresses" },
    { name: "عبايات",        nameEn: "Abaya",      slug: "abaya" },
    { name: "تنانير",   nameEn: "Skirts", slug: "skirts" },
    { name: " اطقم", nameEn: "Sets", slug: "sets" },
    { name: "وصل حديثاً",    nameEn: "New Arrivals", slug: "women" },
  ];

 const trustBadges = [
  { icon: TruckIcon, ar: "شحن سريع", sub: "لكافة المناطق" },
  { icon: ShieldCheckIcon, ar: "دفع آمن", sub: "طرق دفع متعددة وآمنة" },
  { icon: ArrowUturnLeftIcon, ar: "إرجاع سهل", sub: "سياسة إرجاع مرنة" },
  { icon: StarIcon, ar: "جودة عالية", sub: "خامات مختارة بعناية" },
];


const [slides, setSlides] = useState<HeroSlide[]>([]);
const [current, setCurrent] = useState(0);
useEffect(() => {
  getHeroSlides()
    .then(setSlides)
    .catch(() => setSlides([]));
}, []);
useEffect(() => {
  if (!slides.length) return;

  const interval = setInterval(() => {
    setCurrent((prev) => {
      if (slides.length === 0) return 0;
      return (prev + 1) % slides.length;
    });
  }, 10000);

  return () => clearInterval(interval);
}, [slides.length]);

  const { toggleWishlist, isWishlisted } = useStore();
const currentSlide = slides?.[current] ?? null;

  return (
    <PageReveal className="page-shell pb-20">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "min(90vh, 780px)", minHeight: 560 }}
        >
          {/* bg gradient fallback */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(120deg,#9d7f8c 0%,#c4a0a8 100%)" }}
          />

          {/* product image */}
          

<div
  key={currentSlide?.image}
  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
  style={{
backgroundImage: currentSlide?.image
  ? `url(${resolveMediaUrl(currentSlide.image)})`
  : "url('/Hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center right",
  }}
/>
        

          {/* left dark fade */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,rgba(60,35,42,.82) 0%,rgba(60,35,42,.45) 40%,rgba(60,35,42,0) 75%)",
            }}
          />

          {/* content */}
          <div className="relative z-10 flex h-full flex-col justify-center px-8 sm:px-14 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#e8cfc0]">
                Modest Fashion
              </p>
              <h1
                className="mt-4 text-5xl sm:text-6xl font-light tracking-wide text-white leading-tight"
                style={{ fontFamily: "var(--font-display, serif)" }}
              >
                MODESTY <p>WITH{" "}
                <span style={{ color: "#d4b080" }}>ELEGANCE</span></p>
              </h1>
              <p className="mt-4 text-base !text-[#e8cfc0] text-left" dir="rtl">
                حيث تلتقي الأناقة بالاحتشام
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium uppercase tracking-widest text-white"
                style={{
                  background: "linear-gradient(135deg,#c9a96e 0%,#a67a5a 100%)",
                }}
              >
                تسوقي الآن →
              </Link>
            </motion.div>
          </div>

          {/* slide dots */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex gap-2">
           {Array.from({ length: slides.length || 3 }).map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all"
                style={{
                 
                  height: 8,
                  background: i === current ? "#d4b080" : "rgba(255,255,255,0.4)",
                  width: i === current ? 28 : 8,
                }}
              />
            ))}
          </div>

          {/* slide counter bottom-left */}
          <p className="absolute bottom-7 left-8 z-10 text-xs text-white/60 tracking-widest">
           {slides.length
  ? `${String(current + 1).padStart(2, "0")} ── ${String(
      slides.length
    ).padStart(2, "0")}`
  : "01 ── 03"}
          </p>
        </div>
      </section>

      {/* ─── BROWSE CATEGORIES ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        {/* heading with gold lines */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-[#c9a96e]" />
          <p
            className="text-center text-sm tracking-[0.3em] text-[#9a7060]"
            dir="rtl"
          >
            تسوقي من مجموعاتنا
          </p>
          <span className="h-px w-16 bg-[#c9a96e]" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featuredCategories.map((cat, i) => (
            <Link
              key={cat.slug + i}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: "3/4" }}
            >
              {/* placeholder gradient bg — replaced by product image if available */}
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(160deg,#d9b8be 0%,#b08890 100%)"
                      : "linear-gradient(160deg,#c4a0a8 0%,#9a7880 100%)",
                }}
              />
              {/* product image if we have enough products */}
              {products[i]?.image && (
                <img
                  src={resolveMediaUrl(products[i].image) ?? ""}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {/* dark overlay at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(50,28,32,.75) 0%,rgba(50,28,32,0) 55%)",
                }}
              />
              <p
                className="absolute bottom-4 w-full text-center text-base font-medium text-white"
                dir="rtl"
              >
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

        {/* "Show all" button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="rounded-full border px-7 py-2.5 text-sm tracking-widest text-[#9a7060] transition hover:bg-[#f5ece8]"
            style={{ borderColor: "#c9a96e" }}
            dir="rtl"
          >
            ← عرض الكل
          </Link>
        </div>
      </section>

      {/* ─── MOST POPULAR ─────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ background: "linear-gradient(180deg,#fdf8f6 0%,#f5ece8 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-10 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#c9a96e]" />
            <p
              className="text-center text-sm tracking-[0.3em] text-[#9a7060]"
              dir="rtl"
            >
              الأكثر مبيعاً
            </p>
            <span className="h-px w-16 bg-[#c9a96e]" />
          </div>

       <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
  {(mostPopular.length ? mostPopular : Array(5).fill(null)).map(
    (product, i) => {
      const wishlisted = product ? isWishlisted(product.id) : false;

      return (
        <motion.div
          key={product?.id ?? `fallback-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="group rounded-2xl overflow-hidden bg-white"
        >
          {/* image area */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "3/4",
              background: "linear-gradient(135deg,#f0e0e4,#ddb5bc)",
            }}
          >
            {product?.image ? (
              <img
                src={resolveMediaUrl(product.image) ?? ""}
                alt={product.name ?? ""}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full" />
            )}

       {product && (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!product) return;
      void toggleWishlist(product);
    }}
    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
  >
    <span
      className={`text-lg transition ${
        wishlisted ? "text-[#d46a8c]" : "text-[#b78895]"
      }`}
    >
      {wishlisted ? "♥" : "♡"}
    </span>
  </button>
)}
          </div>

          {/* info */}
          <div className="p-3" dir="rtl">
            {product && (
              <p className="text-[10px] uppercase tracking-widest text-[#b09098]">
                {product.category?.name}
              </p>
            )}

            <Link
              href={product ? `/products/${product.slug}` : "#"}
              className="mt-1 block text-sm font-medium text-[#5a3a42] hover:text-[#c9a96e] transition line-clamp-1"
            >
              {product?.name ?? "—"}
            </Link>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#c9a96e]">
                {product ? money(product.price) : "—"}
              </p>

              <span className="text-[10px] text-[#c9a96e]">★★★★★</span>
            </div>
          </div>
        </motion.div>
      );
    }
  )}
</div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─────────────────────────────────────── */}
      <section style={{ background: "#f0e4e8" }}>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustBadges.map((b) => {
  const Icon = b.icon;

  return (
    <div
      key={b.ar}
      className="flex flex-col items-center gap-2 text-center"
    >
      <Icon className="h-6 w-6 text-[#b78895]" />

      <p className="text-sm font-medium text-[#5a3a42]" dir="rtl">
        {b.ar}
      </p>

      <p className="text-xs text-[#9a7882]" dir="rtl">
        {b.sub}
      </p>
    </div>
  );
})}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM GRID ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-[#c9a96e]" />
          <p
            className="text-center text-sm tracking-[0.3em] text-[#9a7060]"
            dir="rtl"
          >
            تابعينا على الإنستقرام
          </p>
          <span className="h-px w-16 bg-[#c9a96e]" />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {(products.length ? products.slice(0, 7) : Array(7).fill(null)).map(
            (product: Product | null | undefined, i) => (
              <div
               key={product?.id ?? `fallback-${i}`}
                className="relative overflow-hidden rounded-xl"
                style={{
                  aspectRatio: "1",
                  background: "linear-gradient(135deg,#e8d0d4,#c9a0a8)",
                }}
              >
                {product?.image && (
                  <img
                    src={resolveMediaUrl(product.image) ?? ""}
                    alt=""
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            )
          )}
        </div>
      </section>

    </PageReveal>
  );
}
