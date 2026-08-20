/**
 * Single source of truth for all brand strings, contact details, and social
 * links. Nothing outside this file should hard-code a phone number, address,
 * or brand copy string — change it here and it changes everywhere.
 */

export const CONTACT = {
  phone: "+92 51 8770820",
  phoneHref: "tel:+925188770820",
  mobile: "0314-0955919",
  mobileIntl: "+92 314 0955919",
  whatsappNumber: "923140955919", // wa.me format, no leading +/0
  website: "www.eminentpak.com",
  websiteHref: "https://www.eminentpak.com",
  officeAddress: "Office # 1 & 16, Mezzanine Floor, Moscow Plaza, Blue Area, Islamabad",
  officeCoords: { lat: 33.7101, lng: 73.0672 }, // Blue Area, Islamabad — approximate
  tiktok: { handle: "@eminententerprises0", href: "https://www.tiktok.com/@eminententerprises0" },
  instagram: { handle: "@emin.enterprises", href: "https://www.instagram.com/emin.enterprises" },
  serviceRegion: "Islamabad, Rawalpindi (twin cities) and scenic hill regions (Murree, Galiyat, Nathia Gali, Ayubia)",
  officeHours: "Monday – Saturday, 10:00 AM – 7:00 PM",
} as const;

export const EMINENT = {
  brandKey: "eminent" as const,
  name: "Eminent Enterprises",
  legalName: "Eminent Enterprises (Pvt.) Ltd.",
  positioning: "Real Estate Solutions. Lasting Value.",
  descriptor: "Real Estate Developers & Consultants",
  heroHeadline: "YOUR PROPERTY. OUR EXPERTISE. LASTING VALUE.",
  boilerplate:
    "Eminent Enterprises is a trusted real estate advisory and property services firm dedicated to helping clients achieve their property goals with confidence.",
  credentialBadge: "10+ Years of Experience",
  subPositioning: "Local Insights. Global Perspective.",
  subPositioningBody:
    "We combine in-depth local market knowledge with international standards to deliver exceptional results for local and global clients.",
  pillars: ["Strategic Locations", "Smart Investments", "Secure Transactions", "Trusted Partnership"],
  services: [
    {
      slug: "property-sale-purchase",
      name: "Property Sale & Purchases",
      description:
        "We help you buy or sell residential, commercial and industrial properties at the best value with complete transparency and professionalism.",
    },
    {
      slug: "investment-portfolio-management",
      name: "Investment & Portfolio Management",
      description:
        "We identify high-potential investment opportunities and manage your real estate portfolio to maximize returns and long-term growth.",
    },
    {
      slug: "property-management-allied-services",
      name: "Property Management & Allied Services",
      description:
        "From tenant management to maintenance and legal support, we provide end-to-end solutions to protect and enhance your property assets.",
    },
  ],
  whyChoose: [
    "10+ Years of Industry Experience",
    "Deep Local Market Insights",
    "Professional & Ethical Approach",
    "Wide Network & Strong Partnerships",
    "Customized Solutions for Every Client",
    "Commitment to Excellence",
  ],
  audienceSplit: {
    local: "Helping Pakistanis make the right property decisions for living, investing and building their future.",
    international:
      "Providing secure, seamless and profitable property investment opportunities in Pakistan with complete peace of mind.",
  },
  closingCta: {
    headline: "LET'S BUILD VALUE, TOGETHER.",
    body: "Whether you're buying your dream property, growing your investment portfolio, or need reliable property management — we are here to help.",
    signature: "Eminent Enterprises – Your Trusted Property Partner.",
  },
} as const;

