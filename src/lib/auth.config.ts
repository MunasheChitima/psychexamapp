import type { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'

export const authConfig = {
    session: { strategy: 'jwt' },
    trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.NODE_ENV !== 'production',
    pages: {
        signIn: '/signin',
        verifyRequest: '/check-email',
    },
    providers: [
        Resend({
            apiKey: process.env.RESEND_API_KEY!,
            from: process.env.EMAIL_FROM || 'APRAcademy: Psychology <noreply@apracademy.app>',
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
