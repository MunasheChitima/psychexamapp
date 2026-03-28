import NextAuth from 'next-auth'
import { cookies } from 'next/headers'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { authConfig } from './auth.config'
import { sendWelcomeEmail } from './email'
import type { Session } from 'next-auth'

const nextAuthInstance = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    async createUser({ user }) {
      if (user.id) {
        await prisma.studyData.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        })

        if (user.email) {
          sendWelcomeEmail({
            id: user.id,
            email: user.email,
            name: user.name,
          }).catch((err) =>
            console.error('Welcome email failed:', err)
          )
        }
      }
    },
  },
})

function readCookieValue(cookieHeader: string | null | undefined, key: string): string | null {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(';').map((part) => part.trim())
  for (const part of parts) {
    const [cookieKey, ...cookieValueParts] = part.split('=')
    if (cookieKey === key) {
      return decodeURIComponent(cookieValueParts.join('='))
    }
  }
  return null
}

async function getE2ESession(requestHeaders?: Headers, requestUrl?: string): Promise<Session | null> {
  if (process.env.NODE_ENV === 'production' && process.env.E2E_AUTH_BYPASS !== 'true') {
    return null
  }

  try {
    const cookieHeader = requestHeaders?.get('cookie')
    const authHeader = requestHeaders?.get('authorization')
    const forceUnauthHeader = requestHeaders?.get('x-e2e-unauth')
    const forceUnauthCookie = readCookieValue(cookieHeader, 'e2e-unauth')
    const url = requestUrl ? new URL(requestUrl) : null
    const forceUnauthQuery = url?.searchParams.get('__e2eUnauth')
    if (forceUnauthHeader === 'true' || forceUnauthCookie === 'true') {
      return null
    }
    if (forceUnauthQuery === 'true') {
      return null
    }

    const authParts = authHeader?.startsWith('Bearer e2e:')
      ? authHeader.replace('Bearer e2e:', '').split(':')
      : null
    const authId = authParts?.[0]
    const authEmail = authParts?.[1]
    const authName = authParts?.slice(2).join(':')

    const email = authEmail
      || requestHeaders?.get('x-e2e-user-email')
      || readCookieValue(cookieHeader, 'e2e-user-email')
      || url?.searchParams.get('__e2eUserEmail')
    if (!email) {
      return null
    }
    const id = authId
      || requestHeaders?.get('x-e2e-user-id')
      || readCookieValue(cookieHeader, 'e2e-user-id')
      || url?.searchParams.get('__e2eUserId')
      || `e2e_${email.replace(/[^a-zA-Z0-9]/g, '_')}`
    const name = authName
      || requestHeaders?.get('x-e2e-user-name')
      || readCookieValue(cookieHeader, 'e2e-user-name')
      || url?.searchParams.get('__e2eUserName')
      || email

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    const stableUserId = existingUser?.id || id

    await prisma.user.upsert({
      where: { id: stableUserId },
      update: { email, name },
      create: { id: stableUserId, email, name },
    })
    await prisma.studyData.upsert({
      where: { userId: stableUserId },
      update: {},
      create: { userId: stableUserId },
    })

    return {
      user: { id: stableUserId, email, name },
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    } as Session
  } catch {
    return null
  }
}

export const handlers = nextAuthInstance.handlers
export const signIn = nextAuthInstance.signIn
export const signOut = nextAuthInstance.signOut

export async function auth(...args: unknown[]) {
  const session = args.length
    ? await (nextAuthInstance.auth as (...inner: unknown[]) => Promise<Session | null>)(...args)
    : await nextAuthInstance.auth()
  if (session?.user?.id) {
    return session
  }
  const requestLike = args[0] as { headers?: Headers; url?: string } | undefined
  let headerBag = requestLike?.headers
  const url = requestLike?.url
  if (!headerBag && process.env.E2E_AUTH_BYPASS === 'true') {
    try {
      const jar = await cookies()
      const pairs = jar.getAll().map((c) => `${c.name}=${c.value}`)
      if (pairs.length) {
        headerBag = new Headers({ cookie: pairs.join('; ') })
      }
    } catch {
      /* outside request context */
    }
  }
  const e2eSession = await getE2ESession(headerBag, url)
  return e2eSession ?? session
}
