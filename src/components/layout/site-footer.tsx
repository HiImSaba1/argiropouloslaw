import Image from "next/image";
import { LetterHoverLink } from "@/components/ui/letter-hover-link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <Image
          src="/images/logo/argiropouloslaw-logo.png"
          alt="Φώτιος Αργυρόπουλος"
          width={788}
          height={147}
        />
        <p>Νομική καθοδήγηση με συνέπεια, σαφήνεια και προσωπική προσέγγιση.</p>
      </div>
      <div className="site-footer__columns">
        <nav aria-label="Πλοήγηση υποσέλιδου">
          <h2>Γρήγοροι σύνδεσμοι</h2>
          <LetterHoverLink href="/about-us">Το γραφείο</LetterHoverLink>
          <LetterHoverLink href="/viografiko">Βιογραφικό</LetterHoverLink>
          <LetterHoverLink href="/ypiresies">Υπηρεσίες</LetterHoverLink>
          <LetterHoverLink href="/epikoinonia">Επικοινωνία</LetterHoverLink>
        </nav>
        <address>
          <h2>Επικοινωνία</h2>
          <p>
            Στρατηγού Μακρυγιάννη 66
            <br />
            564 31 Θεσσαλονίκη
          </p>
          <div className="site-footer__contact">
            <LetterHoverLink
              className="site-footer__animated-link"
              href="tel:+306955238770"
            >
              +30 695 523 8770
            </LetterHoverLink>
            <a className="site-footer__mobile-link" href="tel:+306955238770">
              +30 695 523 8770
            </a>
            <LetterHoverLink
              className="site-footer__animated-link"
              href="mailto:argiropouloslaw@gmail.com"
            >
              argiropouloslaw@gmail.com
            </LetterHoverLink>
            <a
              className="site-footer__mobile-link"
              href="mailto:argiropouloslaw@gmail.com"
            >
              argiropouloslaw@gmail.com
            </a>
          </div>
        </address>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Φώτιος Αργυρόπουλος</p>
        <LetterHoverLink
          className="site-footer__credit"
          href="https://www.sabaweb.gr"
          target="_blank"
          rel="noreferrer"
        >
          By Saba Web Solutions
        </LetterHoverLink>
        <LetterHoverLink
          className="site-footer__animated-link"
          href="/politiki-aporritou"
        >
          Πολιτική απορρήτου
        </LetterHoverLink>
        <a className="site-footer__mobile-link" href="/politiki-aporritou">
          Πολιτική απορρήτου
        </a>
      </div>
    </footer>
  );
}
