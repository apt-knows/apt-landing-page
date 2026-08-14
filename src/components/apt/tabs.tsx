import agentLook from "@/assets/agent-look.jpg";
import boardLook from "@/assets/board-look.jpg";
import feedLook from "@/assets/feed-look.jpg";
import { useReveal } from "@/hooks/use-reveal";

import { AgentMark, AgentNote, Chip, Eyebrow, Section, Tag } from "./kit";
import { Phone } from "./phone";

function FittingRoomScreen() {
  return (
    <Phone>
      <img
        src={feedLook}
        alt="A shopper shown wearing a charcoal knit sweater and olive trousers"
        width={896}
        height={1152}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 top-8 flex justify-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              i === 1
                ? "h-1 w-8 rounded-full bg-grey-0"
                : "h-1 w-8 rounded-full bg-grey-0/40"
            }
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-grey-10/70 to-transparent p-4 pt-16">
        <Tag tone="agent">On you · frame 2 of 4</Tag>
        <p className="text-[15px] font-medium text-inverse-foreground">
          Ribbed knit crewneck
        </p>
      </div>
    </Phone>
  );
}

function AgentScreen() {
  return (
    <Phone>
      <div className="flex h-full flex-col bg-card">
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
          <AgentNote label="I learned">
            You keep water-resistant over wool. Showing those first.
          </AgentNote>
        </div>
      </div>
    </Phone>
  );
}

function ProfileScreen() {
  return (
    <Phone>
      <div className="flex h-full flex-col bg-card">
        <div className="px-4 pt-8 pb-3">
          <div className="h-12 w-12 rounded-full bg-sunken" />
          <p className="mt-3 text-[15px] font-medium">Your style</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip active>Quiet luxury</Chip>
            <Chip>Workwear</Chip>
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
              className="h-28 w-full rounded-md object-cover"
            />
            <div className="flex h-28 items-end rounded-md bg-sunken p-2 text-[12px] text-muted-foreground">
              + New board
            </div>
          </div>
          <p className="mt-2 text-[13px] text-secondary-foreground">
            Puerto Rico trip · 14 saved
          </p>
        </div>
      </div>
    </Phone>
  );
}

const tabs = [
  {
    name: "Fitting Room",
    lead: "A scroll worth staying in.",
    body: "An endless feed where every card is a carousel: the product first, then you wearing it. Ranked by a For You algorithm that treats a scroll-past as an opinion.",
    screen: <FittingRoomScreen />,
  },
  {
    name: "apt",
    lead: "Your personal shopping agent.",
    body: "Tell her what you're after and she answers in pictures — options, already on you. No paragraphs to read, no filters to fight. Just looks you can judge in a second.",
    screen: <AgentScreen />,
    agent: true,
  },
  {
    name: "Profile",
    lead: "The part that makes it yours.",
    body: "Set your interests, add photos so try-on looks like you, and build situational boards — a Puerto Rico trip, a wedding, a new job — that fill up now and get bought later.",
    screen: <ProfileScreen />,
  },
];

export function AppTabs() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <Section id="app" className="bg-card">
      <Eyebrow>Inside the app</Eyebrow>
      <h2 className="mt-4 max-w-[22ch] text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] font-semibold tracking-[var(--tracking-heading)]">
        Three tabs. That's the whole app.
      </h2>

      <div ref={ref} data-shown={shown} className="reveal mt-14 space-y-20">
        {tabs.map((tab, index) => (
          <div
            key={tab.name}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="flex justify-center">{tab.screen}</div>
            <div>
              <div className="flex items-center gap-2">
                {tab.agent ? <AgentMark size={20} /> : null}
                <span className="eyebrow">Tab {index + 1}</span>
              </div>
              <h3 className="mt-3 text-[24px] font-semibold tracking-[var(--tracking-heading)] lowercase">
                {tab.name}
              </h3>
              <p className="mt-2 text-[20px] leading-[1.18] font-medium tracking-[-0.012em]">
                {tab.lead}
              </p>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-secondary-foreground">
                {tab.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
