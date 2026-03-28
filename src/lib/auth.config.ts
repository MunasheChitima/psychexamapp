import type { NextAuthConfig } from 'next-auth'
import ResendProvider from 'next-auth/providers/resend'
import { Resend } from 'resend'
import { renderMagicLinkEmail } from './emailTemplates'

let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is required to send magic link emails')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export const authConfig = {
    session: { strategy: 'jwt' },
    // Required on Vercel/custom domains to avoid UntrustedHost auth errors.
    trustHost: true,
    pages: {
        signIn: '/signin',
        verifyRequest: '/check-email',
    },
    providers: [
        ResendProvider({
            apiKey: process.env.RESEND_API_KEY!,
            from: process.env.EMAIL_FROM || 'APRAcademy: Psychology <noreply@aphracademy.com.au>',
            async sendVerificationRequest({ identifier, url, provider }) {
                const host = new URL(url).host
                const { html, text } = await renderMagicLinkEmail({
                    loginUrl: url,
                    host,
                })

                const from = typeof provider.from === 'string'
                    ? provider.from
                    : process.env.EMAIL_FROM || 'APRAcademy <noreply@aphracademy.com.au>'

                const { error } = await getResendClient().emails.send({
                    from,
                    to: identifier,
                    subject: 'Sign in to APRAcademy',
                    html,
                    text,
                })

                if (error) {
                    throw new Error(JSON.stringify(error))
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string
            }
            return session
        },
    },
} satisfies NextAuthConfig
