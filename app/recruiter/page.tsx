import type { Metadata } from "next";
import PortfolioExperience from "../components/PortfolioExperience";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

const RECRUITER_URL = "https://anasahmed10.github.io/recruiter/";

export const metadata: Metadata = {
  title: "Software Engineer | Android, Cross-Platform & Connected Systems",
  description:
    "Anas Ahmed is a software engineer with 5+ years building production Android systems, cross-platform mobile products, connected-device workflows, and web experiences.",
  keywords: [
    "Software Engineer",
    "Android Engineer",
    "Kotlin Engineer",
    "Kotlin Multiplatform",
    "Cross-Platform Software Engineer",
    "Hardware Integration",
    "Connected Devices",
    "POS Integration",
    "Payment Terminal Integration",
    "Jetpack Compose",
    "Java",
    "JavaScript",
    "Boston Android Engineer",
  ],
  alternates: { canonical: RECRUITER_URL },
  openGraph: {
    title: "Anas Ahmed | Software Engineer",
    description:
      "Production Android systems, cross-platform mobile products, connected devices, and shipped web experiences.",
    url: RECRUITER_URL,
    type: "profile",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Anas Ahmed software engineering portfolio" }],
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
    "Cross-platform product engineering",
    "Web applications",
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
