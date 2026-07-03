import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { BRAND_NAME } from "@/app/lib/brand";
import { AppShell } from "@/app/components/AppShell";
import { GFS_Didot, Allura, Noto_Kufi_Arabic } from "next/font/google";

export const arabicFont = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-arabic",
});
export const didot = GFS_Didot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-didot",
});

export const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
});
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
    <html lang="en" className={`${didot.variable} ${allura.variable} ${arabicFont.variable}`}>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
