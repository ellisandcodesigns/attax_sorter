import "server-only";

import { JWTPayload, jwtVerify } from "jose";

import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

// Extend the JWTPayload type to include Supabase-specific metadata
type SupabaseJwtPayload = JWTPayload & {
  app_metadata: {
    role: string;
  };
};

export async function getUserRole(supabase: SupabaseClient) {
  // Create a Supabase client for server-side operations
  const { data: { session } } = await supabase.auth.getSession();


  let role;

  if (session) {
    const token = session.access_token;
    try {
      const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      const { payload } = await jwtVerify<SupabaseJwtPayload>(token, secret);
      role = payload.app_metadata.role;
    } catch (error) {
      console.error("Failed to verify token:", error);
    }
  }

  return role;
}
