import type { Metadata } from "next";
import HomeAnimated from "./HomeAnimated";

export const metadata: Metadata = {
  title: "Healing Waters Clinic — Restore Your Natural Flow",
  description: "Premium holistic wellness clinic offering hydrotherapy, massage therapy, and acupuncture.",
};

export default function HomePage() {
  return <HomeAnimated />;
}
