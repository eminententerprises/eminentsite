import Image from "next/image";
import { Heart, RefreshCw, Search, Smartphone } from "lucide-react";
import { APP } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Official "Get it on Google Play" badge. Links to the store once
 * APP.playStoreUrl is set in src/config/site.ts; until then it renders as a
 * non-interactive "Coming soon" badge.
 */
export function PlayStoreBadge({ className, height = 56 }: { className?: string; height?: number }) {
  const width = Math.round((height * 646) / 250);
  const badge = (
    <Image
      src="/badges/google-play-badge.png"
      alt="Get it on Google Play"
      width={width}
      height={height}
      className="block h-auto max-w-full"
      style={{ width, height: "auto" }}
    />
  );

  if (APP.playStoreUrl) {
    return (
      <a
        href={APP.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-block transition-transform duration-200 hover:-translate-y-0.5", className)}
      >
        {badge}
      </a>
    );
  }

  return (
    <span className={cn("relative inline-block", className)} aria-label="Google Play app coming soon">
      <span className="block opacity-90">{badge}</span>
      <span className="absolute -right-2 -top-2 rounded-full bg-accent px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-paper shadow-card">
        Coming soon
      </span>
    </span>
  );
}

const APP_FEATURES = [
  { icon: Search, label: "Search every listing on the go" },
  { icon: Heart, label: "Save & compare favourites" },
  { icon: RefreshCw, label: "Always in sync with our latest listings" },
];

/** Homepage band announcing the Android app. */
export function AppDownloadSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 sm:px-12 sm:py-14">
        <div className="hero-glow opacity-70" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-label font-semibold uppercase tracking-widest text-iris-300">
              <Smartphone className="h-4 w-4" aria-hidden="true" /> The Eminent App
            </p>
            <h2 className="mt-3 text-display-md text-paper">Property Search, In Your Pocket.</h2>
            <p className="mt-4 text-body-lg text-ink-inverted-muted">
              Every listing from our team, updated the moment it&apos;s published. Browse, save, compare and reach us on WhatsApp
              in one tap.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 lg:justify-start">
              {APP_FEATURES.map((f) => (
                <li key={f.label} className="flex items-center justify-center gap-2 text-body-sm text-paper lg:justify-start">
                  <f.icon className="h-4 w-4 text-iris-300" aria-hidden="true" />
                  {f.label}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center lg:-ml-2.5 lg:justify-start">
              <PlayStoreBadge height={64} />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[var(--shadow-glass)] backdrop-blur-xl">
              <Image
                src="/badges/eminent-app-icon.png"
                alt="Eminent Enterprises app icon"
                width={128}
                height={128}
                className="h-28 w-28 rounded-[1.6rem] shadow-raised sm:h-32 sm:w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
