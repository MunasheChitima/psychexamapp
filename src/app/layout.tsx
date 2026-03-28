import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import OrganicAttributionTracker from "@/components/OrganicAttributionTracker";
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

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const verificationOther = bingSiteVerification ? { "msvalidate.01": bingSiteVerification } : undefined;

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
  alternates: {
    canonical: "/",
    languages: {
      "en-AU": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "APRAcademy: Psychology",
    title: "APRAcademy - Pass the National Psychology Exam with Confidence",
    description: "1,493+ practice questions, 1,007+ flashcards, exam simulations, and adaptive learning. Built for the Australian NPPE.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "APRAcademy - Pass the National Psychology Exam with Confidence",
    description: "1,493+ practice questions, 1,007+ flashcards, and exam simulations for the Australian NPPE.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: googleSiteVerification,
    ...(verificationOther ? { other: verificationOther } : {}),
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
    <html lang="en-AU">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="APRAcademy" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" href="/icon.svg" />
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
        {gaMeasurementId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <OrganicAttributionTracker />
      </body>
    </html>
  );
}
