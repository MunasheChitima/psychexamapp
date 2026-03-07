import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
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
    template: "%s | AHPRAcademy: Psychology",
  },
  description: "Comprehensive study application for the Australian National Psychology Examination. Practice questions, flashcards, spaced repetition, and progress tracking across Ethics, Assessment, Interventions, and Communication domains.",
  keywords: [
    "psychology exam", "national psychology examination", "Australia",
    "study app", "APS", "flashcards", "practice questions",
    "psychology board exam prep", "spaced repetition", "exam readiness",
  ],
  authors: [{ name: "AHPRAcademy: Psychology" }],
  creator: "AHPRAcademy: Psychology",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://ahpracademy.app"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "AHPRAcademy: Psychology",
    title: "Australian Health Practitioners Resource Academy: Psychology - National Exam Study App",
    description: "Pass the Australian National Psychology Exam with confidence. 88+ practice questions, 103+ flashcards, spaced repetition, and progress tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Australian Health Practitioners Resource Academy: Psychology - National Exam Study App",
    description: "Pass the Australian National Psychology Exam with confidence.",
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
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AHPRAcademy: Psychology" />
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
