import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminHarnessProfile, AdminHarnessSkill } from "./user-harness.server";
import {
  buildHarnessFiles,
  buildSafeShoppingLinks,
  buildShoppingState,
  loadUserHarness,
} from "./user-harness.server";

const founderBoundary = vi.hoisted(() => ({ authorized: true }));
const serviceSupabaseClient = vi.hoisted(() => vi.fn());

vi.mock("./supabase.server", () => ({
  requireAdmin: vi.fn(async () => {
    if (!founderBoundary.authorized) throw new Error("Founder authorization is required.");
    return { access: "founder", userId: "33333333-3333-4333-8333-333333333333" } as const;
  }),
  serviceSupabaseClient,
}));

const profile: AdminHarnessProfile = {
  user_id: "11111111-1111-4111-8111-111111111111",
  soul_text: "Private soul",
  hot_user_text: "User cache",
  hot_memory_text: "Memory cache",
  revision: 4,
  knowledge_revision: 2,
  runtime_hash: "a".repeat(64),
  last_learning_at: "2026-08-24T00:00:00Z",
  last_reconciled_at: "2026-08-24T01:00:00Z",
  reconciliation_error: null,
  created_at: "2026-08-23T00:00:00Z",
  updated_at: "2026-08-24T01:00:00Z",
};

const skillContent = "---\nname: private.shopping\ndescription: Personal shopping.\n---\n";
const skill: AdminHarnessSkill = {
  id: "22222222-2222-4222-8222-222222222222",
  key: "private.shopping",
  title: "Personal shopping",
  content: skillContent,
  metadata: {},
  status: "active",
  revision: 3,
  checksum: sha256(skillContent),
  source_agent_run_id: null,
  created_at: "2026-08-23T00:00:00Z",
  updated_at: "2026-08-24T01:00:00Z",
};

describe("read-only user harness projection", () => {
  beforeEach(() => {
    founderBoundary.authorized = true;
    serviceSupabaseClient.mockReset();
  });

  it("projects only materialized private artifact paths with deterministic checksums", () => {
    const files = buildHarnessFiles(profile, [skill]);
    expect(files.map((file) => file.path)).toEqual([
      "SOUL.md",
      "memories/USER.md",
      "memories/MEMORY.md",
      "skills/private.shopping/SKILL.md",
      ".apt-claw.json",
    ]);
    expect(files[0]).toMatchObject({
      content: "Private soul",
      checksum: sha256("Private soul"),
      revision: 4,
      status: "active",
    });
    expect(files[3]).toMatchObject({
      content: skillContent,
      checksum: skill.checksum,
      revision: 3,
      status: "active",
    });
    expect(files[4]).toMatchObject({
      content: JSON.stringify({ runtimeHash: profile.runtime_hash }),
      status: "materialized",
    });
  });

  it("returns no pretend files before a private profile exists", () => {
    expect(buildHarnessFiles(null, [skill])).toEqual([]);
  });

  it("marks a missing runtime hash as pending instead of materialized", () => {
    const files = buildHarnessFiles({ ...profile, runtime_hash: null }, []);
    expect(files.at(-1)).toMatchObject({ path: ".apt-claw.json", status: "pending" });
  });

  it("fails before creating a service-role client when the requester is not a founder", async () => {
    founderBoundary.authorized = false;
    await expect(loadUserHarness(profile.user_id)).rejects.toThrow(
      "Founder authorization is required.",
    );
    expect(serviceSupabaseClient).not.toHaveBeenCalled();
  });

  it("hashes the full canonical shopping projection and reports its latest row change", () => {
    const input = {
      items: [{ id: "item-1", item_name: "Jacket", updated_at: "2026-08-25T20:00:00Z" }],
      listEntries: [
        {
          shopping_item_id: "item-1",
          list_kind: "cart",
          quantity: 1,
          updated_at: "2026-08-25T21:00:00Z",
        },
      ],
      boards: [{ id: "board-1", title: "Trip", updated_at: "2026-08-25T19:00:00Z" }],
      boardItems: [
        { board_id: "board-1", shopping_item_id: "item-1", created_at: "2026-08-25T22:00:00Z" },
      ],
    };
    const first = buildShoppingState(input);
    expect(buildShoppingState(input)).toEqual(first);
    expect(first.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.lastChangedAt).toBe("2026-08-25T22:00:00Z");
    expect(
      buildShoppingState({ ...input, listEntries: [{ ...input.listEntries[0], quantity: 2 }] })
        .hash,
    ).not.toBe(first.hash);
  });

  it("exposes only credential-free public Shopping URLs as clickable founder links", async () => {
    const links = await buildSafeShoppingLinks([
      {
        id: "item-1",
        item_name: "Jacket",
        canonical_url: "https://8.8.8.8/product",
        source_url: "http://127.0.0.1/private",
        image_url: "https://user:password@example.com/image",
      },
    ]);
    expect(links).toEqual([
      {
        itemId: "item-1",
        itemName: "Jacket",
        field: "canonical_url",
        url: "https://8.8.8.8/product",
      },
    ]);
  });
});

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
