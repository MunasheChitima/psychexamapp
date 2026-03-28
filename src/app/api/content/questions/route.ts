import { NextResponse } from 'next/server'
import { getAllPracticeQuestionsAsync } from '@/lib/contentDb'
import { isProductLineAllowedInThisDeployment } from '@/lib/examSuite'
import type { ProductLine } from '@apracademy/contracts'

const VALID_PRODUCT_LINES: ProductLine[] = ['psychology', 'nursing']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productLine = searchParams.get('productLine') as ProductLine | null

  if (!productLine || !VALID_PRODUCT_LINES.includes(productLine)) {
    return NextResponse.json(
      { error: 'Invalid or missing productLine. Use: psychology or nursing' },
      { status: 400 }
    )
  }

  if (!isProductLineAllowedInThisDeployment(productLine)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const questions = await getAllPracticeQuestionsAsync(productLine)
    return NextResponse.json(questions)
  } catch (err) {
    console.error('[content/questions]', err)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
