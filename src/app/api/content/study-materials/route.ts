import { NextResponse } from 'next/server'
import { getAllStudyMaterialsAsync } from '@/lib/contentDb'
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
    const materials = await getAllStudyMaterialsAsync(productLine)
    return NextResponse.json(materials)
  } catch (err) {
    console.error('[content/study-materials]', err)
    return NextResponse.json({ error: 'Failed to fetch study materials' }, { status: 500 })
  }
}
