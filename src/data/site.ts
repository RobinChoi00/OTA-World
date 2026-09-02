export const site = {
  name: "OTA World",
  legalName: "OTA World, LLC",
  slogan: "America's No. 1 choice for massage chairs",
  url: "https://www.ota-world.com",
  email: "jay.s@osakititan.com",
  phoneDisplay: "888-848-2630",
  phoneTel: "+18888482630",
  phoneLocalDisplay: "214-307-4771",
  phoneLocalTel: "+12143074771",
  addressLine: "1001 W. Crosby Ln.",
  cityStateZip: "Carrollton, TX 75006",
  city: "Carrollton, Texas",
  mapsQuery: "1001+W+Crosby+Ln+Carrollton+TX+75006",
  hoursWeekday: "9:30 a.m. – 6:30 p.m.",
  hoursSaturday: "10:00 a.m. – 4:00 p.m.",
  hoursSunday: "Closed",
  hoursShort: "Mon–Fri 9:30–6:30",
  founded: "2005",
  brands: [
    { letter: "O", name: "Osaki", url: "https://www.osakiusa.com", sit: "Highpointe 4D" },
    { letter: "T", name: "Titan", url: "https://titanchair.com", sit: "Remedy Pro 4D" },
    { letter: "A", name: "AmaMedic", url: "https://amamedic.com", sit: "Haven" },
  ],
  ogImage: "/assets/images/home4.jpeg",
  /** Intro video on the home page (high-end chairs) */
  youtubeId: "9UmOR1BETis",
} as const;

/** Major retail & channels shown on the home partner rail */
export const retailPartners = [
  { name: "Costco", href: "https://www.costco.com" },
  { name: "Ashley", href: "https://www.ashleyfurniture.com" },
  { name: "Amazon", href: "https://www.amazon.com" },
  { name: "Sam’s Club", href: "https://www.samsclub.com" },
] as const;

/** Nike-style mission lines (about) */
export const mission = {
  kicker: "Our mission",
  lines: ["Show the chair", "in person.", "Stand behind it", "from Carrollton."],
  footnote: "The showroom is not a side room. It is the business.",
} as const;

/** Duolingo-style welcome paths (about / secondary) */
export const welcomePaths = [
  {
    num: "01",
    label: "For the home",
    title: "Sit before you buy",
    text: "Osaki, Titan, and AmaMedic — on the floor, without hurry.",
    href: "/dealers",
    cta: "Find a dealer",
  },
  {
    num: "02",
    label: "The flagship",
    title: "Visit Carrollton",
    text: "Show, stock, and service under one Texas roof since 2005.",
    href: "/dealers#flagship",
    cta: "Plan a visit",
  },
  {
    num: "03",
    label: "For owners",
    title: "Put our name on your door",
    text: "No franchise fee. No royalty. You show the chair.",
    href: "/franchise",
    cta: "Explore partners",
  },
  {
    num: "04",
    label: "After the sale",
    title: "Care from the house",
    text: "Delivery, installation, warranty — Carrollton stays with the chair.",
    href: "/care",
    cta: "Care & service",
  },
] as const;

/** LEGO-style purpose pillars (about) */
export const purposePillars = [
  {
    title: "The showroom",
    text: "The chair is decided in the room — not from a catalog that has moved on.",
    href: "/dealers",
    cta: "Plan a visit",
  },
  {
    title: "The house after delivery",
    text: "We bring the chair home, install it, and remain when service is needed.",
    href: "/care",
    cta: "Care & service",
  },
  {
    title: "The partner floor",
    text: "Owners show the chair. Training, trucks, and warranty stay in Carrollton.",
    href: "/franchise",
    cta: "Become a partner",
  },
  {
    title: "The three names",
    text: "Osaki, Titan, and AmaMedic — one house, shown in person across America.",
    href: "/products",
    cta: "See the lineup",
  },
] as const;

/** Patagonia-style post-sale promise (home + care) */
export const footprint = [
  {
    title: "Delivered",
    text: "White-glove into the room — not left at the curb.",
    href: "/care",
  },
  {
    title: "Installed",
    text: "Set up where it lives. Tested before we leave.",
    href: "/care",
  },
  {
    title: "Warrantied",
    text: "The house stands behind Osaki, Titan, and AmaMedic.",
    href: "/care",
  },
  {
    title: "Serviced",
    text: "Carrollton answers when the chair needs attention.",
    href: "/contact?topic=service",
  },
] as const;

export const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  slogan: site.slogan,
  foundingDate: site.founded,
  telephone: site.phoneTel,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.addressLine,
    addressLocality: "Carrollton",
    addressRegion: "TX",
    postalCode: "75006",
    addressCountry: "US",
  },
  brand: site.brands.map((b) => b.name),
};

export const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: site.name,
  telephone: site.phoneTel,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.addressLine,
    addressLocality: "Carrollton",
    addressRegion: "TX",
    postalCode: "75006",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:30",
      closes: "18:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
};