export const BURAQ = {
  brandKey: "buraq" as const,
  name: "Buraq Eminent Constructors",
  legalName: "Buraq Eminent Constructors (Pvt.) Ltd.",
  positioning: "Building Trust. Creating Spaces. Enriching Lives.",
  heroHeadline: "WE DON'T JUST BUILD STRUCTURES. WE DESIGN BETTER LIVES.",
  badge: "New in Construction — backed by 10 years of real estate expertise",
  intro:
    "From dream homes to complete makeovers, we bring innovation, precision, and elegance to every project. With a deep understanding of local architecture and lifestyle needs, we serve homeowners with world-class construction and renovation solutions across the twin cities and scenic hill regions.",
  subPositioning: "Top Architects. Exceptional Designs. Timeless Spaces.",
  subPositioningBody:
    "We collaborate with the finest architects to deliver spaces that are functional, beautiful, and built to last.",
  pillars: ["Quality Materials", "On-Time Delivery", "Transparent Communication", "Professional Team"],
  services: [
    {
      slug: "new-construction",
      name: "New Construction",
      description:
        "Creating strong, sustainable and stylish homes from the ground up — tailored to your vision and lifestyle.",
      order: 1,
    },
    {
      slug: "renovation",
      name: "Renovation",
      description:
        "Breathe new life into your existing spaces with our smart renovation solutions that enhance value and comfort.",
      order: 2,
    },
    {
      slug: "interior-exterior",
      name: "Interior & Exterior",
      description:
        "Complete interior and exterior transformations that reflect your style and elevate every corner of your home.",
      order: 3,
    },
    {
      slug: "consultation",
      name: "Consultation",
      description:
        "Expert guidance at every step — from planning to execution — to help you make the right decisions with confidence.",
      order: 4,
    },
    {
      slug: "oversight-supervision",
      name: "Oversight / Supervision",
      description: "We oversee every detail on site to ensure top-quality work, safety, and timely completion.",
      order: 5,
    },
  ],
  whyChoose: [
    "10 Years of Real Estate Market Expertise Now Bringing Construction Excellence",
    "Top Architects on Our Panel",
    "Customized Solutions for Every Budget",
    "Attention to Detail & Premium Finishes",
    "End-to-End Project Management",
  ],
  signatureLines: [
    "Your Dream. Our Commitment. Built to Perfection.",
    "Designed Around You. Built for Generations.",
    "Let's Build Something Extraordinary Together!",
    "Building Spaces That Inspire. Creating Homes That Last.",
  ],
} as const;

export const GROUP = {
  headline: "YOUR PROPERTY. OUR CRAFT. LASTING VALUE.",
  body: "One trusted name, two areas of excellence — real estate advisory and construction craftsmanship, working together to build properties of lasting value.",
} as const;

export const NAV = {
  properties: [
    { label: "Buy", href: "/properties?purpose=buy" },
    { label: "Rent", href: "/properties?purpose=rent" },
    { label: "New Projects", href: "/projects" },
    { label: "Area Guides", href: "/areas" },
  ],
  services: [
    ...EMINENT.services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  ],
  construction: [
    { label: "Overview", href: "/construction" },
    ...BURAQ.services.map((s) => ({ label: s.name, href: `/construction/services/${s.slug}` })),
    { label: "Portfolio", href: "/construction/portfolio" },
    { label: "Cost Estimator", href: "/construction/estimate" },
  ],
  tools: [
    { label: "Eminent Estimate", href: "/tools/eminent-estimate" },
    { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
    { label: "Area Converter", href: "/tools/area-converter" },
    { label: "Construction Cost Estimator", href: "/construction/estimate" },
    { label: "Brick & Material Calculator", href: "/tools/material-calculator" },
  ],
  calculators: {
    realEstate: [
      { label: "Eminent Estimate", href: "/tools/eminent-estimate", description: "Instant, indicative property valuation" },
      { label: "Mortgage Calculator", href: "/tools/mortgage-calculator", description: "Monthly instalment & amortisation schedule" },
      { label: "Area Converter", href: "/tools/area-converter", description: "Marla, kanal, sq ft & more" },
    ],
    construction: [
      { label: "Construction Cost Estimator", href: "/construction/estimate", description: "Indicative build cost by covered area" },
      { label: "Brick & Material Calculator", href: "/tools/material-calculator", description: "Bricks, cement, sand, crush & steel" },
    ],
  },
  primary: [
    { label: "Properties", href: "/properties" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Construction", href: "/construction" },
    { label: "Area Guides", href: "/areas" },
    { label: "Insights", href: "/insights" },
    { label: "Overseas", href: "/overseas" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type BrandKey = "eminent" | "buraq";
