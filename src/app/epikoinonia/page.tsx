import type { Metadata } from "next";
import { InnerPageHero } from "@/components/pages/inner-page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { createPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({ title: "Επικοινωνία", description: "Επικοινωνήστε με το δικηγορικό γραφείο Φώτιος Αργυρόπουλος στη Θεσσαλονίκη.", path: "/epikoinonia", keywords: ["επικοινωνία δικηγόρος Θεσσαλονίκη", "ραντεβού δικηγόρου"] });

export default function ContactPage() {
  return <main id="main-content" tabIndex={-1}>
    <InnerPageHero eyebrow="Επικοινωνία" title="Το πρώτο βήμα ξεκινά με μια συζήτηση." subtitle="Επικοινωνήστε με το γραφείο για να προγραμματίσουμε την πρώτη μας συνάντηση." image="/images/home/hero-contact.jpg" imageAlt="Επαγγελματική συνάντηση" />
    <section className="contact-details">
      <header><p className="eyebrow">01 / Στοιχεία γραφείου</p><h2>Είμαστε στη διάθεσή σας.</h2></header>
      <address>
        <a href="tel:+306955238770"><span>Τηλέφωνο</span><strong>+30 695 523 8770</strong></a>
        <a href="mailto:argiropouloslaw@gmail.com"><span>Email</span><strong>argiropouloslaw@gmail.com</strong></a>
        <p><span>Διεύθυνση</span><strong>Στρατηγού Μακρυγιάννη 66<br />564 31 Θεσσαλονίκη</strong></p>
        <p><span>Ραντεβού</span><strong>Κατόπιν επικοινωνίας και εκτός γραφείου μόνο για σοβαρούς λόγους.</strong></p>
      </address>
      
    </section> 
    <section className="contact-form-section" aria-labelledby="contact-form-title">
      <header><p className="eyebrow">02 / Αίτημα επικοινωνίας</p><h2 id="contact-form-title">Πείτε μας πώς μπορούμε να επικοινωνήσουμε μαζί σας.</h2></header>
      <ContactForm />
    </section>
  </main>;
}
