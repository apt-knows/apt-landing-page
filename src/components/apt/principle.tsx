import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Wordmark } from "./kit";

export function Principle() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section className="bg-card">
      <div
        ref={ref}
        data-shown={shown}
        className="reveal"
      >
        <div>
          <Eyebrow>
            The <Wordmark className="lowercase! text-[16px]!" /> idea
          </Eyebrow>
          <p className="mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
            Shopping used to mean trying it on. We're bringing that back.
          </p>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.6] text-secondary-foreground">
            Online, you scroll through thousands of things on people who aren't
            you, guess your size, and send half of it back. <Wordmark /> brings back the
            part that made shopping work: you see something, you see it on you,
            you decide — in your pocket, with a store that already knows your
            taste.
          </p>
        </div>
      </div>
    </Section>
  );
}
