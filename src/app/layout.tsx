import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteProviders } from "@/providers/site-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FooterCurtain } from "@/components/layout/footer-curtain";
import { GlobalRevealChoreography } from "@/components/motion/global-reveal-choreography";
import { comfortaa, inter } from "./fonts";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: { default: "Φώτιος Αργυρόπουλος | Δικηγορικό Γραφείο", template: "%s | Φώτιος Αργυρόπουλος" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Φώτιος Αργυρόπουλος" }],
  creator: "Φώτιος Αργυρόπουλος",
  publisher: siteConfig.name,
  category: "Νομικές υπηρεσίες",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: siteConfig.locale, siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description, url: "/", images: [{ url: "/images/home/office-practice.jpg", width: 2560, height: 1707, alt: siteConfig.name }] },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description, images: ["/images/home/office-practice.jpg"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const legalOfficeSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": absoluteUrl("/#legal-office"),
    name: siteConfig.name,
    url: siteConfig.origin,
    logo: absoluteUrl("/images/logo/argiropouloslaw-logo.png"),
    image: absoluteUrl("/images/home/office-practice.jpg"),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: { "@type": "PostalAddress", streetAddress: "Στρατηγού Μακρυγιάννη 66", postalCode: "56431", addressLocality: "Θεσσαλονίκη", addressCountry: "GR" },
    areaServed: { "@type": "Country", name: "Ελλάδα" },
  };
  return (
    <html
      lang="el"
      className={`${inter.variable} ${comfortaa.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(legalOfficeSchema).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#main-content">Μετάβαση στο κύριο περιεχόμενο</a>
        <SiteProviders><SiteHeader />{children}<FooterCurtain><SiteFooter /></FooterCurtain><GlobalRevealChoreography /></SiteProviders>
      </body>
    </html>
  );
}
