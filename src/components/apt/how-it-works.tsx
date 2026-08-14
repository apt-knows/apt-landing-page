import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Wordmark } from "./kit";

const steps = [
  {
    step: "01",
    real: "You walk into a store",
    apt: "You open the Fitting Room — an endless, ranked scroll of pieces picked for you.",
  },
  {
    step: "02",
    real: "Something catches your eye",
    apt: "The first frame of every carousel is the product itself, shot clean.",
  },
  {
    step: "03",
    real: "You try it on",
    apt: "Keep swiping and the same piece appears on you, generated from your photos.",
  },
  {
    step: "04",
    real: "You keep it or leave it",
    apt: (
      <>
        Add to cart, or scroll away — either way <Wordmark /> learns and the next
        look gets sharper.
      </>
    ),
  },
];

export function HowItWorks() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section id="how">
      <Eyebrow>How it works</Eyebrow>
      <h2 className="mt-4 max-w-[20ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        The real shopping loop, rebuilt in your pocket.
      </h2>

      <div
        ref={ref}
        data-shown={shown}
        className="reveal mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((item) => (
          <div key={item.step} className="bg-card p-6">
            <span className="eyebrow text-signal-ink">{item.step}</span>
            <p className="mt-4 text-[17px] font-medium tracking-[-0.012em]">
              {item.real}
            </p>
            <p className="mt-2 text-[15px] leading-[1.6] text-secondary-foreground">
              {item.apt}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
