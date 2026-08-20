import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import type { BrandKey } from "@/config/site";
import { CONTACT, EMINENT, BURAQ } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-1.4V15.2a5.4 5.4 0 1 1-4.68-5.35v2.6a2.8 2.8 0 1 0 1.97 2.68V2h2.55a4.28 4.28 0 0 0 3.9 4.24z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Buy", href: "/properties?purpose=buy" },
  { label: "Rent", href: "/properties?purpose=rent" },
  { label: "Projects", href: "/projects" },
  { label: "Construction", href: "/construction" },
  { label: "Areas", href: "/areas" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shortlist", href: "/shortlist" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer({ brand }: { brand: BrandKey }) {
  const isBuraq = brand === "buraq";
  return (
    <footer className="border-t border-border-hairline bg-surface-sunken">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-heading-lg uppercase text-navy-800">{isBuraq ? BURAQ.name : EMINENT.name}</p>
            <p className="mt-2 text-body-sm text-ink-secondary">{isBuraq ? BURAQ.positioning : EMINENT.boilerplate}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline text-ink-secondary transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.tiktok.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline text-ink-secondary transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href={buildWhatsAppLink("Hi, I'd like to know more about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline text-ink-secondary transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.phoneHref}
                aria-label="Call"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline text-ink-secondary transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2.5 lg:max-w-lg">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-body-sm font-medium text-ink-secondary transition-colors hover:text-accent-strong"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border-hairline pt-6 text-body-sm text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Eminent Enterprises &amp; Buraq Eminent Constructors.</p>
          <p className="font-tabular-nums text-label uppercase tracking-widest text-accent-strong">{CONTACT.website}</p>
        </div>
      </div>
    </footer>
  );
}
