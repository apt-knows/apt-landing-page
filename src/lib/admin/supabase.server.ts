import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import {
  getCookies,
  setCookie,
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { z } from "zod";

const environmentSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

function environment() {
  return environmentSchema.parse(process.env);
}

export function noStoreAdminResponse() {
  setResponseHeader("Cache-Control", "private, no-store, max-age=0");
  setResponseHeader("Pragma", "no-cache");
  setResponseHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
}

export function requestSupabaseClient() {
  const env = environment();
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

export function serviceSupabaseClient() {
  const env = environment();
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export async function currentAdmin() {
  noStoreAdminResponse();
  const client = requestSupabaseClient();
  const { data } = await client.auth.getUser();
  if (!data.user) return { access: "anonymous" as const };
  const service = serviceSupabaseClient();
  const { data: admin, error } = await service
    .from("claw_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (error) throw new Error("Unable to verify founder authorization.");
  if (!admin) return { access: "forbidden" as const };
  return { access: "founder" as const, userId: data.user.id };
}

export async function requireAdmin() {
  const admin = await currentAdmin();
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
