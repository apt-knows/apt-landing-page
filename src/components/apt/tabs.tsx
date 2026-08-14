import { useState } from "react";

import { useReveal } from "@/hooks/use-reveal";

import { Eyebrow, Section, Wordmark } from "./kit";
import type { TabKey } from "./phone";
import { AgentScreen } from "./screens/agent";
import { FittingRoomScreen } from "./screens/fitting-room";
import { ProfileScreen } from "./screens/profile";

const screens = {
  0: AgentScreen,
  1: FittingRoomScreen,
  2: ProfileScreen,
} as const;

const tabs: { name: string; lead: string; body: React.ReactNode }[] = [
  {
    name: "apt",
    lead: "Your personal shopping agent.",
    body: (
      <>
        Tell <Wordmark /> what you're after and she gives you options — already
        on you. No paragraphs to read, no filters to fight. Just looks you can
        judge in a second.
      </>
    ),
  },
  {
    name: "Fitting Room",
    lead: "A scroll worth staying in.",
    body: "An endless feed where every card is a carousel — the product first, then you wearing it. Swipe to see it on you, scroll up for the next. Ranked by what you scroll past.",
  },
  {
    name: "Profile",
    lead: "The part that makes it yours.",
    body: "Set your interests, add photos so try-on looks like you, and build situational boards — a Puerto Rico trip, a wedding, a new job — that fill up now and get bought later.",
  },
];

export function AppTabs() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<TabKey>(0);
  const tab = tabs[active]!;
  const Screen = screens[active];

  return (
    <Section id="app" className="bg-card">
      <Eyebrow>
        Inside <Wordmark className="lowercase! text-[1.35em]!" />
      </Eyebrow>
      <h2 className="mt-4 max-w-[28ch] text-[clamp(1.5rem,1.15rem+1.6vw,2.75rem)] text-balance leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Three tabs; apt, fitting room, you.
      </h2>
      <p className="mt-3 max-w-[46ch] text-[clamp(0.9rem,0.87rem+0.15vw,0.95rem)] text-muted-foreground">
        Tap the tab bar on the phone to move between them.
      </p>

      <div
        ref={ref}
        data-shown={shown}
        className="reveal mt-8 grid items-center gap-8 rounded-2xl border border-border bg-sunken/40 p-4 sm:mt-10 sm:rounded-3xl sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12 lg:p-10 xl:gap-16"
      >
        <div className="flex justify-center">
          <Screen onTab={setActive} />
        </div>
        <div className="min-w-0">
          <span className="eyebrow">Tab {active + 1}</span>
          <h3 className="mt-3 text-[clamp(1.375rem,1.15rem+1vw,2rem)] font-semibold tracking-[var(--tracking-heading)] lowercase">
            {tab.name}
          </h3>
          <p className="mt-2 text-[clamp(1.05rem,0.95rem+0.55vw,1.375rem)] leading-[1.18] font-medium tracking-[-0.012em]">
            {tab.lead}
          </p>
          <p className="mt-4 max-w-[52ch] text-[clamp(0.95rem,0.9rem+0.3vw,1.125rem)] leading-[1.6] text-secondary-foreground">
            {tab.body}
          </p>
        </div>
      </div>
    </Section>
  );
}
