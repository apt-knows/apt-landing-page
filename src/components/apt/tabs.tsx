import { useState } from "react";
import agentLook from "@/assets/agent-look.jpg";
import boardLook from "@/assets/board-look.jpg";
import feedLook from "@/assets/feed-look.jpg";
import heroTryon from "@/assets/hero-tryon.jpg";
import tryonProduct from "@/assets/tryon-product.jpg";
import { useReveal } from "@/hooks/use-reveal";

import { AgentMark, Eyebrow, Section } from "./kit";
import { Phone, TabBar } from "./phone";

type FeedItem = {
  name: string;
  price: string;
  frames: { src: string; label: string; alt: string }[];
};

const feed: FeedItem[] = [
  {
    name: "Ribbed knit crewneck",
    price: "$128",
    frames: [
      {
        src: tryonProduct,
        label: "Product",
        alt: "A ribbed knit crewneck photographed on its own",
      },
      {
        src: feedLook,
        label: "On you",
        alt: "The crewneck rendered on the shopper",
      },
      {
        src: heroTryon,
        label: "On you",
        alt: "A second angle of the crewneck on the shopper",
      },
    ],
  },
  {
    name: "Leather low-top sneaker",
    price: "$210",
    frames: [
      {
        src: agentLook,
        label: "Product",
        alt: "White leather low-top sneakers",
      },
      {
        src: boardLook,
        label: "On you",
        alt: "The sneakers rendered on the shopper",
      },
    ],
  },
];

const actions = [
  {
    label: "Board",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4 2.5h8v11l-4-2.6-4 2.6z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Cart",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 4.5h10l-1 8H4l-1-8zM6 4.5a2 2 0 1 1 4 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Share",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 11V3m0 0L5 6m3-3 3 3M3.5 10v3h9v-3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function FeedCard({ item }: { item: FeedItem }) {
  const [frame, setFrame] = useState(0);

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
      <div className="pointer-events-none absolute bottom-28 right-2.5 flex flex-col items-center gap-3">
        {actions.map((a) => (
          <span key={a.label} className="flex flex-col items-center gap-0.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grey-10/55 text-inverse-foreground backdrop-blur-sm">
              {a.icon}
            </span>
            <span className="text-[8px] font-medium text-inverse-foreground/85">
              {a.label}
            </span>
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-11 space-y-2 bg-gradient-to-t from-grey-10/85 to-transparent p-4 pt-16">
        <span className="inline-flex items-center rounded-full bg-signal/20 px-2.5 py-1 text-[10px] font-medium text-signal">
          {item.frames[frame]?.label} · {frame + 1} of {item.frames.length}
        </span>
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

function FittingRoomScreen({ onTab }: { onTab: (i: 0 | 1 | 2) => void }) {
  return (
    <Phone>
      <div className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {feed.map((item) => (
          <div key={item.name} className="h-full w-full snap-start">
            <FeedCard item={item} />
          </div>
        ))}
      </div>
      <TabBar active={0} onSelect={onTab} />
    </Phone>
  );
}


function AgentScreen({ onTab }: { onTab: (i: 0 | 1 | 2) => void }) {
  return (
    <Phone>
      <div className="flex h-full flex-col bg-card pb-11">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 pt-6">
          <AgentMark size={18} />
          <span className="text-[14px] font-medium lowercase">apt</span>
        </div>
        <div className="flex-1 space-y-3 p-4">
          <div className="ml-auto w-fit rounded-full bg-sunken px-4 py-2 text-[13px]">
            something for a rainy commute
          </div>
          <div className="grid grid-cols-2 gap-2">
            <img
              src={agentLook}
              alt="White leather sneakers shown on a shopper"
              width={896}
              height={1152}
              loading="lazy"
              className="col-span-2 h-32 w-full rounded-md object-cover"
            />
            <div className="h-20 rounded-md bg-sunken" />
            <div className="h-20 rounded-md bg-sunken" />
          </div>
          <div className="rounded-lg border border-signal/30 bg-signal/[0.06] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">
              I learned
            </p>
            <p className="mt-1 text-[13px] leading-[1.4] text-secondary-foreground">
              You keep water-resistant over wool. Showing those first.
            </p>
          </div>
        </div>
      </div>
      <TabBar active={1} onSelect={onTab} />
    </Phone>
  );
}

function ProfileScreen({ onTab }: { onTab: (i: 0 | 1 | 2) => void }) {
  return (
    <Phone>
      <div className="flex h-full flex-col overflow-hidden bg-card pb-11">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3">
          <img
            src={boardLook}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium">Your profile</p>
            <p className="text-[11px] text-muted-foreground">
              6 photos · 3 boards
            </p>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="eyebrow">Your photos</p>
          <p className="mt-1 text-[11px] leading-[1.35] text-muted-foreground">
            So try-on looks like you.
          </p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            <img
              src={feedLook}
              alt="A photo the shopper uploaded of themselves"
              width={896}
              height={1152}
              loading="lazy"
              className="aspect-square w-full rounded-md object-cover"
            />
            <img
              src={agentLook}
              alt="A second uploaded photo of the shopper"
              width={896}
              height={1152}
              loading="lazy"
              className="aspect-square w-full rounded-md object-cover"
            />
            <div className="aspect-square rounded-md bg-sunken" />
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
            <span className="rounded-full bg-grey-10 px-2.5 py-1 text-[11px] font-medium text-inverse-foreground">
              Quiet luxury
            </span>
            <span className="rounded-full border border-border-strong px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
              Workwear
            </span>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="eyebrow">Boards</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <img
              src={boardLook}
              alt="A linen outfit saved to a Puerto Rico trip board"
              width={896}
              height={1152}
              loading="lazy"
              className="h-20 w-full rounded-md object-cover"
            />
            <div className="flex h-20 items-end rounded-md bg-sunken p-2 text-[11px] text-muted-foreground">
              + New board
            </div>
          </div>
          <p className="mt-2 text-[12px] text-secondary-foreground">
            Puerto Rico trip · 14 saved
          </p>
        </div>
      </div>
      <TabBar active={2} onSelect={onTab} />
    </Phone>
  );
}

type TabKey = 0 | 1 | 2;

const tabs: {
  name: string;
  lead: string;
  body: string;
  agent?: boolean;
}[] = [
  {
    name: "Fitting Room",
    lead: "A scroll worth staying in.",
    body: "An endless feed where every card is a carousel: the product first, then you wearing it. Swipe sideways to see it on you, scroll up for the next piece. Ranked by a For You algorithm that treats a scroll-past as an opinion.",
  },
  {
    name: "apt",
    lead: "Your personal shopping agent.",
    body: "Tell her what you're after and she answers in pictures — options, already on you. No paragraphs to read, no filters to fight. Just looks you can judge in a second.",
    agent: true,
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

  return (
    <Section id="app" className="bg-card">
      <Eyebrow>Inside the app</Eyebrow>
      <h2 className="mt-4 max-w-[22ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Three tabs. That's the whole app.
      </h2>
      <p className="mt-3 max-w-[46ch] text-[15px] text-muted-foreground">
        Tap the tab bar on the phone to move between them.
      </p>

      <div
        ref={ref}
        data-shown={shown}
        className="reveal mt-10 grid items-center gap-10 rounded-3xl border border-border bg-sunken/40 p-8 sm:p-10 lg:grid-cols-2 lg:gap-16"
      >
        <div className="flex justify-center">
          {active === 0 ? (
            <FittingRoomScreen onTab={setActive} />
          ) : active === 1 ? (
            <AgentScreen onTab={setActive} />
          ) : (
            <ProfileScreen onTab={setActive} />
          )}
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

