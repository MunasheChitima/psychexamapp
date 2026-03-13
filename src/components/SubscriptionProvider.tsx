'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

interface SubscriptionSnapshot {
  id: string
  status: string
  pricingTier: string
  expiresAt: string
  stripeCustomerId: string | null
  monthlyRate: number
  examSittingId: string
  isResubscription: boolean
  failDiscountApplied: boolean
}

interface SubscriptionContextValue {
  isSubscribed: boolean
  subscription: SubscriptionSnapshot | null
  loading: boolean
  refresh: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (status === 'loading') return
    if (status !== 'authenticated') {
      setSubscription(null)
      setIsSubscribed(false)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/subscription', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }
      const data = await response.json()
      setSubscription(data.subscription ?? null)
      setIsSubscribed(Boolean(data.active))
    } catch (error) {
      console.error('Subscription fetch failed:', error)
      setSubscription(null)
      setIsSubscribed(false)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ isSubscribed, subscription, loading, refresh }),
    [isSubscribed, subscription, loading, refresh]
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
