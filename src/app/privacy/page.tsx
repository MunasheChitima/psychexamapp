import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for APRAcademy Psychology Exam Study App.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">APRAcademy</span>
          </Link>
          <Link href="/signin" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: 13 March 2026</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Overview</h2>
            <p>
              APRAcademy Pty Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy in accordance with the Australian Privacy Principles (APPs) under the <em>Privacy Act 1988</em> (Cth). This Privacy Policy explains how we collect, use, disclose, and store your personal information when you use APRAcademy (&ldquo;the Service&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <h3 className="text-base font-medium text-gray-900 mt-4 mb-2">Information you provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account information:</strong> Email address used for sign-in via magic link.</li>
              <li><strong>Study preferences:</strong> Selected exam sitting, study goal, and domain preferences set during onboarding.</li>
              <li><strong>Exam results:</strong> If you submit previous exam results for resit discount verification, we collect your AHPRA candidate number and result details.</li>
              <li><strong>Referral codes:</strong> If you create or redeem referral codes as part of the Study Buddy programme.</li>
            </ul>

            <h3 className="text-base font-medium text-gray-900 mt-4 mb-2">Information collected automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Study data:</strong> Practice question answers, flashcard progress, study session durations, and quiz results.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, and interaction patterns to improve the Service.</li>
              <li><strong>Device information:</strong> Browser type, operating system, and device type for compatibility and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide and maintain the Service, including personalised study recommendations.</li>
              <li>Process subscriptions and payments via Stripe.</li>
              <li>Send authentication emails (magic sign-in links) via Resend.</li>
              <li>Verify exam results for resit discount eligibility.</li>
              <li>Facilitate the Study Buddy referral programme.</li>
              <li>Improve the Service based on usage patterns and feedback.</li>
              <li>Communicate important updates about the Service or your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services that may process your personal information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Stripe</strong> — Payment processing. Stripe collects and processes your payment information directly. We do not store your credit card details. See{' '}
                <a href="https://stripe.com/au/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.
              </li>
              <li>
                <strong>Resend</strong> — Email delivery for authentication. See{' '}
                <a href="https://resend.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Resend&apos;s Privacy Policy</a>.
              </li>
              <li>
                <strong>Vercel</strong> — Hosting and infrastructure. See{' '}
                <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.
              </li>
              <li>
                <strong>Sentry</strong> — Error monitoring and performance tracking. See{' '}
                <a href="https://sentry.io/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Sentry&apos;s Privacy Policy</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Storage and Security</h2>
            <p>
              Your data is stored in secure PostgreSQL databases hosted by our infrastructure providers. We implement appropriate technical and organisational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Encrypted data transmission (HTTPS/TLS).</li>
              <li>Passwordless authentication via secure magic links.</li>
              <li>JWT-based session management with secure cookies.</li>
              <li>Regular security reviews of our codebase and dependencies.</li>
            </ul>
            <p className="mt-3">
              While we take reasonable steps to protect your information, no method of electronic transmission or storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide the Service. Study data, including practice results and progress, is retained to maintain your learning history. If you request account deletion, we will delete your personal information within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p>Under the Australian Privacy Principles, you have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information and account.</li>
              <li><strong>Complaint:</strong> Lodge a complaint with us or with the Office of the Australian Information Commissioner (OAIC) if you believe your privacy has been breached.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@apracademy.app" className="text-blue-600 hover:underline">privacy@apracademy.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies and Local Storage</h2>
            <p>
              The Service uses essential cookies for authentication and session management. We also use browser local storage to persist your study preferences and progress for offline access. These are necessary for the Service to function and cannot be disabled.
            </p>
            <p className="mt-3">
              We do not use third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. International Data Transfers</h2>
            <p>
              Some of our third-party service providers may process your data outside of Australia. Where this occurs, we ensure appropriate safeguards are in place to protect your information in accordance with the APPs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Service and updating the &ldquo;Last updated&rdquo; date. Your continued use of the Service after changes are posted constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
            <p>
              For privacy-related enquiries or to exercise your rights, contact our Privacy Officer:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong>Email:</strong>{' '}
                <a href="mailto:privacy@apracademy.app" className="text-blue-600 hover:underline">privacy@apracademy.app</a>
              </li>
              <li><strong>Post:</strong> APRAcademy Pty Ltd, Sydney, NSW, Australia</li>
            </ul>
            <p className="mt-3">
              You may also contact the Office of the Australian Information Commissioner at{' '}
              <a href="https://www.oaic.gov.au" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} APRAcademy</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="font-medium text-gray-900">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
