import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { finishAdminOAuth } from "@/lib/admin/admin.functions";
import { adminRedirect } from "@/lib/admin/admin-http";

export const Route = createFileRoute("/admin_/auth/callback")({
  validateSearch: (search) =>
    z.object({ code: z.string().optional(), error: z.string().optional() }).parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (!deps.code) throw adminRedirect("/admin/login");
    const access = await finishAdminOAuth({ data: { code: deps.code } });
    throw adminRedirect(access.access === "founder" ? "/admin" : "/admin/login");
  },
  component: () => null,
});
