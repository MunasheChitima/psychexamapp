export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: [
    '/((?!api/auth|signin|check-email|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png).*)',
  ],
}
