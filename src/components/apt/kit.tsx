import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";


/* ---------- wordmark ---------- */

export function Wordmark({
  className,
  dot = true,
}: {
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-semibold lowercase tracking-[-0.045em] text-signal",
        className,
      )}
    >
      apt{dot ? <span className="text-signal">.</span> : null}
    </span>
  );
}

export function AgentMark({
  className,
  size = 24,
  active = true,
}: {
  className?: string;
  size?: number;
  active?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    >
      {/* cyan tip between the twin peaks */}
      <path
        d="M50 6 L56 36 L50 56 L44 36 Z"
        className={active ? "fill-signal" : "fill-grey-5"}
      />
      {/* twin-peak delta outline */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46 16 L50 52 L54 16 L97 97 L50 62 L3 97 Z
           M47 41 L50 59 L53 41 L85 92 L50 70 L15 92 Z"
        fill="currentColor"
      />

    </svg>
  );
}


/* ---------- button ---------- */

const button = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium tracking-[-0.012em] transition-[background-color,color,box-shadow,transform] duration-[160ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-grey-10 text-inverse-foreground hover:bg-signal hover:text-grey-10",
        agent: "bg-signal text-signal-deep hover:bg-signal-press",
        outline:
          "border border-border-strong bg-card text-foreground hover:border-grey-5",
        ghost: "text-foreground hover:bg-sunken",
      },
      size: {
        md: "",
        lg: "min-h-12 px-6 text-[17px]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: ComponentPropsWithoutRef<"a"> & VariantProps<typeof button>) {
  return <a className={cn(button({ variant, size }), className)} {...props} />;
}

/* ---------- chip & tag ---------- */

export function Chip({
  children,
  count,
  active,
}: {
  children: ReactNode;
  count?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium",
        active
          ? "border-signal bg-card text-foreground"
          : "border-border-strong bg-card text-secondary-foreground",
      )}
    >
      {children}
      {count ? <span className="text-muted-foreground">{count}</span> : null}
    </span>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "agent" | "alert";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-medium",
        tone === "agent" && "border-border-agent bg-agent text-agent-foreground",
        tone === "alert" && "border-alert/40 bg-alert-wash text-alert",
        tone === "neutral" && "border-border bg-sunken text-secondary-foreground",
      )}
    >
      {children}
    </span>
  );
}

/* ---------- agent note ---------- */

export function AgentNote({
  label,
  children,
  tone = "agent",
}: {
  label: string;
  children: ReactNode;
  tone?: "agent" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3",
        tone === "agent"
          ? "border-border-agent bg-agent"
          : "border-border bg-sunken",
      )}
    >
      <div
        className={cn(
          "eyebrow flex items-center gap-1.5",
          tone === "agent" && "text-agent-foreground",
        )}
      >
        {tone === "agent" ? <AgentMark size={12} /> : null}
        {label}
      </div>
      <p
        className={cn(
          "mt-1 text-[15px] leading-[1.45]",
          tone === "agent" ? "text-agent-foreground" : "text-secondary-foreground",
        )}
      >
        {children}
      </p>
    </div>
  );
}

/* ---------- layout ---------- */

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 border-t border-border py-20 sm:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
