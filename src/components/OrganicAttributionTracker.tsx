'use client'

import { useEffect } from 'react'
import { initOrganicAttribution } from '@/lib/organicAnalytics'

export default function OrganicAttributionTracker() {
  useEffect(() => {
    initOrganicAttribution()
  }, [])

  return null
}
