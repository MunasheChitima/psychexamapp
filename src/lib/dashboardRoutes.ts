/** Canonical app shell paths (product-scoped). */

export const PSYCH_DASHBOARD = '/psych/dashboard'
export const NURSING_DASHBOARD = '/nursing/dashboard'
export const LEGACY_DASHBOARD = '/dashboard'

/** Cookie set when the user visits a product-scoped dashboard so `/` can redirect correctly. */
export const DASHBOARD_PREFERENCE_COOKIE = 'apr_preferred_dashboard'

const VALID = new Set<string>([PSYCH_DASHBOARD, NURSING_DASHBOARD, LEGACY_DASHBOARD])

export function dashboardPathForProductLine(productLine: 'psychology' | 'nursing'): string {
  return productLine === 'nursing' ? NURSING_DASHBOARD : PSYCH_DASHBOARD
}

/** Strip query/hash; keep user on the same dashboard mount after payment toasts. */
export function resolveDashboardBasePath(pathname: string): string {
  if (pathname.startsWith(NURSING_DASHBOARD)) return NURSING_DASHBOARD
  if (pathname.startsWith(PSYCH_DASHBOARD)) return PSYCH_DASHBOARD
  return LEGACY_DASHBOARD
}

export function isValidDashboardPreference(value: string | undefined): value is string {
  return typeof value === 'string' && VALID.has(value)
}
