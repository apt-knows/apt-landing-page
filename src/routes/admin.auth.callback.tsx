import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { finishAdminOAuth } from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/admin/auth/callback")({
  validateSearch: (search) =>
    z.object({ code: z.string().optional(), error: z.string().optional() }).parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (!deps.code) throw redirect({ to: "/admin/login" });
    const access = await finishAdminOAuth({ data: { code: deps.code } });
    throw redirect({ to: access.access === "founder" ? "/admin" : "/admin/login" });
  },
  component: () => null,
});
