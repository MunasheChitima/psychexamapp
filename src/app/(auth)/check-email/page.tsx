'use client'

import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
        <p className="text-gray-600 mb-8">
          A sign-in link has been sent to your email address. Click the link in the email to sign in to Australian Health Practitioners Resource Academy: Psychology.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="space-y-3 text-sm text-gray-600">
            <p>The link will expire in 24 hours.</p>
            <p>If you don&apos;t see the email, check your spam folder.</p>
          </div>
        </div>

        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
