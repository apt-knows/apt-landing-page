import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Wordmark } from "./kit";

const steps = [
  {
    step: "01",
    real: "You walk into a store",
    apt: "Open the Fitting Room — an endless, ranked scroll of pieces picked for you.",
  },
  {
    step: "02",
    real: "Something catches your eye",
    apt: "Scroll your personal feed until you find something you like",
  },
  {
    step: "03",
    real: "You try it on",
    apt: "Swipe left to see how it would actually look on you",
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
      <Eyebrow>
        How <Wordmark className="lowercase! text-[1.35em]!" /> works
      </Eyebrow>
      <h2 className="mt-4 max-w-[20ch] text-[clamp(1.5rem,1.15rem+1.6vw,2.75rem)] text-balance leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        The real shopping loop, rebuilt in your pocket.
      </h2>

      <div
        ref={ref}
        data-shown={shown}
        className="reveal mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((item) => (
          <div key={item.step} className="bg-card p-5 sm:p-6 lg:p-7">
            <span className="eyebrow text-signal-ink">{item.step}</span>
            <p className="mt-3 text-[clamp(1rem,0.95rem+0.2vw,1.0625rem)] font-medium sm:mt-4 tracking-[-0.012em]">
              {item.real}
            </p>
            <p className="mt-2 text-[clamp(0.9rem,0.87rem+0.15vw,0.95rem)] leading-[1.6] text-secondary-foreground">
              {item.apt}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
