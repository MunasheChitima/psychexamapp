'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { SubscriptionProvider } from '@/components/SubscriptionProvider'
import { ToastProvider } from '@/components/Toast'

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SubscriptionProvider>
        <ToastProvider>{children}</ToastProvider>
      </SubscriptionProvider>
    </SessionProvider>
  )
}
