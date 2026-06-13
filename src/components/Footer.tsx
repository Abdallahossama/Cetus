import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a
              href="#top"
              className="font-serif text-2xl tracking-[0.2em] text-cream"
            >
              CETUS<span className="text-gold">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              {site.tagline} crafting refined residential and commercial
              interiors from concept to completion.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">
              Studio
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li>{site.phone}</li>
              <li className="text-cream/60">{site.address}</li>
            </ul>
            <ul className="mt-5 flex gap-4 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition-colors hover:text-gold"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />
        <p className="mt-6 text-xs text-cream/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
