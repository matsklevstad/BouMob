import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if user is trying to access protected routes
  if (
    req.nextUrl.pathname.startsWith("/fantasy") ||
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    if (!session) {
      // Redirect to login if not authenticated
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if user is trying to access admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (session) {
      // Fetch user profile to check if admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!profile || !profile.is_admin) {
        // Redirect to fantasy page if not admin
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/fantasy";
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/fantasy/:path*", "/admin/:path*"],
};
