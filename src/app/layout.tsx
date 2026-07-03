import type { Metadata, Viewport } from "next";

import { ClickSpark } from "@/components/magic/click-spark";
import { SoundController } from "@/components/magic/sound-controller";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const siteUrl = "https://adityachaudhari.tech";
const description =
  "Aditya Chaudhari is a full-stack software engineer in Pune, India, building AI agents, RAG systems, React and Next.js web apps, and React Native mobile apps with FastAPI, Node.js, LangChain, and LangGraph.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aditya Chaudhari — Full-Stack Software Engineer",
    template: "%s — Aditya Chaudhari"
  },
  description,
  keywords: [
    "Aditya Chaudhari",
    "Full-Stack Software Engineer",
    "AI Engineer",
    "Software Engineer Pune",
    "React",
    "Next.js",
    "React Native",
    "FastAPI",
    "Node.js",
    "TypeScript",
    "Python",
    "LangChain",
    "LangGraph",
    "RAG",
    "LLM",
    "AI Agents",
    "Portfolio"
  ],
  authors: [{ name: "Aditya Chaudhari", url: siteUrl }],
  creator: "Aditya Chaudhari",
  publisher: "Aditya Chaudhari",
  category: "technology",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.ico",
    apple: { url: "/favicon.png", sizes: "512x512" }
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Aditya Chaudhari",
    title: "Aditya Chaudhari — Full-Stack Software Engineer",
    description,
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    site: "@AdityaXCodess",
    creator: "@AdityaXCodess",
    title: "Aditya Chaudhari — Full-Stack Software Engineer",
    description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aditya Chaudhari",
  url: siteUrl,
  image: `${siteUrl}/favicon.png`,
  jobTitle: "Full-Stack Software Engineer",
  email: "mailto:AdityaChaudhari9022@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    addressCountry: "India"
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "DY Patil International University"
  },
  worksFor: {
    "@type": "Organization",
    name: "Fynd (Shopsense Retail Technologies)"
  },
  sameAs: [
    "https://www.linkedin.com/in/aditya-chaudhari-ai/",
    "https://github.com/AdityaChaudhari901",
    "https://x.com/AdityaXCodess"
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "React Native",
    "FastAPI",
    "Node.js",
    "TypeScript",
    "Python",
    "LangChain",
    "LangGraph",
    "RAG",
    "Large Language Models",
    "AI Agents"
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <ClickSpark />
          <SoundController />
        </ThemeProvider>
      </body>
    </html>
  );
}
