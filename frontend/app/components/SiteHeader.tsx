"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/app/providers/StoreProvider";
import { BrandLogo } from "@/app/components/BrandLogo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/app/components/icons";
import { HeaderSearch } from "@/app/components/HeaderSearch";
import { CategoriesBar } from "./CategoriesBar";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collections" },
  { href: "/products?sort=new", label: "New arrivals" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { wishlistCount, isAdmin, mounted } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-[60]">
      <div className="bg-[#79515b] px-3 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-white sm:text-[10px]">
        Delivery all over Lebanon <span className="mx-2 text-[#efd7b4]">•</span> New collection available
      </div>
      <nav className="border-b border-[#eadfe0] bg-[#fffdfb]/95 backdrop-blur-lg">
        <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:px-6 lg:h-[92px] lg:grid-cols-[190px_minmax(0,1fr)_190px] lg:gap-5 lg:px-10">
          <Link href="/" aria-label="Girl House home" onClick={closeMenu} className="min-w-0 shrink-0 justify-self-start">
            <BrandLogo />
          </Link>

          <div className="hidden min-w-0 lg:block">
            <Suspense fallback={null}>
              <CategoriesBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-1 justify-self-end sm:gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} className="nav-icon" aria-label="Search products" aria-expanded={searchOpen} aria-controls="site-search-dialog">
              <SearchIcon className="h-5 w-5" />
            </button>
            <Link href={mounted && isAdmin ? "/admin" : "/account"} className="nav-icon hidden sm:flex" aria-label="Account">
              <UserIcon className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" className="nav-icon relative hidden sm:flex" aria-label="Wishlist">
              <HeartIcon className="h-5 w-5" />
              {wishlistCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#956773] px-1 text-[9px] font-bold text-white">{wishlistCount}</span>}
            </Link>
            <Link href="/cart" className="nav-icon" aria-label="Shopping bag"><BagIcon className="h-5 w-5" /></Link>
            <button type="button" onClick={() => setMenuOpen(true)} className="nav-icon lg:hidden" aria-label="Open navigation"><MenuIcon className="h-5 w-5" /></button>
          </div>
        </div>
      </nav>

      <div className="border-b border-[#eadfe0] bg-[#fffdfb]/95 px-3 lg:hidden">
        <Suspense fallback={null}>
          <CategoriesBar />
        </Suspense>
      </div>

      {searchOpen && (
        <div id="site-search-dialog" className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search products">
          <button type="button" className="absolute inset-0 cursor-default bg-[#34242a]/35 backdrop-blur-[2px]" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-16 w-[min(92vw,680px)] sm:mt-24">
            <button type="button" onClick={() => setSearchOpen(false)} className="mb-3 ml-auto flex min-h-10 items-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#79515b] shadow-lg">Close</button>
            <Suspense fallback={null}><HeaderSearch onClose={() => setSearchOpen(false)} /></Suspense>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" aria-label="Close navigation" onClick={closeMenu} className="absolute inset-0 bg-[#34242a]/35 backdrop-blur-[2px]" />
          <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-[#fffdfb] px-6 py-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadfe0] pb-5">
              <BrandLogo />
              <button type="button" onClick={closeMenu} className="nav-icon" aria-label="Close navigation"><CloseIcon className="h-5 w-5" /></button>
            </div>
            <div className="mt-7 flex flex-col">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu} className={`border-b border-[#eee3e4] py-4 text-sm uppercase tracking-[0.16em] ${pathname === item.href ? "text-[#956773]" : "text-[#4b343a]"}`}>{item.label}</Link>
              ))}
              <Link href="/account" onClick={closeMenu} className="border-b border-[#eee3e4] py-4 text-sm uppercase tracking-[0.16em] text-[#4b343a]">My account</Link>
              <Link href="/wishlist" onClick={closeMenu} className="border-b border-[#eee3e4] py-4 text-sm uppercase tracking-[0.16em] text-[#4b343a]">Wishlist</Link>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
              <Link href="/login" onClick={closeMenu} className="border border-[#b98e98] py-3 text-center text-xs uppercase tracking-wider text-[#79515b]">Login</Link>
              <Link href="/register" onClick={closeMenu} className="bg-[#956773] py-3 text-center text-xs uppercase tracking-wider text-white">Create account</Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
