import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)
export const middleware = auth

export const config = {
  matcher: [
    '/((?!api/auth|signin|check-email|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png).*)',
  ],
}
