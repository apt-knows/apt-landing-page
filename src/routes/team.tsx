import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/apt/site-footer";
import { SiteHeader } from "@/components/apt/site-header";
import { Team } from "@/components/apt/team";
import { site } from "@/content/site";

const title = "apt — the team";
const description =
  "The people building apt, a personal shopping assistant that learns your taste.";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/team` },
    ],
    links: [{ rel: "canonical", href: `${site.url}/team` }],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Team />
      </main>
      <SiteFooter />
    </div>
  );
}
