import type { Metadata } from "next";
import Image from "next/image";
import { InnerPageHero } from "@/components/pages/inner-page-hero";
import { PageContactCta } from "@/components/pages/page-contact-cta";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Βιογραφικό", description: "Η εκπαίδευση, η εμπειρία και η επαγγελματική πορεία του δικηγόρου Φώτιου Αργυρόπουλου.", path: "/viografiko", keywords: ["Φώτιος Αργυρόπουλος", "δικηγόρος Θεσσαλονίκη", "βιογραφικό δικηγόρου"] });

const milestones = [
  ["Σπουδές", "Απόφοιτος της Νομικής Σχολής του Ευρωπαϊκού Πανεπιστημίου Κύπρου."],
  ["Άσκηση δικηγορίας", "Ουσιαστική εμπειρία στη μελέτη και διαχείριση σύνθετων νομικών υποθέσεων."],
  ["Εξειδίκευση", "Ιδιαίτερη ενασχόληση με το τραπεζικό δίκαιο και τις ιδιωτικές διαφορές."],
  ["Σήμερα", "Παροχή εξατομικευμένης νομικής υποστήριξης με έδρα τη Θεσσαλονίκη."],
] as const;

export default function BiographyPage() {
  return <main id="main-content" tabIndex={-1}>
    <InnerPageHero eyebrow="Βιογραφικό" title="Γνώση, προετοιμασία και ανθρώπινη προσέγγιση." subtitle="Η επαγγελματική πορεία του δικηγόρου Φώτιου Αργυρόπουλου." image="/images/home/hero-biography.webp" imageAlt="Ο δικηγόρος Φώτιος Αργυρόπουλος" />
    <section className="inner-profile">
      <ParallaxMedia className="inner-profile__media"><Image src="/images/home/hero-biography.webp" alt="Φώτιος Αργυρόπουλος" fill sizes="(max-width: 900px) 100vw, 44vw" /></ParallaxMedia>
      <div className="inner-profile__copy"><p className="eyebrow">01 / Προφίλ</p><h2>Σταθερή παρουσία σε κάθε στάδιο της υπόθεσης.</h2><p>Ο Φώτιος Αργυρόπουλος γεννήθηκε και μεγάλωσε στη Θεσσαλονίκη. Η προσέγγισή του συνδυάζει τη συστηματική νομική έρευνα, την καθαρή επικοινωνία και τη βαθιά κατανόηση των πραγματικών αναγκών του εντολέα.</p></div>
    </section>
    <section className="inner-timeline"><header><p className="eyebrow">02 / Πορεία</p><h2>Εκπαίδευση και επαγγελματική εξέλιξη.</h2></header><ol>{milestones.map(([title, body], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
    <PageContactCta />
  </main>;
}
