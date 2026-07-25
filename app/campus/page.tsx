import type { Metadata } from "next";
import PortfolioExperience from "../components/PortfolioExperience";

export const metadata: Metadata = {
  title: "Enterprise Systems Campus",
  description:
    "Explore an interactive portfolio of enterprise Android, payments, printers, scanners, observability, mobile AI, and robotics applications.",
};

export default function CampusPage() {
  return <PortfolioExperience initialMode="campus" />;
}
