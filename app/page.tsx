import type { Metadata } from "next";
import ClayCampus from "./components/ClayCampus";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Android Engineering & Products" },
  description:
    "Explore eight clay landmarks spanning enterprise Android, connected vehicles, scanner automation, SplitDish, SmartShopper, and Highlight Corner, a live NFL highlights product built around a 272-game catalog.",
};

export default function Home() {
  return <ClayCampus />;
}
