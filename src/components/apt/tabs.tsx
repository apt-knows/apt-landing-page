import { useState } from "react";
import agentLook from "@/assets/agent-look.jpg";
import boardLook from "@/assets/board-look.jpg";
import aModel1 from "@/assets/feed/a-model-1.jpg";
import aModel2 from "@/assets/feed/a-model-2.jpg";
import aProduct from "@/assets/feed/a-product.jpg";
import bModel1 from "@/assets/feed/b-model-1.jpg";
import bModel2 from "@/assets/feed/b-model-2.jpg";
import bProduct from "@/assets/feed/b-product.jpg";
import cModel1 from "@/assets/feed/c-model-1.jpg";
import cModel2 from "@/assets/feed/c-model-2.jpg";
import cProduct from "@/assets/feed/c-product.jpg";
import rainLook1 from "@/assets/feed/rain-look-1.jpg";
import rainLook2 from "@/assets/feed/rain-look-2.jpg";
import rainLook3 from "@/assets/feed/rain-look-3.jpg";
import { useReveal } from "@/hooks/use-reveal";

import { AgentMark, Eyebrow, Section } from "./kit";
import { Phone, TabBar } from "./phone";

type Frame = {
  src: string;
  label: string;
  alt: string;
  generated?: boolean;
};

type FeedItem = {
  name: string;
  price: string;
  store: string;
  frames: Frame[];
};

