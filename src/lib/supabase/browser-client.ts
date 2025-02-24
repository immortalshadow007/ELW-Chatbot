import { Database } from "../../supabase/types"
import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient, createServerClient } from "@supabase/ssr"

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseServer = (request?: NextRequest, response?: NextResponse) =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          if (!request) return [];
          return Object.entries(request.cookies.getAll()).map(([name, value]) => ({
            name,
            value: value.value,
          }));
        },
        setAll: (cookiesToSet) => {
          if (!response) return;
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );