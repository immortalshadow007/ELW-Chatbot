import { Toaster } from "../components/ui/sonner";
import { GlobalState } from "../components/utility/global-state";
import { Providers } from "../components/utility/providers";
import TranslationsProvider from "../components/utility/translations-provider";
import initTranslations from "../lib/i18n";
import { Database } from "../supabase/types";
import { createServerClient } from "@supabase/ssr"
import { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers"
import { ReactNode } from "react"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "ELW Assistant"
const APP_DEFAULT_TITLE = "ELW"
const APP_TITLE_TEMPLATE = "%s - ELW"
const APP_DESCRIPTION = "e-commerce platform assistant"

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale:string
  }
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "ELW",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const i18nNamespaces = ["translation"];

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const session = (await supabase.auth.getSession()).data.session;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className}`}>
        <Providers attribute="class" defaultTheme="dark">
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            <Toaster richColors position="top-center" duration={3000} />
            <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
              {session ? <GlobalState>{children}</GlobalState> : children}
            </div>
          </TranslationsProvider>
        </Providers>
      </body>
    </html>
  );
}
