import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/apt/legal-page";
import { Wordmark } from "@/components/apt/kit";

const title = "Privacy — apt";
const description =
  "How apt handles the photos, preferences, and email addresses you share with us.";

export const Route = createFileRoute("/privacy")({
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
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy" updated="August 2026">
      <p>
        apt is in private beta. This page describes, in plain terms, what we
        collect today and how it is used.
      </p>
      <h2>What we collect</h2>
      <p>
        If you join the early-access list, we store the email address you give us.
        That's it — no tracking pixels, no advertising profiles, no sale of your
        data.
      </p>
      <h2>Photos and try-on</h2>
      <p>
        Once the app launches, any photos you upload are used only to generate
        try-on imagery for you, and to improve the recommendations you see. They
        are never shown to other users and never sold.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to delete your email or account data at any time by
        replying to any message we send you.
      </p>
    </LegalPage>
  );
}
