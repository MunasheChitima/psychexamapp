import { NextResponse, type NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { getExamSuite } from '@/lib/examSuite'

// Middleware runs without the Prisma adapter context, so do not initialize
// email providers here (Resend requires an adapter and causes MissingAdapter).
const { auth } = NextAuth({
  ...authConfig,
  providers: [],
})

// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter.
// On Vercel serverless each cold start resets this store, so it is not a
// global rate limit. It still protects individual instances against sustained
// abuse. For a global solution, upgrade to @upstash/ratelimit with Redis.
// ---------------------------------------------------------------------------
const windowStore = new Map<string, number[]>()
let lastCleanup = Date.now()

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = windowStore.get(key) ?? []
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= limit) return true

  recent.push(now)
  windowStore.set(key, recent)

  if (now - lastCleanup > 60_000) {
    lastCleanup = now
    for (const [k, v] of windowStore) {
      const valid = v.filter((t) => now - t < 300_000)
      if (valid.length === 0) windowStore.delete(k)
      else windowStore.set(k, valid)
    }
  }

  return false
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function getApiRateLimit(pathname: string): { limit: number; windowMs: number } | null {
  if (pathname.startsWith('/api/stripe/webhook')) return null
  if (pathname.startsWith('/api/auth')) return null
  if (pathname.startsWith('/api/cron/')) return null
  if (pathname.startsWith('/api/stripe/checkout')) return { limit: 5, windowMs: 60_000 }
  if (pathname.startsWith('/api/stripe/portal')) return { limit: 5, windowMs: 60_000 }
  if (pathname.startsWith('/api/referrals/redeem')) return { limit: 10, windowMs: 60_000 }
  if (pathname.startsWith('/api/referrals')) return { limit: 20, windowMs: 60_000 }
  if (pathname.startsWith('/api/live/create')) return { limit: 5, windowMs: 60_000 }
  if (pathname.startsWith('/api/exam-results')) return { limit: 10, windowMs: 60_000 }
  if (pathname.startsWith('/api/admin')) return { limit: 20, windowMs: 60_000 }
  return { limit: 60, windowMs: 60_000 }
}

// Compose rate limiting with NextAuth auth middleware.
// The `auth()` callback form gives us access to `req.auth` (the session).
// We handle auth redirects for page routes manually so we can also run
// rate limiting for API routes in the same function.
export default auth((req) => {
  const { pathname } = req.nextUrl
  const suite = getExamSuite()

  // --- Single-product deploy: hide the other exam’s routes (404, not sign-in) ---
  if (suite === 'psychology') {
    if (pathname === '/nursing' || pathname.startsWith('/nursing/')) {
      return NextResponse.rewrite(new URL('/suite-not-found', req.nextUrl))
    }
  }
  if (suite === 'nursing') {
    if (pathname === '/psych' || pathname.startsWith('/psych/')) {
      return NextResponse.rewrite(new URL('/suite-not-found', req.nextUrl))
    }
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
      return NextResponse.rewrite(new URL('/suite-not-found', req.nextUrl))
    }
  }

  // --- Rate limiting for API routes ---
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/content/')) {
      const pl = req.nextUrl.searchParams.get('productLine')
      if (pl === 'nursing' && suite === 'psychology') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      if (pl === 'psychology' && suite === 'nursing') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }
    const limits = getApiRateLimit(pathname)
    if (limits) {
      const ip = getClientIp(req)
      const key = `${ip}:${pathname}`
      if (isRateLimited(key, limits.limit, limits.windowMs)) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
    }
    return NextResponse.next()
  }

  // --- Auth redirect for page routes ---
  if (!req.auth) {
    // Playwright E2E: lib/auth.ts resolves session from e2e-* cookies, but this middleware
    // uses a slim NextAuth instance without that hook — let the request through so RSC auth() works.
    if (
      process.env.E2E_AUTH_BYPASS === 'true' &&
      req.cookies.get('e2e-user-email')?.value
    ) {
      return NextResponse.next()
    }
    const signInUrl = new URL('/signin', req.nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * .+ (not .*) so the root path "/" is excluded — it renders the
     * public landing page for unauthenticated visitors.
     * Also excludes: /pricing, /signin, /check-email, /terms, /privacy, /blog, static assets.
     */
    '/((?!api/auth|api/cron|pricing|signin|check-email|terms|privacy|blog|suite-not-found|_next/static|_next/image|_vercel|favicon.ico|manifest.json|sw.js|icon-.*\\.png).+)',
  ],
}
