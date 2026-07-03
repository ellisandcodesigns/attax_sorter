// components/GoogleSignInButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function GoogleSignInButton() {
  const supabase = createClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Point exactly to the callback API route created in Step 4
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleSignIn}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'var(--primary)',
        maxWidth: '20rem',
        margin: '0 auto'
      }}
    >
      Sign in with Google
    </button>
  )
}
