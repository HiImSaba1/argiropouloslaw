import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InnerPageHero } from "@/components/pages/inner-page-hero";
import { PageContactCta } from "@/components/pages/page-contact-cta";
import { legalServices } from "@/data/services";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Νομικές Υπηρεσίες", description: "Οι τομείς δικηγορικής πρακτικής του γραφείου Φώτιος Αργυρόπουλος στη Θεσσαλονίκη.", path: "/ypiresies", keywords: legalServices.map(({ title }) => title) });

export default function ServicesPage() {
  return <main id="main-content" tabIndex={-1}>
    <InnerPageHero eyebrow="Νομικές υπηρεσίες" title="Στρατηγική προσαρμοσμένη σε κάθε υπόθεση." subtitle="Ακρίβεια, αποτελεσματικότητα και εξατομικευμένες λύσεις." image="/images/home/candidate-law-book.png" imageAlt="Νομικά βιβλία" />
    <section className="services-index" aria-labelledby="services-index-title">
      <header><p className="eyebrow">01 / Τομείς πρακτικής</p><h2 id="services-index-title">Ένα ευρύ φάσμα νομικής υποστήριξης.</h2></header>
      <div className="services-index__grid">
        {legalServices.map((service, index) => <Link className="services-index__card" href={`/services/${service.slug}`} key={service.slug}>
          <span className="services-index__card-top"><span>0{index + 1}</span><ArrowUpRight aria-hidden="true" /></span>
          <h3>{service.title}</h3><p>{service.summary}</p><span className="services-index__card-action">Προβολή υπηρεσίας <ArrowUpRight aria-hidden="true" /></span>
        </Link>)}
      </div>
    </section>
    <PageContactCta />
  </main>;
}
