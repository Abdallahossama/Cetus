import SectionReveal from "./SectionReveal";
import ParallaxImage from "./ParallaxImage";

const stats = [
  { value: "12+", label: "Years of practice" },
  { value: "180", label: "Projects delivered" },
  { value: "9", label: "Design awards" },
];

export default function About() {
  return (
    <section id="about" className="bg-velvet relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Editorial image */}
          <SectionReveal className="relative order-2 lg:order-1">
            <ParallaxImage
              src="/Residential/IMG_1685.JPG"
              alt="A double-height loft with a mezzanine, exposed brick and a teal modular sofa"
              className="aspect-[4/5] rounded-sm bg-ink"
              amount={50}
            />
            <div className="card-luxe absolute -bottom-6 -right-6 hidden rounded-sm px-6 py-5 shadow-[0_30px_60px_-30px_rgba(10,17,36,0.6)] sm:block">
              <p className="text-foil font-serif text-2xl">Cetus</p>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-beige-dim">
                Est. 2013
              </p>
            </div>
          </SectionReveal>

          {/* Copy */}
          <SectionReveal className="order-1 flex flex-col justify-center lg:order-2" delay={0.1}>
            <p className="eyebrow">The Studio</p>
            <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.1] text-beige sm:text-5xl">
              We design interiors that feel inevitable.
            </h2>
            <p className="mt-6 text-base leading-[1.75] text-beige-dim">
              Cetus Design is a multidisciplinary studio working across
              residential, hospitality and workplace interiors. We believe a
              well-designed space should feel effortless — balanced in light,
              proportion and material, and grounded in how people actually live
              and work.
            </p>
            <p className="mt-4 text-base leading-[1.75] text-beige-dim">
              From a single room to a full property, every project is led
              personally and delivered with the same attention to craft.
            </p>

            <div className="hairline my-9" />

            <dl className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-foil font-serif text-4xl sm:text-5xl">
                    {s.value}
                  </dt>
                  <dd className="font-cinzel mt-2 text-[11px] uppercase tracking-[0.16em] text-beige-dim">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
