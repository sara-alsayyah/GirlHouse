"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tags,
  Star,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] overflow-y-auto bg-gradient-to-b from-[#8e6370] via-[#9a6f7a] to-[#8b616d] text-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 ">
          <div className="flex justify-center rounded-xl">
            <img
              src="/GH-Logo.png"
              alt="Girl House Logo"
              className="w-[150px]"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-[#d4a2af]/50 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />

                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
