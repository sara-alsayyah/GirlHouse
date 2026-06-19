import type { ReactNode } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminTopbar } from "./components/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdf8f7]">
      <div className="flex">
        <AdminSidebar />

        <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
          <AdminTopbar />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
