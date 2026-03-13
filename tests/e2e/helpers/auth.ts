import type { APIRequestContext, Page } from '@playwright/test'
import { E2E_ADMIN, E2E_USER, E2E_USER_TWO } from './constants'

type Identity = typeof E2E_USER

function identityHeaders(identity: Identity) {
  return {
    'x-e2e-user-id': identity.id,
    'x-e2e-user-email': identity.email,
    'x-e2e-user-name': identity.name,
    authorization: `Bearer e2e:${identity.id}:${identity.email}:${identity.name}`,
    cookie: `e2e-user-id=${encodeURIComponent(identity.id)}; e2e-user-email=${encodeURIComponent(identity.email)}; e2e-user-name=${encodeURIComponent(identity.name)}`,
  }
}

function pathWithIdentity(path: string, identity: Identity) {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}__e2eUserId=${encodeURIComponent(identity.id)}&__e2eUserEmail=${encodeURIComponent(identity.email)}&__e2eUserName=${encodeURIComponent(identity.name)}`
}

export async function withE2EIdentity(page: Page, identity: Identity = E2E_USER) {
  await page.addInitScript((headers) => {
    const originalFetch = window.fetch.bind(window)
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const nextHeaders = new Headers(init?.headers || {})
      Object.entries(headers).forEach(([k, v]) => nextHeaders.set(k, v))
      return originalFetch(input, { ...init, headers: nextHeaders })
    }
  }, identityHeaders(identity))
}

export async function authedPost(
  request: APIRequestContext,
  path: string,
  identity: Identity,
  data?: unknown
) {
  return request.post(pathWithIdentity(path, identity), {
    headers: {
      ...identityHeaders(identity),
      'content-type': 'application/json',
    },
    data,
  })
}

export async function authedPatch(
  request: APIRequestContext,
  path: string,
  identity: Identity,
  data?: unknown
) {
  return request.patch(pathWithIdentity(path, identity), {
    headers: {
      ...identityHeaders(identity),
      'content-type': 'application/json',
    },
    data,
  })
}

export async function authedGet(request: APIRequestContext, path: string, identity: Identity) {
  return request.get(pathWithIdentity(path, identity), {
    headers: identityHeaders(identity),
  })
}

export async function forceUnauthGet(request: APIRequestContext, path: string) {
  const separator = path.includes('?') ? '&' : '?'
  return request.get(`${path}${separator}__e2eUnauth=true`, {
    headers: {
      'x-e2e-unauth': 'true',
      cookie: 'e2e-unauth=true',
    },
  })
}

export const identities = {
  primary: E2E_USER,
  secondary: E2E_USER_TWO,
  admin: E2E_ADMIN,
}
