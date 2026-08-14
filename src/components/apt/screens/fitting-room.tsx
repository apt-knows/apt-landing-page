import { useRef, useState } from "react";

import { feed, type FeedItem } from "@/content/app-demo";

import { Phone, TabBar, type TabKey } from "../phone";

const actions = [
  { label: "Save", path: "M4 2.5h8v11l-4-2.6-4 2.6z" },
  { label: "Try on", path: "M8 2.5l1.4 3.6L13 7.5l-3.6 1.4L8 12.5 6.6 8.9 3 7.5l3.6-1.4z" },
  { label: "Hide", path: "M2.5 8S4.8 4 8 4s5.5 4 5.5 4-2.3 4-5.5 4-5.5-4-5.5-4zM3 3l10 10" },
  { label: "Open", path: "M6 3.5L10.5 8 6 12.5" },
];

function FeedCard({ item }: { item: FeedItem }) {
  const [frame, setFrame] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = item.frames[frame];

  const go = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: (frame + dir) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex h-full w-full snap-start flex-col justify-center bg-grey-10 px-3 pb-14 pt-8">
      {/* the card */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div
          ref={trackRef}
          className="flex aspect-[4/5] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

        {/* category chip */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-grey-10/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-inverse-foreground backdrop-blur-sm">
          {current?.generated ? "On you" : item.store}
        </span>

        {/* left frame stepper */}
        <div className="absolute left-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous frame"
            onClick={() => go(-1)}
            disabled={frame === 0}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-grey-10/45 text-inverse-foreground backdrop-blur-sm transition disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 12.5v-9M4.5 7L8 3.5 11.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="rounded-full bg-grey-10/45 px-1.5 py-0.5 text-[8px] font-medium text-inverse-foreground backdrop-blur-sm">
            {frame + 1}/{item.frames.length}
          </span>
          <button
            type="button"
            aria-label="Next frame"
            onClick={() => go(1)}
            disabled={frame === item.frames.length - 1}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-grey-10/45 text-inverse-foreground backdrop-blur-sm transition disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 3.5v9M4.5 9L8 12.5 11.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* right action rail */}
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2.5">
          {actions.map((a) => (
            <span key={a.label} className="flex flex-col items-center gap-0.5">
              <span
                className={
                  a.label === "Try on"
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-signal text-signal-deep"
                    : "flex h-8 w-8 items-center justify-center rounded-full bg-grey-10/50 text-inverse-foreground backdrop-blur-sm"
                }
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d={a.path} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.06em] text-inverse-foreground/85">
                {a.label}
              </span>
            </span>
          ))}
        </div>

        {/* pagination dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1">
          {item.frames.map((f, i) => (
            <span
              key={f.label + i}
              className={
                i === frame
                  ? "h-1 w-4 rounded-full bg-grey-0"
                  : "h-1 w-1 rounded-full bg-grey-0/50"
              }
            />
          ))}
        </div>
      </div>

      {/* meta under the card */}
      <div className="mt-3 px-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-inverse-foreground/50">
            {item.store}
          </span>
          <span className="text-[13px] font-semibold text-inverse-foreground">
            {item.price}
          </span>
        </div>
        <p className="mt-1 text-[14px] font-semibold text-inverse-foreground">
          {item.name}
        </p>
        {current?.generated ? (
          <p className="mt-1 text-[9px] font-medium text-signal">
            How it looks on you · AI generated
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function FittingRoomScreen({ onTab }: { onTab: (i: TabKey) => void }) {
  return (
    <Phone>
      <div className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth bg-grey-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
