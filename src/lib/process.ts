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
    img: "/Residential/IMG_1671.JPG",
    alt: "Living room shown half as a technical concept drawing and half as a finished render",
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
    img: "/Business/IMG_1674.JPG",
    alt: "Fine-dining restaurant with blue-and-white tile arches, marble floors and velvet chairs",
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
    img: "/Residential/IMG_1693.JPG",
    alt: "Whitewashed courtyard lounge with a sunken firepit, floor cushions and tropical planting",
  },
];
