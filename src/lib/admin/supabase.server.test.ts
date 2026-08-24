import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  userId: null as string | null,
  founder: false,
  founderError: null as Error | null,
  responseStatus: 200,
  headers: new Map<string, string>(),
  cookies: [] as Array<{ name: string; value: string; options: Record<string, unknown> }>,
  cookieAdapter: null as null | {
    setAll(cookies: Array<{ name: string; value: string; options: Record<string, unknown> }>): void;
  },
}));

vi.mock("@tanstack/react-start/server", () => ({
  getCookies: () => ({ session: "cookie" }),
  setCookie: (name: string, value: string, options: Record<string, unknown>) => {
    state.cookies.push({ name, value, options });
  },
  setResponseHeader: (name: string, value: string) => state.headers.set(name, value),
  setResponseStatus: (status: number) => {
    state.responseStatus = status;
  },
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: (
    _url: string,
    _key: string,
    options: { cookies: NonNullable<typeof state.cookieAdapter> },
  ) => {
    state.cookieAdapter = options.cookies;
    return {
      auth: {
        getUser: async () => ({
          data: { user: state.userId ? { id: state.userId } : null },
        }),
      },
    };
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: state.founder ? { user_id: state.userId } : null,
            error: state.founderError,
          }),
        }),
      }),
    }),
  }),
}));

import {
  currentAdmin,
  founderAccessForUser,
  requestSupabaseClient,
  requireAdmin,
} from "./supabase.server";

describe("founder authorization boundary", () => {
  beforeEach(() => {
    process.env["SUPABASE_URL"] = "https://example.supabase.co";
    process.env["SUPABASE_PUBLISHABLE_KEY"] = "publishable-key-with-enough-length";
    process.env["SUPABASE_SERVICE_ROLE_KEY"] = "service-key-with-enough-length";
    process.env["NODE_ENV"] = "test";
    state.userId = null;
    state.founder = false;
    state.founderError = null;
    state.responseStatus = 200;
    state.headers.clear();
    state.cookies = [];
    state.cookieAdapter = null;
  });

  it("returns only anonymous access and private no-store headers without a session", async () => {
    await expect(currentAdmin()).resolves.toEqual({ access: "anonymous" });
    expect(state.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
    expect(state.headers.get("X-Robots-Tag")).toContain("noindex");
  });

  it("fails closed with 503 and no-store headers when server configuration is absent", async () => {
    delete process.env["SUPABASE_SERVICE_ROLE_KEY"];
    await expect(currentAdmin()).resolves.toEqual({ access: "unconfigured" });
    expect(state.responseStatus).toBe(503);
    expect(state.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
  });

  it("denies an authenticated non-founder with HTTP 403", async () => {
    state.userId = "11111111-1111-4111-8111-111111111111";
    await expect(requireAdmin()).rejects.toThrow("Founder authorization is required.");
    expect(state.responseStatus).toBe(403);
  });

  it("authorizes a newly authenticated founder by UUID without rereading request cookies", async () => {
    state.founder = true;
    await expect(founderAccessForUser("22222222-2222-4222-8222-222222222222")).resolves.toEqual({
      access: "founder",
      userId: "22222222-2222-4222-8222-222222222222",
    });
  });

  it("accepts only a matching founder UUID and hardens SSR cookies", async () => {
    state.userId = "11111111-1111-4111-8111-111111111111";
    state.founder = true;
    await expect(requireAdmin()).resolves.toEqual({ access: "founder", userId: state.userId });

    requestSupabaseClient();
    state.cookieAdapter!.setAll([
      { name: "sb-session", value: "secret", options: { httpOnly: false, sameSite: "none" } },
    ]);
    expect(state.cookies[0]).toMatchObject({
      name: "sb-session",
      options: { httpOnly: true, sameSite: "lax", secure: false },
    });
  });
});
