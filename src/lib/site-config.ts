import type { Metadata } from "next";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Δικηγορικό Γραφείο Φώτιος Αργυρόπουλος",
  shortName: "Φώτιος Αργυρόπουλος",
  description: "Δικηγορικό γραφείο στη Θεσσαλονίκη με υπεύθυνη νομική καθοδήγηση, εχεμύθεια και προσωπική προσέγγιση.",
  origin: (configuredOrigin || "https://argiropouloslaw.com").replace(/\/$/, ""),
  locale: "el_GR",
  email: "argiropouloslaw@gmail.com",
  phone: "+306955238770",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.origin}/`).toString();
}

export function createPageMetadata({ title, description, path, keywords = [] }: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      images: [{ url: "/images/home/office-practice.jpg", width: 2560, height: 1707, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/home/office-practice.jpg"] },
  };
}
