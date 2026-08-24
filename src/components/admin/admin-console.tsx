import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";
import { AgentMark, Wordmark } from "@/components/apt/kit";
import { UserHarnessViewer } from "@/components/admin/user-harness-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  cloneAdminRelease,
  createAdminRelease,
  logoutAdmin,
  publishAdminRelease,
  reviewAdminProposal,
  rollbackAdminRelease,
  saveAdminCapability,
  saveAdminDocument,
  validateAdminRelease,
} from "@/lib/admin/admin.functions";
import { requiredCapabilityKind } from "@/lib/admin/admin-policy";
import type { AdminCapability, AdminDocument, AdminState } from "@/lib/admin/admin.server";

const effectiveDenyList = [
  "browser use outside read-only commerce Hunts",
  "terminal/filesystem/code execution",
  "vision/media generation",
  "delegation/cron",
  "arbitrary MCP",
  "cart/checkout/purchase/tracking",
];

export function AdminConsole({ state }: { state: AdminState }) {
  const router = useRouter();
  const [draftId, setDraftId] = useState(
    state.releases.find((release) => release.status === "draft")?.id ?? "",
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    valid: boolean;
    issues: string[];
    diff: Array<{ key: string }>;
  } | null>(null);
  const validate = useServerFn(validateAdminRelease);
  const publish = useServerFn(publishAdminRelease);
  const logout = useServerFn(logoutAdmin);
  const draft =
    state.releases.find((release) => release.id === draftId && release.status === "draft") ?? null;
  const published = state.releases.find((release) => release.status === "published") ?? null;

  async function action(operation: () => Promise<unknown>, success: string) {
    setError(null);
    setNotice(null);
    try {
      await operation();
      setNotice(success);
      await router.invalidate();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The action failed.");
    }
  }

  return (
    <main className="admin-theme admin-shell min-h-screen text-foreground">
      <div className="border-b border-border bg-[var(--scrim-chrome)] backdrop-blur-[14px] backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Apt home">
            <Wordmark className="text-xl" />
            <span className="h-5 w-px bg-border-strong" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary-foreground">Founder console</span>
          </a>
          <Button
            variant="outline"
            className="rounded-full border-border-strong bg-card"
            onClick={() =>
              void action(async () => {
                await logout({ data: undefined });
                window.location.assign("/admin/login");
              }, "Signed out.")
            }
          >
            <LogOut /> Sign out
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow mb-3 flex items-center gap-2 text-agent-foreground">
              <AgentMark size={14} /> Founder control plane
            </div>
            <h1 className="text-3xl font-semibold tracking-heading sm:text-4xl">
              Claw shared harness
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary-foreground">
              Draft, validate, publish, and roll back shared commerce behavior. Authorized founders
              can also inspect each isolated user harness through a separate read-only view.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border-agent bg-agent px-4 py-2 text-sm font-medium text-agent-foreground">
            <ShieldCheck className="size-4" /> UUID authorized
          </div>
        </header>

        {(notice || error) && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${error ? "border-alert/40 bg-alert-wash text-alert" : "border-border-agent bg-agent text-agent-foreground"}`}
          >
            {error ?? notice}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Metric
            label="Published release"
            value={published ? `v${published.version}` : "None"}
            detail={published?.content_checksum?.slice(0, 12) ?? "Fail-closed"}
          />
          <Metric
            label="Provisioned profiles"
            value={String(state.overview.provisionedProfiles)}
            detail={`${state.overview.privateProfiles} private artifact rows`}
          />
          <Metric
            label="Pending proposals"
            value={String(state.overview.pendingProposals)}
            detail="Sanitized shared changes"
          />
          <Metric
            label="Reconciliation errors"
            value={String(state.overview.reconciliationErrors)}
            detail="Aggregate metadata only"
            warning={state.overview.reconciliationErrors > 0}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="min-w-64 flex-1">
            <Label className="mb-2 block">Working draft</Label>
            <Select
              value={draftId}
              onValueChange={(value) => {
                setDraftId(value);
                setValidation(null);
              }}
            >
              <SelectTrigger className="border-border-strong bg-sunken">
                <SelectValue placeholder="Create or clone a draft" />
              </SelectTrigger>
              <SelectContent className="admin-theme">
                {state.releases
                  .filter((release) => release.status === "draft")
                  .map((release) => (
                    <SelectItem key={release.id} value={release.id}>
                      v{release.version} · {release.name} · rev {release.revision}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            disabled={!draft}
            onClick={() =>
              draft &&
              void action(async () => {
                const result = await validate({ data: { releaseId: draft.id } });
                setValidation({ ...result.validation, diff: result.diff });
              }, "Validation completed.")
            }
          >
            Validate
          </Button>
          <Button
            disabled={!draft || !validation?.valid}
            onClick={() =>
              draft &&
              void action(
                () =>
                  publish({
                    data: {
                      releaseId: draft.id,
                      expectedRevision: draft.revision,
                      changeNote: draft.change_note || `Publish Claw v${draft.version}`,
                    },
                  }),
                `Published v${draft.version}.`,
              )
            }
          >
            Publish
          </Button>
        </div>

        {validation && (
          <div
            className={`mb-6 rounded-md border p-4 text-sm ${validation.valid ? "border-border-agent bg-agent" : "border-alert/40 bg-alert-wash"}`}
          >
            <div className="flex items-center gap-2 font-medium">
              {validation.valid ? (
                <CheckCircle2 className="size-4 text-agent-foreground" />
              ) : (
                <AlertTriangle className="size-4 text-alert" />
              )}
              {validation.valid ? "Draft is valid" : "Draft needs work"}
            </div>
            {validation.issues.map((issue) => (
              <div key={issue} className="mt-2 text-foreground">
                • {issue}
              </div>
            ))}
            <div className="mt-3 text-secondary-foreground">
              Deterministic diff:{" "}
              {validation.diff.length
                ? validation.diff.map((item) => item.key).join(", ")
                : "no changes from base"}
            </div>
          </div>
        )}

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 h-auto w-full flex-wrap justify-start border border-border bg-sunken p-1">
            {[
              "overview",
              "core",
              "intents",
              "merchants",
              "skills",
              "tools",
              "proposals",
              "users",
              "releases",
            ].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview">
            <Overview state={state} published={published} />
          </TabsContent>
          <TabsContent value="core">
            <DocumentEditor
              title="Core and default Soul"
              description="Shared identity, Soul seed, policy, routing, privacy, and unsupported-action boundaries."
              state={state}
              draft={draft}
              kinds={["core", "soul_template", "policy"]}
              onAction={action}
            />
          </TabsContent>
          <TabsContent value="intents">
            <DocumentEditor
              title="Intents"
              description="Retail, grocery, and food intent documents. Release validation requires all three keys."
              state={state}
              draft={draft}
              kinds={["intent"]}
              onAction={action}
            />
          </TabsContent>
          <TabsContent value="merchants">
            <DocumentEditor
              title="Merchants"
              description="Merchant domains, supported sectors, caveats, and retrieval guidance live in metadata and content."
              state={state}
              draft={draft}
              kinds={["merchant"]}
              onAction={action}
            />
          </TabsContent>
          <TabsContent value="skills">
            <DocumentEditor
              title="Shared skills"
              description="Apt-authored and allowlisted upstream skill snapshots. Live content remains in Supabase."
              state={state}
              draft={draft}
              kinds={["skill"]}
              onAction={action}
            />
          </TabsContent>
          <TabsContent value="tools">
            <CapabilityEditor state={state} draft={draft} onAction={action} />
          </TabsContent>
          <TabsContent value="proposals">
            <ProposalList state={state} draft={draft} onAction={action} />
          </TabsContent>
          <TabsContent value="users">
            <UserHarnessViewer users={state.users} />
          </TabsContent>
          <TabsContent value="releases">
            <ReleaseManager state={state} onAction={action} setDraftId={setDraftId} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  warning = false,
}: {
  label: string;
  value: string;
  detail: string;
  warning?: boolean;
}) {
  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={warning ? "text-alert" : "text-foreground"}>{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{detail}</CardContent>
    </Card>
  );
}

function Overview({
  state,
  published,
}: {
  state: AdminState;
  published: AdminState["releases"][number] | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Active release</CardTitle>
          <CardDescription>New runs pin this immutable release.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row
            label="Version"
            value={published ? `v${published.version}` : "None — user runs fail closed"}
          />
          <Row
            label="Validation"
            value={String(published?.validation_result?.["valid"] ?? false)}
          />
          <Row label="Published at" value={published?.published_at ?? "—"} />
          <Row label="Publisher UUID" value={published?.published_by ?? "—"} />
        </CardContent>
      </Card>
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Artifact health</CardTitle>
          <CardDescription>
            Private content is available only in the founder-gated, read-only Users view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Private profiles" value={String(state.overview.privateProfiles)} />
          <Row label="Provisioned profiles" value={String(state.overview.provisionedProfiles)} />
          <Row label="Reconciliation errors" value={String(state.overview.reconciliationErrors)} />
          <Row label="Pending proposals" value={String(state.overview.pendingProposals)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2">
      <span className="text-secondary-foreground">{label}</span>
      <span className="max-w-[65%] break-all text-right">{value}</span>
    </div>
  );
}

type DocumentKind = AdminDocument["kind"];
function DocumentEditor({
  title,
  description,
  state,
  draft,
  kinds,
  onAction,
}: {
  title: string;
  description: string;
  state: AdminState;
  draft: AdminState["releases"][number] | null;
  kinds: DocumentKind[];
  onAction: (operation: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const save = useServerFn(saveAdminDocument);
  const documents = useMemo(
    () =>
      state.documents.filter(
        (document) => document.release_id === draft?.id && kinds.includes(document.kind),
      ),
    [draft?.id, kinds, state.documents],
  );
  const [selectedId, setSelectedId] = useState("");
  const selected = documents.find((document) => document.id === selectedId);
  const [form, setForm] = useState({
    key: "",
    kind: kinds[0] ?? "policy",
    title: "",
    content: "",
    enabled: true,
    metadata: "{}",
  });
  function select(id: string) {
    setSelectedId(id);
    const document = documents.find((item) => item.id === id);
    if (document)
      setForm({
        key: document.key,
        kind: document.kind,
        title: document.title,
        content: document.content,
        enabled: document.enabled,
        metadata: JSON.stringify(document.metadata, null, 2),
      });
  }
  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full border-border-strong"
            onClick={() => {
              setSelectedId("");
              setForm({
                key: "",
                kind: kinds[0] ?? "policy",
                title: "",
                content: "",
                enabled: true,
                metadata: "{}",
              });
            }}
          >
            New document
          </Button>
          {documents.map((document) => (
            <button
              key={document.id}
              onClick={() => select(document.id)}
              className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${selectedId === document.id ? "border-border-agent bg-agent text-agent-foreground" : "border-border bg-sunken text-foreground hover:border-border-strong"}`}
            >
              <div className="font-medium">{document.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {document.key} · {document.enabled ? "enabled" : "disabled"}
              </div>
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Key">
              <Input
                value={form.key}
                onChange={(event) => setForm({ ...form, key: event.target.value })}
              />
            </Field>
            <Field label="Kind">
              <Select
                value={form.kind}
                onValueChange={(kind: DocumentKind) => setForm({ ...form, kind })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-theme">
                  {kinds.map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {kind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </Field>
          <Field label="Content">
            <Textarea
              className="min-h-72 font-mono"
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
            />
          </Field>
          <Field label="Metadata JSON">
            <Textarea
              className="min-h-28 font-mono"
              value={form.metadata}
              onChange={(event) => setForm({ ...form, metadata: event.target.value })}
            />
          </Field>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.enabled}
                onCheckedChange={(enabled) => setForm({ ...form, enabled })}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              disabled={!draft || !form.key || !form.title || !form.content}
              onClick={() =>
                draft &&
                void onAction(
                  () =>
                    save({
                      data: {
                        releaseId: draft.id,
                        expectedRevision: draft.revision,
                        key: form.key,
                        kind: form.kind,
                        title: form.title,
                        content: form.content,
                        enabled: form.enabled,
                        metadata: JSON.parse(form.metadata) as Record<string, unknown>,
                      },
                    }),
                  `${selected ? "Updated" : "Created"} ${form.key}.`,
                )
              }
            >
              Save draft
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CapabilityEditor({
  state,
  draft,
  onAction,
}: {
  state: AdminState;
  draft: AdminState["releases"][number] | null;
  onAction: (operation: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const save = useServerFn(saveAdminCapability);
  const capabilities = state.capabilities.filter((item) => item.release_id === draft?.id);
  const [form, setForm] = useState({
    key: "memory" as AdminCapability["key"],
    kind: "toolset" as AdminCapability["kind"],
    enabled: true,
    config: "{}",
    instructions: "",
    secretRefs: "",
  });
  function select(capability: AdminCapability) {
    setForm({
      key: capability.key,
      kind: requiredCapabilityKind(capability.key) ?? capability.kind,
      enabled: capability.enabled,
      config: JSON.stringify(capability.config, null, 2),
      instructions: capability.instructions,
      secretRefs: capability.secret_refs.join(", "),
    });
  }
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Tools and MCP</CardTitle>
          <CardDescription>
            Only five code-approved capabilities can be saved. Secret values never enter Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability) => (
              <Button key={capability.id} variant="outline" onClick={() => select(capability)}>
                {capability.key}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Capability">
              <Select
                value={form.key}
                onValueChange={(key) => {
                  const kind = requiredCapabilityKind(key);
                  if (!kind) return;
                  setForm({
                    ...form,
                    key,
                    kind,
                    secretRefs: key === "apt_bridge" ? "APT_BRIDGE_TOKEN" : "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-theme">
                  {["memory", "session_search", "skills", "browser", "apt_bridge"].map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Kind">
              <Input className="bg-sunken" value={form.kind} readOnly aria-readonly="true" />
              <p className="text-xs text-muted-foreground">
                Fixed by the code-approved capability policy.
              </p>
            </Field>
          </div>
          <Field label="Bounded config JSON">
            <Textarea
              className="min-h-36 font-mono"
              value={form.config}
              onChange={(event) => setForm({ ...form, config: event.target.value })}
            />
          </Field>
          <Field label="Instructions">
            <Textarea
              value={form.instructions}
              onChange={(event) => setForm({ ...form, instructions: event.target.value })}
            />
          </Field>
          <Field label="Secret reference names (comma separated)">
            <Input
              value={form.secretRefs}
              onChange={(event) => setForm({ ...form, secretRefs: event.target.value })}
            />
          </Field>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.enabled}
                onCheckedChange={(enabled) => setForm({ ...form, enabled })}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              disabled={!draft}
              onClick={() =>
                draft &&
                void onAction(
                  () =>
                    save({
                      data: {
                        releaseId: draft.id,
                        expectedRevision: draft.revision,
                        key: form.key as "memory",
                        kind: form.kind,
                        enabled: form.enabled,
                        config: JSON.parse(form.config) as Record<string, unknown>,
                        instructions: form.instructions,
                        secretRefs: form.secretRefs
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      },
                    }),
                  `Saved ${form.key}.`,
                )
              }
            >
              Save draft
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Effective deny list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {effectiveDenyList.map((item) => (
            <div
              key={item}
              className="rounded-md border border-border bg-sunken px-3 py-2 text-sm text-secondary-foreground"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ProposalList({
  state,
  draft,
  onAction,
}: {
  state: AdminState;
  draft: AdminState["releases"][number] | null;
  onAction: (operation: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const review = useServerFn(reviewAdminProposal);
  const pending = state.proposals.filter((proposal) => proposal.status === "pending");
  const [keys, setKeys] = useState<Record<string, string>>({});
  return (
    <div className="space-y-4">
      {!pending.length && (
        <Card className="border-border bg-card p-6 text-sm text-secondary-foreground shadow-card">
          No pending proposals.
        </Card>
      )}
      {pending.map((proposal) => (
        <Card key={proposal.id} className="border-border bg-card shadow-card">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{proposal.title}</CardTitle>
              <Badge>{proposal.kind}</Badge>
            </div>
            <CardDescription>
              Profile {proposal.submitter_profile_id ?? "deleted"} · run{" "}
              {proposal.agent_run_id ?? "unavailable"} · {proposal.created_at}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-foreground">{proposal.rationale}</div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-sunken p-4 text-xs text-foreground">
              {proposal.content}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Input
                className="max-w-72"
                placeholder="Target key for merge"
                value={keys[proposal.id] ?? ""}
                onChange={(event) => setKeys({ ...keys, [proposal.id]: event.target.value })}
              />
              <Button
                variant="outline"
                onClick={() =>
                  void onAction(
                    () => review({ data: { proposalId: proposal.id, decision: "rejected" } }),
                    "Proposal rejected.",
                  )
                }
              >
                Reject proposal
              </Button>
              <Button
                disabled={!draft || !keys[proposal.id]}
                onClick={() =>
                  draft &&
                  void onAction(
                    () =>
                      review({
                        data: {
                          proposalId: proposal.id,
                          decision: "accepted",
                          releaseId: draft.id,
                          expectedRevision: draft.revision,
                          targetKey: keys[proposal.id],
                        },
                      }),
                    "Proposal merged into draft.",
                  )
                }
              >
                Merge into draft
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReleaseManager({
  state,
  onAction,
  setDraftId,
}: {
  state: AdminState;
  onAction: (operation: () => Promise<unknown>, success: string) => Promise<void>;
  setDraftId: (id: string) => void;
}) {
  const create = useServerFn(createAdminRelease);
  const clone = useServerFn(cloneAdminRelease);
  const rollback = useServerFn(rollbackAdminRelease);
  const [name, setName] = useState("Claw release");
  const [note, setNote] = useState("");
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle>Create a draft</CardTitle>
          <CardDescription>
            Create release 1 or clone any immutable release for a new version.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input
            className="max-w-xs"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            className="min-w-72 flex-1"
            placeholder="Change note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button
            onClick={() =>
              void onAction(async () => {
                const release = await create({ data: { name, changeNote: note } });
                if (release?.id) setDraftId(release.id);
              }, "Draft created.")
            }
          >
            Create empty draft
          </Button>
        </CardContent>
      </Card>
      {state.releases.map((release) => (
        <Card key={release.id} className="border-border bg-card shadow-card">
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <div className="min-w-48 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  v{release.version} · {release.name}
                </span>
                <Badge variant="outline">{release.status}</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                rev {release.revision} · {release.content_checksum?.slice(0, 12) ?? "no checksum"} ·{" "}
                {release.change_note || "no change note"}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                void onAction(async () => {
                  const result = await clone({
                    data: {
                      sourceReleaseId: release.id,
                      name: `${release.name} — draft`,
                      changeNote: `Derived from v${release.version}`,
                    },
                  });
                  const cloned = Array.isArray(result) ? result[0] : result;
                  if (cloned?.id) setDraftId(cloned.id);
                }, "Release cloned into a new draft.")
              }
            >
              Clone draft
            </Button>
            {release.status !== "draft" && (
              <Button
                variant="outline"
                onClick={() =>
                  void onAction(
                    () =>
                      rollback({
                        data: {
                          sourceReleaseId: release.id,
                          name: `Rollback to v${release.version}`,
                          changeNote: `Rollback to v${release.version}: ${note || "founder-approved restoration"}`,
                        },
                      }),
                    `Published rollback derived from v${release.version}.`,
                  )
                }
              >
                Roll back
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
