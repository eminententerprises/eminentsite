import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import type { BrandKey } from "@/config/site";
import { CONTACT, EMINENT, BURAQ } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.79c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.45-4.94 8.45-9.94z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82c-1.01-.98-1.56-2.32-1.56-3.72h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V8.75c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.32 1.38V7.3c-1.31 0-2.51-.55-3.36-1.48z" />
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
                href={CONTACT.facebook.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline text-ink-secondary transition-colors hover:border-accent-strong hover:text-accent-strong"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
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
