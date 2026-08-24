import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  cloneRelease,
  createRelease,
  exchangeOAuthCode,
  getAccess,
  loadAdminState,
  publishRelease,
  releaseDiff,
  reviewProposal,
  rollbackRelease,
  saveCapability,
  saveDocument,
  signInWithPassword,
  signOutAdmin,
  startGoogleSignIn,
  validateDraft,
} from "./admin.server";
import { loadUserHarness } from "./user-harness.server";

const uuid = z.string().uuid();
const releaseAction = z.object({
  name: z.string().trim().min(1).max(160),
  changeNote: z.string().trim().max(2_000),
});

export const getAdminAccess = createServerFn({ method: "GET" }).handler(() => getAccess());
export const getAdminState = createServerFn({ method: "GET" }).handler(() => loadAdminState());

export const getAdminUserHarness = createServerFn({ method: "GET" })
  .validator((data) => z.object({ userId: uuid }).parse(data))
  .handler(({ data }) => loadUserHarness(data.userId));

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data) =>
    z.object({ email: z.string().email(), password: z.string().min(1).max(1_000) }).parse(data),
  )
  .handler(({ data }) => signInWithPassword(data.email, data.password));

export const googleAdminLogin = createServerFn({ method: "POST" }).handler(() =>
  startGoogleSignIn(),
);

export const finishAdminOAuth = createServerFn({ method: "POST" })
  .validator((data) => z.object({ code: z.string().min(8).max(4_096) }).parse(data))
  .handler(({ data }) => exchangeOAuthCode(data.code));

export const logoutAdmin = createServerFn({ method: "POST" }).handler(() => signOutAdmin());

export const createAdminRelease = createServerFn({ method: "POST" })
  .validator((data) => releaseAction.parse(data))
  .handler(({ data }) => createRelease(data));

export const cloneAdminRelease = createServerFn({ method: "POST" })
  .validator((data) => releaseAction.extend({ sourceReleaseId: uuid }).parse(data))
  .handler(({ data }) => cloneRelease(data));

export const saveAdminDocument = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        releaseId: uuid,
        expectedRevision: z.number().int().positive(),
        key: z.string().regex(/^[a-z][a-z0-9_.-]{0,127}$/),
        kind: z.enum(["core", "soul_template", "policy", "intent", "merchant", "skill"]),
        title: z.string().trim().min(1).max(200),
        content: z.string().min(1).max(100_000),
        enabled: z.boolean(),
        metadata: z.record(z.unknown()),
      })
      .parse(data),
  )
  .handler(({ data }) => saveDocument(data));

export const saveAdminCapability = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        releaseId: uuid,
        expectedRevision: z.number().int().positive(),
        key: z.enum(["memory", "session_search", "skills", "browser", "apt_bridge"]),
        kind: z.enum(["toolset", "mcp"]),
        enabled: z.boolean(),
        config: z.record(z.unknown()),
        instructions: z.string().max(20_000),
        secretRefs: z.array(z.string().regex(/^[A-Z][A-Z0-9_]*$/)).max(20),
      })
      .parse(data),
  )
  .handler(({ data }) => saveCapability(data));

export const reviewAdminProposal = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        proposalId: uuid,
        decision: z.enum(["accepted", "rejected"]),
        releaseId: uuid.optional(),
        expectedRevision: z.number().int().positive().optional(),
        targetKey: z
          .string()
          .regex(/^[a-z][a-z0-9_.-]{0,127}$/)
          .optional(),
      })
      .parse(data),
  )
  .handler(({ data }) =>
    reviewProposal({
      proposalId: data.proposalId,
      decision: data.decision,
      ...(data.releaseId ? { releaseId: data.releaseId } : {}),
      ...(data.expectedRevision ? { expectedRevision: data.expectedRevision } : {}),
      ...(data.targetKey ? { targetKey: data.targetKey } : {}),
    }),
  );

export const validateAdminRelease = createServerFn({ method: "POST" })
  .validator((data) => z.object({ releaseId: uuid }).parse(data))
  .handler(async ({ data }) => {
    const loaded = await loadAdminState();
    if (loaded.access !== "founder") throw new Error("Founder authorization is required.");
    return {
      validation: validateDraft(loaded.state, data.releaseId),
      diff: releaseDiff(loaded.state, data.releaseId),
    };
  });

export const publishAdminRelease = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        releaseId: uuid,
        expectedRevision: z.number().int().positive(),
        changeNote: z.string().trim().min(1).max(2_000),
      })
      .parse(data),
  )
  .handler(({ data }) => publishRelease(data));

export const rollbackAdminRelease = createServerFn({ method: "POST" })
  .validator((data) =>
    releaseAction
      .extend({ sourceReleaseId: uuid, changeNote: z.string().trim().min(1).max(2_000) })
      .parse(data),
  )
  .handler(({ data }) => rollbackRelease(data));
