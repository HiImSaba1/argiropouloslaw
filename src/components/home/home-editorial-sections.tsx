import Image from "next/image";
import { EditorialButton } from "@/components/ui/editorial-button";
import { HomeTestimonials } from "@/components/home/home-testimonials";
import { ParallaxMedia } from "@/components/motion/parallax-media";

const processSteps = [
  { number: "01", title: "Πρώτη επικοινωνία", body: "Επικοινωνείτε τηλεφωνικά, μέσω email ή από τη φόρμα επικοινωνίας και προγραμματίζουμε την πρώτη συνάντηση." },
  { number: "02", title: "Μελέτη της υπόθεσης", body: "Ακούμε προσεκτικά τα πραγματικά περιστατικά και εξετάζουμε τα διαθέσιμα στοιχεία και έγγραφα." },
  { number: "03", title: "Νομική στρατηγική", body: "Παρουσιάζουμε με σαφήνεια τις διαθέσιμες επιλογές, τα επόμενα βήματα και το πλαίσιο της συνεργασίας." },
  { number: "04", title: "Συνεχής ενημέρωση", body: "Παρακολουθούμε την εξέλιξη και διατηρούμε σταθερή, υπεύθυνη επικοινωνία σε κάθε στάδιο." },
] as const;

export function HomeEditorialSections() {
  return (
    <>
      <section className="home-biography" aria-labelledby="home-biography-title">
        <ParallaxMedia className="home-biography__media" gentle><Image src="/images/home/hero-biography.webp" alt="Ο δικηγόρος Φώτιος Αργυρόπουλος" fill sizes="(max-width: 900px) 100vw, 48vw" /></ParallaxMedia>
        <div className="home-biography__copy">
          <p className="eyebrow">02 / Βιογραφικό</p>
          <h2 id="home-biography-title">Γνώση, προετοιμασία και ανθρώπινη προσέγγιση.</h2>
          <p>Ο Φώτιος Αργυρόπουλος γεννήθηκε και μεγάλωσε στη Θεσσαλονίκη. Αποφοίτησε από τη Νομική Σχολή του Ευρωπαϊκού Πανεπιστημίου Κύπρου και απέκτησε ουσιαστική εμπειρία σε σύνθετες υποθέσεις, με ιδιαίτερη ενασχόληση στο τραπεζικό δίκαιο.</p>
          <EditorialButton href="/viografiko" label="Διαβάστε το βιογραφικό" />
        </div>
      </section>

      <section className="home-process" aria-labelledby="home-process-title">
        <header>
          <p className="eyebrow">03 / Πορεία υπόθεσης</p>
          <div className="home-section-title-action">
            <h2 id="home-process-title">Μια ξεκάθαρη διαδρομή από την πρώτη επικοινωνία έως την ολοκλήρωση.</h2>
            <EditorialButton href="/poreia-diacheirisis-ypotheseon" label="Δείτε τη διαδικασία" tone="dark" />
          </div>
        </header>
        <ol>{processSteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
        <div className="home-section-mobile-action"><EditorialButton href="/poreia-diacheirisis-ypotheseon" label="Δείτε τη διαδικασία" tone="dark" /></div>
      </section>

      <HomeTestimonials />

      <section className="home-contact-cta" aria-labelledby="home-contact-title">
        <p className="eyebrow">05 / Επικοινωνία</p>
        <div className="home-contact-cta__heading">
          <h2 id="home-contact-title">Το επόμενο βήμα ξεκινά με μια συζήτηση.</h2>
        </div>
        <p>Για να προγραμματίσετε μια πρώτη συνάντηση ή να ζητήσετε περισσότερες πληροφορίες, επικοινωνήστε με το γραφείο.</p>
        <EditorialButton href="/epikoinonia" label="Κλείστε ραντεβού" />
      </section>

      <section className="home-office" aria-labelledby="home-office-title">
        <ParallaxMedia className="home-office__media"><Image src="/images/home/office-practice.jpg" alt="Χώρος δικηγορικού γραφείου με νομική βιβλιοθήκη" fill sizes="100vw" /></ParallaxMedia>
        <div className="home-office__card">
          <p className="eyebrow">06 / Το γραφείο</p>
          <h2 id="home-office-title">Ένας χώρος εμπιστοσύνης στη Θεσσαλονίκη.</h2>
          <p>Το γραφείο βρίσκεται στην οδό Στρατηγού Μακρυγιάννη 66, στην Άνω Ηλιούπολη, σε έναν χώρο σχεδιασμένο για άνετη και ουσιαστική συνεργασία.</p>
          <EditorialButton href="/about-us" label="Γνωρίστε τον χώρο" />
        </div>
      </section>

    </>
  );
}
