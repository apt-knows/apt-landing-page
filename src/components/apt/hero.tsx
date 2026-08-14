import { Wordmark } from "./kit";
import { WaitlistForm } from "./waitlist-form";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-3xl px-5 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-24 lg:px-10 lg:pt-28 lg:pb-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-agent bg-agent px-3 py-1 text-[12px] font-medium text-agent-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          Beta — early access
        </span>

        <h1 className="mt-6 text-[clamp(2.15rem,1.4rem+4.6vw,5rem)] text-balance leading-[1.04] font-bold tracking-[var(--tracking-display)]">
          <Wordmark /> shopping that's about you
        </h1>

        <p className="mt-5 max-w-[52ch] text-[clamp(1rem,0.95rem+0.35vw,1.1875rem)] sm:mt-6 leading-[1.6] text-secondary-foreground">
          <Wordmark /> is a personal shopping agent that understands your taste,
          finds the pieces worth your attention, and shows how it would look on
          you — before you spend anything.
        </p>

        <div className="mt-7 max-w-lg sm:mt-8">
          <WaitlistForm id="hero-email" size="lg" />
        </div>
      </div>
    </section>
  );
}
