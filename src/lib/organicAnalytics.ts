type OrganicEventName =
  | 'organic_session_started'
  | 'organic_signup_intent'
  | 'organic_pricing_checkout_click'

interface OrganicEventPayload {
  path?: string
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
  referrer?: string
  [key: string]: string | number | boolean | undefined
}

const STORAGE_KEY = 'apra_organic_attribution'
const SEARCH_ENGINES = ['google.', 'bing.com', 'duckduckgo.com', 'yahoo.com', 'search.brave.com']

function parseUtmParams(searchParams: URLSearchParams) {
  return {
    source: searchParams.get('utm_source') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    campaign: searchParams.get('utm_campaign') || undefined,
    content: searchParams.get('utm_content') || undefined,
    term: searchParams.get('utm_term') || undefined,
  }
}

function getReferrerSource(referrer: string): string | undefined {
  if (!referrer) return undefined
  try {
    const host = new URL(referrer).hostname.toLowerCase()
    return host
  } catch {
    return undefined
  }
}

function isSearchEngineReferrer(referrerHost?: string): boolean {
  if (!referrerHost) return false
  return SEARCH_ENGINES.some((engine) => referrerHost.includes(engine))
}

function getAttributionFromStorage(): OrganicEventPayload | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    return parsed as OrganicEventPayload
  } catch {
    return null
  }
}

function saveAttributionToStorage(payload: OrganicEventPayload) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage failures (private mode/quota).
  }
}

function sendToApi(eventName: OrganicEventName, payload: OrganicEventPayload) {
  try {
    const body = JSON.stringify({
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    })

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/organic-event', blob)
      return
    }

    void fetch('/api/analytics/organic-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Ignore instrumentation errors.
  }
}

function sendToGtag(eventName: OrganicEventName, payload: OrganicEventPayload) {
  try {
    if (typeof window === 'undefined') return
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return
    gtag('event', eventName, payload)
  } catch {
    // Ignore analytics failures.
  }
}

export function initOrganicAttribution() {
  if (typeof window === 'undefined') return

  const current = getAttributionFromStorage()
  if (current) return

  const url = new URL(window.location.href)
  const utm = parseUtmParams(url.searchParams)
  const referrer = document.referrer || undefined
  const referrerHost = getReferrerSource(referrer || '')

  const isOrganic = utm.medium === 'organic' || isSearchEngineReferrer(referrerHost)
  if (!isOrganic) return

  const attribution: OrganicEventPayload = {
    source: utm.source || referrerHost || 'organic',
    medium: utm.medium || 'organic',
    campaign: utm.campaign,
    content: utm.content,
    term: utm.term,
    referrer,
    path: window.location.pathname,
  }

  saveAttributionToStorage(attribution)
  trackOrganicEvent('organic_session_started', attribution)
}

export function trackOrganicEvent(eventName: OrganicEventName, payload: OrganicEventPayload = {}) {
  if (typeof window === 'undefined') return
  const attribution = getAttributionFromStorage()
  if (!attribution) return

  const mergedPayload: OrganicEventPayload = {
    ...attribution,
    path: window.location.pathname,
    ...payload,
  }

  sendToApi(eventName, mergedPayload)
  sendToGtag(eventName, mergedPayload)
}
