"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { EditorialButton } from "@/components/ui/editorial-button";
import { ParallaxMedia } from "@/components/motion/parallax-media";

const services = [
  {
    title: "Αστικό & Κτηματολογικό Δίκαιο",
    summary: "Υποθέσεις ακινήτων, εμπράγματες διαφορές, κτηματολογικές διορθώσεις, μισθώσεις και συμβατικές σχέσεις.",
    capabilities: ["Ακίνητα", "Κτηματολόγιο", "Συμβάσεις"],
    image: "/images/home/candidate-shelf-books.png",
  },
  {
    title: "Τραπεζικό & Εμπορικό Δίκαιο",
    summary: "Συμβουλευτική και εκπροσώπηση σε τραπεζικές διαφορές, ρυθμίσεις οφειλών και ζητήματα εμπορικής δραστηριότητας.",
    capabilities: ["Οφειλές", "Τράπεζες", "Εμπορικές διαφορές"],
    image: "/images/home/candidate-lawyer-cover.png",
  },
  {
    title: "Ποινικό Δίκαιο",
    summary: "Νομική υποστήριξη και υπεράσπιση σε όλα τα στάδια της ποινικής διαδικασίας, με προσεκτική μελέτη κάθε υπόθεσης.",
    capabilities: ["Προανάκριση", "Ανακριτής", "Δικαστήριο"],
    image: "/images/home/candidate-law-virgo.png",
  },
  {
    title: "Εργατικό & Διοικητικό Δίκαιο",
    summary: "Υποστήριξη σε εργατικές διαφορές, διοικητικές προσφυγές και υποθέσεις που αφορούν δημόσιες συμβάσεις.",
    capabilities: ["Εργασιακές σχέσεις", "Προσφυγές", "Δημόσιες συμβάσεις"],
    image: "/images/home/office-detail.jpg",
  },
] as const;

export function HomeServicesSection() {
  return (
    <section className="home-services" aria-labelledby="home-services-title">
      <header className="home-services__header">
        <p className="eyebrow">01 / Νομικές υπηρεσίες</p>
        <div className="home-section-title-action">
          <h2 id="home-services-title">Κάθε υπόθεση απαιτεί γνώση, ακρίβεια και προσωπική στρατηγική.</h2>
          <EditorialButton href="/ypiresies" label="Όλες οι υπηρεσίες" tone="dark" />
        </div>
        <p>Το γραφείο προσφέρει ένα ευρύ φάσμα νομικών υπηρεσιών, με εξατομικευμένες λύσεις που ανταποκρίνονται στις ιδιαίτερες ανάγκες κάθε εντολέα.</p>
      </header>
      <ol className="home-services__list">
        {services.map((service, index) => <ServiceRow key={service.title} service={service} index={index} />)}
      </ol>
      <div className="home-section-mobile-action"><EditorialButton href="/ypiresies" label="Όλες οι υπηρεσίες" tone="dark" /></div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: (typeof services)[number]; index: number }) {
  const row = useRef<HTMLLIElement>(null);
  const visible = useInView(row, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <motion.li ref={row} initial={{ opacity: 0, y: 36 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .8, ease: [.16, 1, .3, 1] }}>
      <div className="home-services__title-line">
        <p className="home-services__number">0{index + 1}</p>
        <h3>{service.title}</h3>
      </div>
      <div className="home-services__copy">
        <p>{service.summary}</p>
        <ul>{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <ParallaxMedia className="home-services__media">
        <div><Image src={service.image} alt="" fill sizes="(max-width: 900px) 100vw, 32vw" /></div>
      </ParallaxMedia>
    </motion.li>
  );
}
