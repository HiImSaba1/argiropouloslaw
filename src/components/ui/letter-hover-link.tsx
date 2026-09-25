"use client";

import type { ComponentProps, ReactNode, RefObject } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/animations/gsap";

type LetterHoverLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: string;
  leadingVisual?: ReactNode;
  trailingVisual?: ReactNode;
};

function useMenuLetterHoverAnimation(ref: RefObject<HTMLAnchorElement | null>, contentKey: string) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const staticContainer = el.querySelector<HTMLElement>("[data-hover-text-base]");
    const activeContainer = el.querySelector<HTMLElement>("[data-hover-text-active]");
    if (!staticContainer || !activeContainer) return;

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 48.001rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        // 1. Split the text into individual characters
        const staticSplit = new SplitText(staticContainer, { type: "chars" });
        const activeSplit = new SplitText(activeContainer, { type: "chars" });

        // 2. Set initial layout states
        gsap.set(staticSplit.chars, { yPercent: 0 });
        gsap.set(activeSplit.chars, { yPercent: 100 });

        const timeline = gsap.timeline({
          paused: true,
          defaults: { duration: 0.3, ease: "power3.inOut", overwrite: "auto" },
        });

        timeline
          .to(staticSplit.chars, { yPercent: -150, stagger: 0.009 }, 0)
          .to(activeSplit.chars, { yPercent: 0, stagger: 0.009 }, 0);

        const enter = () => timeline.play();
        const leave = () => timeline.reverse();

        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        el.addEventListener("focus", enter);
        el.addEventListener("blur", leave);

        return () => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
          el.removeEventListener("focus", enter);
          el.removeEventListener("blur", leave);
          timeline.kill();
          staticSplit.revert();
          activeSplit.revert();
        };
      }
    );

    return () => media.revert();
  }, { scope: ref, dependencies: [contentKey] });
}

export function LetterHoverLink({ children, leadingVisual, trailingVisual, ...props }: LetterHoverLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMenuLetterHoverAnimation(ref, children);

  return (
    <Link ref={ref} {...props} aria-label={props["aria-label"] ?? children}>
      {leadingVisual}
      <span className="letter-hover-link__text">
        <span data-hover-text-base>{children}</span>
        <span data-hover-text-active aria-hidden="true">{children}</span>
      </span>
      {trailingVisual}
    </Link>
  );
}