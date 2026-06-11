"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "@/app/providers/StoreProvider";
import { BrandLogo } from "@/app/components/BrandLogo";
import { CategoryMegaMenu } from "@/app/components/CategoryMegaMenu";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  HomeIcon,
  MailIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/app/components/icons";

const rightNavigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/contact", label: "اتصل بنا" },
  { href: "/products", label: "المجموعات" },
  { href: "/products?category=women", label: "وصل حديثاً" },
  { href: "/about", label: "من نحن" },
];

export function SiteHeader() {
  const { openWishlist, wishlistCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMenus() {
    setIsMobileMenuOpen(false);
  }
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <header className="relative z-30">
      {/* Top announcement bar (static) */}
      <div className="w-full bg-[linear-gradient(90deg,#b78895,#d8b4bc)] px-6 py-2 text-center">
        <p className="text-xs text-white/90 tracking-wide">
          <span className="hidden sm:inline">تصفح متجرنا  |</span> Welcome to our shop
          <span className="hidden sm:inline"> | أهلا وسهلا</span>
        </p>
      </div>

      {/* Overlay navbar (absolute) */}
      <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/50 backdrop-blur-xl shadow-sm"
      : "bg-transparent"
  }`}
>
  <div
    className={`flex items-center justify-between transition-all duration-300 ${
      scrolled ? "h-[80px]" : "h-[92px]"
    }`}
  >
       <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
          <div className="relative h-[92px] w-full flex items-center justify-between">
           <div className="hidden lg:flex items-center gap-4 flex-1">
              <Link
                href="/products"
                onClick={closeMenus}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#faf8f6] transition"
                aria-label="Store"
              >
                <BagIcon className="h-5 w-5 text-[#b78895]" />
              </Link>

              <Link
                href="/account"
                onClick={closeMenus}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#faf8f6] transition"
                aria-label="Account"
              >
                <UserIcon className="h-5 w-5 text-[#b78895]" />
              </Link>

              <Link
                href="/products"
                onClick={closeMenus}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#faf8f6] transition"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5 text-[#b78895]" />
              </Link>

              <button
                type="button"
                onClick={openWishlist}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#faf8f6] transition"
                aria-label="Open wishlist"
              >
                <HeartIcon className="h-5 w-5 text-[#b78895]" />
                {wishlistCount ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b78895] text-[9px] text-white font-semibold">
                    {wishlistCount}
                  </span>
                ) : null}
              </button>
            </div>

            {/* Center logo */}
            <div className="absolute left-1/2 top-10 -translate-x-1/2 scale-[1.65]">
              <Link href="/" onClick={closeMenus}>
                <BrandLogo />
              </Link>
            </div>

            {/* Right nav links */}
           <div className="hidden lg:flex items-center justify-end gap-4 flex-1">
              {rightNavigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenus} className="text-center hover:text-[#b78895] transition">
                  <div className="text-xs uppercase tracking-[0.3em] text-[#d6c9cb]">
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <CloseIcon className="h-5 w-5 text-[#b78895]" /> : <MenuIcon className="h-5 w-5 text-[#b78895]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      </nav>

      {/* Mobile menu (below overlay) */}
      {isMobileMenuOpen && (
        <div className="mt-20 bg-white/95 border-t border-[rgba(166,122,122,0.08)] lg:hidden">
          <div className="space-y-2 px-4 py-4">
            {rightNavigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenus} className="block px-4 py-3 text-sm text-[#8a7a7d] hover:text-[#b78895] hover:bg-[#faf8f6] rounded-lg transition">
                <div className="text-sm font-medium">{item.label}</div>
              </Link>
            ))}

            <div className="flex gap-2 pt-2">
              <Link href="/login" onClick={closeMenus} className="flex-1 rounded-lg border border-[#b78895] px-4 py-2 text-center text-sm text-[#b78895] hover:bg-[#faf8f6] transition">Login</Link>
              <Link href="/register" onClick={closeMenus} className="flex-1 rounded-lg px-4 py-2 text-center text-sm text-white transition" style={{ background: "linear-gradient(135deg, #d4b599 0%, #b78895 48%, #a67a7a 100%)" }}>Join</Link>
            </div>
          </div>
        </div>
      )}

      <CategoryMegaMenu open={false} onEnter={() => {}} onLeave={() => {}} />
    </header>
  );
}
