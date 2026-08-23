import { redirect } from "@tanstack/react-router";

export const ADMIN_PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const;

export function adminRedirect(to: "/admin" | "/admin/login") {
  return redirect({ to, headers: ADMIN_PRIVATE_HEADERS });
}
