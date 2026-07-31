import type { Metadata } from "next";
import ClayCampus from "./components/ClayCampus";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Android Engineering & Products" },
  description:
    "Explore Anas Ahmed’s clay campus for self-service retail, connected-vehicle mobile work, scanner automation, and TabTally.",
};

export default function Home() {
  return <ClayCampus />;
}
