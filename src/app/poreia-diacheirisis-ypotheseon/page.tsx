import type { Metadata } from "next";
import { InnerPageHero } from "@/components/pages/inner-page-hero";
import { PageContactCta } from "@/components/pages/page-contact-cta";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Πορεία Διαχείρισης Υποθέσεων", description: "Η πορεία μιας νομικής υπόθεσης από την πρώτη επικοινωνία έως την ολοκλήρωση.", path: "/poreia-diacheirisis-ypotheseon", keywords: ["διαχείριση νομικής υπόθεσης", "νομική στρατηγική"] });

const steps = [
  ["Προκαταρκτική επικοινωνία", "Επικοινωνείτε με το γραφείο και περιγράφετε συνοπτικά το ζήτημα, ώστε να οριστεί η πρώτη συνάντηση."],
  ["Υποδοχή και γνωριμία", "Δημιουργούμε από την πρώτη συνάντηση ένα κλίμα ειλικρίνειας, οικειότητας και αμοιβαίας εμπιστοσύνης."],
  ["Μελέτη στοιχείων", "Συγκεντρώνουμε τα απαραίτητα έγγραφα και εξετάζουμε αναλυτικά τα πραγματικά και νομικά δεδομένα."],
  ["Στρατηγική και ενέργειες", "Παρουσιάζουμε τις διαθέσιμες επιλογές και προχωρούμε στις συμφωνημένες εξώδικες ή δικαστικές ενέργειες."],
  ["Ενημέρωση και ολοκλήρωση", "Παρέχουμε συνεχή ενημέρωση μέχρι τη διευθέτηση των εκκρεμοτήτων και την ολοκλήρωση της διαδικασίας."],
] as const;

export default function ProcessPage() {
  return <main id="main-content" tabIndex={-1}>
    <InnerPageHero eyebrow="Πορεία υποθέσεων" title="Μια ξεκάθαρη διαδρομή, βήμα προς βήμα." subtitle="Από την πρώτη επικοινωνία μέχρι την ολοκλήρωση, γνωρίζετε τι ακολουθεί." image="/images/home/office-detail.jpg" imageAlt="Μελέτη νομικής υπόθεσης" />
    <section className="inner-process"><header><p className="eyebrow">01 / Η διαδικασία</p><h2>Μεθοδική προσέγγιση και σταθερή επικοινωνία.</h2></header><ol>{steps.map(([title, body], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></section>
    <PageContactCta />
  </main>;
}
