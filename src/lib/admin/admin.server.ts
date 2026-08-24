import { createHash } from "node:crypto";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  currentAdmin,
  requestSupabaseClient,
  requireAdmin,
  serviceSupabaseClient,
} from "./supabase.server";
import { allowedCapabilities, stableJson } from "./admin-policy";
export { releaseDiff, validateDraft } from "./admin-policy";

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export async function getAccess() {
  return currentAdmin();
}

export async function signInWithPassword(email: string, password: string) {
  const client = requestSupabaseClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error("The email or password was not accepted.");
  return currentAdmin();
}

export async function startGoogleSignIn() {
  const client = requestSupabaseClient();
  const callback = new URL("/admin/auth/callback", getRequestUrl()).toString();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new Error("Unable to start Google sign in.");
  return data.url;
}

export async function exchangeOAuthCode(code: string) {
  const client = requestSupabaseClient();
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) throw new Error("The sign-in callback is invalid or expired.");
  return currentAdmin();
}

export async function signOutAdmin() {
  const client = requestSupabaseClient();
  await client.auth.signOut();
  return { ok: true as const };
}

export interface AdminRelease {
  id: string;
  version: number;
  name: string;
  status: "draft" | "published" | "archived";
  base_release_id: string | null;
  change_note: string;
  revision: number;
  content_checksum: string | null;
  validation_result: Record<string, JsonValue>;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  published_by: string | null;
}

export interface AdminDocument {
  id: string;
  release_id: string;
  key: string;
  kind: "core" | "soul_template" | "policy" | "intent" | "merchant" | "skill";
  title: string;
  content: string;
  enabled: boolean;
  metadata: Record<string, JsonValue>;
  checksum: string;
}

export interface AdminCapability {
  id: string;
  release_id: string;
  key: string;
  kind: "toolset" | "mcp";
  enabled: boolean;
  config: Record<string, JsonValue>;
  instructions: string;
  secret_refs: string[];
  checksum: string;
}

export interface AdminProposal {
  id: string;
  kind: string;
  title: string;
  rationale: string;
  content: string;
  status: string;
  agent_run_id: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  submitter_profile_id: string | null;
}

export interface AdminState {
  founderId: string;
  releases: AdminRelease[];
  documents: AdminDocument[];
  capabilities: AdminCapability[];
  proposals: AdminProposal[];
  overview: {
    provisionedProfiles: number;
    privateProfiles: number;
    reconciliationErrors: number;
    pendingProposals: number;
  };
}

export async function loadAdminState(): Promise<
  { access: "anonymous" | "forbidden" | "unconfigured" } | { access: "founder"; state: AdminState }
