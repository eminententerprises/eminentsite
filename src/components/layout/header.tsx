"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, Heart, Scale, ChevronRight } from "lucide-react";
import type { BrandKey } from "@/config/site";
import { NAV } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PROPERTY_TYPE_LINKS = [
  { label: "Houses", href: "/properties?type=House" },
  { label: "Flats & Apartments", href: "/properties?type=Flat%2FApartment" },
  { label: "Residential Plots", href: "/properties?type=Residential+Plot" },
  { label: "Commercial", href: "/properties?category=commercial" },
];

export function Header({ brand }: { brand: BrandKey }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isBuraq = brand === "buraq";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <header
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 transition-[background-color,box-shadow,border-color] duration-300 sm:px-5",
          "border-white/50 bg-white/85 backdrop-blur-xl",
          isScrolled ? "bg-white/95 shadow-[0_12px_36px_rgba(41,31,118,0.14)]" : "shadow-[0_4px_20px_rgba(41,31,118,0.08)]",
        )}
      >
        <Link href={isBuraq ? "/construction" : "/"} className="flex shrink-0 flex-col whitespace-nowrap leading-none">
          <span className="font-display text-lg uppercase tracking-tight text-navy-800">
            {isBuraq ? "Buraq Eminent" : "Eminent Enterprises"}
          </span>
          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-accent-strong">
            {isBuraq ? "Constructors" : "Real Estate Solutions"}
          </span>
        </Link>

        <NavigationMenu className="hidden min-w-0 max-w-none flex-1 justify-center xl:flex">
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2.5 2xl:px-3">Properties</NavigationMenuTrigger>
              <NavigationMenuContent>
                <PropertiesMega />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2.5 2xl:px-3">Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ServicesMega brand={brand} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/projects">Projects</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/construction">Construction</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/areas">Areas</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/insights">Insights</NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2.5 2xl:px-3">Calculators</NavigationMenuTrigger>
              <NavigationMenuContent>
                <CalculatorsMega />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2.5 2xl:px-3">More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <MoreMega brand={brand} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/shortlist"
            aria-label="View shortlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-iris-50 hover:text-accent-strong lg:inline-flex"
          >
            <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <Link
            href="/compare"
            aria-label="Compare properties"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-iris-50 hover:text-accent-strong lg:inline-flex"
          >
            <Scale className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <Button asChild variant="outline" size="icon" className="xl:hidden">
            <Link href="/properties" aria-label="Search properties">
              <Search />
            </Link>
          </Button>
          <Button asChild variant="primary" size="md" className="hidden xl:inline-flex">
            <Link href="/properties">Search Properties</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full max-w-sm flex-col p-0">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <MobileNav brand={brand} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="relative block px-3 py-2 text-body-sm font-semibold uppercase tracking-wide text-current transition-colors after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-[2px] after:origin-left after:scale-x-0 after:bg-accent-strong after:transition-transform after:duration-300 hover:text-accent-strong hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong"
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

function BrandSwitcher({ brand, className }: { brand: BrandKey; className?: string }) {
  return (
    <div
      className={cn("items-center gap-0.5 rounded-full border border-border-hairline bg-surface-sunken p-0.5", className)}
      role="group"
      aria-label="Switch brand"
    >
      <Link
        href="/"
        className={cn(
          "rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider transition-colors",
          brand === "eminent" ? "bg-accent text-ink-on-accent" : "text-ink-secondary hover:text-accent-strong",
        )}
        aria-current={brand === "eminent" ? "page" : undefined}
      >
        Eminent
      </Link>
      <Link
        href="/construction"
        className={cn(
          "rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider transition-colors",
          brand === "buraq" ? "bg-accent text-ink-on-accent" : "text-ink-secondary hover:text-accent-strong",
        )}
        aria-current={brand === "buraq" ? "page" : undefined}
      >
        Buraq
      </Link>
    </div>
  );
}

