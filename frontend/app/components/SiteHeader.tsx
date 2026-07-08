"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/app/providers/StoreProvider";
import { BrandLogo } from "@/app/components/BrandLogo";
import { CategoryMegaMenu } from "@/app/components/CategoryMegaMenu";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/app/components/icons";
import { HeaderSearch } from "@/app/components/HeaderSearch";

const rightNavigation = [
  { href: "/about", label: "من نحن" },
  { href: "/products?category=women", label: "وصل حديثاً" },
  { href: "/products", label: "المجموعات" },
  { href: "/contact", label: "اتصل بنا" },
  { href: "/", label: "الرئيسية" },
];

export function SiteHeader() {
  const { openWishlist, wishlistCount, user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  function handleSearch(e: React.FormEvent) {
  e.preventDefault();

  const value = search.trim();

  if (!value) return;

  router.push(`/products?search=${encodeURIComponent(value)}`);

  setSearch("");
  setSearchOpen(false);
}

  const pathname = usePathname();

  function closeMenus() {
    setIsMobileMenuOpen(false);
  }
  
  return (
   <>
<div className="brand-font top-0 left-0 right-0 z-[60] bg-[#956773] py-2 text-center text-xs tracking-[0.25em] uppercase text-white">
  ✨ Delivery All Over Lebanon • New Collection Available
</div>

  <header className="relative z-30">
  <nav className="absolute top-0 left-0 right-0 z-[50]">
        <div
          className={`flex items-center justify-between transition-all duration-300
          }`}
        >
          <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
            <div className="relative h-[92px] w-full flex items-center justify-between pt-2">

  {/* LEFT */}
  <div className="flex items-center gap-3 flex-1">

    {/* Desktop search */}
    <div className="hidden lg:flex items-center gap-2 w-[240px]">
      <SearchIcon className="h-5 w-5 text-[#b78895]" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full bg-transparent border-b border-[#d8b6be] outline-none text-sm placeholder:text-[#b78895]/60"
      />
    </div>

    {/* Mobile search icon */}
    <button
      onClick={() => setSearchOpen(true)}
      className="lg:hidden flex items-center justify-center"
    >
      <SearchIcon className="h-5 w-5 text-[#b78895]" />
    </button>

  </div>

  {/* CENTER LOGO */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 scale-[0.9] sm:scale-100">
    <Link href="/" onClick={closeMenus}>
      <BrandLogo />
    </Link>
  </div>

  {/* RIGHT */}
  <div className="flex items-center justify-end flex-1">

    {/* Desktop */}
    <div className="hidden lg:flex items-center gap-5">

      <Link
        href={user?.is_admin ? "/admin" : "/account"}
        className="flex items-center gap-2 text-sm text-[#7d6269]"
      >
        <UserIcon className="h-5 w-5 text-[#b78895]" />
        <span className="hidden underline xl:inline">Account</span>
      </Link>
       <Link
        href={"/wishlist"}
        className="flex items-center gap-2 text-sm text-[#7d6269]"
      >
        <HeartIcon className="h-5 w-5 text-[#b78895]" />
        <span className="hidden underline xl:inline">Wishlist ({wishlistCount})</span>
     
      </Link>

      <Link
        href="/cart"
        className="flex items-center gap-2 text-sm text-[#7d6269]"
      >
        <BagIcon className="h-5 w-5 text-[#b78895]" />
        <span className="hidden underline xl:inline">Bag (0)</span>
      </Link>

    </div>

    {/* Mobile menu button */}
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen((c) => !c)}
        className="flex h-10 w-10 items-center justify-center"
      >
        {isMobileMenuOpen ? (
          <CloseIcon className="h-5 w-5 text-[#b78895]" />
        ) : (
          <MenuIcon className="h-5 w-5 text-[#b78895]" />
        )}
      </button>
    </div>

  </div>
            </div>
          </div>
        </div>
      </nav>
     {searchOpen && (
  <div className="fixed top-[90px] left-0 right-0 z-50 flex justify-center px-6">
    <HeaderSearch />
  </div>
)}

      {isMobileMenuOpen && (
        <div className="mt-20 bg-white/95 border-t border-[rgba(166,122,122,0.08)] lg:hidden">
          <div className="space-y-2 px-4 py-4">
            {rightNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className="block px-4 py-3 text-sm text-[#8a7a7d] hover:text-[#b78895] hover:bg-[#faf8f6] rounded-lg transition"
              >
                <div className="text-sm font-medium">{item.label}</div>
              </Link>
            ))}

            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                onClick={closeMenus}
                className="flex-1 rounded-lg border border-[#b78895] px-4 py-2 text-center text-sm text-[#b78895] hover:bg-[#faf8f6] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="flex-1 rounded-lg px-4 py-2 text-center text-sm text-white transition"
                style={{
                  background:
                    "linear-gradient(135deg, #d4b599 0%, #b78895 48%, #a67a7a 100%)",
                }}
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      )}

      <CategoryMegaMenu open={false} onEnter={() => {}} onLeave={() => {}} />
    </header>
    </>
  );
}
