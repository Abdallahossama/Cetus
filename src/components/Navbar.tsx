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
          ? "bg-navy/90 backdrop-blur-md border-b border-gold/15"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a
          href="#top"
          className="font-serif text-xl tracking-[0.2em] text-cream"
          aria-label={`${site.name} home`}
        >
          CETUS
          <span className="text-gold">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group flex items-center gap-2 text-sm tracking-wide text-cream/80 transition-colors hover:text-gold"
              >
            
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold-soft md:inline-flex"
        >
          <IconCalendarEvent size={17} stroke={1.7} aria-hidden="true" />
          Book a Consultation
        </a>

        {/* Mobile toggle — 44px+ touch target */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-gold/10 bg-navy/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 text-base text-cream/90 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="py-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-navy"
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
