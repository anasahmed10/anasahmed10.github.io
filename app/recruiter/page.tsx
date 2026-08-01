import type { Metadata } from "next";
import PortfolioExperience from "../components/PortfolioExperience";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

const RECRUITER_URL = "https://anasahmed10.github.io/recruiter/";

export const metadata: Metadata = {
  title: "Enterprise Mobile Engineer | Android, Kotlin & Hardware Systems",
  description:
    "Anas Ahmed is an enterprise mobile engineer with 5+ years building Kotlin and Android systems for printers, scanners, payment terminals, POS automation, and connected-device workflows.",
  keywords: [
    "Enterprise Mobile Engineer",
    "Android Engineer",
    "Kotlin Engineer",
    "Hardware Integration",
    "Android Platform Engineer",
    "POS Integration",
    "Payment Terminal Integration",
    "Jetpack Compose",
    "Kotlin Multiplatform",
    "Boston Android Engineer",
  ],
  alternates: { canonical: RECRUITER_URL },
  openGraph: {
    title: "Anas Ahmed | Enterprise Mobile Engineer",
    description:
      "5+ years building Android and cross-platform software around printers, scanners, payments, POS automation, and connected devices.",
    url: RECRUITER_URL,
    type: "profile",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Anas Ahmed enterprise mobile engineering portfolio" }],
  },
};

const PERSON_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anas Ahmed",
  url: "https://anasahmed10.github.io/",
  jobTitle: "Software Engineer II, Mobile",
  worksFor: { "@type": "Organization", name: "Staples" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Massachusetts Lowell" },
  sameAs: [
    "https://www.linkedin.com/in/anas-ahmed-28b391166",
    "https://github.com/anasahmed10",
  ],
  knowsAbout: [
    "Android",
    "Kotlin",
    "Enterprise mobile engineering",
    "Hardware SDK integration",
    "Payment terminals",
    "Point-of-sale automation",
    "Jetpack Compose",
    "Kotlin Multiplatform",
  ],
};

export default function RecruiterPage() {
  return (
    <main className="public-shell recruiter-shell">
      <a className="skip-link" href="#experience">Skip to experience</a>
      <PublicHeader active="recruiter" />
      <PortfolioExperience />
      <PublicFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_STRUCTURED_DATA) }}
      />
    </main>
  );
}
