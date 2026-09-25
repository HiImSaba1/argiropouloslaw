import type { Metadata } from "next";
import { HomeHeroSlider } from "@/components/home/home-hero-slider";
import { HomeServicesSection } from "@/components/home/home-services-section";
import { HomeEditorialSections } from "@/components/home/home-editorial-sections";
import { createPageMetadata, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Δικηγορικό Γραφείο στη Θεσσαλονίκη", description: siteConfig.description, path: "/", keywords: ["δικηγόρος Θεσσαλονίκη", "δικηγορικό γραφείο", "νομικές υπηρεσίες"] });

export default function HomePage() {
  return <main id="main-content" tabIndex={-1}><HomeHeroSlider /><HomeServicesSection /><HomeEditorialSections /></main>;
}
