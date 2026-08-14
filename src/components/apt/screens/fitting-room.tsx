import { useState } from "react";

import { feed, type FeedItem } from "@/content/app-demo";

import { Phone, TabBar, type TabKey } from "../phone";

const actions = [
  {
    label: "Board",
    path: "M4 2.5h8v11l-4-2.6-4 2.6z",
  },
  {
    label: "Cart",
    path: "M3 4.5h10l-1 8H4l-1-8zM6 4.5a2 2 0 1 1 4 0",
  },
  {
    label: "Share",
    path: "M8 11V3m0 0L5 6m3-3 3 3M3.5 10v3h9v-3",
  },
];

function FeedCard({ item }: { item: FeedItem }) {
  const [frame, setFrame] = useState(0);
  const current = item.frames[frame];

  return (
    <div className="relative h-full w-full snap-start overflow-hidden">
      <div
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          setFrame(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {item.frames.map((f) => (
          <img
            key={f.src + f.label}
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {/* carousel progress */}
      <div className="pointer-events-none absolute inset-x-0 top-7 flex justify-center gap-1.5 px-8">
        {item.frames.map((f, i) => (
          <span
            key={f.label + i}
            className={
              i === frame
                ? "h-1 flex-1 rounded-full bg-grey-0"
                : "h-1 flex-1 rounded-full bg-grey-0/40"
            }
          />
        ))}
      </div>

      {/* rail of side actions */}
      <div className="pointer-events-none absolute right-2.5 bottom-28 flex flex-col items-center gap-3">
        {actions.map((a) => (
          <span key={a.label} className="flex flex-col items-center gap-0.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grey-10/55 text-inverse-foreground backdrop-blur-sm">
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
            <span className="rounded-full bg-grey-10/45 px-1.5 text-[8px] font-medium text-inverse-foreground backdrop-blur-sm">
              {a.label}
            </span>
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-11 space-y-2 bg-gradient-to-t from-grey-10/85 to-transparent p-4 pt-16">
        <div className="flex flex-wrap items-center gap-1.5">
          {current?.generated ? (
            <>
              <span className="inline-flex items-center rounded-full bg-grey-10/60 px-2.5 py-1 text-[10px] font-medium text-signal backdrop-blur-sm">
                How it looks on you
              </span>
              <span className="inline-flex items-center rounded-full border border-grey-0/30 px-2 py-1 text-[9px] font-medium text-inverse-foreground/85 backdrop-blur-sm">
                AI generated
              </span>
            </>
          ) : (
            <span className="inline-flex items-center rounded-full bg-grey-10/60 px-2.5 py-1 text-[10px] font-medium text-inverse-foreground backdrop-blur-sm">
              From {item.store}
            </span>
          )}
          <span className="text-[9px] text-inverse-foreground/60">
            {frame + 1}/{item.frames.length}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 pr-12">
          <p className="text-[15px] font-medium text-inverse-foreground">
            {item.name}
          </p>
          <p className="text-[13px] text-inverse-foreground/80">{item.price}</p>
        </div>

        <span className="inline-flex items-center rounded-full bg-grey-0 px-3 py-1.5 text-[11px] font-semibold text-grey-10">
          Add to cart
        </span>
      </div>
    </div>
  );
}

export function FittingRoomScreen({ onTab }: { onTab: (i: TabKey) => void }) {
  return (
    <Phone>
      <div className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
