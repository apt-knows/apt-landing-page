import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section } from "./kit";

export function Principle() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section className="bg-card">
      <div
        ref={ref}
        data-shown={shown}
        className="reveal grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20"
      >
        <div>
          <Eyebrow>The idea</Eyebrow>
          <p className="mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
            Shopping used to mean trying it on. We're bringing that back.
          </p>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.6] text-secondary-foreground">
            Online, you scroll through thousands of things on people who aren't
            you, guess your size, order three, and send two back. apt rebuilds the
            part that actually made shopping work: you walk in, you see something,
            you see it on you, and you decide. Same feeling as your favourite
            store — just in your pocket, and it already knows your taste.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <AgentNote label="I noticed">
            You've skipped every jacket with visible branding — I'll hide those.
          </AgentNote>
          <AgentNote label="My reasoning">
            Ranked by fit and fabric because your last three keeps were oversized
            wool.
          </AgentNote>
          <AgentNote label="Not sure" tone="neutral">
            I don't have enough signal on sleeve length yet — assuming regular fit.
          </AgentNote>
        </div>
      </div>
    </Section>
  );
}
