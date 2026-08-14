import heroTryOn from "@/assets/hero-tryon.jpg";
import tryOnProduct from "@/assets/tryon-product.jpg";
import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Tag } from "./kit";

export function TryOn() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section id="try-on">
      <div
        ref={ref}
        data-shown={shown}
        className="reveal grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div>
          <Eyebrow>How it looks on you</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
            The catalog photo is the least useful photo.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-secondary-foreground">
            Upload a few photos once. From then on every piece apt shows you is
            rendered on your body, your proportions, your skin tone. You stop
            guessing whether it works and start deciding whether you like it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Tag>Clothing</Tag>
            <Tag>Shoes</Tag>
            <Tag>Bags</Tag>
            <Tag>Accessories</Tag>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
            <img
              src={tryOnProduct}
              alt="Cream oversized wool coat photographed flat as a product shot"
              width={896}
              height={1152}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <figcaption className="px-4 py-3 text-[13px] text-muted-foreground">
              The product
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-lg border border-border-agent bg-card shadow-[var(--shadow-raise)]">
            <img
              src={heroTryOn}
              alt="The same coat rendered on Maya by apt"
              width={896}
              height={1152}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <figcaption className="px-4 py-3 text-[13px] text-agent-foreground">
              On you
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
