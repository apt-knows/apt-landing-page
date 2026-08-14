import teamCeo from "@/assets/team-ceo.jpg";
import teamCto from "@/assets/team-cto.jpg";

import { Eyebrow, Section } from "./kit";

/**
 * Swap `image` for a real portrait (drop the file in src/assets and change the
 * import) — nothing else needs to move.
 */
const team = [
  {
    name: "Robel Bruk",
    role: "Co-founder & CEO",
    image: teamCeo,
    blurb: "Product and taste. Obsessed with what makes a recommendation feel personal.",
  },
  {
    name: "Robel Kebede",
    role: "Co-founder & CTO",
    image: teamCto,
    blurb: "Ranking, try-on generation, and the systems that learn from every scroll.",
  },
];

export function Team() {
  return (
    <Section id="team" className="bg-card">
      <Eyebrow>Team</Eyebrow>
      <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Meet the apt team
      </h2>


      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        {team.map((member) => (
          <article
            key={member.name}
            className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]"
          >
            <img
              src={member.image}
              alt={`Portrait of ${member.name}`}
              width={768}
              height={768}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-[17px] font-semibold tracking-[-0.012em]">
                {member.name}
              </h3>
              <p className="mt-0.5 text-[13px] text-signal-ink">{member.role}</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-secondary-foreground">
                {member.blurb}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
