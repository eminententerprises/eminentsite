import type { Metadata } from "next";
import { CONTACT, EMINENT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Eminent Enterprises collects, uses and protects information submitted through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-lg">Privacy Policy</h1>
        <p className="mt-3 text-body-sm text-ink-muted">Last updated: August 2026</p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8 flex flex-col gap-8 text-body-md text-ink-primary [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-heading-lg [&_h2]:uppercase [&_h2]:text-ink-primary [&_p]:text-ink-secondary [&_li]:text-ink-secondary">
        <section>
          <p>
            This Privacy Policy explains how {EMINENT.legalName} (&quot;Eminent Enterprises&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses
            and protects information when you use this website, browse listings, or contact us through enquiry
            forms, phone, WhatsApp or social media. This is a general, informational policy and not a substitute for
            legal advice.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul className="ml-5 flex list-disc flex-col gap-2">
            <li>Contact details you submit voluntarily through enquiry forms — name, phone number, email address and any message content.</li>
            <li>Basic usage data collected automatically, such as pages visited, device/browser type, and approximate location inferred from IP address, typically via standard analytics tooling.</li>
            <li>Communications you send us directly via phone, WhatsApp, email or social media messaging.</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <ul className="ml-5 flex list-disc flex-col gap-2">
            <li>To respond to property enquiries, schedule viewings, and provide requested information.</li>
            <li>To improve this website&apos;s content, usability and performance.</li>
            <li>To send relevant follow-up communication about properties, services or market updates, where you have engaged with us for that purpose.</li>
            <li>To comply with applicable legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>Cookies &amp; Analytics</h2>
          <p>
            This website may use cookies and similar technologies (including third-party analytics services) to
            understand how visitors use the site and to improve functionality. You can control or disable cookies
            through your browser settings; disabling cookies may affect some site functionality.
          </p>
        </section>

        <section>
          <h2>Sharing of Information</h2>
          <p>
            We do not sell personal information. We may share information with service providers who help us operate
            this website or process enquiries (such as hosting or communication tools), and where required by law or
            to protect our legal rights.
          </p>
        </section>

        <section>
          <h2>Data Retention &amp; Security</h2>
          <p>
            We retain enquiry information for as long as reasonably necessary to respond to your request and for
            legitimate business record-keeping, and take reasonable technical and organisational measures to protect
            it. No method of transmission or storage is completely secure.
          </p>
        </section>

        <section>
          <h2>Your Choices</h2>
          <p>
            You may contact us at any time to ask what information we hold about you, to request a correction, or to
            ask that we stop contacting you for marketing purposes.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy can be directed to us at {CONTACT.officeAddress}, by phone at {CONTACT.phone}, or via the contact form on this site.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>This policy and your use of this website are governed by the laws of Pakistan.</p>
        </section>
        </div>
      </SectionReveal>
    </div>
  );
}
