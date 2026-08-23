import { describe, expect, it } from "vitest";
import type { AdminCapability, AdminDocument, AdminRelease, AdminState } from "./admin.server";
import { releaseDiff, stableJson, validateDraft } from "./admin-policy";

const draftId = "11111111-1111-4111-8111-111111111111";
const baseId = "22222222-2222-4222-8222-222222222222";

function release(id: string, status: AdminRelease["status"], base: string | null): AdminRelease {
  return {
    id,
    version: id === draftId ? 2 : 1,
    name: "Release",
    status,
    base_release_id: base,
    change_note: "change",
    revision: 1,
    content_checksum: status === "draft" ? null : "published",
    validation_result: {},
    created_at: "2026-08-22T00:00:00Z",
    updated_at: "2026-08-22T00:00:00Z",
    published_at: status === "draft" ? null : "2026-08-22T00:00:00Z",
    published_by: null,
  };
}

function document(key: string, kind: AdminDocument["kind"], checksum = key): AdminDocument {
  return {
    id: `document-${key}`,
    release_id: draftId,
    key,
    kind,
    title: key,
    content: kind === "skill" ? `---\nname: ${key}\ndescription: Apt skill.\n---\n# Skill\n` : key,
    enabled: true,
    metadata: {},
    checksum,
  };
}

function capability(key: string): AdminCapability {
  return {
    id: `capability-${key}`,
    release_id: draftId,
    key,
    kind: key === "apt_bridge" ? "mcp" : "toolset",
    enabled: true,
    config: {},
    instructions: "",
    secret_refs: [],
    checksum: key,
  };
}

function validState(): AdminState {
  return {
    founderId: "33333333-3333-4333-8333-333333333333",
    releases: [release(draftId, "draft", baseId), release(baseId, "published", null)],
    documents: [
      document("core.identity", "core"),
      document("soul.default", "soul_template"),
      document("policy.boundary", "policy"),
      document("intent.retail", "intent"),
      document("intent.grocery", "intent"),
      document("intent.food", "intent"),
      document("apt-commerce", "skill"),
    ],
    capabilities: ["memory", "session_search", "skills", "browser", "apt_bridge"].map(capability),
    proposals: [],
    overview: {
      provisionedProfiles: 0,
      privateProfiles: 0,
      reconciliationErrors: 0,
      pendingProposals: 0,
    },
  };
}

describe("founder release policy", () => {
  it("accepts a complete narrow draft", () => {
    expect(validateDraft(validState(), draftId)).toEqual({ valid: true, issues: [] });
  });

  it("rejects forbidden tools and malformed shared skills", () => {
    const state = validState();
    state.capabilities.push(capability("terminal"));
    const skill = state.documents.find((item) => item.kind === "skill")!;
    skill.content = "# No frontmatter";
    expect(validateDraft(state, draftId)).toEqual({
      valid: false,
      issues: [
        "Skill apt-commerce needs matching name and description frontmatter.",
        "Forbidden capability terminal.",
      ],
    });
  });

  it("reports only changed release artifacts in deterministic order", () => {
    const state = validState();
    state.documents.push({
      ...document("core.identity", "core", "old"),
      id: "base-doc",
      release_id: baseId,
    });
    state.capabilities.push({ ...capability("memory"), id: "base-cap", release_id: baseId });
    expect(releaseDiff(state, draftId).map((item) => item.key)).toEqual([
      "capability:apt_bridge",
      "capability:browser",
      "capability:session_search",
      "capability:skills",
      "document:apt-commerce",
      "document:core.identity",
      "document:intent.food",
      "document:intent.grocery",
      "document:intent.retail",
      "document:policy.boundary",
      "document:soul.default",
    ]);
  });

  it("canonicalizes nested capability configuration", () => {
    expect(stableJson({ z: [2, { b: false, a: true }], a: "x" })).toBe(
      '{"a":"x","z":[2,{"a":true,"b":false}]}',
    );
  });
});
