import { NextResponse } from 'next/server'
import { getAllFlashcardsAsync } from '@/lib/contentDb'
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

  try {
    const flashcards = await getAllFlashcardsAsync(productLine)
    return NextResponse.json(flashcards)
  } catch (err) {
    console.error('[content/flashcards]', err)
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
  }
}
