import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/apt/hero";
import { HowItWorks } from "@/components/apt/how-it-works";
import { SiteFooter } from "@/components/apt/site-footer";
import { SiteHeader } from "@/components/apt/site-header";
import { site } from "@/content/site";

const title = "apt";
const description =
  "apt is your personal shopping assistant that learns your taste, searches across your stores, and brings back the few products that fit. Join the early-access list.";
const ogImage = `${site.url}/og-image.jpg`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/` },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: `${site.url}/` }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
