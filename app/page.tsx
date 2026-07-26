import type { Metadata } from "next";
import ClayCampus from "./components/ClayCampus";

export const metadata: Metadata = {
  title: { absolute: "Anas Ahmed — Enterprise Android Engineer & Product Builder" },
  description:
    "Explore Anas Ahmed’s interactive 3D campus: enterprise Android, device systems, automation, observability, and products including TabTally.",
};

export default function Home() {
  return <ClayCampus />;
}
