import type { Metadata } from "next";
import { fontVariables } from "@/fonts";
import { BrandShell } from "@/components/brand/brand-shell";
import { Toaster } from "@/components/ui/toaster";
import { CONTACT } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.websiteHref),
  title: {
    default: "Eminent Enterprises — Real Estate Solutions. Lasting Value.",
    template: "%s — Eminent Enterprises",
  },
  description:
    "Eminent Enterprises is a trusted real estate advisory and property services firm in Islamabad & Rawalpindi, working alongside Buraq Eminent Constructors.",
  openGraph: {
    type: "website",
    siteName: "Eminent Enterprises",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <BrandShell>{children}</BrandShell>
        <Toaster />
      </body>
    </html>
  );
}
