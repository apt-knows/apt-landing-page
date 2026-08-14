import type { ReactNode } from "react";

import { Eyebrow } from "./kit";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
        <Eyebrow>Last updated {updated}</Eyebrow>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] leading-[1.04] font-bold tracking-[var(--tracking-display)]">
          {title}
        </h1>
        <div className="mt-10 space-y-5 text-[17px] leading-[1.6] text-secondary-foreground [&>h2]:pt-4 [&>h2]:text-[20px] [&>h2]:font-semibold [&>h2]:tracking-[-0.012em] [&>h2]:text-foreground">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
