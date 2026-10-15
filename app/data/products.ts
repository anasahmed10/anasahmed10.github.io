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
  artworkAlt?: string;
  artworkVariant?: "smartshopper";
  icon?: string;
  monogram?: string;
  artworkLabel: string;
  artworkDetail: string;
  href: string;
  external?: boolean;
  appStoreHref?: string;
  supportHref?: string;
  privacyHref?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "splitdish",
    name: "SplitDish",
    status: "App Store release · Google Play testing",
    availability: {
      apple: "Available on the Apple App Store",
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
    icon: "/products/splitdish/app-icon-v2.png",
    artworkLabel: "Android + iOS",
    artworkDetail: "One shared product system",
    href: "/products/splitdish/",
    appStoreHref: "https://apps.apple.com/us/app/splitdish/id6789408948",
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
    status: "Live cross-platform NFL web app",
    availability: {
      apple: "Add to iPhone home screen from highlightcorner.com",
      googlePlay: "Add to Android home screen from highlightcorner.com",
    },
    tagline: "See the score. Know how the game went.",
    consumerSummary:
      "A mobile-first NFL website with weekly scores, favorites, spoiler controls, outbound YouTube highlight links, fantasy leaders, original recaps, and game centers. It works across iOS, Android, and desktop browsers and can be added to a phone's home screen.",
    engineeringSummary:
      "A responsive JavaScript web app that reads ESPN and Sleeper data, coordinates season and week across views, and refreshes live scores while visible. A service worker supports an installable offline shell; GitHub Actions tests and deploys the static site.",
    platforms: ["iOS + Android home screen", "Desktop web"],
    technologies: [
      "JavaScript",
      "ESPN + Sleeper data",
      "Service Worker",
      "GitHub Actions",
    ],
    artwork: "/products/highlight-corner/scoreboard-preview.jpg",
    artworkAlt: "Highlight Corner scoreboard showing team scores, a game list, and a highlights link",
    icon: "/products/highlight-corner/brand-mark.svg",
    artworkLabel: "Scoreboard interface preview",
    artworkDetail: "Scores · highlights · recaps",
    href: "https://highlightcorner.com/",
    external: true,
  },
];
