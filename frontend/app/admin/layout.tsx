"use client";

import AdminGuard from "@/app/admin/components/AdminGuard";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminTopbar } from "./components/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#fdf8f7] flex">
        
        {/* SIDEBAR */}
        <AdminSidebar />

        {/* MAIN AREA */}
        <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
          
          <AdminTopbar />

          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>

        </div>

      </div>
    </AdminGuard>
  );
}