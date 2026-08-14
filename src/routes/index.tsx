import { createFileRoute } from "@tanstack/react-router";

import { EarlyAccess } from "@/components/apt/early-access";
import { Hero } from "@/components/apt/hero";
import { HowItWorks } from "@/components/apt/how-it-works";
import { Principle } from "@/components/apt/principle";
import { SiteFooter } from "@/components/apt/site-footer";
import { SiteHeader } from "@/components/apt/site-header";
import { AppTabs } from "@/components/apt/tabs";
import { Team } from "@/components/apt/team";
import { TryOn } from "@/components/apt/try-on";

const title = "apt — shopping that's about you";
const description =
  "apt is a personal shopping agent that learns your taste and shows you how every piece looks on you before you buy. Join the early-access list.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Principle />
        <HowItWorks />
        <AppTabs />
        <TryOn />
        <Team />
        <EarlyAccess />
      </main>
      <SiteFooter />
    </div>
  );
}
