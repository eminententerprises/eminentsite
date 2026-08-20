import type { Metadata } from "next";
import { CONTACT, EMINENT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions governing the use of the Eminent Enterprises website.",
};

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-lg">Terms of Use</h1>
        <p className="mt-3 text-body-sm text-ink-muted">Last updated: August 2026</p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8 flex flex-col gap-8 text-body-md text-ink-primary [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-heading-lg [&_h2]:uppercase [&_h2]:text-ink-primary [&_p]:text-ink-secondary [&_li]:text-ink-secondary">
        <section>
          <p>
            These Terms of Use govern your access to and use of this website, operated by {EMINENT.legalName}
            (&quot;Eminent Enterprises&quot;, &quot;we&quot;, &quot;us&quot;). By using this website, you agree to these terms. If you do not
            agree, please do not use this website.
          </p>
        </section>

        <section>
          <h2>Website Content</h2>
          <p>
            Property listings, project details, pricing, area guides and other content on this website are provided
            for general informational purposes and marketing. Details such as price, availability, area and
            specifications are subject to change without notice and should be independently verified before you rely
            on them for any decision.
          </p>
        </section>

        <section>
          <h2>No Binding Offer</h2>
          <p>
            Nothing on this website constitutes a binding offer to sell, lease or otherwise transact in any property.
            Any transaction is subject to separate written agreements, due diligence, and applicable legal and
            regulatory requirements.
          </p>
        </section>

        <section>
          <h2>Not Legal, Financial or Tax Advice</h2>
          <p>
            Content on this website — including area guides, tools, calculators and any overseas-investment
            information — is provided for general informational purposes only and does not constitute legal,
            financial or tax advice. Always consult a qualified professional advisor before making property or
            financial decisions.
          </p>
        </section>

        <section>
          <h2>Enquiries &amp; Communication</h2>
          <p>
            By submitting an enquiry form, calling, or messaging us via WhatsApp or social media, you consent to
            being contacted by our team regarding your enquiry, using the contact details you provide.
          </p>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            The design, text, graphics and other content on this website are owned by or licensed to Eminent
            Enterprises and may not be reproduced or used without permission, except as necessary to browse the site
            for personal, non-commercial use.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the extent permitted by law, Eminent Enterprises is not liable for any loss or damage arising from
            your use of this website or reliance on its content, including errors, omissions, or temporary
            unavailability of the site.
          </p>
        </section>

        <section>
          <h2>Changes to These Terms</h2>
          <p>We may update these Terms of Use from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>These Terms of Use are governed by the laws of Pakistan, without regard to conflict-of-law principles.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about these terms can be directed to us at {CONTACT.officeAddress} or {CONTACT.phone}.</p>
        </section>
      </div>
      </SectionReveal>
    </div>
  );
}
