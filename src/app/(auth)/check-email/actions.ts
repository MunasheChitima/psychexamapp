'use server'

import { signIn } from '@/lib/auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function resendMagicLink(email: string) {
  if (!email || typeof email !== 'string') {
    return { success: false, error: 'Email is required.' }
  }

  try {
    await signIn('resend', { email, redirect: false })
    return { success: true }
  } catch (error) {
    // NextAuth v5 server-side signIn triggers Next.js redirect() after
    // sending the email. redirect() throws a NEXT_REDIRECT error that we
    // must not swallow — but the email was already dispatched, so treat it
    // as success.
    if (isRedirectError(error)) {
      return { success: true }
    }
    return { success: false, error: 'Could not resend link. Please try again.' }
  }
}
