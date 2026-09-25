"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { EditorialButton } from "@/components/ui/editorial-button";
import { gsap } from "@/lib/animations/gsap";

const slides = [
  {
    href: "/about-us",
    button: "Σχετικά με εμάς",
    eyebrow: "Εχεμύθεια - Αξιοπιστία",
    title: <>Δικηγορικό Γραφείο<br />Φώτιος Αργυρόπουλος</>,
    description: "«Summum jus, summa injuria»",
    image: "/images/home/office-practice.jpg",
    alt: "Νομική βιβλιοθήκη και άγαλμα της Θέμιδος στο δικηγορικό γραφείο",
    position: "center center",
  },
  {
    href: "/viografiko",
    button: "Δείτε το βιογραφικό",
    eyebrow: "Γνώση · Συνέπεια · Προσωπική προσέγγιση",
    title: <>Φώτιος<br />Αργυρόπουλος</>,
    description: "Νομική υποστήριξη με σαφήνεια, υπευθυνότητα και σταθερή παρουσία σε κάθε στάδιο.",
    image: "/images/home/hero-biography.webp",
    alt: "Ο δικηγόρος Φώτιος Αργυρόπουλος στο γραφείο του",
    position: "center 30%",
  },
  {
    href: "/epikoinonia",
    button: "Επικοινωνήστε μαζί μας",
    eyebrow: "Το πρώτο βήμα ξεκινά με μια συζήτηση",
    title: <>Είμαστε εδώ<br />για την υπόθεσή σας</>,
    description: "Επικοινωνήστε με το γραφείο για να προγραμματίσουμε την πρώτη μας συνάντηση.",
    image: "/images/home/hero-contact.jpg",
    alt: "Επαγγελματική συνάντηση και χειραψία",
    position: "center center",
  },
] as const;

export function HomeHeroSlider() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<number | null>(null);
  const drag = useRef({ pointerId: -1, startX: 0, startY: 0 });

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  }, []);
  const move = useCallback((direction: number) => {
    setActive((value) => (value + direction + slides.length) % slides.length);
  }, []);
  const start = useCallback(() => {
    stop();
    if (root.current?.matches(":hover") || root.current?.contains(document.activeElement)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return;
    timer.current = window.setInterval(() => move(1), 7500);
  }, [move, stop]);

  useEffect(() => {
    start();
    const visibility = () => document.hidden ? stop() : start();
    document.addEventListener("visibilitychange", visibility);
    return () => { stop(); document.removeEventListener("visibilitychange", visibility); };
  }, [start, stop]);

  useEffect(() => {
    const preloaders = slides.slice(1).map((slide) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = slide.image;
      return image;
    });
    return () => preloaders.forEach((image) => { image.src = ""; });
  }, []);

  useGSAP(() => {
    const current = root.current?.querySelector<HTMLElement>(`[data-hero-slide="${active}"]`);
    const copy = root.current?.querySelector<HTMLElement>("[data-hero-copy]");
    if (!current || !copy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = copy.querySelectorAll("[data-hero-reveal]");
    const timeline = gsap.timeline()
      .fromTo(current, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" }, { autoAlpha: 1, clipPath: "inset(0)", duration: 1.05, ease: "power4.inOut" })
      .fromTo(targets, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .72, stagger: .1, ease: "power3.out" }, "-=.56");
    return () => timeline.kill();
  }, { scope: root, dependencies: [active], revertOnUpdate: true });

  const slide = slides[active];
  const select = (index: number) => { setActive(index); start(); };
  const beginDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as Element).closest("a,button")) return;
    stop();
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* optional on touch browsers */ }
  };
  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    const x = event.clientX - drag.current.startX;
    const y = event.clientY - drag.current.startY;
    drag.current.pointerId = -1;
    if (Math.abs(x) >= 55 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
    start();
  };

  return (
    <section ref={root} className="home-hero" aria-roledescription="carousel" aria-label="Κύριες πληροφορίες δικηγορικού γραφείου" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }} onMouseEnter={stop} onMouseLeave={start} onFocusCapture={stop} onBlurCapture={start} onPointerDown={beginDrag} onPointerUp={endDrag} onPointerCancel={start}>
      <div className="home-hero__slides" aria-live="off">
        {slides.map((item, index) => (
          <ParallaxMedia key={item.href} className="home-hero__media">
            <div data-hero-slide={index} data-active={index === active ? "true" : undefined} className="home-hero__slide" aria-hidden={index !== active}>
              <Image src={item.image} alt={index === active ? item.alt : ""} fill priority={index === 0} sizes="100vw" style={{ objectPosition: item.position }} />
            </div>
          </ParallaxMedia>
        ))}
        <span className="home-hero__overlay" aria-hidden="true" />
      </div>

      <div key={slide.href} className="home-hero__content" data-hero-copy>
        <p className="home-hero__eyebrow" data-hero-reveal>{slide.eyebrow}</p>
        <h1 id="home-title" className="home-hero__title" data-hero-reveal>{slide.title}</h1>
        <p className="home-hero__intro" data-hero-reveal>{slide.description}</p>
        <div data-hero-reveal><EditorialButton href={slide.href} label={slide.button} /></div>
      </div>

      <button className="home-hero__arrow home-hero__arrow--previous" type="button" onClick={() => { move(-1); start(); }} aria-label="Προηγούμενη διαφάνεια"><ArrowLeft /></button>
      <button className="home-hero__arrow home-hero__arrow--next" type="button" onClick={() => { move(1); start(); }} aria-label="Επόμενη διαφάνεια"><ArrowRight /></button>
      <div className="home-hero__pagination" aria-label="Επιλογή διαφάνειας">
        {slides.map((item, index) => <button key={item.href} type="button" onClick={() => select(index)} aria-label={`Διαφάνεια ${index + 1}`} aria-current={index === active ? "true" : undefined} />)}
      </div>
    </section>
  );
}
