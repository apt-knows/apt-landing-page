/**
 * Single entry point for waitlist signups.
 *
 * The actual delivery happens server-side in `waitlist.server.ts` (Resend).
 */

import { joinWaitlist } from "./waitlist.functions";

export type WaitlistState =
  { status: "idle" } | { status: "error"; message: string } | { status: "success"; email: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { status: "error", message: "Enter your email to join." };
  if (!EMAIL.test(email)) return { status: "error", message: "That email doesn't look right." };

  try {
    await joinWaitlist({ data: { email } });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success", email };
}
