import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import MobileNav from "@/components/footer/mobile-nav";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vidbox.to"),
  title: "Vidbox - Your Ultimate Streaming Guide",
  description:
    "Discover and track your favorite movies and TV shows across all streaming platforms. Get personalized recommendations and streaming availability information.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vidbox.to",
    siteName: "Vidbox",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vidbox Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidbox - Your Ultimate Streaming Guide",
    description:
      "Discover and track your favorite movies and TV shows across all streaming platforms.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        signIn: { baseTheme: dark },
        signUp: { baseTheme: dark },
        userProfile: { baseTheme: dark },
      }}
    >
      <html lang="en" className="scrollbar" suppressHydrationWarning={true}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (_) {}
              `,
            }}
          />
        </head>
        <body>
          <div className={`${inter.className}`}>
            <NextTopLoader color="#EF4444" />
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              storageKey="theme"
              disableTransitionOnChange
            >
              <Header />
              {children}
              <MobileNav />
              <Footer backgroundImage="/footer-bg2.jpg" />
            </ThemeProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
