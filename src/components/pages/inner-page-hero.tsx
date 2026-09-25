import Image from "next/image";
import { ParallaxMedia } from "@/components/motion/parallax-media";

export function InnerPageHero({ eyebrow, title, subtitle, image = "/images/home/office-practice.jpg", imageAlt = "Δικηγορικό γραφείο Φώτιος Αργυρόπουλος" }: { eyebrow: string; title: string; subtitle: string; image?: string; imageAlt?: string }) {
  return (
    <section className="inner-hero" aria-labelledby="inner-page-title">
      <ParallaxMedia className="inner-hero__media"><Image src={image} alt={imageAlt} fill priority sizes="100vw" /></ParallaxMedia>
      <span className="inner-hero__overlay" aria-hidden="true" />
      <div className="inner-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="inner-page-title">{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
