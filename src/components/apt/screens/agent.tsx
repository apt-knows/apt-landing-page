import { agentDemo } from "@/content/app-demo";

import { AgentMark } from "../kit";
import { Phone, TabBar, type TabKey } from "../phone";

export function AgentScreen({ onTab }: { onTab: (i: TabKey) => void }) {
  return (
    <Phone>
      <div className="flex h-full flex-col bg-card pb-11">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 pt-6">
          <AgentMark size={18} active />
          <div className="min-w-0">
            <p className="text-[14px] leading-none font-medium lowercase">apt</p>
            <p className="mt-1 text-[9px] text-muted-foreground">
              Your shopping agent
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-sunken px-3.5 py-2 text-[13px]">
            {agentDemo.prompt}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <figure className="relative col-span-2">
              <img
                src={agentDemo.hero.src}
                alt={agentDemo.hero.alt}
                width={768}
                height={1152}
                loading="lazy"
                className="h-32 w-full rounded-lg object-cover object-top"
              />
              <figcaption className="absolute bottom-1.5 left-1.5 rounded-full bg-grey-10/65 px-2 py-0.5 text-[9px] font-medium text-signal backdrop-blur-sm">
                {agentDemo.hero.caption}
              </figcaption>
            </figure>
            {agentDemo.results.map((r) => (
              <figure key={r.caption} className="relative">
                <img
                  src={r.src}
                  alt={r.alt}
                  width={768}
                  height={1152}
                  loading="lazy"
                  className={`h-20 w-full rounded-lg object-cover ${
                    r.objectPosition === "top" ? "object-top" : ""
                  }`}
                />
                <figcaption className="absolute bottom-1 left-1 rounded-full bg-grey-10/65 px-1.5 py-0.5 text-[8px] font-medium text-signal backdrop-blur-sm">
                  {r.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="flex gap-1.5">
            {agentDemo.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border-strong px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="rounded-lg border border-signal/30 bg-signal/[0.06] px-3 py-2.5">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-signal uppercase">
              {agentDemo.learned.label}
            </p>
            <p className="mt-1 text-[13px] leading-[1.4] text-secondary-foreground">
              {agentDemo.learned.text}
            </p>
          </div>

          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-sunken px-3.5 py-2 text-[13px]">
            {agentDemo.followUp}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2">
            <img
              src={agentDemo.saved.src}
              alt={agentDemo.saved.alt}
              width={768}
              height={1152}
              loading="lazy"
              className="h-9 w-9 rounded-md object-cover"
            />
            <p className="text-[11px] leading-[1.35] text-secondary-foreground">
              Saved to{" "}
              <span className="font-medium text-foreground">
                {agentDemo.saved.board}
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-border px-4 py-2.5">
          <div className="flex items-center justify-between rounded-full bg-sunken px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">
              {agentDemo.placeholder}
            </span>
            <AgentMark size={13} active />
          </div>
        </div>
      </div>
      <TabBar active={0} onSelect={onTab} />
    </Phone>
  );
}
