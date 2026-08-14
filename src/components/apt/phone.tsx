import type { ReactNode } from "react";

import { AgentMark } from "./kit";
import { cn } from "@/lib/utils";

/** A lightweight phone chrome used to frame product mockups. */
export function Phone({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[300px] rounded-[2.25rem] border border-border-strong bg-card p-2 shadow-[var(--shadow-sheet)]",
        className,
      )}
    >
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-sunken">
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
          <span className="h-1.5 w-16 rounded-full bg-grey-10/15" />
        </div>
        {children}
      </div>
    </div>
  );
}

const tabIcons = [
  // Fitting Room — stacked carousel frames
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 3v9M11 3v9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  // apt agent — handled by AgentMark below
  null,
  // Profile — person glyph
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 13.5c0-2.2 2.2-3.5 5-3.5s5 1.3 5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
];

/** Bottom navigation shown across every app screen. */
export function TabBar({ active }: { active: 0 | 1 | 2 }) {
  const labels = ["Fitting", "apt", "You"];
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-around border-t border-border bg-card/95 px-2 pb-2 pt-1.5 backdrop-blur-sm">
      {[0, 1, 2].map((i) => {
        const on = i === active;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
            <span className={on ? "text-signal" : "text-grey-10/45"}>
              {i === 1 ? <AgentMark size={15} active={on} /> : tabIcons[i]}
            </span>
            <span
              className={`text-[9px] font-medium lowercase tracking-tight ${
                on ? "text-signal" : "text-grey-10/45"
              }`}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
