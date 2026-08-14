import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { addToWaitlist } from "./waitlist.server";

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ email: z.string().email() }).parse(data))
  .handler(async ({ data }) => {
    await addToWaitlist(data.email.toLowerCase());
    return { ok: true as const };
  });
