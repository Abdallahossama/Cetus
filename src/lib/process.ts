import { Search, PencilRuler, Sparkles, type LucideIcon } from "lucide-react";

export type Phase = {
  no: string;
  kicker: string;
  title: string;
  duration: string;
  description: string;
  steps: string[];
  deliverable: string;
  icon: LucideIcon;
  img: string;
  alt: string;
};

export const phases: Phase[] = [
  {
    no: "01",
    kicker: "Discover",
    title: "Listen, gather & understand",
    duration: "1–2 weeks",
    description:
      "Every project begins with information. We learn how you live, survey the space and align on budget — so the design is grounded in reality, not guesswork.",
    steps: [
      "Discovery call & detailed brief",
      "Lifestyle & inspiration questionnaire",
      "Site survey and measurements",
      "Budget, scope & timeline agreed",
    ],
    deliverable: "A signed brief, measured survey and an agreed budget.",
    icon: Search,
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    alt: "Designers reviewing plans and material samples at a table",
  },
  {
    no: "02",
    kicker: "Design",
    title: "Concept, plan & visualise",
    duration: "3–5 weeks",
    description:
      "We translate the brief into space plans, mood boards and photoreal 3D visuals — refining materials and finishes until you can see the finished room before we build it.",
    steps: [
      "Space planning & mood boards",
      "3D visuals, materials & finishes",
      "Lighting & furniture specification",
      "Detailed drawings signed off",
    ],
    deliverable: "Space plans, 3D visuals and a full finishes schedule.",
    icon: PencilRuler,
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    alt: "Refined modern living room rendered with warm natural light",
  },
  {
    no: "03",
    kicker: "Deliver",
    title: "Build, style & hand over",
    duration: "6–12 weeks",
    description:
      "We manage procurement, contractors and installation, then style the finished space down to the last detail — and walk you through a home ready to live in.",
    steps: [
      "Procurement & on-site management",
      "Trade coordination & quality checks",
      "Final styling, art & furnishing",
      "Snagging, walkthrough & handover",
    ],
    deliverable: "A fully built, styled and handover-ready space.",
    icon: Sparkles,
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
    alt: "Beautifully styled bedroom with layered textiles and soft lighting",
  },
];
