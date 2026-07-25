import type { Metadata } from "next";
import PortfolioExperience from "../components/PortfolioExperience";

export const metadata: Metadata = {
  title: "Recruiter View",
  description:
    "View Anas Ahmed’s role-adaptive profile, enterprise Android experience, verified impact, technical skills, and tailored résumés.",
};

export default function RecruiterPage() {
  return <PortfolioExperience initialMode="recruiter" />;
}
