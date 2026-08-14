import { AgentMark, Wordmark } from "./kit";
import { WaitlistForm } from "./waitlist-form";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-3xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-agent bg-agent px-3 py-1 text-[12px] font-medium text-agent-foreground">
          <AgentMark size={13} />
          Private beta — early access
        </span>

        <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.04] font-bold tracking-[var(--tracking-display)]">
          <Wordmark /> shopping that's about you
        </h1>

        <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-secondary-foreground">
          <Wordmark /> is a personal shopping agent that learns your taste, finds the
          pieces worth your attention, and shows you how each one actually looks
          on you — before you spend anything.
        </p>

        <div className="mt-8 max-w-lg">
          <WaitlistForm id="hero-email" size="lg" />
        </div>
      </div>
    </section>
  );
}
