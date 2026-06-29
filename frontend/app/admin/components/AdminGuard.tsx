"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/providers/StoreProvider";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

 useEffect(() => {
  if (!token) {
    router.replace("/login");
    return;
  }

  if (!user) return;

  if (!user.is_admin) {
    router.replace("/");
    return;
  }

  setChecked(true);
}, [token, user, router]);

  return <>{children}</>;
}