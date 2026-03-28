import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const eventName = typeof data?.eventName === 'string' ? data.eventName.slice(0, 120) : 'unknown'
    const payload = typeof data?.payload === 'object' && data.payload !== null ? data.payload : {}

    try {
      await prisma.organicAnalyticsEvent.create({
        data: {
          eventName,
          payload: payload as object,
        },
      })
    } catch (dbErr) {
      console.error('[organic-analytics] persist failed', dbErr)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
