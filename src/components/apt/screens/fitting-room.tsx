import { useState } from "react";

import { feed, type FeedItem } from "@/content/app-demo";

import { Phone, TabBar, type TabKey } from "../phone";

const actions = [
  { label: "Board", path: "M4 2.5h8v11l-4-2.6-4 2.6z" },
  { label: "Cart", path: "M3 4.5h10l-1 8H4l-1-8zM6 4.5a2 2 0 1 1 4 0" },
  { label: "Share", path: "M8 11V3m0 0L5 6m3-3 3 3M3.5 10v3h9v-3" },
];

function FeedCard({ item }: { item: FeedItem }) {
  const [frame, setFrame] = useState(0);
  const current = item.frames[frame];

  return (
    <div className="flex h-full w-full snap-start flex-col bg-grey-0">
      {/* image area — fills everything except the caption strip */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const next = Math.round(el.scrollLeft / el.clientWidth);
            setFrame((f) => (f === next ? f : next));
          }}
        >
          {item.frames.map((f) => (
            <img
              key={f.src + f.label}
              src={f.src}
              alt={f.alt}
              loading="lazy"
              draggable={false}
              className="h-full w-full shrink-0 snap-center object-cover select-none"
            />
          ))}
        </div>

        {/* rail of side actions — white pill buttons */}
        <div className="pointer-events-none absolute right-2.5 bottom-9 flex flex-col items-center gap-2.5">
          {actions.map((a) => (
            <span key={a.label} className="flex flex-col items-center gap-0.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-grey-0/85 text-grey-10 shadow-card backdrop-blur-sm">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d={a.path}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="rounded-full bg-grey-0/85 px-1.5 text-[8px] font-medium text-grey-7 backdrop-blur-sm">
                {a.label}
              </span>
            </span>
          ))}
        </div>

        {/* carousel dots — bottom middle, TikTok style */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-grey-0/85 px-2 py-1 shadow-card backdrop-blur-sm">
            {item.frames.map((f, i) => (
              <span
                key={f.label + i}
                className={
                  i === frame
                    ? "h-1.5 w-1.5 rounded-full bg-signal transition-colors"
                    : "h-1.5 w-1.5 rounded-full bg-grey-10/20 transition-colors"
                }
              />
            ))}
          </span>
        </div>
      </div>

      {/* caption strip — white card following apt theme */}
      <div className="shrink-0 border-t border-border-subtle bg-grey-0 px-4 pb-14 pt-3">
        <div className="flex h-5 items-center gap-1.5">
          {current?.generated ? (
            <>
              <span className="inline-flex items-center rounded-full bg-signal-wash px-2 py-0.5 text-[9px] font-medium leading-none text-signal-ink">
                How it looks on you
              </span>
              <span className="inline-flex items-center rounded-full border border-border-subtle px-2 py-0.5 text-[9px] font-medium leading-none text-text-secondary">
                AI generated
              </span>
            </>
          ) : (
            <span className="inline-flex items-center rounded-full bg-grey-1 px-2 py-0.5 text-[9px] font-medium leading-none text-foreground">
              From {item.store}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="truncate text-[14px] font-medium leading-tight text-foreground">
            {item.name}
          </p>
          <p className="shrink-0 text-[13px] font-medium leading-tight text-text-secondary">
            {item.price}
          </p>
        </div>
        <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.08em] text-text-muted">
          {item.store}
        </p>
      </div>
    </div>
  );
}

export function FittingRoomScreen({ onTab }: { onTab: (i: TabKey) => void }) {
  return (
    <Phone>
      <div className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {feed.map((item) => (
          <div key={item.name} className="h-full w-full snap-start">
            <FeedCard item={item} />
          </div>
        ))}
      </div>
      <TabBar active={1} onSelect={onTab} />
    </Phone>
  );
}

