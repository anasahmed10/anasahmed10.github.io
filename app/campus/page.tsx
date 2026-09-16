import type { Metadata } from "next";
import ClayCampus from "../components/ClayCampus";

export const metadata: Metadata = {
  title: "Interactive Project Campus",
  description:
    "Walk through eight clay landmarks covering enterprise Android, connected vehicles, scanner automation, SplitDish, SmartShopper, Highlight Corner, and Anas Ahmed’s origin and hobbies.",
};

export default function CampusPage() {
  return <ClayCampus />;
}
