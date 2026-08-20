"use client";

import { usePathname } from "next/navigation";
import type { BrandKey } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";

export function resolveBrand(pathname: string): BrandKey {
  return pathname.startsWith("/construction") ? "buraq" : "eminent";
}

export function BrandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const brand = resolveBrand(pathname ?? "/");
  const isListingDetail = /^\/properties\/[^/]+$/.test(pathname ?? "");

  // The admin dashboard is a separate internal tool with its own shell
  // (see src/app/admin/(dashboard)/layout.tsx) — it must not carry the
  // marketing header/footer/WhatsApp float.
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <div data-brand={brand} className="flex min-h-screen flex-col bg-surface-base">
      <Header brand={brand} />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer brand={brand} />
      <WhatsAppFloat brand={brand} />
      {isListingDetail && <MobileActionBar />}
    </div>
  );
}
