"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { IconCalendarEvent } from "@tabler/icons-react";
import { navLinks, site } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-ink/85 backdrop-blur-md border-b border-gold/20 shadow-[0_8px_30px_-18px_rgba(31,42,68,0.35)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a
          href="#top"
          className="text-foil font-serif text-2xl tracking-[0.18em]"
          aria-label={`${site.name} home`}
        >
          CETUS
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-cinzel relative text-[12px] uppercase tracking-[0.18em] text-beige/75 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-gold hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="btn-outline font-cinzel hidden items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] md:inline-flex"
        >
          <IconCalendarEvent size={16} stroke={1.7} aria-hidden="true" />
          Book a Consultation
        </a>

        {/* Mobile toggle — 44px+ touch target */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-beige md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-gold/15 bg-ink/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-cinzel flex items-center gap-3 py-3 text-sm uppercase tracking-[0.18em] text-beige/85 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="py-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-outline font-cinzel inline-flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.18em]"
            >
              <IconCalendarEvent size={18} stroke={1.7} aria-hidden="true" />
              Book a Consultation
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
