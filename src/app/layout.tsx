import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import MobileNav from "@/components/footer/mobile-nav";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={`${inter.className} scrollbar`}>
          <NextTopLoader color="#EF4444" />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <div className="flex"> */}
            <Header />
            {/* <main className="flex-grow"> */}
            {children}
            {/* </main> */}
            <MobileNav />
            <Footer backgroundImage="/footer-bg2.jpg" />
            {/* </div> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
