/**
 * Single-product deployments (Vercel): set NEXT_PUBLIC_EXAM_SUITE so psychology
 * and nursing never share one production URL with the other product’s routes.
 * Local dev defaults to `all` (both products).
 */
export type ExamSuite = 'all' | 'psychology' | 'nursing'

function normalizeSuite(raw: string | undefined): ExamSuite {
  const v = (raw ?? 'all').trim().toLowerCase()
  if (v === 'psychology' || v === 'psych') return 'psychology'
  if (v === 'nursing' || v === 'nclex') return 'nursing'
  return 'all'
}

/** Server, edge, and client (NEXT_PUBLIC_* is inlined at build time). */
export function getExamSuite(): ExamSuite {
  return normalizeSuite(process.env.NEXT_PUBLIC_EXAM_SUITE)
}

export function isPsychologyInThisDeployment(): boolean {
  const s = getExamSuite()
  return s === 'all' || s === 'psychology'
}

export function isNursingInThisDeployment(): boolean {
  const s = getExamSuite()
  return s === 'all' || s === 'nursing'
}

/** Default signed-in home when no cookie preference exists. */
export function defaultDashboardPathForSuite(): '/psych/dashboard' | '/nursing/dashboard' {
  return getExamSuite() === 'nursing' ? '/nursing/dashboard' : '/psych/dashboard'
}

export function isProductLineAllowedInThisDeployment(productLine: 'psychology' | 'nursing'): boolean {
  if (getExamSuite() === 'all') return true
  if (getExamSuite() === 'psychology') return productLine === 'psychology'
  return productLine === 'nursing'
}
