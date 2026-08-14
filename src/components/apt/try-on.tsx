import aModel1 from "@/assets/feed/a-model-1.jpg";
import aProduct from "@/assets/feed/a-product.jpg";
import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Tag } from "./kit";

export function TryOn() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section id="try-on">
      <div
        ref={ref}
        data-shown={shown}
        className="reveal grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div>
          <Eyebrow>How it looks on you</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
            The catalog photo is the least useful photo.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-secondary-foreground">
            Upload a few photos once. From then on, every piece in your Fitting
            Room feed is rendered on your body, your proportions, your skin tone.
            You stop guessing whether it works and start deciding whether you
            like it.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
            <img
              src={aProduct}
              alt="A cream ribbed knit crewneck photographed on its own"
              width={768}
              height={1152}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <figcaption className="px-3 py-3 text-[13px] text-muted-foreground sm:px-4">
              The product — from Everlane
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-lg border border-border-agent bg-card shadow-[var(--shadow-raise)]">
            <img
              src={aModel1}
              alt="The same crewneck rendered on Maya by apt"
              width={768}
              height={1152}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <figcaption className="px-3 py-3 text-[13px] text-agent-foreground sm:px-4">
              How it looks on you — AI generated
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
