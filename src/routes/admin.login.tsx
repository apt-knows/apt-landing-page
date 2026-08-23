import { useState } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Founder sign in · apt" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  loader: async () => {
    const access = await getAdminAccess();
    if (access.access === "founder") throw redirect({ to: "/admin" });
    return access;
  },
  component: AdminLogin,
});

function AdminLogin() {
  const initial = Route.useLoaderData();
  const router = useRouter();
  const login = useServerFn(loginAdmin);
  const google = useServerFn(googleAdminLogin);
  const logout = useServerFn(logoutAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    initial.access === "forbidden" ? "This signed-in account is not a Claw founder." : null,
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Founder sign in</CardTitle>
          <CardDescription className="text-zinc-400">
            Shared Claw configuration is restricted to approved Supabase UUIDs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void submit(event)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error && (
              <div className="rounded border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <Button className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-zinc-700"
              disabled={busy}
              onClick={() =>
                void (async () => {
                  try {
                    window.location.assign(await google({ data: undefined }));
                  } catch (caught) {
                    setError(caught instanceof Error ? caught.message : "Google sign in failed.");
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
                className="w-full"
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
    </main>
  );
}
