"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/providers/StoreProvider";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isAdmin } = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

  // Wait for user to load before making a decision
  if (!user) return;

    if (!isAdmin) {
      router.replace("/");
      return;
    }

    setLoading(false);
  }, [token, user, isAdmin, router]);
  
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f7]">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#e6c7cf] border-t-[#b78895]" />

        {/* Text */}
        <p className="text-[#7d6269] text-sm tracking-wide">
          Checking access...
        </p>
      </div>
    </div>
  );
}

  return <>{children}</>;
}
