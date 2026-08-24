import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AgentMark, Wordmark } from "@/components/apt/kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminAccess,
  googleAdminLogin,
  loginAdmin,
  logoutAdmin,
} from "@/lib/admin/admin.functions";
import { adminRedirect } from "@/lib/admin/admin-http";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Founder sign in · apt" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  loader: async () => {
    const access = await getAdminAccess();
    if (access.access === "founder") throw adminRedirect("/admin");
    return access;
  },
  component: AdminLogin,
});

function AdminLogin() {
  const initial = Route.useLoaderData();
  const unconfigured = initial.access === "unconfigured";
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const google = useServerFn(googleAdminLogin);
  const logout = useServerFn(logoutAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    unconfigured
      ? "The founder console needs its server-only Supabase environment variables."
      : initial.access === "forbidden"
        ? "This signed-in account is not a Claw founder."
        : null,
  );
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const access = await login({ data: { email, password } });
      if (access.access !== "founder")
        throw new Error("This account is not authorized as a Claw founder.");
      await router.navigate({ to: "/admin" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-theme admin-shell min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
        <header className="flex h-16 items-center">
          <a href="/" aria-label="Apt home" className="flex items-center gap-3">
            <Wordmark className="text-xl" />
            <span className="h-5 w-px bg-border-strong" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary-foreground">Founder console</span>
          </a>
        </header>
        <div className="flex flex-1 items-center justify-center py-10 sm:py-16">
          <Card className="w-full max-w-md border-border bg-card shadow-sheet">
            <CardHeader className="space-y-4 p-7 pb-5 sm:p-8 sm:pb-5">
              <div className="flex size-12 items-center justify-center rounded-full border border-border-agent bg-agent text-agent-foreground">
                <AgentMark size={24} />
              </div>
              <div>
                <p className="eyebrow mb-2 text-agent-foreground">Private control plane</p>
                <CardTitle className="text-2xl tracking-heading">Founder sign in</CardTitle>
                <CardDescription className="mt-2 leading-6">
                  Shared Claw configuration is restricted to approved Supabase UUIDs.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-7 pb-7 sm:px-8 sm:pb-8">
              <form onSubmit={(event) => void submit(event)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    className="h-11 bg-sunken text-foreground"
                    type="email"
                    disabled={unconfigured}
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    className="h-11 bg-sunken text-foreground"
                    type="password"
                    disabled={unconfigured}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-md border border-alert/40 bg-alert-wash p-3 text-sm text-alert">
                    {error}
                  </div>
                )}
                <Button className="h-11 w-full rounded-full" disabled={busy || unconfigured}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-full border-border-strong bg-card"
                  disabled={busy || unconfigured}
                  onClick={() =>
                    void (async () => {
                      try {
                        window.location.assign(await google({ data: undefined }));
                      } catch (caught) {
                        setError(
                          caught instanceof Error ? caught.message : "Google sign in failed.",
                        );
                      }
                    })()
                  }
                >
                  Continue with Google
                </Button>
                {initial.access === "forbidden" && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-full"
                    onClick={() =>
                      void (async () => {
                        await logout({ data: undefined });
                        window.location.reload();
                      })()
                    }
                  >
                    Sign out current account
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">
          Access is logged and restricted to the Apt founding team.
        </p>
      </div>
    </main>
  );
}
