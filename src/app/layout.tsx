import type { Metadata, Viewport } from "next";

import { ClickSpark } from "@/components/magic/click-spark";
import { SoundController } from "@/components/magic/sound-controller";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Chaudhari - Full-Stack Software Engineer",
  description:
    "Portfolio of Aditya Chaudhari, a full-stack software engineer building React, Next.js, React Native, FastAPI, Node.js, and LLM-powered AI systems.",
  metadataBase: new URL("https://aditya-chaudhari.dev"),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.ico",
    apple: { url: "/favicon.png", sizes: "512x512" }
  },
  openGraph: {
    title: "Aditya Chaudhari - Full-Stack Software Engineer",
    description: "AI agents, React Native chat SDKs, RAG systems, and production web applications.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Chaudhari - Full-Stack Software Engineer",
    description: "AI agents, React Native chat SDKs, RAG systems, and production web applications."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6eb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <ClickSpark />
          <SoundController />
        </ThemeProvider>
      </body>
    </html>
  );
}
