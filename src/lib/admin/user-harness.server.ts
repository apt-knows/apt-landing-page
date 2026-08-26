import { createHash } from "node:crypto";
import { stableJson } from "./admin-policy";
import { requireAdmin, serviceSupabaseClient } from "./supabase.server";

export type HarnessJson =
  string | number | boolean | null | HarnessJson[] | { [key: string]: HarnessJson };

export interface AdminUserSummary {
  user_id: string;
  email: string | null;
  hermes_profile_name: string;
  hermes_session_id: string;
  status: "ready" | "disabled";
  profile_revision: number | null;
  knowledge_revision: number | null;
  runtime_hash: string | null;
  last_learning_at: string | null;
  last_reconciled_at: string | null;
  reconciliation_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminHarnessProfile {
  user_id: string;
  soul_text: string;
  hot_user_text: string;
  hot_memory_text: string;
  revision: number;
  knowledge_revision: number;
  runtime_hash: string | null;
  last_learning_at: string | null;
  last_reconciled_at: string | null;
  reconciliation_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminHarnessSkill {
  id: string;
  key: string;
  title: string;
  content: string;
  metadata: Record<string, HarnessJson>;
  status: "active" | "archived";
  revision: number;
  checksum: string;
  source_agent_run_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminHarnessFile {
  path: string;
  kind: "profile" | "private_skill" | "runtime_marker";
  content: string;
  checksum: string;
  revision: number | null;
  status: "active" | "archived" | "materialized" | "pending";
  updated_at: string | null;
}

export interface AdminHarnessKnowledge {
  id: string;
  subject_kind: "self" | "recipient" | "relationship" | "other";
  subject_label: string | null;
  category: string;
  fact: string;
  confidence: number;
  sensitivity: "low" | "sensitive";
  status: "active" | "forgotten" | "superseded" | "expired";
  source_message_id: string | null;
  source_agent_run_id: string | null;
  learned_at: string;
  last_confirmed_at: string | null;
  expires_at: string | null;
  updated_at: string;
}

export interface AdminHarnessLearningEvent {
  id: string;
  agent_run_id: string | null;
  source_message_id: string | null;
  artifact_kind: "knowledge" | "user_profile" | "memory" | "soul" | "private_skill";
  action: "add" | "replace" | "remove" | "forget" | "expire" | "reconcile";
  artifact_id: string | null;
  before_value: HarnessJson;
  after_value: HarnessJson;
  created_at: string;
}

export interface AdminHarnessRun {
  id: string;
  status: "queued" | "running" | "stopping" | "completed" | "failed" | "cancelled";
  error_code: string | null;
  claw_mode: "reply" | "hunt" | null;
  claw_release_id: string | null;
  claw_release_checksum: string | null;
  claw_profile_revision: number | null;
  claw_knowledge_revision: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface AdminHarnessHunt {
  id: string;
  agent_run_id: string;
  category: "retail" | "grocery" | "food";
  status: "running" | "completed" | "failed" | "cancelled";
  query: Record<string, HarnessJson>;
  constraints: Record<string, HarnessJson>;
  coarse_location_label: string | null;
  candidates: HarnessJson[];
  source_urls: HarnessJson[];
  created_at: string;
  completed_at: string | null;
}

export interface AdminHarnessProposal {
  id: string;
  agent_run_id: string | null;
  kind: string;
  title: string;
  rationale: string;
  content: string;
  status: "pending" | "accepted" | "rejected";
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
}

export type AdminShoppingRow = Record<string, HarnessJson>;

export interface AdminShoppingState {
  hash: string;
  lastChangedAt: string | null;
  items: AdminShoppingRow[];
  listEntries: AdminShoppingRow[];
  boards: AdminShoppingRow[];
  boardItems: AdminShoppingRow[];
}

export interface AdminUserHarness {
  user: AdminUserSummary;
  profile: AdminHarnessProfile | null;
  files: AdminHarnessFile[];
  skills: AdminHarnessSkill[];
  knowledge: AdminHarnessKnowledge[];
  learningEvents: AdminHarnessLearningEvent[];
  runs: AdminHarnessRun[];
  hunts: AdminHarnessHunt[];
  proposals: AdminHarnessProposal[];
  shopping: AdminShoppingState;
}

export function buildHarnessFiles(
  profile: AdminHarnessProfile | null,
  skills: AdminHarnessSkill[],
): AdminHarnessFile[] {
  if (!profile) return [];
  const profileFiles = [
    { path: "SOUL.md", content: profile.soul_text },
    { path: "memories/USER.md", content: profile.hot_user_text },
    { path: "memories/MEMORY.md", content: profile.hot_memory_text },
  ].map((file) => ({
    ...file,
    kind: "profile" as const,
    checksum: checksum(file.content),
    revision: profile.revision,
    status: "active" as const,
    updated_at: profile.updated_at,
  }));
  const skillFiles = skills.map((skill) => ({
    path: `skills/${skill.key}/SKILL.md`,
    kind: "private_skill" as const,
    content: skill.content,
    checksum: skill.checksum,
    revision: skill.revision,
    status: skill.status,
    updated_at: skill.updated_at,
  }));
  const markerContent = JSON.stringify({ runtimeHash: profile.runtime_hash });
  return [
    ...profileFiles,
    ...skillFiles,
    {
      path: ".apt-claw.json",
      kind: "runtime_marker",
      content: markerContent,
      checksum: checksum(markerContent),
      revision: null,
      status: profile.runtime_hash ? "materialized" : "pending",
      updated_at: profile.last_reconciled_at,
    },
  ];
}

export async function loadUserHarness(userId: string): Promise<AdminUserHarness> {
  await requireAdmin();
  const service = serviceSupabaseClient();
  const [instance, profile, skills, knowledge, learningEvents, runs, hunts, proposals, authUser] =
    await Promise.all([
      service
        .from("agent_instances")
        .select("user_id,hermes_profile_name,hermes_session_id,status,created_at,updated_at")
        .eq("user_id", userId)
        .maybeSingle(),
      service
        .from("claw_user_profiles")
        .select(
          "user_id,soul_text,hot_user_text,hot_memory_text,revision,knowledge_revision,runtime_hash,last_learning_at,last_reconciled_at,reconciliation_error,created_at,updated_at",
        )
        .eq("user_id", userId)
        .maybeSingle(),
      service
        .from("claw_user_skills")
        .select(
          "id,key,title,content,metadata,status,revision,checksum,source_agent_run_id,created_at,updated_at",
        )
        .eq("user_id", userId)
        .order("key"),
      service
        .from("claw_user_knowledge")
        .select(
          "id,subject_kind,subject_label,category,fact,confidence,sensitivity,status,source_message_id,source_agent_run_id,learned_at,last_confirmed_at,expires_at,updated_at",
        )
        .eq("user_id", userId)
        .order("learned_at", { ascending: false })
        .limit(100),
      service
        .from("claw_learning_events")
        .select(
          "id,agent_run_id,source_message_id,artifact_kind,action,artifact_id,before_value,after_value,created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      service
        .from("agent_runs")
        .select(
          "id,status,error_code,claw_mode,claw_release_id,claw_release_checksum,claw_profile_revision,claw_knowledge_revision,created_at,started_at,finished_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      service
        .from("commerce_hunts")
        .select(
          "id,agent_run_id,category,status,query,constraints,coarse_location_label,candidates,source_urls,created_at,completed_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      service
        .from("claw_learning_proposals")
        .select(
          "id,agent_run_id,kind,title,rationale,content,status,reviewed_at,reviewed_by,created_at",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      service.auth.admin.getUserById(userId),
    ]);

  for (const result of [
    instance,
    profile,
    skills,
    knowledge,
    learningEvents,
    runs,
    hunts,
    proposals,
  ]) {
    if (result.error) throw new Error("Unable to load this private Claw profile.");
  }
  if (!instance.data) throw new Error("This user does not have a provisioned Claw profile.");

  const [shoppingItems, shoppingListEntries, shoppingBoards, shoppingBoardItems] =
    await Promise.all([
      collectPages<AdminShoppingRow>(
        (from, to) =>
          service
            .from("shopping_items")
            .select(
              "id,source_kind,source_hunt_id,source_candidate_id,feed_fixture_id,vertical,candidate_kind,item_name,merchant_name,canonical_url,source_url,variant_or_size,image_url,current_price,currency,price_qualifier,availability,fulfillment_or_store_context,verification_status,observed_at,metadata,created_at,updated_at",
            )
            .eq("user_id", userId)
            .order("id")
            .range(from, to) as unknown as PromiseLike<PageResult<AdminShoppingRow>>,
      ),
      collectPages<AdminShoppingRow>(
        (from, to) =>
          service
            .from("shopping_list_entries")
            .select("shopping_item_id,list_kind,quantity,created_at,updated_at")
            .eq("user_id", userId)
            .order("shopping_item_id")
            .range(from, to) as unknown as PromiseLike<PageResult<AdminShoppingRow>>,
      ),
      collectPages<AdminShoppingRow>(
        (from, to) =>
          service
            .from("shopping_boards")
            .select("id,title,description,context_summary,created_at,updated_at")
            .eq("user_id", userId)
            .order("id")
            .range(from, to) as unknown as PromiseLike<PageResult<AdminShoppingRow>>,
      ),
      collectPages<AdminShoppingRow>(
        (from, to) =>
          service
            .from("shopping_board_items")
            .select("board_id,shopping_item_id,created_at")
            .eq("user_id", userId)
            .order("board_id")
            .order("shopping_item_id")
            .range(from, to) as unknown as PromiseLike<PageResult<AdminShoppingRow>>,
      ),
    ]);
  const shopping = buildShoppingState({
    items: shoppingItems,
    listEntries: shoppingListEntries,
    boards: shoppingBoards,
    boardItems: shoppingBoardItems,
  });

  const profileData = (profile.data ?? null) as AdminHarnessProfile | null;
  const skillData = (skills.data ?? []) as AdminHarnessSkill[];
  const user: AdminUserSummary = {
    ...instance.data,
    email: authUser.data.user?.email ?? null,
    profile_revision: profileData?.revision ?? null,
    knowledge_revision: profileData?.knowledge_revision ?? null,
    runtime_hash: profileData?.runtime_hash ?? null,
    last_learning_at: profileData?.last_learning_at ?? null,
    last_reconciled_at: profileData?.last_reconciled_at ?? null,
    reconciliation_error: profileData?.reconciliation_error ?? null,
  } as AdminUserSummary;

  return {
    user,
    profile: profileData,
    files: buildHarnessFiles(profileData, skillData),
    skills: skillData,
    knowledge: (knowledge.data ?? []) as AdminHarnessKnowledge[],
    learningEvents: (learningEvents.data ?? []) as AdminHarnessLearningEvent[],
    runs: (runs.data ?? []) as AdminHarnessRun[],
    hunts: (hunts.data ?? []) as AdminHarnessHunt[],
    proposals: (proposals.data ?? []) as AdminHarnessProposal[],
    shopping,
  };
}

export function buildShoppingState(input: Omit<AdminShoppingState, "hash" | "lastChangedAt">) {
  const canonical = {
    items: input.items,
    listEntries: input.listEntries,
    boards: input.boards,
    boardItems: input.boardItems,
  };
  const timestamps = [
    ...input.items.flatMap(rowTimestamps),
    ...input.listEntries.flatMap(rowTimestamps),
    ...input.boards.flatMap(rowTimestamps),
    ...input.boardItems.flatMap(rowTimestamps),
  ].filter((value) => Number.isFinite(Date.parse(value)));
  timestamps.sort((left, right) => Date.parse(right) - Date.parse(left));
  return {
    ...canonical,
    hash: checksum(stableJson(canonical)),
    lastChangedAt: timestamps[0] ?? null,
  } satisfies AdminShoppingState;
}

interface PageResult<T> {
  data: T[] | null;
  error: { message: string } | null;
}

async function collectPages<T>(query: (from: number, to: number) => PromiseLike<PageResult<T>>) {
  const pageSize = 1_000;
  const rows: T[] = [];
  for (let page = 0; page < 20; page += 1) {
    const result = await query(page * pageSize, (page + 1) * pageSize - 1);
    if (result.error) throw new Error("Unable to load this user’s shopping state.");
    const batch = result.data ?? [];
    rows.push(...batch);
    if (batch.length < pageSize) return rows;
  }
  throw new Error("Shopping state exceeds the founder-console safety bound.");
}

function rowTimestamps(row: AdminShoppingRow) {
  return [row["updated_at"], row["created_at"]].filter(
    (value): value is string => typeof value === "string",
  );
}

function checksum(content: string) {
  return createHash("sha256").update(content).digest("hex");
}
