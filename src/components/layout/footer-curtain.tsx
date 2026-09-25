"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FooterCurtain({ children }: { children: ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const content = contentRef.current;
    if (!curtain || !content) return;

    const updateHeight = () => {
      curtain.style.setProperty("--footer-curtain-height", `${content.scrollHeight}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    window.addEventListener("load", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", updateHeight);
    };
  }, []);

  return (
    <div className="footer-curtain" ref={curtainRef}>
      <div className="footer-curtain__track">
        <div className="footer-curtain__sticky" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
