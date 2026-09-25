import type { MetadataRoute } from "next";
import { legalServices } from "@/data/services";
import { absoluteUrl } from "@/lib/site-config";

const updated = new Date("2026-09-25T00:00:00+03:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/about-us", priority: .8, changeFrequency: "monthly" },
    { path: "/viografiko", priority: .7, changeFrequency: "yearly" },
    { path: "/ypiresies", priority: .9, changeFrequency: "monthly" },
    { path: "/poreia-diacheirisis-ypotheseon", priority: .7, changeFrequency: "yearly" },
    { path: "/epikoinonia", priority: .8, changeFrequency: "monthly" },
    { path: "/politiki-aporritou", priority: .3, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map(({ path, ...entry }) => ({ url: absoluteUrl(path), lastModified: updated, ...entry })),
    ...legalServices.map(({ slug }) => ({ url: absoluteUrl(`/services/${slug}`), lastModified: updated, changeFrequency: "monthly" as const, priority: .8 })),
  ];
}
