import { EditorialButton } from "@/components/ui/editorial-button";

export function PageContactCta() {
  return (
    <section className="page-contact-cta" aria-labelledby="page-contact-cta-title">
      <p className="eyebrow">Επικοινωνία</p>
      <h2 id="page-contact-cta-title">Η σωστή κατεύθυνση ξεκινά με μια ουσιαστική συζήτηση.</h2>
      <EditorialButton href="/epikoinonia" label="Κλείστε ραντεβού" />
    </section>
  );
}
