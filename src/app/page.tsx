// app/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { redirect } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

export default async function Home() {
  
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ⚡ Server-side redirect safety fallback
  // If a user has a session cookie, skip this landing page entirely
  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className='text-center flex flex-col h-screen justify-center'>
      <div className='flex flex-col h-full justify-between py-50'>
        <div>
          <h1 className='text-3xl font-bold mb-4'>Attax Collector</h1>
          <p className='text-sm font-normal text-muted-foreground'>Please log in to continue</p>
        </div>
      

        <div>
          <GoogleSignInButton />
        </div>
      </div>
    </main>
  )
}