function PropertiesMega() {
  return (
    <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-4">
      <MegaColumn title="Browse by purpose" links={NAV.properties} />
      <MegaColumn title="Property types" links={PROPERTY_TYPE_LINKS} />
      <MegaColumn
        title="Explore locations"
        links={[
          { label: "Islamabad", href: "/properties?city=islamabad" },
          { label: "Rawalpindi", href: "/properties?city=rawalpindi" },
          { label: "Hill Regions", href: "/properties?city=hills" },
          { label: "All Area Guides", href: "/areas" },
        ]}
      />
      <div className="flex flex-col justify-between border-l border-border-hairline pl-8">
        <div>
          <p className="font-display text-heading-md uppercase text-navy-800">Eminent Estimate</p>
          <p className="mt-2 text-body-sm text-ink-secondary">
            Get an instant, indicative property valuation using local price-per-marla data.
          </p>
        </div>
        <Link
          href="/tools/eminent-estimate"
          className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline"
        >
          Try the tool <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function ServicesMega({ brand }: { brand: BrandKey }) {
  const isBuraq = brand === "buraq";
  return (
    <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <p className="text-label uppercase tracking-widest text-ink-muted">
          {isBuraq ? "Buraq Eminent Constructors" : "Eminent Enterprises"}
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {(isBuraq ? NAV.construction.slice(1, 6) : NAV.services).map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="block py-1.5 text-body-md font-medium text-ink-primary hover:text-accent-strong">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-border-hairline pl-8">
        <p className="font-display text-heading-md uppercase text-navy-800">
          {isBuraq ? "Need real estate advisory?" : "Planning to build?"}
        </p>
        <p className="mt-2 text-body-sm text-ink-secondary">
          {isBuraq
            ? "Eminent Enterprises handles sale, purchase and portfolio management."
            : "Buraq Eminent Constructors brings 10 years of real estate expertise to construction."}
        </p>
        <Link
          href={isBuraq ? "/services" : "/construction"}
          className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline"
        >
          {isBuraq ? "Eminent Enterprises" : "Buraq Eminent Constructors"} <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function CalculatorsMega() {
  return (
    <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2">
      <CalculatorColumn title="Real Estate Tools" links={NAV.calculators.realEstate} />
      <CalculatorColumn title="Construction Tools" links={NAV.calculators.construction} />
    </div>
  );
}

function CalculatorColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string; description: string }[];
}) {
  return (
    <div>
      <p className="text-label uppercase tracking-widest text-ink-muted">{title}</p>
      <ul className="mt-3 flex flex-col gap-4">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group block">
              <span className="text-body-md font-semibold text-ink-primary group-hover:text-accent-strong">{l.label}</span>
              <span className="mt-0.5 block text-body-sm text-ink-secondary">{l.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoreMega({ brand }: { brand: BrandKey }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          { label: "Overseas Pakistanis", href: "/overseas" },
          { label: "About the Group", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "List Your Property", href: "/list-your-property" },
          { label: "Shortlist", href: "/shortlist" },
          { label: "Compare", href: "/compare" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="px-2 py-2 text-body-sm font-medium text-ink-primary hover:text-accent-strong">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-border-hairline px-2 pt-5">
        <p className="text-body-sm font-medium text-ink-secondary">Switch site</p>
        <BrandSwitcher brand={brand} className="inline-flex" />
      </div>
    </div>
  );
}

function MegaColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-label uppercase tracking-widest text-ink-muted">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-body-md text-ink-primary hover:text-accent-strong">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileNav({ brand, onNavigate }: { brand: BrandKey; onNavigate: () => void }) {
  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Properties", links: [...NAV.properties] },
    { title: "Eminent Enterprises", links: [{ label: "Services", href: "/services" }, ...NAV.services] },
    { title: "Buraq Eminent Constructors", links: [...NAV.construction] },
    { title: "Tools", links: [...NAV.tools] },
    {
      title: "More",
      links: [
        { label: "Area Guides", href: "/areas" },
        { label: "Insights", href: "/insights" },
        { label: "Overseas Pakistanis", href: "/overseas" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "List Your Property", href: "/list-your-property" },
      ],
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-border-hairline p-5">
        <BrandSwitcher brand={brand} />
      </div>
      <nav className="flex flex-1 flex-col gap-6 p-5" aria-label="Mobile">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-label uppercase tracking-widest text-ink-muted">{g.title}</p>
            <ul className="mt-2 flex flex-col">
              {g.links.map((l) => (
                <li key={l.href}>
                  <SheetClose asChild>
                    <Link
                      href={l.href}
                      onClick={onNavigate}
                      className="block min-h-11 py-2.5 text-body-md font-medium text-ink-primary"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border-hairline p-5">
        <Button asChild variant="primary" size="lg" className="w-full">
          <Link href="/properties" onClick={onNavigate}>
            Search Properties
          </Link>
        </Button>
      </div>
    </div>
  );
}
