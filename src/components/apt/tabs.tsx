import { useState } from "react";

import { tabCopy } from "@/content/app-demo";
import { useReveal } from "@/hooks/use-reveal";

import { AgentMark, Eyebrow, Section } from "./kit";
import type { TabKey } from "./phone";
import { AgentScreen } from "./screens/agent";
import { FittingRoomScreen } from "./screens/fitting-room";
import { ProfileScreen } from "./screens/profile";

const screens = {
  0: AgentScreen,
  1: FittingRoomScreen,
  2: ProfileScreen,
} as const;

export function AppTabs() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<TabKey>(0);
  const tab = tabCopy[active]!;
  const Screen = screens[active];

  return (
    <Section id="app" className="bg-card">
      <Eyebrow>Inside the app</Eyebrow>
      <h2 className="mt-4 max-w-[22ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Three tabs. apt, fitting room, you.
      </h2>
      <p className="mt-3 max-w-[46ch] text-[15px] text-muted-foreground">
        Tap the tab bar on the phone to move between them.
      </p>

      <div
        ref={ref}
        data-shown={shown}
        className="reveal mt-10 grid items-center gap-8 rounded-2xl border border-border bg-sunken/40 p-4 sm:rounded-3xl sm:p-10 lg:grid-cols-2 lg:gap-16"
      >
        <div className="flex justify-center">
          <Screen onTab={setActive} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {tab.agent ? <AgentMark size={20} /> : null}
            <span className="eyebrow">Tab {active + 1}</span>
          </div>
          <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[var(--tracking-heading)] lowercase">
            {tab.name}
          </h3>
          <p className="mt-2 text-[clamp(1.1rem,2vw,1.375rem)] leading-[1.18] font-medium tracking-[-0.012em]">
            {tab.lead}
          </p>
          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.6] text-secondary-foreground">
            {tab.body}
          </p>
        </div>
      </div>
    </Section>
  );
}
