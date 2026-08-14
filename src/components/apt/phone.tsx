import type { ReactNode } from "react";

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
