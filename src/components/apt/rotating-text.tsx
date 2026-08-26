import { cn } from "@/lib/utils";

/**
 * Renders the rotating tail of the hero headline. The parent owns the
 * rotation timer and passes the current word. The outgoing word is removed
 * the instant the incoming one rises in, so two words are never visible at
 * once. Under reduced motion the word swaps in place with no animation.
 */
export function RotatingWord({ word, className }: { word: string; className?: string }) {
  return (
    <span className={cn("inline-block", className)}>
      <span
        key={word}
        className="rise-in inline-block underline decoration-signal decoration-[0.09em] underline-offset-[0.14em] [text-decoration-skip-ink:none]"
      >
        {word}
      </span>
    </span>
  );
}
