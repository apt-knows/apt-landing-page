import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/apt/legal-page";

const title = "Terms — apt";
const description =
  "The terms that apply to the apt early-access list and private beta.";

export const Route = createFileRoute("/terms")({
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
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms" updated="August 2026">
      <p>
        These terms cover the apt website and the early-access list. Fuller terms
        will apply when the app itself launches.
      </p>
      <h2>Early access</h2>
      <p>
        Joining the list does not guarantee a spot in the beta. We invite people
        gradually and may change or discontinue the beta at any time.
      </p>
      <h2>Your content</h2>
      <p>
        You keep ownership of anything you upload. You grant apt permission to
        process it for the purpose of generating your recommendations and try-on
        imagery.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms? Reply to any email from us and we'll answer.</p>
    </LegalPage>
  );
}
