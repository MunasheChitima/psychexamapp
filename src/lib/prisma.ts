import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

type PrismaInitErrorCode =
  | 'DATABASE_URL_MISSING'
  | 'DATABASE_CLIENT_INIT_FAILED'

export class PrismaInitError extends Error {
  code: PrismaInitErrorCode

  constructor(code: PrismaInitErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'PrismaInitError'
    this.code = code
    if (cause !== undefined) {
      this.cause = cause
    }
  }
}

let prismaInitError: PrismaInitError | null = null

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new PrismaInitError(
      'DATABASE_URL_MISSING',
      'DATABASE_URL environment variable is not set'
    )
  }

  try {
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter })
  } catch (error) {
    throw new PrismaInitError(
      'DATABASE_CLIENT_INIT_FAILED',
      'Failed to initialize Prisma client',
      error
    )
  }
}

function createUnavailablePrisma(error: PrismaInitError): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get() {
      throw error
    },
  })
}

function initPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  try {
    const client = createPrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client
    }
    return client
  } catch (error) {
    prismaInitError = error instanceof PrismaInitError
      ? error
      : new PrismaInitError('DATABASE_CLIENT_INIT_FAILED', 'Failed to initialize Prisma client', error)
    return createUnavailablePrisma(prismaInitError)
  }
}

export const prisma = initPrisma()

export function getPrismaInitError(): PrismaInitError | null {
  return prismaInitError
}
