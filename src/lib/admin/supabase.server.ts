import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import {
  getCookies,
  setCookie,
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { z } from "zod";
import { ADMIN_PRIVATE_HEADERS } from "./admin-http";

const environmentSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

function environment() {
  return environmentSchema.parse(process.env);
}

type Environment = z.infer<typeof environmentSchema>;

export function noStoreAdminResponse() {
  for (const [name, value] of Object.entries(ADMIN_PRIVATE_HEADERS)) {
    setResponseHeader(name, value);
  }
}

export function requestSupabaseClient(config = environment()) {
  const env = config;
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookies) {
        for (const cookie of cookies) {
          setCookie(cookie.name, cookie.value, {
            ...(cookie.options as CookieOptions),
            httpOnly: true,
            sameSite: "lax",
            secure: process.env["NODE_ENV"] === "production",
          });
        }
      },
    },
    auth: { flowType: "pkce", detectSessionInUrl: false },
  });
}

export function serviceSupabaseClient(config = environment()) {
  const env = config;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

async function founderAccessForUserWithConfig(userId: string, config: Environment) {
  const service = serviceSupabaseClient(config);
  const { data: admin, error } = await service
    .from("claw_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error("Unable to verify founder authorization.");
  if (!admin) return { access: "forbidden" as const };
  return { access: "founder" as const, userId };
}

export async function founderAccessForUser(userId: string) {
  noStoreAdminResponse();
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) {
    setResponseStatus(503);
    return { access: "unconfigured" as const };
  }
  return founderAccessForUserWithConfig(userId, parsed.data);
}

export async function currentAdmin() {
  noStoreAdminResponse();
  const parsed = environmentSchema.safeParse(process.env);
  if (!parsed.success) {
    setResponseStatus(503);
    return { access: "unconfigured" as const };
  }
  const client = requestSupabaseClient(parsed.data);
  const { data } = await client.auth.getUser();
  if (!data.user) return { access: "anonymous" as const };
  return founderAccessForUserWithConfig(data.user.id, parsed.data);
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (admin.access === "unconfigured") {
    setResponseStatus(503);
    throw new Error("The founder console is not configured.");
  }
  if (admin.access === "anonymous") {
    setResponseStatus(401);
    throw new Error("Sign in is required.");
  }
  if (admin.access === "forbidden") {
    setResponseStatus(403);
    throw new Error("Founder authorization is required.");
  }
  return admin;
}
