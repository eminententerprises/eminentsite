import {
  Banknote,
  FileBarChart,
  FileText,
  HandCoins,
  KeyRound,
  PieChart,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EMINENT } from "@/config/site";

type ServiceSlug = (typeof EMINENT)["services"][number]["slug"];

export interface ServiceHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceStat {
  label: string;
  // PLACEHOLDER — illustrative figure, not an audited/verified statistic.
  value: string;
}

export interface ServiceDetail {
  heroImageSeed: string;
  pullQuote: string;
  stats: ServiceStat[];
  highlights: ServiceHighlight[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
}

export const SERVICE_DETAILS: Record<ServiceSlug, ServiceDetail> = {
  "property-sale-purchase": {
    heroImageSeed: "eminent-sale-purchase-hero",
    pullQuote: "Strategic Locations. Smart Investments. Secure Transactions.",
    stats: [
      { label: "Years of Experience", value: "10+" },
      { label: "Properties Advised On", value: "800+" },
      { label: "Coverage", value: "Twin Cities + Hills" },
    ],
    highlights: [
      {
        icon: Search,
        title: "Curated Search",
        description: "We shortlist properties that actually match your budget, purpose and location — not a generic listing dump.",
      },
      {
        icon: ShieldCheck,
        title: "Verified Documentation",
        description: "Title, transfer history and society approval status are checked before any property reaches your shortlist.",
      },
      {
        icon: HandCoins,
        title: "Negotiation Support",
        description: "We negotiate on your behalf, using local market data so you don't overpay or undersell.",
      },
      {
        icon: FileText,
        title: "Transfer Handling",
        description: "Paperwork, registry and possession are coordinated end-to-end so nothing falls through the cracks.",
      },
    ],
    process: [
      { title: "Brief", description: "Tell us your budget, purpose and preferred locations — buying or selling." },
      { title: "Shortlist", description: "We bring vetted options with honest pros, cons and area context." },
      { title: "Negotiate", description: "We handle offers, counter-offers and terms on your behalf." },
      { title: "Close", description: "Documentation, transfer and possession, coordinated start to finish." },
    ],
    faqs: [
      {
        question: "Do you only handle residential properties?",
        answer: "No — we advise on residential, commercial and industrial properties across the twin cities and hill regions.",
      },
      {
        question: "Can you represent me if I'm overseas?",
        answer: "Yes, this is one of our most common engagements — see our dedicated Overseas Pakistanis page for how remote transactions are handled.",
      },
      {
        question: "How do you verify a property before recommending it?",
        answer: "We check title documents, transfer history and, for society plots, the development authority's approval status before it reaches your shortlist.",
      },
      {
        question: "Is there a fee for an initial consultation?",
        answer: "No — the first conversation is free. We'll explain our fee structure only once you decide to move forward.",
      },
    ],
  },
  "investment-portfolio-management": {
    heroImageSeed: "eminent-investment-hero",
    pullQuote: "Local Insights. Global Perspective. Lasting Value.",
    stats: [
      { label: "Years Market Track Record", value: "10+" },
      { label: "Shortlisted Opportunities / Brief", value: "3–5" },
      { label: "Coverage", value: "Twin Cities + Hills" },
    ],
    highlights: [
      {
        icon: Search,
        title: "Opportunity Sourcing",
        description: "We screen plots, files and built units against your target returns — including options before they're widely listed.",
      },
      {
        icon: PieChart,
        title: "Portfolio Structuring",
        description: "A mix of holding periods and property types matched to your risk appetite, not a single bet on one plot.",
      },
      {
        icon: ShieldCheck,
        title: "Due Diligence",
        description: "Every recommendation is checked against title, transfer history and society approval status before you commit.",
      },
      {
        icon: FileBarChart,
        title: "Performance Reviews",
        description: "Regular check-ins on what each holding is worth and whether it's still the right fit for your goals.",
      },
      {
        icon: TrendingUp,
        title: "Exit Planning",
        description: "We time and manage the sale once a holding has matured, so gains aren't left on the table.",
      },
    ],
    process: [
      { title: "Goals & Risk Profile", description: "We understand your budget, timeline and how much risk you're comfortable carrying." },
      { title: "Shortlist & Analysis", description: "You get 3–5 vetted opportunities with area comparisons, not a single option." },
      { title: "Acquisition", description: "Negotiation, documentation and transfer handled end-to-end on your behalf." },
      { title: "Ongoing Management", description: "Periodic valuation check-ins and exit guidance as the market moves." },
    ],
    faqs: [
      {
        question: "How much capital do I need to start?",
        answer: "It depends on the property type and area — plots, files and built units all have different entry points. Tell us your budget and we'll shortlist what fits.",
      },
      {
        question: "Do you manage a portfolio, or just individual purchases?",
        answer: "Both. We can source a single opportunity, or take a broader view across several holdings and advise on rebalancing over time.",
      },
      {
        question: "Can you help me exit an existing holding, not just buy new ones?",
        answer: "Yes — exit timing and sale management are part of the service, not an afterthought.",
      },
      {
        question: "Is there a fee for the initial consultation?",
        answer: "No — the first conversation is free. We'll explain our fee structure only once you decide to move forward.",
      },
    ],
  },
  "property-management-allied-services": {
    heroImageSeed: "eminent-property-mgmt-hero",
    pullQuote: "Trusted Partnership. Secure Transactions. Lasting Value.",
    stats: [
      { label: "Years of Experience", value: "10+" },
      { label: "Coverage", value: "Twin Cities + Hills" },
      { label: "Owner Reporting", value: "Regular Updates" },
    ],
    highlights: [
      {
        icon: UserCheck,
        title: "Tenant Sourcing & Screening",
        description: "We source, vet and place tenants — so you're not fielding calls or chasing viewings yourself.",
      },
      {
        icon: Banknote,
        title: "Rent Collection & Reporting",
        description: "Rent is collected and reconciled on schedule, with regular statements sent your way.",
      },
      {
        icon: Wrench,
        title: "Maintenance Coordination",
        description: "Repairs and upkeep are coordinated with vetted contractors, so small issues don't become expensive ones.",
      },
      {
        icon: FileText,
        title: "Legal & Documentation Support",
        description: "Lease agreements, renewals and dispute support, handled with proper documentation at every step.",
      },
      {
        icon: KeyRound,
        title: "Vacant Property Oversight",
        description: "Regular checks on unoccupied houses and hill-region second homes, especially useful for overseas owners.",
      },
      {
        icon: Users,
        title: "Owner Liaison",
        description: "One point of contact for every update — you're never left chasing multiple people for one answer.",
      },
    ],
    process: [
      { title: "Property Assessment", description: "We review the property, market rent and condition before drawing up a management plan." },
      { title: "Tenant Placement", description: "Screening, references and lease agreement, handled before anyone moves in." },
      { title: "Ongoing Management", description: "Rent collection, maintenance coordination and day-to-day oversight, continuously." },
      { title: "Owner Reporting", description: "Regular statements and updates, so you always know where things stand." },
    ],
    faqs: [
      {
        question: "Do you manage properties while the owner is overseas?",
        answer: "Yes — this is one of our most common engagements. See our Overseas Pakistanis page for how remote management is handled.",
      },
      {
        question: "What does 'allied services' cover beyond rent collection?",
        answer: "Maintenance coordination, legal and documentation support, tenant screening and vacant-property oversight are all included, not billed as separate add-ons.",
      },
      {
        question: "Can you manage a vacant plot or house, not just a rented property?",
        answer: "Yes — regular checks and upkeep for unoccupied properties, including hill-region second homes, are part of the service.",
      },
      {
        question: "How often will I receive updates?",
        answer: "You'll get regular statements and can request a status update from your dedicated point of contact at any time.",
      },
    ],
  },
};
