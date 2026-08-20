import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { SurveyLine } from "@/components/brand/survey-line";
import { formatPKR } from "@/lib/format-pkr";
import { formatArea } from "@/lib/area";
import urMessages from "../../../messages/ur.json";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const COLOR_GROUPS: { name: string; stops: string[] }[] = [
  { name: "navy", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "gold", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800"] },
  { name: "cream", stops: ["50", "100", "200", "300", "400", "500", "600"] },
  { name: "charcoal", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
];

const SEMANTIC_SWATCHES = [
  "surface-base",
  "surface-sunken",
  "surface-raised",
  "surface-inverted",
  "surface-inverted-deep",
  "surface-warm",
  "accent",
  "accent-soft",
  "accent-strong",
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
      <p className="text-label uppercase tracking-widest text-accent-strong">Design system</p>
      <h1 className="mt-2 text-display-lg">Styleguide</h1>
      <p className="mt-3 max-w-2xl text-body-lg text-ink-secondary">
        Every token and component state used across Eminent Enterprises and Buraq Eminent Constructors. Append{" "}
        <code className="font-tabular-nums text-body-sm">?brand=buraq</code> logic is route-driven — visit{" "}
        <code className="font-tabular-nums text-body-sm">/construction</code> to see the warm skin live.
      </p>

      <Section title="Primitive color ramps">
        <div className="flex flex-col gap-6">
          {COLOR_GROUPS.map((group) => (
            <div key={group.name}>
              <p className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">{group.name}</p>
              <div className="flex flex-wrap gap-2">
                {group.stops.map((stop) => (
                  <div key={stop} className="flex flex-col items-center gap-1">
                    <div className={`h-14 w-14 border border-border-hairline bg-${group.name}-${stop}`} />
                    <span className="font-tabular-nums text-[0.625rem] text-ink-muted">{stop}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Semantic surfaces & accents">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {SEMANTIC_SWATCHES.map((token) => (
            <div key={token} className="border border-border-hairline">
              <div className={`h-16 bg-${token}`} />
              <p className="p-2 font-tabular-nums text-[0.6875rem] text-ink-secondary">{token}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-4">
          <TypeSample className="text-display-2xl">Display 2XL</TypeSample>
          <TypeSample className="text-display-xl">Display XL</TypeSample>
          <TypeSample className="text-display-lg">Display LG</TypeSample>
          <TypeSample className="text-display-md">Display MD</TypeSample>
          <TypeSample className="text-display-sm">Display SM</TypeSample>
          <TypeSample className="text-heading-lg normal-case font-body font-semibold tracking-normal">Heading LG — normal case body weight</TypeSample>
          <TypeSample className="text-body-lg normal-case font-body font-normal tracking-normal">Body LG — for lead paragraphs and intros.</TypeSample>
          <TypeSample className="text-body-md normal-case font-body font-normal tracking-normal">Body MD — the default paragraph size across the site.</TypeSample>
          <TypeSample className="font-tabular-nums text-2xl">PKR 2.75 Crore — tabular figures</TypeSample>
          <p className="font-accent text-2xl italic text-navy-800">Your Dream. Our Commitment. Built to Perfection.</p>
        </div>
      </Section>

      <Section title="Signature element — Survey Line">
        <SurveyLine label={formatArea(10, "marla")} className="max-w-md" />
        <div className="mt-6 bg-surface-inverted-deep p-6">
          <SurveyLine inverted label="35' × 70'" className="max-w-md" />
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Send Enquiry</Button>
          <Button variant="secondary" className="bg-navy-800 text-white">Secondary on dark</Button>
          <Button variant="outline">View Details</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="link">Read More</Button>
          <Button variant="whatsapp">WhatsApp Now</Button>
          <Button variant="destructive">Remove</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">Ready</Badge>
          <Badge variant="accent">Featured</Badge>
          <Badge variant="verified">Verified</Badge>
          <Badge variant="outline">CDA Approved</Badge>
          <Badge variant="danger">Balloted</Badge>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-5 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>5 Marla House</CardTitle>
              <CardDescription>DHA Phase II, Islamabad</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-tabular-nums text-xl text-navy-800">{formatPKR(18_500_000).short}</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                View Listing
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-accent">
            <CardHeader>
              <Badge variant="accent" className="w-fit">
                Featured
              </Badge>
              <CardTitle>Emphasis card state</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-ink-secondary">Featured listings use a gold border to differ in weight.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Form controls">
        <div className="grid max-w-md gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sg-name">Full name</Label>
            <Input id="sg-name" placeholder="e.g. Ahmed Khan" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sg-msg">Message</Label>
            <Textarea id="sg-msg" placeholder="Tell us what you're looking for…" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="sg-consent" />
            <Label htmlFor="sg-consent" className="font-normal">
              I agree to be contacted about this enquiry
            </Label>
          </div>
        </div>
      </Section>

      <Section title="Internationalisation — Urdu RTL preview">
        <p className="mb-4 max-w-2xl text-body-sm text-ink-secondary">
          English is the complete, default locale across every route. Urdu ships as a translation scaffold —
          real message files at <code className="font-tabular-nums text-body-sm">/messages/ur.json</code> plus
          the RTL layout switch below, wired through <code className="font-tabular-nums text-body-sm">[dir=&quot;rtl&quot;]</code>{" "}
          rules in globals.css (Noto Nastaliq Urdu, no uppercase/tracking). Routing every page through a{" "}
          <code className="font-tabular-nums text-body-sm">[locale]</code> segment is the documented next step in
          the README, not yet wired into the live route tree.
        </p>
        <div dir="rtl" lang="ur" className="border border-border-hairline bg-surface-sunken p-6">
          <h3 className="text-heading-lg text-ink-primary">{urMessages.home.groupHeadline}</h3>
          <p className="mt-3 text-body-md text-ink-secondary">{urMessages.home.groupBody}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="primary">{urMessages.common.sendEnquiry}</Button>
            <Button variant="whatsapp">{urMessages.common.whatsappNow}</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10">
      <Separator className="mb-10" />
      <h2 className="mb-6 text-display-sm">{title}</h2>
      {children}
    </section>
  );
}

function TypeSample({ className, children }: { className: string; children: React.ReactNode }) {
  return <p className={className}>{children}</p>;
}