const feed: FeedItem[] = [
  {
    name: "Ribbed knit crewneck",
    price: "$128",
    store: "Everlane",
    frames: [
      {
        src: aProduct,
        label: "Product",
        alt: "A cream ribbed knit crewneck photographed on its own",
      },
      {
        src: aModel1,
        label: "How it looks on you",
        alt: "The crewneck rendered on the shopper, facing forward",
        generated: true,
      },
      {
        src: aModel2,
        label: "How it looks on you",
        alt: "The crewneck rendered on the shopper, side angle",
        generated: true,
      },
    ],
  },
  {
    name: "Leather low-top sneaker",
    price: "$210",
    store: "COS",
    frames: [
      {
        src: bProduct,
        label: "Product",
        alt: "White leather low-top sneakers",
      },
      {
        src: bModel1,
        label: "How it looks on you",
        alt: "The sneakers rendered on the shopper, full length",
        generated: true,
      },
      {
        src: bModel2,
        label: "How it looks on you",
        alt: "The sneakers rendered on the shopper, low angle",
        generated: true,
      },
    ],
  },
  {
    name: "Structured shoulder bag",
    price: "$340",
    store: "Arket",
    frames: [
      {
        src: cProduct,
        label: "Product",
        alt: "A tan leather structured shoulder bag",
      },
      {
        src: cModel1,
        label: "How it looks on you",
        alt: "The bag rendered on the shopper over a black coat",
        generated: true,
      },
      {
        src: cModel2,
        label: "How it looks on you",
        alt: "The bag rendered on the shopper, back angle",
        generated: true,
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
            <span className="rounded-full bg-grey-10/45 px-1.5 text-[8px] font-medium text-inverse-foreground backdrop-blur-sm">
              {a.label}
            </span>
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-11 space-y-2 bg-gradient-to-t from-grey-10/85 to-transparent p-4 pt-16">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.frames[frame]?.generated ? (
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
          <AgentMark size={18} active />
          <div className="min-w-0">
            <p className="text-[14px] font-medium lowercase leading-none">apt</p>
            <p className="mt-1 text-[9px] text-muted-foreground">
              Your shopping agent
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-sunken px-3.5 py-2 text-[13px]">
            something for a rainy commute
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <figure className="relative col-span-2">
              <img
                src={rainLook1}
                alt="A water-resistant trench and rain boots shown on the shopper"
                width={768}
                height={1152}
                loading="lazy"
                className="h-32 w-full rounded-lg object-cover object-top"
              />
              <figcaption className="absolute bottom-1.5 left-1.5 rounded-full bg-grey-10/65 px-2 py-0.5 text-[9px] font-medium text-signal backdrop-blur-sm">
                Water-resistant trench · on you
              </figcaption>
            </figure>
            <figure className="relative">
              <img
                src={rainLook2}
                alt="Black waterproof rain boots shown on the shopper"
                width={768}
                height={1152}
                loading="lazy"
                className="h-20 w-full rounded-lg object-cover"
              />
              <figcaption className="absolute bottom-1 left-1 rounded-full bg-grey-10/65 px-1.5 py-0.5 text-[8px] font-medium text-signal backdrop-blur-sm">
                Rain boots
              </figcaption>
            </figure>
            <figure className="relative">
              <img
                src={rainLook3}
                alt="An olive hooded rain shell shown on the shopper"
                width={768}
                height={1152}
                loading="lazy"
                className="h-20 w-full rounded-lg object-cover object-top"
              />
              <figcaption className="absolute bottom-1 left-1 rounded-full bg-grey-10/65 px-1.5 py-0.5 text-[8px] font-medium text-signal backdrop-blur-sm">
                Rain shell
              </figcaption>
            </figure>
          </div>

          <div className="flex gap-1.5">
            <span className="rounded-full border border-border-strong px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
              Under $250
            </span>
            <span className="rounded-full border border-border-strong px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
              More like this
            </span>
          </div>

          <div className="rounded-lg border border-signal/30 bg-signal/[0.06] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">
              I learned
            </p>
            <p className="mt-1 text-[13px] leading-[1.4] text-secondary-foreground">
              You keep water-resistant over wool. Showing those first.
            </p>
          </div>

          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-sunken px-3.5 py-2 text-[13px]">
            save the boots to my commute board
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2">
            <img
              src={rainLook2}
              alt="Rain boots saved to a board"
              width={768}
              height={1152}
              loading="lazy"
              className="h-9 w-9 rounded-md object-cover"
            />
            <p className="text-[11px] leading-[1.35] text-secondary-foreground">
              Saved to{" "}
              <span className="font-medium text-foreground">Rainy commute</span>
            </p>
          </div>

        </div>

        <div className="border-t border-border px-4 py-2.5">
          <div className="flex items-center justify-between rounded-full bg-sunken px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">
              Ask apt anything
            </span>
            <AgentMark size={13} active />
          </div>
        </div>
      </div>
      <TabBar active={1} onSelect={onTab} />
    </Phone>
  );
}


function ProfileScreen({ onTab }: { onTab: (i: 0 | 1 | 2) => void }) {
  const photos = [
    { src: aModel1, alt: "A photo the shopper uploaded of themselves" },
    { src: aModel2, alt: "A second uploaded photo, side angle" },
    { src: cModel1, alt: "A third uploaded photo in a black coat" },
  ];
  const styles = [
    { label: "Quiet luxury", on: true },
    { label: "Workwear", on: true },
    { label: "Neutrals", on: true },
    { label: "Streetwear", on: false },
    { label: "Tailored", on: false },
  ];
  const boards = [
    { src: boardLook, name: "Puerto Rico trip", count: "14 saved" },
    { src: bModel1, name: "Everyday rotation", count: "26 saved" },
  ];

  return (
    <Phone>
      <div className="flex h-full flex-col overflow-y-auto bg-card pb-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3">
          <img
            src={cModel1}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-11 w-11 rounded-full object-cover object-top"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium">Maya R.</p>
            <p className="text-[11px] text-muted-foreground">
              6 photos · 3 boards · 128 saved
            </p>
          </div>
          <span className="ml-auto rounded-full border border-border-strong px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
            Edit
          </span>
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Your photos</p>
            <span className="text-[10px] text-signal">Fit model ready</span>
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
            <span>Sizes · M / 9</span>
            <span>Budget · $80–$300</span>
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
            <p className="flex justify-between">
              Try-on generation <span className="text-signal">On</span>
            </p>
            <p className="flex justify-between">
              Orders & returns{" "}
              <span className="text-muted-foreground">2 active</span>
            </p>
            <p className="flex justify-between">
              Notifications{" "}
              <span className="text-muted-foreground">Drops only</span>
            </p>
          </div>
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

