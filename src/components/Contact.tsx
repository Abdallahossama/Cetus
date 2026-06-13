"use client";

import { useState, type FormEvent } from "react";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCheck,
  IconSend,
  IconChevronDown,
  IconClockHour4,
} from "@tabler/icons-react";
import { site } from "@/lib/site";

type Errors = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
};
type Status = "idle" | "submitting" | "success";

const projectTypes = ["Residential", "Commercial", "Hospitality", "Other"];

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const projectType = String(data.get("projectType") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (!projectType) next.projectType = "Please choose a project type.";
    if (message.length < 10)
      next.message = "Tell us a little more (at least 10 characters).";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(new FormData(form));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 900)); // front-end demo
    setStatus("success");
    form.reset();
  }

  const field =
    "mt-2 w-full rounded-sm border bg-white/80 px-4 py-3 text-cream placeholder-cream/35 transition-colors focus:border-gold focus:outline-none";
  const border = (err?: string) => (err ? "border-red-500" : "border-navy/15");

  return (
    <section id="contact" className="bg-velvet grain relative py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Intro + details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Let&apos;s Talk</p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-cream sm:text-4xl lg:text-5xl">
              Start the conversation.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream/75">
              Tell us about your space and what you have in mind. We&apos;ll arrange an
              initial consultation to explore how we can help.
            </p>

            <ul className="mt-10 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <IconMail size={18} className="text-gold" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconPhone size={18} className="text-gold" aria-hidden="true" />
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconMapPin size={18} className="text-gold" aria-hidden="true" />
                <span className="text-cream/75">{site.address}</span>
              </li>
            </ul>

            <div className="hairline my-8 max-w-xs" />
            <p className="flex items-center gap-2 text-sm text-cream/60">
              <IconClockHour4 size={16} className="text-gold" aria-hidden="true" />
              We reply within two working days.
            </p>
          </div>

          {/* Form card */}
          <form
            noValidate
            onSubmit={handleSubmit}
            className="rounded-sm border border-gold/25 bg-white/70 p-6 shadow-[0_30px_70px_-40px_rgba(31,42,68,0.45)] backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <h3 className="font-serif text-xl text-cream">Request a consultation</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/40">
              Fields marked <span className="text-gold">*</span> are required
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm text-cream/80">
                  Name <span className="text-gold">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`${field} ${border(errors.name)}`}
                  placeholder="Jane Doe"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-cream/80">
                  Email <span className="text-gold">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`${field} ${border(errors.email)}`}
                  placeholder="jane@email.com"
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="text-sm text-cream/80">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={`${field} ${border()}`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="text-sm text-cream/80">
                  Project type <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="projectType"
                    name="projectType"
                    defaultValue=""
                    aria-invalid={Boolean(errors.projectType)}
                    aria-describedby={errors.projectType ? "type-error" : undefined}
                    className={`${field} appearance-none pr-10 ${border(errors.projectType)}`}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-ink text-cream">
                        {t}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold"
                    aria-hidden="true"
                  />
                </div>
                {errors.projectType && (
                  <p id="type-error" role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.projectType}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="text-sm text-cream/80">
                About your project <span className="text-gold">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`${field} resize-none ${border(errors.message)}`}
                placeholder="A two-bedroom apartment we'd love to refresh…"
              />
              {errors.message && (
                <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-gold mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-medium disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/40 border-t-navy" />
                  Sending…
                </>
              ) : status === "success" ? (
                <>
                  <IconCheck size={18} aria-hidden="true" />
                  Sent
                </>
              ) : (
                <>
                  <IconSend size={18} aria-hidden="true" />
                  Send Enquiry
                </>
              )}
            </button>

            <div aria-live="polite" className="min-h-6">
              {status === "success" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-gold">
                  <IconCheck size={16} aria-hidden="true" />
                  Thank you — we&apos;ll be in touch within two working days.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
