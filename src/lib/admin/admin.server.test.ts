import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  passwordUserId: "11111111-1111-4111-8111-111111111111",
  oauthUserId: "22222222-2222-4222-8222-222222222222",
  authorizedUserIds: [] as string[],
}));

vi.mock("@tanstack/react-start/server", () => ({
  getRequestUrl: () => "https://example.com/admin/login",
}));

vi.mock("./supabase.server", () => ({
  currentAdmin: vi.fn(),
  founderAccessForUser: vi.fn(async (userId: string) => {
    state.authorizedUserIds.push(userId);
    return { access: "founder", userId } as const;
  }),
  requestSupabaseClient: () => ({
    auth: {
      signInWithPassword: async () => ({
        data: { user: { id: state.passwordUserId } },
        error: null,
      }),
      exchangeCodeForSession: async () => ({
        data: { user: { id: state.oauthUserId } },
        error: null,
      }),
    },
  }),
  requireAdmin: vi.fn(),
  serviceSupabaseClient: vi.fn(),
}));

import { exchangeOAuthCode, signInWithPassword } from "./admin.server";

describe("founder sign-in authorization", () => {
  beforeEach(() => {
    state.authorizedUserIds = [];
  });

  it("authorizes the user returned by password sign-in", async () => {
    await expect(signInWithPassword("founder@example.com", "password")).resolves.toEqual({
      access: "founder",
      userId: state.passwordUserId,
    });
    expect(state.authorizedUserIds).toEqual([state.passwordUserId]);
  });

  it("authorizes the user returned by the OAuth code exchange", async () => {
    await expect(exchangeOAuthCode("valid-code")).resolves.toEqual({
      access: "founder",
      userId: state.oauthUserId,
    });
    expect(state.authorizedUserIds).toEqual([state.oauthUserId]);
  });
});
