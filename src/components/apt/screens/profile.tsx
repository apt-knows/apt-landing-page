import { demoUser, profileDemo } from "@/content/app-demo";

import { Phone, TabBar, type TabKey } from "../phone";

export function ProfileScreen({ onTab }: { onTab: (i: TabKey) => void }) {
  const { photos, styles, boards, settings } = profileDemo;

  return (
    <Phone>
      <div className="flex h-full flex-col overflow-y-auto bg-card pb-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Header — deliberately the loudest block on this screen */}
        <div className="bg-sunken px-4 pt-8 pb-4">
          <div className="flex items-center gap-3.5">
            <span className="relative shrink-0">
              <img
                src={demoUser.avatar}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-16 w-16 rounded-full object-cover object-top ring-2 ring-signal ring-offset-2 ring-offset-sunken"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[20px] leading-tight font-semibold tracking-[-0.01em]">
                {demoUser.name}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {demoUser.meta}
              </p>
            </div>
            <span className="rounded-full bg-grey-10 px-3 py-1.5 text-[10px] font-semibold text-inverse-foreground">
              Edit
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-3 overflow-hidden rounded-lg border border-border bg-card">
            {demoUser.stats.map((s, i) => (
              <div
                key={s.label}
                className={
                  i === 1
                    ? "border-x border-border px-2 py-2 text-center"
                    : "px-2 py-2 text-center"
                }
              >
                <p className="text-[15px] leading-none font-semibold">
                  {s.value}
                </p>
                <p className="mt-1 text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Your photos</p>
            <span className="text-[10px] text-muted-foreground">Manage</span>
          </div>
          <p className="mt-1 text-[11px] leading-[1.35] text-muted-foreground">
            So try-on looks like you.
          </p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {photos.map((p) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                width={768}
                height={1152}
                loading="lazy"
                className="aspect-square w-full rounded-md object-cover object-top"
              />
            ))}
            <div className="flex aspect-square flex-col items-center justify-center rounded-md border border-dashed border-border-strong text-[16px] leading-none text-signal">
              +
              <span className="mt-0.5 text-[8px] text-muted-foreground">
                Upload
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="eyebrow">Your style</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {styles.map((s) => (
              <span
                key={s.label}
                className={
                  s.on
                    ? "rounded-full bg-grey-10 px-2.5 py-1 text-[11px] font-medium text-inverse-foreground"
                    : "rounded-full border border-border-strong px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                }
              >
                {s.label}
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex gap-3 text-[10px] text-muted-foreground">
            <span>{demoUser.sizes}</span>
            <span>{demoUser.budget}</span>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Boards</p>
            <span className="text-[10px] text-muted-foreground">See all</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {boards.map((b) => (
              <figure key={b.name} className="space-y-1">
                <img
                  src={b.src}
                  alt={`Items saved to the ${b.name} board`}
                  width={768}
                  height={1152}
                  loading="lazy"
                  className="h-20 w-full rounded-md object-cover object-top"
                />
                <figcaption className="text-[10px] leading-tight text-secondary-foreground">
                  {b.name}
                  <span className="block text-muted-foreground">{b.count}</span>
                </figcaption>
              </figure>
            ))}
            <div className="flex h-20 items-end rounded-md border border-dashed border-border-strong p-2 text-[10px] text-muted-foreground">
              + New board
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="eyebrow">Settings</p>
          <div className="mt-2 space-y-1.5 text-[11px] text-secondary-foreground">
            {settings.map((s) => (
              <p key={s.label} className="flex justify-between">
                {s.label}{" "}
                <span
                  className={s.accent ? "text-signal" : "text-muted-foreground"}
                >
                  {s.value}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <TabBar active={2} onSelect={onTab} />
    </Phone>
  );
}
