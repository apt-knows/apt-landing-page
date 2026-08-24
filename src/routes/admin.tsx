import { createFileRoute } from "@tanstack/react-router";
import { AgentMark, Wordmark } from "@/components/apt/kit";
import { AdminConsole } from "@/components/admin/admin-console";
import { getAdminState } from "@/lib/admin/admin.functions";
import { adminRedirect } from "@/lib/admin/admin-http";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Claw admin · apt" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  loader: async () => {
    const loaded = await getAdminState();
    if (loaded.access === "anonymous") throw adminRedirect("/admin/login");
    return loaded;
  },
  component: AdminPage,
});

function AdminPage() {
  const loaded = Route.useLoaderData();
  if (loaded.access === "unconfigured")
    return (
      <AdminAccessState
        title="Founder console setup required"
        description="Add the server-only Supabase environment variables to this deployment, then redeploy."
      />
    );
  if (loaded.access !== "founder")
    return (
      <AdminAccessState
        title="Founder access required"
        description="This authenticated account is not listed in the UUID-based Claw founder allowlist."
        action={{ href: "/admin/login", label: "Use another account" }}
      />
    );
  return <AdminConsole state={loaded.state} />;
}

function AdminAccessState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <main className="admin-theme admin-shell flex min-h-screen flex-col text-foreground">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center px-5 sm:px-8 lg:px-10">
        <a href="/" aria-label="Apt home" className="flex items-center gap-3">
          <Wordmark className="text-xl" />
          <span className="h-5 w-px bg-border-strong" aria-hidden="true" />
          <span className="text-sm font-medium text-secondary-foreground">Founder console</span>
        </a>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sheet">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border-agent bg-agent text-agent-foreground">
            <AgentMark size={24} />
          </div>
          <p className="eyebrow mt-5 text-agent-foreground">Private control plane</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-heading">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-secondary-foreground">{description}</p>
          {action && (
            <a
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              href={action.href}
            >
              {action.label}
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
