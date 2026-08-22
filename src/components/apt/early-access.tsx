import { AgentMark, Section, Wordmark } from "./kit";
import { WaitlistForm } from "./waitlist-form";

export function EarlyAccess() {
  return (
    <Section id="early-access">
      <div className="mx-auto max-w-2xl text-center">
        <AgentMark size={32} className="mx-auto" />
        <h2 className="mt-6 text-[clamp(1.5rem,1.15rem+1.6vw,2.75rem)] text-balance leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
          Be there when <Wordmark /> opens.
        </h2>
        <p className="mt-4 text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-[1.6] text-secondary-foreground">
          We're letting people in slowly so the recommendations stay sharp. Leave
          your email and we'll reach out with your invite.
        </p>
        <div className="mx-auto mt-7 max-w-lg text-left sm:mt-8">
          <WaitlistForm id="cta-email" size="lg" />
        </div>
      </div>
    </Section>
  );
}
