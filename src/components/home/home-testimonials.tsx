"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { gsap, SplitText } from "@/lib/animations/gsap";

const testimonials = [
  {
    quote: "Η συνεργασία μου με το Δικηγορικό Γραφείο Φώτη Αργυρόπουλου ήταν εξαιρετική. Αισθάνθηκα πάντα ότι οι ανάγκες μου ήταν σε καλά χέρια. Συνιστώ ανεπιφύλακτα το γραφείο για αξιόπιστη νομική υποστήριξη.",
    name: "Σταύρος Νικολάου",
    role: "Πελάτης Ποινικού Δικαίου",
  },
  {
    quote: "Ο Φώτης και η ομάδα του είναι πραγματικοί επαγγελματίες. Η εμπειρία και η γνώση τους με βοήθησαν να ξεπεράσω δύσκολες νομικές καταστάσεις. Η υποστήριξη που έλαβα ήταν εξαιρετική.",
    name: "Νικολέτα Παπά",
    role: "Νομικός Σύμβουλος",
  },
  {
    quote: "Η ομάδα του Φώτη Αργυρόπουλου ήταν δίπλα μου σε κάθε βήμα. Η καθοδήγηση και η επαγγελματική προσέγγισή τους έκαναν τη διαδικασία πολύ πιο εύκολη.",
    name: "Ελένη Συροπούλου",
    role: "Κάτοχος διαμερισμάτων",
  },
] as const;

export function HomeTestimonials() {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer.current = setInterval(() => setSelected((value) => (value + 1) % testimonials.length), 7500);
    }
  }, [stop]);

  const move = useCallback((direction: number) => {
    setSelected((value) => (value + direction + testimonials.length) % testimonials.length);
    start();
  }, [start]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  useGSAP(() => {
    const quote = root.current?.querySelector<HTMLElement>("blockquote");
    const details = root.current?.querySelectorAll<HTMLElement>("[data-testimonial-reveal]");
    if (!quote || !details) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const split = SplitText.create(quote, { type: "lines", mask: "lines" });
    const timeline = gsap.timeline()
      .fromTo(split.lines, { yPercent: 115 }, { yPercent: 0, duration: .75, stagger: .07, ease: "power4.out" })
      .fromTo(details, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .45, stagger: .06 }, "-=.35");

    return () => {
      timeline.kill();
      split.revert();
    };
  }, { scope: root, dependencies: [selected], revertOnUpdate: true });

  const item = testimonials[selected];

  return (
    <section ref={root} className="home-testimonials" aria-labelledby="home-testimonials-title" onMouseEnter={stop} onMouseLeave={start} onFocusCapture={stop} onBlurCapture={start}>
      <header>
        <p className="eyebrow">04 / Εμπιστοσύνη</p>
        <h2 id="home-testimonials-title">Λόγια ανθρώπων που μας εμπιστεύτηκαν.</h2>
      </header>
      <article key={item.name} aria-live="polite">
        <Quote aria-hidden="true" />
        <div>
          <p className="home-testimonials__count" data-testimonial-reveal>0{selected + 1} / 0{testimonials.length}</p>
          <blockquote>«{item.quote}»</blockquote>
          <p className="home-testimonials__name" data-testimonial-reveal>{item.name}</p>
          <p className="home-testimonials__role" data-testimonial-reveal>{item.role}</p>
        </div>
      </article>
      <footer>
        <div className="home-testimonials__dots" aria-label="Επιλογή μαρτυρίας">
          {testimonials.map((testimonial, index) => (
            <button key={testimonial.name} type="button" aria-label={`Μαρτυρία ${index + 1}`} aria-current={selected === index ? "true" : undefined} onClick={() => { setSelected(index); start(); }} />
          ))}
        </div>
        <div className="home-testimonials__arrows">
          <button type="button" aria-label="Προηγούμενη μαρτυρία" onClick={() => move(-1)}><ArrowLeft /></button>
          <button type="button" aria-label="Επόμενη μαρτυρία" onClick={() => move(1)}><ArrowRight /></button>
        </div>
      </footer>
    </section>
  );
}
