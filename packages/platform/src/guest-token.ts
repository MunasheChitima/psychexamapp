import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const TOKEN_PARTS = 2

function getSigningSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 16) {
      throw new Error(
        'NEXTAUTH_SECRET must be set (min 16 chars) in production for guest token signing and auth.'
      )
    }
    return secret
  }
  return secret || process.env.DATABASE_URL || 'apracademy-guest-fallback'
}

function createSignature(tokenId: string): string {
  return createHmac('sha256', getSigningSecret()).update(tokenId).digest('hex')
}

export function createGuestToken(): string {
  const tokenId = randomUUID()
  const signature = createSignature(tokenId)
  return `${tokenId}.${signature}`
}

export function isValidGuestToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== TOKEN_PARTS) return false
  const [tokenId, signature] = parts
  if (!tokenId || !signature) return false

  const expected = createSignature(tokenId)
  const signatureBuffer = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (signatureBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(signatureBuffer, expectedBuffer)
}

export function guestTokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
