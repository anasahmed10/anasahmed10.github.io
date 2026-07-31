import type { Metadata } from "next";
import ClayCampus from "./components/ClayCampus";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Android Engineering & Products" },
  description:
    "Explore Anas Ahmed’s clay campus for enterprise Android, connected vehicles, scanner automation, TabTally, and SmartShopper AI research.",
};

export default function Home() {
  return <ClayCampus />;
}
