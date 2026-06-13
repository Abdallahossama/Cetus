import { Home, Building2, Sofa, PencilRuler } from "lucide-react";
import SectionReveal from "./SectionReveal";

const services = [
  {
    icon: Home,
    title: "Residential Design",
    description:
      "Full-home interiors that balance comfort and character — from layout to the final cushion.",
  },
  {
    icon: Building2,
    title: "Commercial & Hospitality",
    description:
      "Workplaces, restaurants and retail spaces designed to express a brand and move people through it.",
  },
  {
    icon: Sofa,
    title: "Styling & Furnishing",
    description:
      "Curated furniture, lighting and art — sourced, arranged and styled to bring a scheme to life.",
  },
  {
    icon: PencilRuler,
    title: "Design Consultation",
    description:
      "Focused guidance on layout, palette and materials when you want direction, not a full build.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            What We Do
          </p>
          <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-cream sm:text-5xl">
            A complete interior service.
          </h2>
        </SectionReveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-gold/25 bg-gold/25 sm:grid-cols-2">
          {services.map((service, i) => (
            <SectionReveal
              key={service.title}
              as="article"
              delay={i * 0.08}
              className="group bg-ink p-8 transition-colors duration-300 hover:bg-sand lg:p-10"
            >
              <service.icon
                size={32}
                strokeWidth={1.5}
                className="text-gold"
                aria-hidden="true"
              />
              <h3 className="mt-6 font-serif text-2xl text-cream">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">
                {service.description}
              </p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
