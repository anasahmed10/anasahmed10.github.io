import type { Metadata } from "next";
import ClayCampus from "./components/ClayCampus";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Android Engineering & Products" },
  description:
    "Explore eight clay landmarks spanning enterprise Android, connected vehicles, scanner automation, SplitDish, SmartShopper, and Highlight Corner, a live NFL scores and highlights hub.",
};

export default function Home() {
  return <ClayCampus />;
}
