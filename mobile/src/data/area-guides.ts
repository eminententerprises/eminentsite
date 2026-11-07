import type { AreaGuide } from "@/types";

const QUARTERS = ["2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4"];

function trend(values: number[]) {
  return QUARTERS.map((quarter, i) => ({ quarter, avgPricePerMarla: values[i] }));
}

export const AREA_GUIDES: AreaGuide[] = [
  {
    slug: "dha-2",
    name: "DHA Phase II",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.5215, lng: 73.14 },
    summary:
      "DHA Phase II is one of Islamabad's most established defence-society sectors, popular with families for its wide streets, mature landscaping and short commute to the airport and Kashmir Highway.",
    heroImage: "https://picsum.photos/seed/areaguide-dha2/1600/900",
    priceTrend: trend([5980000, 6105000, 6205000, 6305000, 6405000, 6530000, 6605000, 6685000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 6800000 },
      { type: "Residential Plot", pricePerMarla: 6685000 },
      { type: "Upper Portion", pricePerMarla: 3900000 },
      { type: "Flat/Apartment", pricePerMarla: 7100000 },
    ],
    amenities: ["Gated Community", "24/7 Security", "Community Park", "Mosque Nearby", "Underground Electrification"],
    landmarks: [
      { name: "Islamabad International Airport", distanceKm: 14 },
      { name: "DHA Phase II Commercial Market", distanceKm: 1.2 },
      { name: "Kashmir Highway Interchange", distanceKm: 3.5 },
    ],
    pros: [
      "Well-established infrastructure with reliable utilities",
      "Strong resale demand relative to newer DHA phases",
      "Close to Islamabad Expressway and the airport",
    ],
    cons: [
      "Premium pricing compared to G-sector or B-17 alternatives",
      "Limited public transport access within the society",
      "Some older blocks have narrower internal streets than newer phases",
    ],
  },
  {
    slug: "f-7",
    name: "F-7",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.718, lng: 73.058 },
    summary:
      "F-7 is one of Islamabad's oldest and most prestigious sectors, home to embassies, upscale apartments and Jinnah Super Market, commanding some of the highest per-marla prices in the twin cities.",
    heroImage: "https://picsum.photos/seed/areaguide-f7/1600/900",
    priceTrend: trend([14005000, 14325000, 14425000, 14565000, 14910000, 15230000, 15550000, 16010000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 15500000 },
      { type: "Penthouse", pricePerMarla: 22000000 },
      { type: "Flat/Apartment", pricePerMarla: 17800000 },
      { type: "Office", pricePerMarla: 20900000 },
    ],
    amenities: ["Jinnah Super Market", "Diplomatic Enclave Proximity", "Mature Tree-Lined Streets", "24/7 Security Patrols"],
    landmarks: [
      { name: "Jinnah Super Market", distanceKm: 0.8 },
      { name: "Margalla Hills Trail Heads", distanceKm: 3 },
      { name: "Diplomatic Enclave", distanceKm: 2.5 },
    ],
    pros: [
      "Among the most prestigious and central addresses in Islamabad",
      "Walkable access to Jinnah Super's restaurants and retail",
      "Consistently strong long-term price appreciation",
    ],
    cons: [
      "Entry price is well above most other Islamabad sectors",
      "Very limited fresh plot inventory — mostly resale houses",
      "Parking congestion around the commercial market on weekends",
    ],
  },
  {
    slug: "bahria-1-8",
    name: "Bahria Town Phases 1–8",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.533, lng: 73.248 },
    summary:
      "Bahria Town's original Islamabad phases offer a self-contained township experience with theme parks, a golf course and extensive commercial zones, attracting both end-users and rental investors.",
    heroImage: "https://picsum.photos/seed/areaguide-bahria18/1600/900",
    priceTrend: trend([4375000, 4400000, 4465000, 4480000, 4565000, 4640000, 4770000, 4850000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 4800000 },
      { type: "Residential Plot", pricePerMarla: 4850000 },
      { type: "Commercial Plot", pricePerMarla: 7200000 },
      { type: "Shop", pricePerMarla: 9100000 },
    ],
    amenities: ["Theme Park", "Golf Course", "Grand Mosque", "Cinema & Food Street", "Extensive Commercial Zones"],
    landmarks: [
      { name: "Bahria Town Theme Park", distanceKm: 2 },
      { name: "Bahria Grand Mosque", distanceKm: 1.5 },
      { name: "Chaklala Scheme III", distanceKm: 6 },
    ],
    pros: [
      "Extensive lifestyle amenities within the township",
      "Wide product mix from plots to ready houses to commercial",
      "Consistent rental demand from families relocating for work",
    ],
    cons: [
      "Traffic congestion near the main entrances during peak hours",
      "Society maintenance charges add to the ongoing cost of ownership",
      "Distance from central Islamabad sectors is greater than DHA phases",
    ],
  },
  {
    slug: "g-13",
    name: "G-13",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.664, lng: 72.985 },
    summary:
      "G-13 is a maturing CDA sector popular with mid-income families, offering more affordable house and portion options than the F-sectors while remaining close to Islamabad's core.",
    heroImage: "https://picsum.photos/seed/areaguide-g13/1600/900",
    priceTrend: trend([2990000, 3050000, 3100000, 3120000, 3210000, 3290000, 3385000, 3435000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 3400000 },
      { type: "Upper Portion", pricePerMarla: 1900000 },
      { type: "Lower Portion", pricePerMarla: 1900000 },
      { type: "Residential Plot", pricePerMarla: 3435000 },
    ],
    amenities: ["CDA-Developed Streets", "Local Commercial Markets", "Mosque in Every Block", "Government Schools Nearby"],
    landmarks: [
      { name: "G-13 Markaz", distanceKm: 1 },
      { name: "Islamabad Expressway", distanceKm: 4 },
      { name: "PWD Housing Society", distanceKm: 3 },
    ],
    pros: [
      "More affordable entry point than neighbouring F and E sectors",
      "Good mix of full houses and rentable portions",
      "Steady development of local commercial markets",
    ],
    cons: [
      "Some sub-sectors still have partially developed infrastructure",
      "Fewer high-end amenities compared to gated private societies",
      "Public transport coverage is limited outside the main markaz road",
    ],
  },
  {
    slug: "e-11",
    name: "E-11",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.701, lng: 73.006 },
    summary:
      "E-11 is a premium CDA sector known for its wide plots, well-planned apartment blocks and proximity to Islamabad's central business areas, making it a favourite among senior professionals.",
    heroImage: "https://picsum.photos/seed/areaguide-e11/1600/900",
    priceTrend: trend([8685000, 8895000, 9190000, 9420000, 9535000, 9735000, 9965000, 10210000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 9500000 },
      { type: "Flat/Apartment", pricePerMarla: 11200000 },
      { type: "Penthouse", pricePerMarla: 14800000 },
      { type: "Residential Plot", pricePerMarla: 10210000 },
    ],
    amenities: ["Wide Plot Layout", "Apartment Blocks", "Margalla Hills Views", "Low-Density Streets"],
    landmarks: [
      { name: "Centaurus Mall", distanceKm: 4 },
      { name: "Margalla Hills National Park", distanceKm: 2 },
      { name: "Islamabad Expressway", distanceKm: 3 },
    ],
    pros: [
      "Larger plot sizes and lower density than most Islamabad sectors",
      "Growing apartment inventory suited to rental investment",
      "Close to Centaurus Mall and central business districts",
    ],
    cons: [
      "Land prices have risen steeply over the past two years",
      "Ongoing construction activity in some blocks",
      "Fewer local schools compared to older sectors",
    ],
  },
  {
    slug: "capital-smart-city",
    name: "Capital Smart City",
    city: "islamabad",
    cityLabel: "Islamabad",
    coords: { lat: 33.689, lng: 72.758 },
    summary:
      "Capital Smart City is Islamabad's largest new-generation smart housing project along the M-2 Motorway, offering low entry prices and instalment-friendly plans for first-time investors and overseas buyers.",
    heroImage: "https://picsum.photos/seed/areaguide-csc/1600/900",
    priceTrend: trend([1730000, 1770000, 1785000, 1790000, 1845000, 1865000, 1905000, 1960000]),
    avgPriceByType: [
      { type: "Residential Plot", pricePerMarla: 1960000 },
      { type: "Commercial Plot", pricePerMarla: 2940000 },
      { type: "Flat/Apartment", pricePerMarla: 2400000 },
      { type: "Plot File", pricePerMarla: 1650000 },
    ],
    amenities: ["Crystal Lake", "Business District (Planned)", "Smart Utility Metering", "M-2 Motorway Access"],
    landmarks: [
      { name: "M-2 Motorway Interchange", distanceKm: 2 },
      { name: "Chakri Interchange", distanceKm: 5 },
      { name: "Overseas Block", distanceKm: 1.5 },
    ],
    pros: [
      "Lowest entry price among major new Islamabad societies",
      "Instalment-friendly plans popular with overseas Pakistanis",
      "Direct motorway access shortens the drive to central Islamabad",
    ],
    cons: [
      "Many blocks are still at an early development stage",
      "Some file-stage inventory carries pending approval status",
      "Limited existing amenities until development matures",
    ],
  },
  {
    slug: "bahria-town-rwp",
    name: "Bahria Town Rawalpindi",
    city: "rawalpindi",
    cityLabel: "Rawalpindi",
    coords: { lat: 33.514, lng: 73.198 },
    summary:
      "Bahria Town Rawalpindi extends the Bahria brand into the twin cities with a mix of ready houses, plots and a growing commercial strip, popular with buyers who want Islamabad-adjacent amenities at Rawalpindi pricing.",
    heroImage: "https://picsum.photos/seed/areaguide-bahriarwp/1600/900",
    priceTrend: trend([4115000, 4215000, 4275000, 4380000, 4430000, 4480000, 4610000, 4720000]),
    avgPriceByType: [
      { type: "House", pricePerMarla: 4600000 },
      { type: "Residential Plot", pricePerMarla: 4720000 },
      { type: "Shop", pricePerMarla: 8700000 },
      { type: "Upper Portion", pricePerMarla: 2600000 },
    ],
    amenities: ["Gated Entrances", "Commercial Strip", "Community Parks", "Mosque Network"],
    landmarks: [
      { name: "Bahria Town Commercial Strip", distanceKm: 1 },
      { name: "Chakri Road Interchange", distanceKm: 4 },
      { name: "DHA Phase II Rawalpindi", distanceKm: 7 },
    ],
    pros: [
      "More affordable than equivalent DHA phases nearby",
      "Steady infrastructure development across newer blocks",
      "Active resale and rental market",
    ],
    cons: [
      "Some outer blocks remain under development",
      "Distance from central Rawalpindi requires reliance on private transport",
      "Society charges apply on top of purchase price",
    ],
  },
  {
    slug: "saddar",
    name: "Saddar",
    city: "rawalpindi",
    cityLabel: "Rawalpindi",
    coords: { lat: 33.599, lng: 73.048 },
    summary:
      "Saddar is Rawalpindi's historic commercial core, dense with shops, offices and mixed-use buildings, offering strong rental yields for investors focused on established foot traffic rather than new development.",
    heroImage: "https://picsum.photos/seed/areaguide-saddar/1600/900",
    priceTrend: trend([5345000, 5470000, 5560000, 5720000, 5805000, 5910000, 5965000, 6065000]),
    avgPriceByType: [
      { type: "Shop", pricePerMarla: 11500000 },
      { type: "Office", pricePerMarla: 8200000 },
      { type: "Building", pricePerMarla: 6800000 },
      { type: "Upper Portion", pricePerMarla: 3500000 },
    ],
    amenities: ["Dense Retail Corridor", "Established Commercial Banks", "Public Transport Hub", "Wholesale Markets Nearby"],
    landmarks: [
      { name: "Raja Bazaar", distanceKm: 1.5 },
      { name: "Rawalpindi Railway Station", distanceKm: 2 },
      { name: "Committee Chowk", distanceKm: 0.6 },
    ],
    pros: [
      "High and consistent foot traffic supports strong shop rental yields",
      "Central location with easy access across old Rawalpindi",
      "Established banking and wholesale trade presence",
    ],
    cons: [
      "Traffic congestion and limited parking in the core market area",
      "Ageing building stock in parts of the commercial district",
      "Redevelopment or renovation projects can face narrow street access",
    ],
  },
  {
    slug: "murree",
    name: "Murree",
    city: "hills",
    cityLabel: "Hill Regions",
    coords: { lat: 33.907, lng: 73.39 },
    summary:
      "Murree remains the twin cities' most established hill destination, combining year-round tourist demand with a steady market for farm houses and hillside plots among Islamabad and Rawalpindi buyers seeking a weekend retreat.",
    heroImage: "https://picsum.photos/seed/areaguide-murree/1600/900",
    priceTrend: trend([3050000, 3065000, 3165000, 3180000, 3235000, 3295000, 3370000, 3455000]),
    avgPriceByType: [
      { type: "Farm House", pricePerMarla: 4000000 },
      { type: "Residential Plot", pricePerMarla: 3455000 },
      { type: "Agricultural Land", pricePerMarla: 1400000 },
    ],
    amenities: ["Mall Road Tourist Strip", "Pine Forest Views", "Seasonal Tourism Economy", "Cool Summer Climate"],
    landmarks: [
      { name: "Mall Road", distanceKm: 2 },
      { name: "Murree Expressway Toll Plaza", distanceKm: 8 },
      { name: "Patriata Chair Lift", distanceKm: 12 },
    ],
    pros: [
      "Strong seasonal rental demand from tourism during summer and snowfall",
      "Scenic value supports long-term price resilience",
      "Well-connected via the Murree Expressway to Islamabad",
    ],
    cons: [
      "Steep terrain limits buildable area on many plots",
      "Traffic congestion during peak tourist season",
      "Water supply relies mainly on tankers or boring in outer areas",
    ],
  },
  {
    slug: "nathia-gali",
    name: "Nathia Gali",
    city: "hills",
    cityLabel: "Hill Regions",
    coords: { lat: 34.067, lng: 73.383 },
    summary:
      "Nathia Gali offers a quieter, higher-altitude alternative to Murree, favoured by buyers looking for forested farm house plots away from the denser tourist crowds while still within a manageable drive of the twin cities.",
    heroImage: "https://picsum.photos/seed/areaguide-nathiagali/1600/900",
    priceTrend: trend([2515000, 2555000, 2615000, 2635000, 2710000, 2765000, 2830000, 2865000]),
    avgPriceByType: [
      { type: "Farm House", pricePerMarla: 3200000 },
      { type: "Residential Plot", pricePerMarla: 2865000 },
      { type: "Agricultural Land", pricePerMarla: 1100000 },
    ],
    amenities: ["Dense Pine & Fir Forest", "Cooler Climate Than Murree", "Walking Trails", "Lower Tourist Density"],
    landmarks: [
      { name: "Nathia Gali Bazaar", distanceKm: 1.5 },
      { name: "Ayubia National Park", distanceKm: 6 },
      { name: "Abbottabad Road", distanceKm: 3 },
    ],
    pros: [
      "Quieter and less commercialised than Murree's main strip",
      "Dense forest cover supports a cooler microclimate in summer",
      "Growing interest from buyers priced out of Murree proper",
    ],
    cons: [
      "Longer drive from Islamabad than Murree or Bhurban",
      "Limited year-round infrastructure and services",
      "Winter access can be affected by snowfall on approach roads",
    ],
  },
];
