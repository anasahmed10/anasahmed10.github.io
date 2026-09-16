export type Product = {
  id: string;
  name: string;
  status: string;
  availability: {
    apple: string;
    googlePlay: string;
  };
  tagline: string;
  consumerSummary: string;
  engineeringSummary: string;
  platforms: string[];
  technologies: string[];
  artwork?: string;
  artworkVariant?: "smartshopper" | "highlight-corner";
  monogram?: string;
  artworkLabel: string;
  artworkDetail: string;
  href: string;
  external?: boolean;
  supportHref?: string;
  privacyHref?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "splitdish",
    name: "SplitDish",
    status: "App review + external testing",
    availability: {
      apple: "Submitted for Apple App Store review",
      googlePlay: "Google Play external testing",
    },
    tagline: "Scan receipts. Split fairly. Share totals.",
    consumerSummary:
      "A clear, editable way to turn a restaurant receipt into a fair split for everyone at the table.",
    engineeringSummary:
      "A Kotlin Multiplatform product combining native capture, on-device OCR, geometry-aware reconstruction, strict-schema AI extraction, shared Compose UI, and deterministic split calculation.",
    platforms: ["Android", "iOS"],
    technologies: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "ML Kit + Vision",
      "Ktor",
      "SQLDelight",
    ],
    artwork: "/products/splitdish/feature-graphic.png",
    artworkLabel: "Android + iOS",
    artworkDetail: "One shared product system",
    href: "/products/splitdish/",
    supportHref: "https://anasahmed10.github.io/splitdish-support/",
    privacyHref: "https://anasahmed10.github.io/splitdish-support/privacy/",
  },
  {
    id: "smartshopper",
    name: "SmartShopper",
    status: "Live custom GPT",
    availability: {
      apple: "Available in ChatGPT",
      googlePlay: "Web and mobile access",
    },
    tagline: "Shopping research that explains the tradeoffs.",
    consumerSummary:
      "A guided shopping assistant that turns personal constraints into researched, purchase-ready recommendations.",
    engineeringSummary:
      "A custom GPT workflow designed around targeted clarification, multi-source product research, budget-to-premium comparisons, seller and review signals, and transparent value-tradeoff analysis.",
    platforms: ["ChatGPT", "Web + mobile"],
    technologies: [
      "Custom GPT",
      "Prompt Engineering",
      "Web Research",
      "Recommendation Design",
    ],
    artworkLabel: "Reusable across 5+ categories",
    artworkDetail: "Constraints in · researched options out",
    artworkVariant: "smartshopper",
    monogram: "SS",
    href: "https://chatgpt.com/g/g-6a4be8c0f2ac8191a2e34a57b52f46ee-smartshopper",
    external: true,
  },
  {
    id: "highlight-corner",
    name: "Highlight Corner",
    status: "Live 2026 season product",
    availability: {
      apple: "Live at highlightcorner.com",
      googlePlay: "Responsive web experience",
    },
    tagline: "NFL highlights without the scoreboard ambush.",
    consumerSummary:
      "A fan passion project that makes official NFL highlights easy to find in one place, with spoiler-conscious browsing of the 2026 season and concise original game recaps.",
    engineeringSummary:
      "A React and TypeScript product built around a curated 272-game catalog, verified official video playback, a board-wide spoiler-free mode, sourced recaps, fantasy-style player stats, and Cloudflare Workers delivery.",
    platforms: ["Responsive web"],
    technologies: [
      "React 19",
      "TypeScript",
      "Vinext + Vite",
      "Cloudflare Workers",
    ],
    artworkVariant: "highlight-corner",
    monogram: "HC",
    artworkLabel: "2026 NFL regular season",
    artworkDetail: "272 games · spoiler-conscious browsing",
    href: "https://highlightcorner.com/",
    external: true,
  },
];
