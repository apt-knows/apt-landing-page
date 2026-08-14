import { AgentMark, Section } from "./kit";
import { WaitlistForm } from "./waitlist-form";

export function EarlyAccess() {
  return (
    <Section id="early-access">
      <div className="mx-auto max-w-2xl text-center">
        <AgentMark size={32} className="mx-auto" />
        <h2 className="mt-6 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
          Be there when apt opens.
        </h2>
        <p className="mt-4 text-[17px] leading-[1.6] text-secondary-foreground">
          We're letting people in slowly so the recommendations stay sharp. Leave
          your email and we'll reach out with your invite.
        </p>
        <div className="mx-auto mt-8 max-w-lg text-left">
          <WaitlistForm id="cta-email" size="lg" />
        </div>
      </div>
    </Section>
  );
}
