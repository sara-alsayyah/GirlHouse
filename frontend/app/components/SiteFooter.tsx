import Link from "next/link";
import { BrandLogo } from "@/app/components/BrandLogo";
import { ArrowUturnLeftIcon, ShieldCheckIcon, StarIcon, TruckIcon } from "@heroicons/react/24/outline";

const trustItems = [
  { icon: TruckIcon, title: "Fast shipping", detail: "Delivery across Lebanon" },
  { icon: ShieldCheckIcon, title: "Secure payment", detail: "Safe payment options" },
  { icon: ArrowUturnLeftIcon, title: "Easy returns", detail: "Flexible return support" },
  { icon: StarIcon, title: "Premium quality", detail: "Thoughtfully selected pieces" },
];
const quickLinks = [{ href: "/", label: "Home" }, { href: "/products", label: "Collections" }, { href: "/products?sort=new", label: "New arrivals" }, { href: "/contact", label: "Contact us" }];
const supportLinks = [{ href: "/account", label: "My account" }, { href: "/cart", label: "Shopping bag" }, { href: "/checkout", label: "Checkout" }, { href: "/contact", label: "Delivery & returns" }];
const footerLinkClass = "block text-sm leading-6 text-[#6f5b61] transition-colors hover:text-[#956773]";
const footerHeadingClass = "mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#79515b]";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#eadfe0] bg-[#faf5f2] text-[#4b343a]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:px-10">
        <div className="max-w-sm"><BrandLogo nav /><p className="mt-5 text-sm leading-6 text-[#6f5b61]">Elegant modest fashion, thoughtfully selected for every sophisticated woman.</p></div>
        <div><h2 className={footerHeadingClass}>Quick links</h2><div className="space-y-2">{quickLinks.map((link) => <Link key={link.href} href={link.href} className={footerLinkClass}>{link.label}</Link>)}</div></div>
        <div><h2 className={footerHeadingClass}>Customer care</h2><div className="space-y-2">{supportLinks.map((link) => <Link key={link.href} href={link.href} className={footerLinkClass}>{link.label}</Link>)}</div></div>
        <div><h2 className={footerHeadingClass}>Stay in touch</h2><p className="text-sm leading-6 text-[#6f5b61]">Join our WhatsApp group for new arrivals and special offers.</p><a href="https://wa.me/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#956773] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#79515b]">Join WhatsApp</a></div>
      </div>
      <div className="border-t border-[#eadfe0]"><p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs leading-5 text-[#806a71] sm:px-6 lg:px-10 lg:text-left">© {new Date().getFullYear()} Girl House Shop. All rights reserved.</p></div>
    </footer>
  );
}
