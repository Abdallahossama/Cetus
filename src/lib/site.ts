export const site = {
  name: "Cetus Design",
  tagline: "Interior Design Studio",
  email: "studio@cetusdesign.com",
  phone: "+1 (555) 018-2240",
  address: "Studio 04, Harbour Lane, London",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Pinterest", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "About", href: "#about", },
  { label: "Services", href: "#services", },
  { label: "Niches", href: "#niches", },
  { label: "Process", href: "#process", },
  { label: "Visualised", href: "#portfolio", },
  { label: "Contact", href: "#contact", },
];
