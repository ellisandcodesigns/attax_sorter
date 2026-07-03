"use client";

// CHANGE THIS IMPORT: Swap out your server file for the browser client
import { createClient } from "@/lib/supabase/client"; 

export default function SignInButton() {
  const handleGoogleSignIn = async () => {
    // Instantiate the browser-safe client
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Automatically matches localhost or your production domain
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google Auth failed to initialize:", error.message);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
