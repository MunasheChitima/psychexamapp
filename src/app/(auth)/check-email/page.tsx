'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { resendMagicLink } from './actions'

const COOLDOWN_SECONDS = 60

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0 || status === 'sending') return

    setStatus('sending')
    setErrorMessage('')

    const result = await resendMagicLink(email)

    if (result.success) {
      setStatus('sent')
      setCooldown(COOLDOWN_SECONDS)
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong.')
    }
  }, [email, cooldown, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
        <p className="text-gray-600 mb-8">
          A sign-in link has been sent{email ? <> to <span className="font-medium text-gray-900">{email}</span></> : ' to your email address'}.
          Click the link in the email to sign in to Australian Health Practitioners Resource Academy: Psychology.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="space-y-3 text-sm text-gray-600">
            <p>The link will expire in 24 hours.</p>
            <p>If you don&apos;t see the email, check your spam folder.</p>
          </div>

          {email && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              {status === 'sent' && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 mb-3">
                  <CheckCircle className="w-4 h-4" />
                  Link resent successfully!
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleResend}
                disabled={cooldown > 0 || status === 'sending'}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${status === 'sending' ? 'animate-spin' : ''}`} />
                {status === 'sending'
                  ? 'Sending...'
                  : cooldown > 0
                    ? `Resend link (${cooldown}s)`
                    : 'Resend link'}
              </button>
            </div>
          )}
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

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}
