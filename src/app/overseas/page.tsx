import type { Metadata } from "next";
import { Banknote, FileCheck, Video, ClipboardList, Info } from "lucide-react";
import { EMINENT, CONTACT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SurveyLine } from "@/components/brand/survey-line";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Overseas Pakistanis",
  description: "Information for overseas Pakistanis investing in property back home — remittance-based purchases, filer status, virtual tours and power of attorney.",
};

const POA_CHECKLIST = [
  "Draft the Power of Attorney (POA) specifying exactly which acts are authorised (e.g. sale, purchase, possession, registration).",
  "Have the POA attested at the Pakistani Embassy/Consulate in your country of residence.",
  "Get the attested POA counter-attested by the Ministry of Foreign Affairs (MOFA) in Pakistan, where required.",
  "Register the POA with the relevant Sub-Registrar in Pakistan before it is used in any transaction.",
  "Share certified copies with your appointed attorney/representative and keep the original secure.",
  "Confirm validity/expiry terms and whether the POA is general or limited to a specific transaction.",
];

export default function OverseasPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Overseas Pakistanis" }]} />

      <SectionReveal>
        <div className="mt-4 max-w-2xl">
          <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Overseas Pakistanis</p>
          <h1 className="mt-2 text-display-lg">Invest in Pakistan From Anywhere</h1>
          <p className="mt-4 text-body-lg text-ink-secondary">{EMINENT.audienceSplit.international}</p>
        </div>
      </SectionReveal>

      <SurveyLine className="my-10" />

      <div className="rounded-2xl border border-warning bg-surface-sunken p-5">
        <p className="flex items-start gap-2.5 text-body-sm text-ink-primary">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <span>
            The information on this page is <strong>informational only</strong> and does not constitute legal, tax or
            financial advice. Rules on remittances, filer status and property transfer change periodically — always
            verify current requirements with your own legal and tax advisor before proceeding with any transaction.
          </span>
        </p>
      </div>

      <StaggerGroup className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <StaggerItem>
          <section>
            <Banknote className="h-7 w-7 text-accent-strong" aria-hidden="true" />
            <h2 className="mt-3 text-heading-lg uppercase text-ink-primary">Remittance-Based Purchases</h2>
            <p className="mt-3 text-body-md text-ink-secondary">
              Many overseas Pakistanis fund property purchases through formal banking channels, remitting funds into a
              Pakistani bank account (commonly a Non-Resident Pakistani/foreign currency account) and using those funds
              to complete the transaction. Keeping a clear remittance trail through official banking channels generally
              makes it easier to demonstrate the legitimate source of funds later, including at the time of resale.
            </p>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section>
            <FileCheck className="h-7 w-7 text-accent-strong" aria-hidden="true" />
            <h2 className="mt-3 text-heading-lg uppercase text-ink-primary">Filer Status &amp; FBR Considerations</h2>
            <p className="mt-3 text-body-md text-ink-secondary">
              Whether a buyer is an active taxpayer (a &quot;filer&quot;) with Pakistan&apos;s Federal Board of Revenue (FBR) can affect
              withholding tax rates applied on property transactions. Overseas Pakistanis may also have specific
              provisions available to them under prevailing tax law. This is general background only — confirm your
              filer status and the applicable withholding tax treatment with a qualified tax advisor before you commit
              to a purchase.
            </p>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section>
            <Video className="h-7 w-7 text-accent-strong" aria-hidden="true" />
            <h2 className="mt-3 text-heading-lg uppercase text-ink-primary">Virtual Tours</h2>
            <p className="mt-3 text-body-md text-ink-secondary">
              Can&apos;t visit in person? Request a live video walkthrough of any listing or project — our team will schedule
              a call at a time that works across time zones and walk you through the property, the surrounding society,
              and answer questions in real time before you decide.
            </p>
          </section>
        </StaggerItem>

        <StaggerItem>
          <section>
            <ClipboardList className="h-7 w-7 text-accent-strong" aria-hidden="true" />
            <h2 className="mt-3 text-heading-lg uppercase text-ink-primary">Power of Attorney Checklist</h2>
            <StaggerGroup className="mt-3 flex flex-col gap-2.5">
              {POA_CHECKLIST.map((item) => (
                <StaggerItem key={item} className="text-body-sm text-ink-primary">
                  — {item}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        </StaggerItem>
      </StaggerGroup>

      <div className="mt-4 rounded-2xl border border-warning bg-surface-sunken p-5">
        <p className="flex items-start gap-2.5 text-body-sm text-ink-primary">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <span>
            Power of attorney requirements and attestation processes vary by country of residence and can change —
            verify the current procedure with the Pakistani Embassy/Consulate nearest you and your legal advisor.
          </span>
        </p>
      </div>

      <SectionReveal>
        <section className="mt-16 rounded-3xl border border-border-hairline bg-surface-raised p-6 sm:p-8">
          <h2 className="text-heading-lg uppercase text-ink-primary">Request Information</h2>
          <p className="mt-2 text-body-sm text-ink-secondary">
            Tell us what you&apos;re looking to invest in, and where you&apos;re based — we&apos;ll follow up with tailored information, including virtual tour scheduling.
          </p>
          <div className="mt-6 max-w-xl">
            <EnquiryForm defaultReason="Investment" showReason submitLabel="Request Information" />
          </div>
          <p className="mt-4 text-body-sm text-ink-muted">Prefer WhatsApp? Message us directly at {CONTACT.mobile}.</p>
        </section>
      </SectionReveal>
    </div>
  );
}
