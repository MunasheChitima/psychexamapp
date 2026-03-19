import { NextRequest, NextResponse } from 'next/server'
import { createGuestToken, isValidGuestToken } from '@/lib/guestToken'
import { isGuestCloudSaveEnabled } from '@/lib/featureFlags'

export async function POST(req: NextRequest) {
  if (!isGuestCloudSaveEnabled()) {
    return NextResponse.json({ error: 'Guest cloud save is disabled' }, { status: 404 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const existingToken = typeof body?.token === 'string' ? body.token : null
    if (existingToken && isValidGuestToken(existingToken)) {
      return NextResponse.json({ token: existingToken })
    }
  } catch {
    // Fall through and issue a new token.
  }

  return NextResponse.json({ token: createGuestToken() })
}
