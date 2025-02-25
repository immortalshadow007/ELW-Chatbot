import { Brand } from "../../components/ui/brand"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { SubmitButton } from "../../components/ui/submit-button"
import { createClient } from "../../lib/supabase/server"
import { Database } from "../../supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

type Workspace = {
  id: string;
  user_id: string;
  is_home: boolean;
}

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
searchParams
}: {
  searchParams: { message: string }
}) {
  const sp = await Promise.resolve(searchParams);
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  if (session) {
    const { data: workspaces, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
    
    if (error) {
      throw new Error(error.message);
    }

    if (!workspaces || workspaces.length === 0) {
      // No home workspace exists; redirect to setup
      return redirect("/setup");
    } else if (workspaces.length > 1) {
      console.warn(`Multiple home workspaces found for user ${session.user.id}. Using the first one.`);
      const homeWorkspace = workspaces[0];
      return redirect(`/${homeWorkspace.id}/chat`);
    } else {
      // Exactly one home workspace
      const homeWorkspace = workspaces[0];
      return redirect(`/${homeWorkspace.id}/chat`);
    }
  }

  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    const userId = data.user.id;
    const { data: workspaces, error: workspacesError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true) as { data: Workspace[] | null, error: any }

    if (workspacesError) {
      throw new Error(`Workspace query failed: ${workspacesError.message}`)
    }

    let homeWorkspace: Workspace;
    if (!workspaces || workspaces.length === 0) {
      // Create a default home workspace if none exists
      const { data: newWorkspace, error: createError } = await supabase
        .from("workspaces")
        .insert({
          user_id: userId,
          name: "Default Workspace",
          is_home: true,
          created_at: new Date().toISOString()
        })
        .select("*")
        .single();

      if (createError) {
        throw new Error(`Workspace creation failed: ${createError.message}`);
      }
      homeWorkspace = newWorkspace;
    } else if (workspaces.length > 1) {
      console.warn(`Multiple home workspaces found for user ${userId}. Using the first one.`);
      homeWorkspace = workspaces[0];
    } else {
      homeWorkspace = workspaces[0];
    }

    return redirect(`/${homeWorkspace.id}/chat`);
  };

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }

    return process.env[name]
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    // If there are whitelist patterns, check if the email is allowed to sign up
    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    const cookieStore = cookies()
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      console.error(error)
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/setup")

    // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
    // return redirect("/login?message=Check email to continue sign in process")
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const origin = (await headers()).get("origin")
    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/login?message=Check email to reset password")
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        action={signIn}
      >
        <Brand />

        <Label className="text-md mt-4" htmlFor="email">
          Email
        </Label>
        <Input
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />

        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
        />

        <SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
          Login
        </SubmitButton>

        <SubmitButton
          formAction={signUp}
          className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
        >
          Sign Up
        </SubmitButton>

        <div className="text-muted-foreground mt-1 flex justify-center text-sm">
          <span className="mr-1">Forgot your password?</span>
          <button
            formAction={handleResetPassword}
            className="text-primary ml-1 underline hover:opacity-80"
          >
            Reset
          </button>
        </div>

        {sp?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {sp.message}
          </p>
        )}
      </form>
    </div>
  )
}
