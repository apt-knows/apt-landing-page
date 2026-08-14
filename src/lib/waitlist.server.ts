/**
 * WAITLIST DELIVERY (server only)
 * ------------------------------------------------------------------
 * Sends signups through Resend. All configuration is env-driven — see
 * `.env.example` for the full list and `README.md` for the Vercel setup.
 *
 *   RESEND_API_KEY        — API key from resend.com (required to send)
 *   WAITLIST_FROM_EMAIL   — verified sender, e.g. "apt <hello@yourdomain.com>"
 *   WAITLIST_NOTIFY_EMAIL — internal inbox that gets a copy of each signup
 *   RESEND_AUDIENCE_ID    — optional Resend audience to add the contact to
 *
 * Without RESEND_API_KEY the signup still succeeds (placeholder mode) so the
 * UI can be developed and demoed with no credentials.
 */

const RESEND_API = "https://api.resend.com";

const DEFAULT_FROM = "apt <onboarding@resend.dev>";

/** Read at call time — env is injected per request, not at module scope. */
function readEnv() {
  return {
    apiKey: process.env["RESEND_API_KEY"],
    from: process.env["WAITLIST_FROM_EMAIL"] ?? DEFAULT_FROM,
    notify: process.env["WAITLIST_NOTIFY_EMAIL"],
    audienceId: process.env["RESEND_AUDIENCE_ID"],
  };
}

/** Email copy lives here so it can be edited without touching transport code. */
const templates = {
  confirmation: {
    subject: "You're on the apt waitlist",
    html: `<p>Thanks for joining the apt waitlist.</p>
<p>apt is a personal shopping agent that learns your taste and shows you how
every piece looks on you before you buy. We're letting people in slowly — we'll
email you when your invite is ready.</p>
<p>— the apt team</p>`,
  },
  notification: (email: string) => ({
    subject: `New apt waitlist signup: ${email}`,
    html: `<p>${email} joined the apt waitlist.</p>`,
  }),
};

async function resend(apiKey: string, path: string, body: unknown) {
  const res = await fetch(`${RESEND_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `Resend ${path} failed (${res.status}): ${await res.text()}`,
    );
  }
  return res.json();
}

export async function addToWaitlist(email: string): Promise<void> {
  const { apiKey, from, notify, audienceId } = readEnv();

  if (!apiKey) {
    console.info(`[waitlist] would register ${email} (RESEND_API_KEY not set)`);
    return;
  }

  if (audienceId) {
    await resend(apiKey, `/audiences/${audienceId}/contacts`, {
      email,
      unsubscribed: false,
    });
  }

  await resend(apiKey, "/emails", {
    from,
    to: [email],
    ...templates.confirmation,
  });

  if (notify) {
    await resend(apiKey, "/emails", {
      from,
      to: [notify],
      ...templates.notification(email),
    });
  }
}
