"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"; // ⚡ Client-side routing
import { User, AuthError, Session } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

type SupabaseJwtPayload = JwtPayload & {
  app_metadata: {
    role: string;
  };
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  role: string | null;
  displayName: string;
  updateProfileName: (name: string) => Promise<void>;
  signOut: () => Promise<void>; // ⚡ Expose clean signOut function
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter(); // ⚡ Use Next.js client router

  const displayName = 
  user?.user_metadata?.full_name || 
  user?.user_metadata?.display_name ||  
  user?.user_metadata?.name ||
  user?.email?.split("@")[0] || 
  "Collector Hero";

  const updateProfileName = async (newName: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: newName } // Saves name directly to secure user_metadata dictionary
    });
    if (error) throw error;
    if (data.user) setUser(data.user); // Instantly updates context state across whole app layout
  } catch (err) {
    console.error("Failed updating profile name:", err);
  }
};

  // ⚡ Fixed Sign Out: Completely client-safe
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/"); // Client-side redirect
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          setSession(session);
          setUser(session.user);
          const decodedJwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
          setRole(decodedJwt.app_metadata.role || "authenticated");
        }
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // ⚡ Real-time auth listener automatically cleans context state on sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        const decodedJwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
        setRole(decodedJwt.app_metadata.role || "authenticated");
      } else {
        setSession(null);
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, loading, error, role, displayName, updateProfileName, signOut } },
    children
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}
