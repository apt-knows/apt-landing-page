/**
 * SITE CONFIG
 * ------------------------------------------------------------------
 * Names, links and people. Anything here is safe to edit without
 * touching component code.
 *
 * `siteUrl` comes from the `VITE_SITE_URL` env var (see `.env.example`) so
 * the same build works on preview, staging and the production domain.
 */

import { assets } from "./assets";

export const site = {
  /** Product name, always rendered lowercase. */
  name: "apt",
  tagline: "Shopping that's about you.",
  description:
    "apt is a personal shopping agent that learns your taste and shows you how every piece looks on you before you buy.",
  /** Absolute origin, no trailing slash. */
  url: (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(
    /\/$/,
    "",
  ) ?? "https://apt.app",
  /** Public contact address shown in the footer and legal pages. */
  contactEmail:
    (import.meta.env["VITE_CONTACT_EMAIL"] as string | undefined) ??
    "hello@apt.app",
} as const;

export type TeamMember = {
  name: string;
  role: string;
  /** Swap the import in `content/assets.ts` for a real portrait. */
  image: string;
  blurb: string;
};

export const team: TeamMember[] = [
  {
    name: "Robel Bruk",
    role: "Co-founder & CEO",
    image: assets.team.ceo,
    blurb:
      "Product and taste. Obsessed with what makes a recommendation feel personal.",
  },
  {
    name: "Robel Kebede",
    role: "Co-founder & CTO",
    image: assets.team.cto,
    blurb:
      "Ranking, try-on generation, and the systems that learn from every scroll.",
  },
];
