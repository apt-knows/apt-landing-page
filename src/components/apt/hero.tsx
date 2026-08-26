import { useEffect, useRef, useState } from "react";

import { getProduct, heroMoments } from "@/content/products";
import { cn } from "@/lib/utils";

import { Button, LinkButton, Wordmark } from "./kit";
import { RotatingWord } from "./rotating-text";
import { WaitlistForm } from "./waitlist-form";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Crossfades to a new src by fading the old image out on top. */
function CrossfadeImage({ src }: { src: string }) {
  const [leaving, setLeaving] = useState<string | null>(null);
  const previous = useRef(src);

  useEffect(() => {
    if (src === previous.current) return;
    if (!reducedMotion()) setLeaving(previous.current);
    previous.current = src;
    const done = setTimeout(() => setLeaving(null), 440);
    return () => clearTimeout(done);
  }, [src]);

  return (
    <span className="relative block aspect-[4/5]">
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {leaving ? (
        <img
          src={leaving}
          alt=""
          aria-hidden="true"
          className="img-fade absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}

/** Layout of the three fanned cards, hero-10 style but flat motion. */
const fanSlots = [
  "z-10 w-[36%] -rotate-6 translate-y-5 -mr-7 sm:-mr-9",
  "z-20 w-[42%] -translate-y-1",
  "z-10 w-[36%] rotate-6 translate-y-5 -ml-7 sm:-ml-9",
];

export function Hero() {
  const [moment, setMoment] = useState(0);
  const [joinOpen, setJoinOpen] = useState(false);
  const active = heroMoments[moment]!;

  // Rotate the headline phrase and the fan together. Preload the next
  // moment's images during the dwell so the swap never flashes. The
  // rotation rests while the email form is open — no motion behind typing.
  useEffect(() => {
    if (reducedMotion() || joinOpen) return;
    const next = (moment + 1) % heroMoments.length;
    for (const id of heroMoments[next]!.productIds) {
      new Image().src = getProduct(id).image;
    }
    const dwell = moment === 0 ? 3600 : 2400;
    const timer = setTimeout(() => setMoment(next), dwell);
    return () => clearTimeout(timer);
  }, [moment, joinOpen]);

  // The header's Join button (and /#join links) open the inline form.
  useEffect(() => {
    const open = () => setJoinOpen(true);
    window.addEventListener("apt:join", open);
    if (window.location.hash === "#join") setJoinOpen(true);
    return () => window.removeEventListener("apt:join", open);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pt-16 pb-14 text-center sm:px-8 sm:pt-24 sm:pb-16 lg:pt-28">
        <h1 className="text-[clamp(2.4rem,1.5rem+4.2vw,4.75rem)] leading-[1.06] font-bold tracking-[var(--tracking-display)] text-balance">
          Shopping{" "}
          <span className="block">
            for <span className="sr-only">{heroMoments[0]!.phrase}</span>
            <span aria-hidden="true">
              <RotatingWord word={active.phrase} />
            </span>
          </span>
        </h1>

        <p className="mt-8 max-w-[44ch] text-[clamp(1rem,0.95rem+0.35vw,1.1875rem)] leading-[1.6] text-secondary-foreground">
          <Wordmark /> is your personal shopping assistant. It learns your taste — and your people —
          then brings back the things that fit.
        </p>

        <div id="join" className="mt-7 w-full scroll-mt-24 sm:mt-8">
          {joinOpen ? (
            <div className="mx-auto max-w-md text-left">
              <WaitlistForm id="hero-email" size="lg" autoFocus />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="agent" size="lg" onClick={() => setJoinOpen(true)}>
                Join the waitlist
              </Button>
              <LinkButton href="#how" variant="outline" size="lg">
                How it works
              </LinkButton>
            </div>
          )}
        </div>

        <div className="mt-12 w-full max-w-xl sm:mt-14" aria-hidden="true">
          <div className="relative flex items-center justify-center">
            {active.productIds.map((id, index) => (
              <div
                key={index}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-raise)]",
                  fanSlots[index],
                )}
              >
                <CrossfadeImage src={getProduct(id).image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