> {
  const admin = await currentAdmin();
  if (admin.access !== "founder") return { access: admin.access };
  const service = serviceSupabaseClient();
  const [releases, documents, capabilities, proposalRows, instances, privateProfiles, errors] =
    await Promise.all([
      service
        .from("claw_releases")
        .select(
          "id,version,name,status,base_release_id,change_note,revision,content_checksum,validation_result,created_at,updated_at,published_at,published_by",
        )
        .order("version", { ascending: false }),
      service
        .from("claw_documents")
        .select("id,release_id,key,kind,title,content,enabled,metadata,checksum")
        .order("key"),
      service
        .from("claw_capabilities")
        .select("id,release_id,key,kind,enabled,config,instructions,secret_refs,checksum")
        .order("key"),
      service
        .from("claw_learning_proposals")
        .select(
          "id,kind,title,rationale,content,status,user_id,agent_run_id,created_at,reviewed_at,reviewed_by",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      service.from("agent_instances").select("user_id,hermes_profile_name"),
      service.from("claw_user_profiles").select("user_id", { count: "exact", head: true }),
      service
        .from("claw_user_profiles")
        .select("user_id", { count: "exact", head: true })
        .not("reconciliation_error", "is", null),
    ]);
  for (const result of [
    releases,
    documents,
    capabilities,
    proposalRows,
    instances,
    privateProfiles,
    errors,
  ]) {
    if (result.error) throw new Error("Unable to load the Claw admin state.");
  }
  const profileByUser = new Map(
    (instances.data ?? []).map((row) => [row.user_id, row.hermes_profile_name]),
  );
  const proposals = (proposalRows.data ?? []).map((row) => {
    const { user_id: userId, ...proposal } = row;
    return {
      ...proposal,
      submitter_profile_id: userId ? (profileByUser.get(userId) ?? null) : null,
    } as AdminProposal;
  });
  return {
    access: "founder",
    state: {
      founderId: admin.userId,
      releases: (releases.data ?? []) as AdminRelease[],
      documents: (documents.data ?? []) as AdminDocument[],
      capabilities: (capabilities.data ?? []) as AdminCapability[],
      proposals,
      overview: {
        provisionedProfiles: instances.data?.length ?? 0,
        privateProfiles: privateProfiles.count ?? 0,
        reconciliationErrors: errors.count ?? 0,
        pendingProposals: proposals.filter((proposal) => proposal.status === "pending").length,
      },
    },
  };
}

export async function createRelease(input: { name: string; changeNote: string }) {
  const admin = await requireAdmin();
  const service = serviceSupabaseClient();
  const { data, error } = await service.rpc("claw_create_release", {
    p_founder_id: admin.userId,
    p_release_name: input.name,
    p_change_note: input.changeNote,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function cloneRelease(input: {
  sourceReleaseId: string;
  name: string;
  changeNote: string;
}) {
  const admin = await requireAdmin();
  const service = serviceSupabaseClient();
  const { data, error } = await service.rpc("claw_clone_release", {
    p_source_release_id: input.sourceReleaseId,
    p_founder_id: admin.userId,
    p_release_name: input.name,
    p_release_change_note: input.changeNote,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function saveDocument(input: {
  releaseId: string;
  expectedRevision: number;
  key: string;
  kind: AdminDocument["kind"];
  title: string;
  content: string;
  enabled: boolean;
  metadata: Record<string, unknown>;
}) {
  const admin = await requireAdmin();
  const checksum = hash(input.content);
  const { data, error } = await serviceSupabaseClient().rpc("claw_save_document", {
    p_founder_id: admin.userId,
    p_release_id: input.releaseId,
    p_expected_revision: input.expectedRevision,
    p_key: input.key,
    p_kind: input.kind,
    p_title: input.title,
    p_content: input.content,
    p_enabled: input.enabled,
    p_metadata: input.metadata,
    p_checksum: checksum,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function saveCapability(input: {
  releaseId: string;
  expectedRevision: number;
  key: string;
  kind: AdminCapability["kind"];
  enabled: boolean;
  config: Record<string, unknown>;
  instructions: string;
  secretRefs: string[];
}) {
  const admin = await requireAdmin();
  if (!allowedCapabilities.has(input.key))
    throw new Error("Capability is outside the code-approved allowlist.");
  const checksum = hash(
    stableJson({
      key: input.key,
      kind: input.kind,
      enabled: input.enabled,
      config: input.config,
      instructions: input.instructions,
      secretRefs: input.secretRefs,
    }),
  );
  const { data, error } = await serviceSupabaseClient().rpc("claw_save_capability", {
    p_founder_id: admin.userId,
    p_release_id: input.releaseId,
    p_expected_revision: input.expectedRevision,
    p_key: input.key,
    p_kind: input.kind,
    p_enabled: input.enabled,
    p_config: input.config,
    p_instructions: input.instructions,
    p_secret_refs: input.secretRefs,
    p_checksum: checksum,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function reviewProposal(input: {
  proposalId: string;
  decision: "accepted" | "rejected";
  releaseId?: string;
  expectedRevision?: number;
  targetKey?: string;
}) {
  const admin = await requireAdmin();
  const { data, error } = await serviceSupabaseClient().rpc("claw_review_proposal", {
    p_founder_id: admin.userId,
    p_proposal_id: input.proposalId,
    p_decision: input.decision,
    p_release_id: input.releaseId ?? null,
    p_expected_revision: input.expectedRevision ?? null,
    p_target_key: input.targetKey ?? null,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function publishRelease(input: {
  releaseId: string;
  expectedRevision: number;
  changeNote: string;
}) {
  const admin = await requireAdmin();
  const { data, error } = await serviceSupabaseClient().rpc("claw_publish_release", {
    p_release_id: input.releaseId,
    p_founder_id: admin.userId,
    p_expected_revision: input.expectedRevision,
    p_publish_change_note: input.changeNote,
  });
  if (error) throw adminError(error.message);
  return data;
}

export async function rollbackRelease(input: {
  sourceReleaseId: string;
  name: string;
  changeNote: string;
}) {
  const cloned = await cloneRelease(input);
  const release = Array.isArray(cloned) ? cloned[0] : cloned;
  if (!release?.id) throw new Error("Rollback draft was not created.");
  return publishRelease({
    releaseId: release.id,
    expectedRevision: Number(release.revision),
    changeNote: input.changeNote,
  });
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function adminError(message: string) {
  if (/revision conflict/i.test(message))
    return new Error("This draft changed in another session. Reload before saving again.");
  return new Error(message);
}

export const adminSchemas = {
  login: z.object({ email: z.string().email(), password: z.string().min(1).max(1_000) }),
};
