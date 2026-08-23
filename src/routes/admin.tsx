import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminConsole } from "@/components/admin/admin-console";
import { getAdminState } from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Claw admin · apt" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  loader: async () => {
    const loaded = await getAdminState();
    if (loaded.access === "anonymous") throw redirect({ to: "/admin/login" });
    return loaded;
  },
  component: AdminPage,
});

function AdminPage() {
  const loaded = Route.useLoaderData();
  if (loaded.access !== "founder")
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Founder access required</h1>
          <p className="mt-3 text-zinc-400">
            This authenticated account is not listed in the UUID-based Claw founder allowlist.
          </p>
          <a className="mt-6 inline-block underline" href="/admin/login">
            Use another account
          </a>
        </div>
      </main>
    );
  return <AdminConsole state={loaded.state} />;
}
