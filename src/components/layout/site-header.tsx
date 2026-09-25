"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LetterHoverLink } from "@/components/ui/letter-hover-link";

const navigation = [
  { href: "/", label: "Αρχική" },
  { href: "/about-us", label: "Το γραφείο" },
  { href: "/viografiko", label: "Βιογραφικό" },
  { href: "/ypiresies", label: "Υπηρεσίες" },
  { href: "/poreia-diacheirisis-ypotheseon", label: "Πορεία υποθέσεων" },
  { href: "/epikoinonia", label: "Επικοινωνία" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY >= 150);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const focusTimer = open
      ? window.setTimeout(() => menu.current?.querySelector<HTMLAnchorElement>("nav a")?.focus(), 50)
      : undefined;
    return () => {
      document.documentElement.style.overflow = "";
      if (focusTimer) window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header" data-open={open ? "true" : undefined} data-scrolled={scrolled ? "true" : undefined}>
      <Link href="/" className="site-header__logo" aria-label="Φώτιος Αργυρόπουλος — Αρχική" onClick={() => setOpen(false)}>
        <Image src="/images/logo/argiropouloslaw-logo.png" alt="Φώτιος Αργυρόπουλος, Δικηγόρος Θεσσαλονίκης" width={788} height={147} priority />
      </Link>
      <button ref={menuButton} className="site-header__menu-button" type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((value) => !value)}>
        <span>{open ? "Κλείσιμο" : "Μενού"}</span>
        <span aria-hidden="true">{open ? <X /> : <Menu />}</span>
      </button>

      <div ref={menu} id="site-menu" className="site-menu" aria-hidden={!open}>
        <nav aria-label="Κύρια πλοήγηση">
          {navigation.map((item, index) => (
            <LetterHoverLink key={item.href} href={item.href} leadingVisual={<span>0{index + 1}</span>} tabIndex={open ? undefined : -1} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </LetterHoverLink>
          ))}
        </nav>
        <div className="site-menu__foot">
          <p>Στρατηγού Μακρυγιάννη 66<br />564 31 Θεσσαλονίκη</p>
          <p><a href="tel:+306955238770">+30 695 523 8770</a><br /><a href="mailto:argiropouloslaw@gmail.com">argiropouloslaw@gmail.com</a></p>
        </div>
      </div>
    </header>
  );
}
