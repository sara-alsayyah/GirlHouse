"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./PromoCarousel.module.css";


const SALE_END = new Date("2026-09-15T23:59:59");

const SLIDE_INTERVAL_MS = 6000;

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (!now) return null;

    const diffMs = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    return { days, hours, minutes, seconds, expired: diffMs <= 0 };
  }, [now, target]);
}

type Slide = {
  id: string;
  eyebrow: string;
  headline: string;
  body?: string;
  cta: { label: string; href: string };
  background: string;
};

const slides: Slide[] = [
  {
    id: "new-in",
    eyebrow: "Just landed",
    headline: "New arrivals are here",
    body: "Fresh pieces added to the collection this week.",
    cta: { label: "Shop new in", href: "/products?sort=new" },
    background: "linear-gradient(120deg, #1c1817 0%, #3a2e2b 100%)",
  },
  {
    id: "delivery",
    eyebrow: "This week only",
    headline: "Free delivery over $75",
    body: "Applied automatically at checkout — no code needed.",
    cta: { label: "Shop the collection", href: "/products" },
    background: "linear-gradient(120deg, #14100f 0%, #4a3a3d 100%)",
  },
  {
    id: "countdown",
    eyebrow: "End of season sale",
    headline: "Sale ends soon",
    cta: { label: "Shop the sale", href: "/products" },
    background: "linear-gradient(120deg, #2a1416 0%, #5a2530 100%)",
  },
];

function CountdownBlock() {
  const countdown = useCountdown(SALE_END);

  if (!countdown) {
    // Avoid a server/client mismatch — render nothing until mounted.
    return <div style={{ height: 40 }} />;
  }

  if (countdown.expired) {
    return <p className="mt-2 text-[13px] uppercase tracking-[0.14em] text-white/70">Sale has ended</p>;
  }

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hrs", value: countdown.hours },
    { label: "Min", value: countdown.minutes },
    { label: "Sec", value: countdown.seconds },
  ];

  return (
    <div className="mt-3 flex items-center justify-center gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="min-w-[52px] border border-white/25 px-2.5 py-1.5 text-center">
          <p className="font-display text-xl leading-none text-white">{String(unit.value).padStart(2, "0")}</p>
          <p className="mt-1 text-[9.5px] uppercase tracking-[0.1em] text-white/60">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

export function PromoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.wrap}>
      <div id="promoCarousel" className="carousel slide">
        <div className="carousel-indicators">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
            />
          ))}
        </div>

        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item ${index === active ? "active" : ""}`}
              style={{ background: slide.background }}
            >
              <div className={styles.slide}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">{slide.eyebrow}</p>
                  <h3 className="font-display mt-2 text-3xl text-white sm:text-4xl">{slide.headline}</h3>

                  {slide.id === "countdown" ? (
                    <CountdownBlock />
                  ) : slide.body ? (
                    <p className="mt-2 text-[13.5px] text-white/75">{slide.body}</p>
                  ) : null}

                  <Link
                    href={slide.cta.href}
                    className="mt-5 inline-flex items-center gap-2 border border-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-[var(--ink)]"
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-control-prev"
          onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="carousel-control-next"
          onClick={() => setActive((current) => (current + 1) % slides.length)}
          aria-label="Next slide"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
