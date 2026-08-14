/**
 * Single entry point for waitlist signups.
 *
 * Nothing is persisted yet — when Resend (and a stored list) is wired up,
 * only the body of `submitWaitlist` changes; no UI touches required.
 */

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; email: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { status: "error", message: "Enter your email to join." };
  if (!EMAIL.test(email))
    return { status: "error", message: "That email doesn't look right." };

  // Placeholder for the Resend hookup.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { status: "success", email };
}
