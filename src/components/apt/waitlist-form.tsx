import { useActionState } from "react";

import { submitWaitlist, type WaitlistState } from "@/lib/waitlist";
import { Button } from "./kit";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm({ id, size = "md" }: { id: string; size?: "md" | "lg" }) {
  const [state, action, pending] = useActionState(submitWaitlist, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-full border border-border-agent bg-agent px-5 py-3.5 text-[15px] text-agent-foreground">
        You're on the list — we'll email {state.email} when apt opens up.
      </div>
    );
  }

  return (
    <form action={action} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          className="min-h-11 flex-1 rounded-full border border-border-strong bg-card px-5 text-[15px] text-foreground placeholder:text-muted-foreground"
        />
        <Button type="submit" size={size} disabled={pending}>
          {pending ? "Joining…" : "Join the waitlist"}
        </Button>
      </div>
      <p
        className="mt-2 min-h-5 pl-1 text-[13px] text-alert"
        role="status"
        aria-live="polite"
      >
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
