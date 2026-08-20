import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PropertyMap } from "@/components/property/property-map";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { SurveyLine } from "@/components/brand/survey-line";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Eminent Enterprises — visit our Blue Area, Islamabad office, call, WhatsApp, or send an enquiry online.",
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CONTACT.website,
    legalName: "Eminent Enterprises",
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.officeAddress,
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.officeCoords.lat,
      longitude: CONTACT.officeCoords.lng,
    },
    url: CONTACT.websiteHref,
    openingHours: CONTACT.officeHours,
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <SectionReveal>
        <div className="mt-4 max-w-2xl">
          <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Get In Touch</p>
          <h1 className="mt-2 text-display-lg">Contact Us</h1>
          <p className="mt-4 text-body-lg text-ink-secondary">
            Visit our office in Blue Area, Islamabad, call or WhatsApp us directly, or send an enquiry and our team will get back to you.
          </p>
        </div>
      </SectionReveal>

      <SurveyLine className="my-10" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
        <SectionReveal>
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6">
            <h2 className="text-heading-md uppercase text-ink-primary">Office</h2>
            <dl className="mt-4 flex flex-col gap-4 text-body-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-ink-primary">Address</dt>
                  <dd className="mt-0.5 text-ink-secondary">{CONTACT.officeAddress}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-ink-primary">Phone</dt>
                  <dd className="mt-0.5">
                    <a href={CONTACT.phoneHref} className="text-ink-secondary hover:text-accent-strong">
                      {CONTACT.phone}
                    </a>
                    {" · "}
                    <a href={`tel:${CONTACT.mobileIntl.replace(/\s/g, "")}`} className="text-ink-secondary hover:text-accent-strong">
                      {CONTACT.mobile}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-ink-primary">Office Hours</dt>
                  <dd className="mt-0.5 text-ink-secondary">{CONTACT.officeHours}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-ink-primary">Service Region</dt>
                  <dd className="mt-0.5 text-ink-secondary">{CONTACT.serviceRegion}</dd>
                </div>
              </div>
            </dl>

            <Button asChild variant="whatsapp" size="lg" className="mt-6 w-full">
              <a href={buildWhatsAppLink("Hi Eminent Enterprises, I'd like to get in touch.")} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
              </a>
            </Button>

            <div className="mt-5 flex items-center gap-4 border-t border-border-hairline pt-5">
              <a href={CONTACT.instagram.href} target="_blank" rel="noopener noreferrer" className="text-body-sm font-semibold uppercase tracking-wide text-ink-secondary hover:text-accent-strong">
                Instagram
              </a>
              <a href={CONTACT.tiktok.href} target="_blank" rel="noopener noreferrer" className="text-body-sm font-semibold uppercase tracking-wide text-ink-secondary hover:text-accent-strong">
                TikTok
              </a>
            </div>
          </div>

          <PropertyMap
            markers={[{ id: "office", lat: CONTACT.officeCoords.lat, lng: CONTACT.officeCoords.lng, label: "Eminent Enterprises" }]}
            center={[CONTACT.officeCoords.lat, CONTACT.officeCoords.lng]}
            zoom={15}
            fitToMarkers={false}
            height={360}
          />
        </aside>
        </SectionReveal>

        <SectionReveal delay={0.15}>
        <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6 sm:p-8">
          <h2 className="text-heading-md uppercase text-ink-primary">Send an Enquiry</h2>
          <p className="mt-2 text-body-sm text-ink-secondary">Fill out the form and our team will reach out shortly.</p>
          <div className="mt-6">
            <EnquiryForm showReason />
          </div>
        </div>
        </SectionReveal>
      </div>
    </div>
  );
}
