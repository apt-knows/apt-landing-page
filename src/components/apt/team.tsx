import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";

import { team, type ContactLink } from "@/content/site";

import { Eyebrow, Section, Wordmark } from "./kit";

const contactIcon = (label: string) => {
  switch (label) {
    case "Instagram":
      return Instagram;
    case "LinkedIn":
      return Linkedin;
    case "X":
      return Twitter;
    case "Email":
      return Mail;
    default:
      return Mail;
  }
};

function ContactRow({ c }: { c: ContactLink }) {
  const Icon = contactIcon(c.label);
  return (
    <a
      href={c.url}
      target={c.url.startsWith("mailto:") ? undefined : "_blank"}
      rel={c.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="group flex items-center gap-2.5 text-[14px] leading-[1.4]"
    >
      <Icon size={15} className="shrink-0 text-secondary-foreground transition-colors group-hover:text-signal" />
      <span className="font-medium text-foreground transition-colors group-hover:text-signal">
        {c.handle}
      </span>
    </a>
  );
}

/** People come from `src/content/site.ts`; portraits from `src/content/assets.ts`. */

export function Team() {
  return (
    <Section id="team" className="bg-card">
      <Eyebrow>Team</Eyebrow>
      <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Meet the <Wordmark /> team
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
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {member.contact.map((c) => (
                  <ContactRow key={c.label} c={c} />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
