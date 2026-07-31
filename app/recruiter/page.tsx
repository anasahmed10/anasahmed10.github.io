import type { Metadata } from "next";
import PortfolioExperience from "../components/PortfolioExperience";

export const metadata: Metadata = {
  title: "Recruiter View",
  description:
    "Review Anas Ahmed’s enterprise Android experience, verified project outcomes, technical skills, projects, and resume.",
};

export default function RecruiterPage() {
  return <PortfolioExperience initialMode="recruiter" />;
}
