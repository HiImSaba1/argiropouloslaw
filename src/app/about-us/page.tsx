import type { Metadata } from "next";
import Image from "next/image";
import { InnerPageHero } from "@/components/pages/inner-page-hero";
import { PageContactCta } from "@/components/pages/page-contact-cta";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Το Γραφείο", description: "Το δικηγορικό γραφείο Φώτιος Αργυρόπουλος στη Θεσσαλονίκη: φιλοσοφία, χώρος και τρόπος συνεργασίας.", path: "/about-us", keywords: ["δικηγορικό γραφείο Θεσσαλονίκη", "Φώτιος Αργυρόπουλος"] });

export default function AboutPage() {
  return <main id="main-content" tabIndex={-1}>
    <InnerPageHero eyebrow="Το γραφείο" title="Ένας χώρος εμπιστοσύνης και ουσιαστικής συνεργασίας." subtitle="Εχεμύθεια, αξιοπιστία και προσωπική προσέγγιση σε κάθε υπόθεση." />
    <section className="inner-editorial inner-editorial--split">
      <div className="inner-editorial__side"><p className="eyebrow">01 / Η φιλοσοφία μας</p><p>«Summum jus, summa injuria»</p></div>
      <div className="inner-editorial__body"><h2>Νομική υποστήριξη με ακεραιότητα και επαγγελματισμό.</h2><p>Στο δικηγορικό γραφείο μας, με επικεφαλής τον Φώτιο Αργυρόπουλο, παρέχουμε εξειδικευμένες νομικές υπηρεσίες με συνέπεια, σαφήνεια και υπεύθυνη προετοιμασία.</p><p>Η εμπειρία μας σε διαφορετικούς τομείς του δικαίου επιτρέπει μια ολοκληρωμένη προσέγγιση, προσαρμοσμένη στις ιδιαίτερες ανάγκες κάθε εντολέα.</p></div>
    </section>
    <section className="inner-media-story">
      <ParallaxMedia className="inner-media-story__media"><Image src="/images/home/office-detail.jpg" alt="Προετοιμασία νομικής υπόθεσης" fill sizes="(max-width: 900px) 100vw, 52vw" /></ParallaxMedia>
      <div><p className="eyebrow">02 / Ο χώρος</p><h2>Στο κέντρο της συνεργασίας βρίσκεται η εμπιστοσύνη.</h2><p>Το γραφείο βρίσκεται στη Στρατηγού Μακρυγιάννη 66, στην Άνω Ηλιούπολη Θεσσαλονίκης, σε έναν εύκολα προσβάσιμο χώρο διαμορφωμένο με φροντίδα, αρμονία και οικειότητα.</p></div>
    </section>
    <PageContactCta />
  </main>;
}
