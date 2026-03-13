import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for APRAcademy Psychology Exam Study App.',
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: 13 March 2026</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using APRAcademy (&ldquo;the Service&rdquo;), operated by APRAcademy Pty Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              APRAcademy is an online study platform designed to help users prepare for the Australian National Psychology Examination (NPPE). The Service provides practice questions, flashcards, exam simulations, study materials, progress tracking, and related educational tools.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> APRAcademy is an independent educational resource. We are not affiliated with, endorsed by, or connected to the Psychology Board of Australia, AHPRA, or any regulatory body. The content provided is for study purposes only and should not be considered official exam material.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p>
              To access the Service, you must create an account using a valid email address. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must notify us immediately of any unauthorised use.
            </p>
            <p className="mt-3">
              You must be at least 18 years of age to use the Service. By creating an account, you represent that you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Subscriptions and Billing</h2>
            <p>
              Certain features of the Service require a paid subscription. Subscriptions are billed monthly via Stripe and are tied to a specific AHPRA exam sitting date. Key billing terms:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Subscriptions auto-expire on your selected exam start date.</li>
              <li>Monthly rates depend on how far in advance you subscribe (early bird pricing).</li>
              <li>You may cancel your subscription at any time through the billing portal.</li>
              <li>Refunds are not provided for partial billing periods.</li>
              <li>The 75% resit discount requires verification of a previous unsuccessful exam attempt.</li>
              <li>Study Buddy discounts are subject to both users maintaining active subscriptions.</li>
            </ul>
            <p className="mt-3">
              Prices are listed in Australian Dollars (AUD). We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Share your account credentials with others.</li>
              <li>Copy, reproduce, distribute, or create derivative works from any content on the Service.</li>
              <li>Use automated tools, bots, or scrapers to access the Service.</li>
              <li>Attempt to circumvent subscription requirements or payment mechanisms.</li>
              <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
              <li>Share exam questions or content from the Service publicly or with non-subscribers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p>
              All content on the Service, including but not limited to practice questions, flashcards, study materials, software, design, and trademarks, is owned by APRAcademy Pty Ltd or its licensors and is protected by Australian and international intellectual property laws. Your subscription grants you a limited, non-exclusive, non-transferable licence to access the content for personal educational use only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>The content is free from errors or omissions.</li>
              <li>Use of the Service will result in passing the NPPE or any other examination.</li>
              <li>The Service will be uninterrupted, secure, or error-free.</li>
              <li>The content reflects the most current regulations, guidelines, or exam content.</li>
            </ul>
            <p className="mt-3">
              You acknowledge that exam preparation outcomes depend on many factors beyond our control and that the Service is a supplementary study tool, not a guarantee of success.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Australian Consumer Law, our total liability to you for any claims arising from or related to the Service is limited to the amount you have paid us in the 12 months preceding the claim. We are not liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time if you breach these Terms or engage in conduct that we determine to be harmful to other users or the Service. You may close your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on the Service and updating the &ldquo;Last updated&rdquo; date. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of New South Wales, Australia. Any disputes arising from these Terms or the Service will be subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:support@apracademy.app" className="text-blue-600 hover:underline">
                support@apracademy.app
              </a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} APRAcademy</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="font-medium text-gray-900">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
