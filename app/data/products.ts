export type Product = {
  id: string;
  name: string;
  status: string;
  tagline: string;
  consumerSummary: string;
  engineeringSummary: string;
  platforms: string[];
  technologies: string[];
  artwork: string;
  href: string;
  supportHref?: string;
  privacyHref?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "tabtally",
    name: "TabTally",
    status: "Coming soon",
    tagline: "Scan receipts. Split bills. Keep everyone on the same page.",
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
    artwork: "/products/tabtally/feature-graphic.png",
    href: "/products/tabtally/",
    supportHref: "https://anasahmed10.github.io/tabtally-support/",
    privacyHref: "https://anasahmed10.github.io/tabtally-support/privacy/",
  },
];
