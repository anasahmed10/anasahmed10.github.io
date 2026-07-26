import type { Metadata } from "next";
import ClayCampus from "../components/ClayCampus";

export const metadata: Metadata = {
  title: "Enterprise Systems Campus",
  description:
    "Explore an interactive portfolio of enterprise Android, payments, printers, scanners, observability, mobile AI, and robotics applications.",
};

export default function CampusPage() {
  return <ClayCampus />;
}
