import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Eye, FileText, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminUserHarness } from "@/lib/admin/admin.functions";
import type {
  AdminUserHarness,
  AdminUserSummary,
  HarnessJson,
} from "@/lib/admin/user-harness.server";

export function UserHarnessViewer({ users }: { users: AdminUserSummary[] }) {
  const loadHarness = useServerFn(getAdminUserHarness);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [harness, setHarness] = useState<AdminUserHarness | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function inspect(userId: string) {
    setSelectedUserId(userId);
    setLoading(true);
    setError(null);
    try {
      setHarness(await loadHarness({ data: { userId } }));
    } catch (caught) {
      setHarness(null);
      setError(caught instanceof Error ? caught.message : "Unable to load this profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-agent-foreground" /> Per-user harnesses
              </CardTitle>
              <CardDescription className="mt-2 max-w-3xl">
                Founder-only, read-only visibility into the canonical files and activity that
                materialize each isolated Hermes profile. Runtime configuration and secrets are
                never returned.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-border-agent text-agent-foreground">
              <ShieldCheck className="mr-1 size-3.5" /> View only
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!users.length ? (
            <Empty text="No provisioned user profiles." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {users.map((user) => (
                <button
                  key={user.user_id}
                  type="button"
                  onClick={() => void inspect(user.user_id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${selectedUserId === user.user_id ? "border-border-agent bg-agent" : "border-border bg-sunken hover:border-border-strong"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">
                        {user.email ?? "Email unavailable"}
                      </div>
                      <div className="mt-1 break-all font-mono text-xs text-muted-foreground">
                        {user.hermes_profile_name}
                      </div>
                    </div>
                    <Badge variant="outline">{user.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-secondary-foreground">
                    <span>Profile rev {user.profile_revision ?? "—"}</span>
                    <span>Knowledge rev {user.knowledge_revision ?? "—"}</span>
                    <span>Learned {formatDate(user.last_learning_at)}</span>
                    <span>Synced {formatDate(user.last_reconciled_at)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-agent-foreground">
                    <Eye className="size-3.5" /> Inspect read-only profile
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border bg-card p-6 text-sm text-secondary-foreground shadow-card">
          Loading the isolated profile snapshot…
        </Card>
      )}
      {error && (
        <div className="rounded-md border border-alert/40 bg-alert-wash px-4 py-3 text-sm text-alert">
          {error}
        </div>
      )}
      {!loading && harness && (
        <HarnessDetails
          key={harness.user.user_id}
          harness={harness}
          onRefresh={() => void inspect(harness.user.user_id)}
        />
      )}
      {!loading && !harness && !error && users.length > 0 && (
        <Card className="border-border bg-card p-8 text-center shadow-card">
          <Eye className="mx-auto size-6 text-agent-foreground" />
          <p className="mt-3 text-sm text-secondary-foreground">
            Select either cofounder profile to inspect its canonical harness.
          </p>
        </Card>
      )}
    </div>
  );
}

function HarnessDetails({
  harness,
  onRefresh,
}: {
  harness: AdminUserHarness;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-5">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>{harness.user.email ?? harness.user.hermes_profile_name}</CardTitle>
              <CardDescription className="mt-2 break-all font-mono">
                {harness.user.user_id} · {harness.user.hermes_profile_name}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw /> Refresh snapshot
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Profile revision" value={String(harness.profile?.revision ?? "—")} />
          <Fact
            label="Knowledge revision"
            value={String(harness.profile?.knowledge_revision ?? "—")}
          />
          <Fact label="Last learning" value={formatDate(harness.profile?.last_learning_at)} />
          <Fact
            label="Last reconciliation"
            value={formatDate(harness.profile?.last_reconciled_at)}
          />
          <Fact label="Files" value={String(harness.files.length)} />
          <Fact label="Knowledge facts" value={String(harness.knowledge.length)} />
          <Fact label="Runs shown" value={String(harness.runs.length)} />
          <Fact label="Hunts shown" value={String(harness.hunts.length)} />
        </CardContent>
      </Card>

      {harness.profile?.reconciliation_error && (
        <div className="rounded-md border border-alert/40 bg-alert-wash px-4 py-3 text-sm text-alert">
          Reconciliation error: {harness.profile.reconciliation_error}
        </div>
      )}

      <Tabs defaultValue="files">
        <TabsList className="mb-5 h-auto w-full flex-wrap justify-start border border-border bg-sunken p-1">
          {(
            [
              ["files", `Files ${harness.files.length}`],
              ["knowledge", `Knowledge ${harness.knowledge.length}`],
              ["changes", `Changes ${harness.learningEvents.length}`],
              ["runs", `Runs ${harness.runs.length}`],
              ["hunts", `Hunts ${harness.hunts.length}`],
              ["proposals", `Proposals ${harness.proposals.length}`],
            ] satisfies Array<[string, string]>
          ).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="files">
          <FileViewer harness={harness} />
        </TabsContent>
        <TabsContent value="knowledge">
          <KnowledgeList harness={harness} />
        </TabsContent>
        <TabsContent value="changes">
          <ChangeList harness={harness} />
        </TabsContent>
        <TabsContent value="runs">
          <RunList harness={harness} />
        </TabsContent>
        <TabsContent value="hunts">
          <HuntList harness={harness} />
        </TabsContent>
        <TabsContent value="proposals">
          <ProposalHistory harness={harness} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FileViewer({ harness }: { harness: AdminUserHarness }) {
  const [selectedPath, setSelectedPath] = useState(harness.files[0]?.path ?? "");
  const selected = harness.files.find((file) => file.path === selectedPath) ?? null;
  if (!harness.files.length)
    return <Empty text="This profile has not materialized harness files yet." />;
  return (
    <Card className="border-border bg-card shadow-card">
      <CardContent className="grid gap-5 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-2">
          {harness.files.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedPath(file.path)}
              className={`w-full rounded-md border p-3 text-left transition-colors ${selectedPath === file.path ? "border-border-agent bg-agent" : "border-border bg-sunken hover:border-border-strong"}`}
            >
              <div className="flex items-center gap-2 font-mono text-xs text-foreground">
                <FileText className="size-3.5 shrink-0" />
                <span className="break-all">{file.path}</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                {file.kind} · rev {file.revision ?? "—"} · {file.status}
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="break-all font-mono text-sm font-medium">{selected.path}</div>
                <div className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                  sha256 {selected.checksum} · updated {formatDate(selected.updated_at)}
                </div>
              </div>
              <Badge variant="outline">Read only</Badge>
            </div>
            <pre className="max-h-[36rem] overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-sunken p-4 font-mono text-xs leading-5 text-foreground">
              {selected.content || "(empty file)"}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KnowledgeList({ harness }: { harness: AdminUserHarness }) {
  if (!harness.knowledge.length) return <Empty text="No per-user knowledge records." />;
  return (
    <div className="space-y-3">
      {harness.knowledge.map((fact) => (
        <Card key={fact.id} className="border-border bg-card shadow-card">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{fact.category}</Badge>
              <Badge variant="outline">{fact.status}</Badge>
              <Badge variant="outline">{fact.sensitivity}</Badge>
              <span className="text-xs text-muted-foreground">
                confidence {Number(fact.confidence).toFixed(3)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-foreground">{fact.fact}</p>
            <div className="mt-3 text-xs text-muted-foreground">
              {fact.subject_kind}
              {fact.subject_label ? ` · ${fact.subject_label}` : ""} · learned{" "}
              {formatDate(fact.learned_at)}
              {fact.source_agent_run_id ? ` · run ${fact.source_agent_run_id}` : ""}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChangeList({ harness }: { harness: AdminUserHarness }) {
  if (!harness.learningEvents.length) return <Empty text="No recorded harness changes." />;
  return (
    <div className="space-y-3">
      {harness.learningEvents.map((event) => (
        <Card key={event.id} className="border-border bg-card shadow-card">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{event.artifact_kind}</Badge>
              <Badge variant="outline">{event.action}</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(event.created_at)}</span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <JsonPanel label="Before" value={event.before_value} />
              <JsonPanel label="After" value={event.after_value} />
            </div>
            <div className="mt-3 break-all text-xs text-muted-foreground">
              run {event.agent_run_id ?? "—"} · artifact {event.artifact_id ?? "—"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RunList({ harness }: { harness: AdminUserHarness }) {
  if (!harness.runs.length) return <Empty text="No agent runs." />;
  return (
    <div className="space-y-3">
      {harness.runs.map((run) => (
        <Card key={run.id} className="border-border bg-card shadow-card">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{run.status}</Badge>
              <Badge>{run.claw_mode ?? "unclassified"}</Badge>
              {run.error_code && <Badge variant="destructive">{run.error_code}</Badge>}
            </div>
            <div className="mt-3 break-all font-mono text-xs text-foreground">{run.id}</div>
            <div className="mt-3 grid gap-2 text-xs text-secondary-foreground sm:grid-cols-2 lg:grid-cols-4">
              <span>Profile rev {run.claw_profile_revision ?? "—"}</span>
              <span>Knowledge rev {run.claw_knowledge_revision ?? "—"}</span>
              <span>Started {formatDate(run.started_at)}</span>
              <span>Finished {formatDate(run.finished_at)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HuntList({ harness }: { harness: AdminUserHarness }) {
  if (!harness.hunts.length) return <Empty text="No commerce Hunts." />;
  return (
    <div className="space-y-3">
      {harness.hunts.map((hunt) => (
        <Card key={hunt.id} className="border-border bg-card shadow-card">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base capitalize">{hunt.category} Hunt</CardTitle>
              <Badge variant="outline">{hunt.status}</Badge>
            </div>
            <CardDescription>
              {formatDate(hunt.created_at)} · {hunt.coarse_location_label ?? "no location retained"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            <JsonPanel
              label="Query and constraints"
              value={{ query: hunt.query, constraints: hunt.constraints }}
            />
            <JsonPanel label="Candidates" value={hunt.candidates} />
            <div className="lg:col-span-2">
              <JsonPanel label="Source URLs" value={hunt.source_urls} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProposalHistory({ harness }: { harness: AdminUserHarness }) {
  if (!harness.proposals.length) return <Empty text="No shared-change proposals from this user." />;
  return (
    <div className="space-y-3">
      {harness.proposals.map((proposal) => (
        <Card key={proposal.id} className="border-border bg-card shadow-card">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{proposal.title}</CardTitle>
              <Badge>{proposal.kind}</Badge>
              <Badge variant="outline">{proposal.status}</Badge>
            </div>
            <CardDescription>{formatDate(proposal.created_at)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-foreground">{proposal.rationale}</p>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-sunken p-4 font-mono text-xs text-foreground">
              {proposal.content}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-sunken p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-all text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function JsonPanel({ label, value }: { label: string; value: HarnessJson | undefined }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-secondary-foreground">{label}</div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-sunken p-3 font-mono text-xs leading-5 text-foreground">
        {value === null || value === undefined ? "—" : JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <Card className="border-border bg-card p-6 text-sm text-secondary-foreground shadow-card">
      {text}
    </Card>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().replace(".000Z", "Z");
}
