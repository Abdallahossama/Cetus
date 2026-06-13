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
    <section id="services" className="bg-navy py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal className="max-w-2xl">
          <p className="eyebrow">What We Do</p>
          <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.1] text-beige sm:text-5xl">
            A complete interior service.
          </h2>
        </SectionReveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-gold/20 bg-gold/20 sm:grid-cols-2">
          {services.map((service, i) => (
            <SectionReveal
              key={service.title}
              as="article"
              delay={i * 0.08}
              className="group bg-navy-2 p-8 transition-colors duration-300 hover:bg-royal/35 lg:p-10"
            >
              <service.icon
                size={30}
                strokeWidth={1.4}
                className="text-gold"
                aria-hidden="true"
              />
              <h3 className="mt-6 font-serif text-2xl text-beige">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.7] text-beige-dim">
                {service.description}
              </p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
