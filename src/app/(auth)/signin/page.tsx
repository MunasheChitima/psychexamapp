'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { BookOpen, Mail, AlertCircle, Sparkles } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn('resend', {
        email,
        callbackUrl: '/',
        redirectTo: '/check-email',
      })
    } catch {
      setError('Could not send sign-in link. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 safe-top safe-bottom">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mx-auto max-w-[280px] leading-tight">Welcome to APRAcademy: Psychology</h1>
          <p className="text-sm text-gray-500 mt-1.5">Enter your email to get a magic sign-in link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-5">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800">
              No password needed. We&apos;ll send a secure link to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Sending link...' : 'Send sign-in link'}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-500 mt-5">
            By signing in you agree to our{' '}
            <a href="/terms" className="underline hover:text-gray-700">terms of service</a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-gray-700">privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
