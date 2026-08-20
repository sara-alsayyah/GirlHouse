"use client";

import { useEffect, useState } from "react";
import { adminGetPromotionBanner, adminUpdatePromotionBanner, getApiErrorMessage, getStoredAccessToken, type PromotionBanner } from "@/app/lib/api";

export function PromotionBannerSettings() {
  const [promotion, setPromotion] = useState<PromotionBanner | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { const token = getStoredAccessToken(); if (token) adminGetPromotionBanner(token).then(setPromotion).catch((error) => setMessage(getApiErrorMessage(error))); }, []);
  if (!promotion) return <div className="h-48 animate-pulse rounded-[28px] bg-white" />;
  const update = <K extends keyof PromotionBanner>(key: K, value: PromotionBanner[K]) => setPromotion((current) => current ? { ...current, [key]: value } : current);
  async function save() { const token = getStoredAccessToken(); if (!token || !promotion) return; try { setPromotion(await adminUpdatePromotionBanner(token, promotion)); setMessage("Promotion saved."); } catch (error) { setMessage(getApiErrorMessage(error)); } }
  return <section className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#4b343a]">Homepage promotion</h2><p className="mt-1 text-sm text-[#8f727a]">The first-order banner displayed on the storefront.</p></div><label className="flex items-center gap-2 text-sm text-[#79515b]"><input type="checkbox" checked={promotion.is_enabled} onChange={(e) => update("is_enabled", e.target.checked)} /> Show banner</label></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><input value={promotion.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="Small heading" className="h-12 rounded-xl border border-[#ead9dd] px-4" /><input value={promotion.headline} onChange={(e) => update("headline", e.target.value)} placeholder="Promotion headline" className="h-12 rounded-xl border border-[#ead9dd] px-4" /><input value={promotion.button_label} onChange={(e) => update("button_label", e.target.value)} placeholder="Button label" className="h-12 rounded-xl border border-[#ead9dd] px-4" /><input value={promotion.button_url} onChange={(e) => update("button_url", e.target.value)} placeholder="Button link, e.g. /products" className="h-12 rounded-xl border border-[#ead9dd] px-4" /></div>
    <div className="mt-5 flex items-center gap-4"><button type="button" onClick={() => void save()} className="bg-[#956773] px-5 py-3 text-xs uppercase tracking-wider text-white">Save promotion</button>{message && <p className="text-sm text-[#79515b]">{message}</p>}</div>
  </section>;
}
