/**
 * SITE CONFIG
 * ------------------------------------------------------------------
 * Names, links and people. Anything here is safe to edit without
 * touching component code.
 *
 * The canonical production origin is intentionally explicit. Preview hosts
 * should still publish production canonical/OG URLs.
 */

import { assets } from "./assets";

export const site = {
  /** Product name, always rendered lowercase. */
  name: "apt",
  tagline: "Shopping that's about you.",
  description:
    "apt is a personal shopping agent that learns your taste and shows you how every piece looks on you before you buy.",
  /** Absolute production origin, no trailing slash. */
  url: "https://aptknows.com",
} as const;

export type ContactLink = {
  /** Short label: Instagram, LinkedIn, X, Email. */
  label: string;
  /** Handle shown next to the label, e.g. "@robelbruk_". */
  handle: string;
  /** Full URL (or mailto:) the row links to. */
  url: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Swap the import in `content/assets.ts` for a real portrait. */
  image: string;
  blurb: string;
  /** Reach-the-founder rows rendered under the portrait. */
  contact: ContactLink[];
};

export const team: TeamMember[] = [
  {
    name: "Robel Bruk",
    role: "Co-founder & CEO",
    image: assets.team.ceo,
    blurb:
      "Product and taste. Obsessed with what makes a recommendation feel personal.",
    contact: [
      { label: "Email", handle: "robelbruk4@gmail.com", url: "mailto:robelbruk4@gmail.com" },
      { label: "LinkedIn", handle: "in/robel-bruk", url: "https://www.linkedin.com/in/robel-bruk/" },
      { label: "Instagram", handle: "@robelbruk_", url: "https://instagram.com/robelbruk_" },
      { label: "X", handle: "@robelbruk", url: "https://x.com/robelbruk" },
    ],
  },
  {
    name: "Robel Kebede",
    role: "Co-founder & CTO",
    image: assets.team.cto,
    blurb:
      "Ranking, try-on generation, and the systems that learn from every scroll.",
    contact: [
      { label: "Email", handle: "robiemelaku@gmail.com", url: "mailto:robiemelaku@gmail.com" },
      { label: "LinkedIn", handle: "in/robel-m-kebede", url: "https://www.linkedin.com/in/robel-m-kebede/" },
      { label: "Instagram", handle: "@robiee__m", url: "https://instagram.com/robiee__m" },
      { label: "X", handle: "@robelmkebede", url: "https://x.com/robelmkebede" },
    ],
  },
];
