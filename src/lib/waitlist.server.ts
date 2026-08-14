/**
 * Resend hookup for waitlist signups.
 *
 * Configure these environment variables (secrets) when the domain is ready:
 *   RESEND_API_KEY        — API key from resend.com
 *   WAITLIST_FROM_EMAIL   — verified sender, e.g. "apt <hello@yourdomain.com>"
 *   WAITLIST_NOTIFY_EMAIL — internal inbox that gets a copy of each signup
 *   RESEND_AUDIENCE_ID    — optional: add the address to a Resend audience
 *
 * Until RESEND_API_KEY exists the signup still succeeds locally, so the UI can
 * be developed and demoed without credentials.
 */

const RESEND_API = "https://api.resend.com";

type Env = {
  apiKey: string | undefined;
  from: string | undefined;
  notify: string | undefined;
  audienceId: string | undefined;
};


function readEnv(): Env {
  return {
    apiKey: process.env["RESEND_API_KEY"],
    from: process.env["WAITLIST_FROM_EMAIL"],
    notify: process.env["WAITLIST_NOTIFY_EMAIL"],
    audienceId: process.env["RESEND_AUDIENCE_ID"],
  };
}

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
    throw new Error(`Resend ${path} failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export async function addToWaitlist(email: string): Promise<void> {
  const { apiKey, from, notify, audienceId } = readEnv();

  if (!apiKey) {
    // Placeholder mode — no credentials configured yet.
    console.info(`[waitlist] would register ${email} (RESEND_API_KEY not set)`);
    return;
  }

  if (audienceId) {
    await resend(apiKey, `/audiences/${audienceId}/contacts`, {
      email,
      unsubscribed: false,
    });
  }

  const sender = from ?? "apt <onboarding@resend.dev>";

  // Confirmation to the person signing up.
  await resend(apiKey, "/emails", {
    from: sender,
    to: [email],
    subject: "You're on the apt waitlist",
    html: `<p>Thanks for joining the apt waitlist.</p>
<p>apt is a personal shopping agent that learns your taste and shows you how
every piece looks on you before you buy. We're letting people in slowly — we'll
email you when your invite is ready.</p>
<p>— the apt team</p>`,
  });

  // Internal notification.
  if (notify) {
    await resend(apiKey, "/emails", {
      from: sender,
      to: [notify],
      subject: `New apt waitlist signup: ${email}`,
      html: `<p>${email} joined the apt waitlist.</p>`,
    });
  }
}
