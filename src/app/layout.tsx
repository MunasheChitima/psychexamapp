import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import {
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  toJsonLdScript,
} from "@/lib/structuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Australian Health Practitioners Resource Academy: Psychology - National Exam Study App",
    template: "%s | APRAcademy: Psychology",
  },
  description: "Comprehensive study application for the Australian National Psychology Examination. Practice questions, flashcards, spaced repetition, and progress tracking across Ethics, Assessment, Interventions, and Communication domains.",
  keywords: [
    "psychology exam", "national psychology examination", "Australia",
    "study app", "APS", "flashcards", "practice questions",
    "psychology board exam prep", "spaced repetition", "exam readiness",
  ],
  authors: [{ name: "APRAcademy: Psychology" }],
  creator: "APRAcademy: Psychology",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://apracademy.app"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "APRAcademy: Psychology",
    title: "APRAcademy - Pass the National Psychology Exam with Confidence",
    description: "1,493+ practice questions, 1,007+ flashcards, exam simulations, and adaptive learning. Built for the Australian NPPE.",
  },
  twitter: {
    card: "summary_large_image",
    title: "APRAcademy - Pass the National Psychology Exam with Confidence",
    description: "1,493+ practice questions, 1,007+ flashcards, and exam simulations for the Australian NPPE.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = toJsonLdScript(getOrganizationJsonLd());
  const websiteJsonLd = toJsonLdScript(getWebsiteJsonLd());

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="APRAcademy" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
        />
        <script defer src="/_vercel/insights/script.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
