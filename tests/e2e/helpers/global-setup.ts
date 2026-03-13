import type { FullConfig } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

async function globalSetup(_config: FullConfig) {
  process.env.E2E_AUTH_BYPASS = 'true'

  const authDir = resolve(process.cwd(), 'tests/e2e/.auth')
  mkdirSync(authDir, { recursive: true })

  const anonymousState = {
    cookies: [],
    origins: [],
  }
  writeFileSync(resolve(authDir, 'anonymous.json'), JSON.stringify(anonymousState, null, 2), 'utf-8')
}

export default globalSetup
