import type { Metadata } from "next";
import ClayCampus from "../components/ClayCampus";

export const metadata: Metadata = {
  title: "Interactive Project Campus",
  description:
    "Walk through seven clay landmarks covering enterprise Android, connected-vehicle mobile work, scanner automation, TabTally, SmartShopper, and Anas Ahmed’s origin and hobbies.",
};

export default function CampusPage() {
  return <ClayCampus />;
}
