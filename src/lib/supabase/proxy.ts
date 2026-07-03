import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getUserRole } from "@/lib/get-user-role";
import { createClient } from "@/lib/supabase/server";

export async function updateSession(request: NextRequest) {
   const { pathname } = request.nextUrl;
   if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/auth") || // Crucial for /auth/callback
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });



  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user from Supabase
  const { data: { user } } = await supabase.auth.getUser();

   // 2. PASS THE SAME CLIENT INSTANCE TO PREVENT KEY STRIPPING
  const role = await getUserRole(supabase); 

  // Redirect non-admin users trying to access admin pages to the home page
  // Redirect non-admin users
  if (user && role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users
  if (!user && !pathname.startsWith("/signin")) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from signin
  if (user && pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

