import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendExamReminderEmail } from '@/lib/email'
import { getSittingById, daysUntilExam } from '@/lib/examSchedule'

const REMINDER_DAYS = [14, 7, 3, 1]

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { status: 'active' },
    select: {
      userId: true,
      examSittingId: true,
      examStartDate: true,
      user: { select: { email: true, name: true } },
    },
  })

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const sub of subscriptions) {
    const sitting = getSittingById(sub.examSittingId)
    if (!sitting) continue

    const days = daysUntilExam(sitting.examStart)
    const matchedDay = REMINDER_DAYS.find((d) => days <= d && days >= d - 1)
    if (!matchedDay) continue

    try {
      const result = await sendExamReminderEmail({
        id: sub.userId,
        email: sub.user.email,
        name: sub.user.name,
        sitting,
        daysUntil: days,
      })

      if (result.deduplicated) {
        skipped++
      } else if (result.success) {
        sent++
      } else {
        errors.push(`${sub.user.email}: ${JSON.stringify(result.error)}`)
      }
    } catch (err) {
      errors.push(`${sub.user.email}: ${err}`)
    }
  }

  return NextResponse.json({
    ok: true,
    checked: subscriptions.length,
    sent,
    skipped,
    errors: errors.length,
    ...(errors.length > 0 ? { errorDetails: errors.slice(0, 10) } : {}),
  })
}
