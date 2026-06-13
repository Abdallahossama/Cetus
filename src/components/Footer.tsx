import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-beige/75">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a
              href="#top"
              className="text-foil font-serif text-3xl tracking-[0.18em]"
            >
              CETUS
            </a>
            <p className="mt-5 max-w-xs text-sm leading-[1.75] text-beige-dim">
              {site.tagline} crafting refined residential and commercial
              interiors from concept to completion.
            </p>
          </div>

          <div>
            <h3 className="eyebrow">Explore</h3>
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
            <h3 className="eyebrow">Studio</h3>
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
              <li className="text-ivory/60">{site.address}</li>
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
        <p className="mt-6 text-xs text-ivory/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
