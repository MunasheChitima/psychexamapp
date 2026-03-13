import type { FullConfig } from '@playwright/test'

async function globalTeardown(_config: FullConfig) {
  // No-op teardown for now. Tests create isolated data via API.
}

export default globalTeardown
