import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { BRAND_NAME } from "@/app/lib/brand";
import { AppShell } from "@/app/components/AppShell";
export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Modest fashion with elegance - GIRL HOUSE Shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
