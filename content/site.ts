// All portfolio copy lives here. Edit this file (or ask Claude) to change the site text.
// Placeholder content: replace the projects, services and contact details with real ones.

export const site = {
  name: "Noisy Studio",
  domain: "noisystudio.com.au",
  tagline: "Brand, design and digital work that refuses to sit quietly.",
  intro:
    "Noisy Studio is an independent creative studio based in Melbourne. We build brands, campaigns and digital experiences for people who want to be noticed.",
  email: "hello@noisystudio.com.au",
  location: "Melbourne, Australia",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  summary: string;
  body: string[];
  // Two colours used for the cover until real images are added to /public/work/
  colors: [string, string];
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    client: "Client name",
    year: "2026",
    category: "Branding",
    summary: "A full identity system: logo, type, colour and launch assets.",
    body: [
      "Describe the brief in two or three sentences: who the client is and what they needed.",
      "Explain the idea behind the work and the main decisions you made.",
      "Close with the result: where it launched and what changed for the client.",
    ],
    colors: ["#ff3b30", "#1a1a1a"],
  },
  {
    slug: "project-two",
    title: "Project Two",
    client: "Client name",
    year: "2026",
    category: "Campaign",
    summary: "A multi-channel campaign across social, print and outdoor.",
    body: ["Brief.", "Idea.", "Result."],
    colors: ["#2747ff", "#ffd84a"],
  },
  {
    slug: "project-three",
    title: "Project Three",
    client: "Client name",
    year: "2025",
    category: "Packaging",
    summary: "Packaging and shelf design for a product range.",
    body: ["Brief.", "Idea.", "Result."],
    colors: ["#ffd84a", "#ff3b30"],
  },
  {
    slug: "project-four",
    title: "Project Four",
    client: "Client name",
    year: "2025",
    category: "Digital",
    summary: "Website design and build with a custom content system.",
    body: ["Brief.", "Idea.", "Result."],
    colors: ["#111111", "#2747ff"],
  },
  {
    slug: "project-five",
    title: "Project Five",
    client: "Client name",
    year: "2025",
    category: "3D & Motion",
    summary: "3D product renders and short motion pieces for launch.",
    body: ["Brief.", "Idea.", "Result."],
    colors: ["#7d8cff", "#111111"],
  },
  {
    slug: "project-six",
    title: "Project Six",
    client: "Client name",
    year: "2024",
    category: "Publishing",
    summary: "Cover and interior design for a book series.",
    body: ["Brief.", "Idea.", "Result."],
    colors: ["#1a1a1a", "#ffd84a"],
  },
];

export const services = [
  { title: "Brand identity", text: "Naming, logos, visual systems and guidelines." },
  { title: "Campaigns & ads", text: "Concepts and assets for social, print and outdoor." },
  { title: "Digital", text: "Websites, landing pages and content systems." },
  { title: "3D & motion", text: "Product renders, animation and short-form video." },
];
