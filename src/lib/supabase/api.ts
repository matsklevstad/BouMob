import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

export function createSupabaseServerClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader(
            "Set-Cookie",
            `${name}=${value}; Path=/; ${options.maxAge ? `Max-Age=${options.maxAge}` : ""}`,
          );
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0`);
        },
      },
    },
  );
}
