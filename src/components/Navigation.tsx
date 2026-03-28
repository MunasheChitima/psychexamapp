'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import {
  Home,
  BookOpen,
  Target,
  FileText,
  BarChart3,
  Brain,
  LogOut,
  User,
  CreditCard,
  ClipboardCheck,
  Users,
  Zap,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react'
import type { ProductLine } from '@/types'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  productLine: ProductLine
}

const PRIMARY_TABS = [
  { id: 'dashboard', name: 'Home', icon: Home },
  { id: 'flashcards', name: 'Cards', icon: BookOpen },
  { id: 'practice', name: 'Quiz', icon: Target },
  { id: 'progress', name: 'Progress', icon: BarChart3 },
  { id: 'more', name: 'More', icon: MoreHorizontal },
]

const DESKTOP_PRIMARY_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, description: 'Overview and quick stats' },
  { id: 'flashcards', name: 'Flashcards', icon: BookOpen, description: 'Spaced repetition learning' },
  { id: 'practice', name: 'Practice', icon: Target, description: 'Test your knowledge' },
  { id: 'materials', name: 'Materials', icon: FileText, description: 'Comprehensive resources' },
  { id: 'progress', name: 'Progress', icon: BarChart3, description: 'Track your performance' },
]

export default function Navigation({ currentPage, onPageChange, productLine }: NavigationProps) {
  const DESKTOP_SECONDARY_ITEMS = productLine === 'psychology'
    ? [
      { id: 'learning-style', name: 'Learning Style', icon: Brain, description: 'Discover your Kolb learning style' },
      { id: 'exam-simulation', name: 'Exam Simulation', icon: Target, description: 'Full timed exam' },
      { id: 'live-session', name: 'Live Quiz', icon: Zap, description: 'Multiplayer quiz battles' },
      { id: 'buddy', name: 'Buddy Hub', icon: Users, description: 'Invite friends' },
      { id: 'pricing', name: 'Pricing', icon: CreditCard, description: 'Upgrade your plan' },
      { id: 'submit-results', name: 'Results', icon: ClipboardCheck, description: 'Submit exam results' },
    ]
    : productLine === 'nursing'
    ? [
      { id: 'exam-simulation', name: 'Exam Simulation', icon: Target, description: 'NCLEX-style timed exam' },
      { id: 'osce-simulation', name: 'OSCE Simulation', icon: ClipboardCheck, description: 'Station-based practical prep' },
      { id: 'drug-calculations', name: 'Drug Calculations', icon: FileText, description: 'Medication math trainer' },
      { id: 'live-session', name: 'Live Quiz', icon: Zap, description: 'Multiplayer quiz battles' },
      { id: 'buddy', name: 'Buddy Hub', icon: Users, description: 'Invite friends' },
      { id: 'pricing', name: 'Pricing', icon: CreditCard, description: 'Upgrade your plan' },
      { id: 'submit-results', name: 'Results', icon: ClipboardCheck, description: 'Submit exam results' },
    ]
    : [
      { id: 'exam-simulation', name: 'Exam Simulation', icon: Target, description: 'Full timed practice exam' },
      { id: 'live-session', name: 'Live Quiz', icon: Zap, description: 'Multiplayer quiz battles' },
      { id: 'buddy', name: 'Buddy Hub', icon: Users, description: 'Study with friends' },
      { id: 'pricing', name: 'Pricing', icon: CreditCard, description: 'Upgrade your plan' },
    ]

  const ALL_NAVIGATION_ITEMS = [...DESKTOP_PRIMARY_ITEMS, ...DESKTOP_SECONDARY_ITEMS]

  const MORE_ITEMS = ALL_NAVIGATION_ITEMS.filter(
    item => !['dashboard', 'flashcards', 'practice', 'progress'].includes(item.id)
  )
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const [openingPortal, setOpeningPortal] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const moreSheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showUserMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  useEffect(() => {
    if (!showMoreSheet) return
    const handleClickOutside = (e: MouseEvent) => {
      if (moreSheetRef.current && !moreSheetRef.current.contains(e.target as Node)) {
        setShowMoreSheet(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMoreSheet(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showMoreSheet])

  const handleNavigation = (pageId: string) => {
    if (pageId === 'more') {
      setShowMoreSheet(!showMoreSheet)
      return
    }
    onPageChange(pageId)
    setShowMoreSheet(false)
  }

  const isInMoreSection = MORE_ITEMS.some(item => item.id === currentPage)

  const [showDesktopMore, setShowDesktopMore] = useState(false)
  const desktopMoreRef = useRef<HTMLDivElement>(null)
  const [billingError, setBillingError] = useState<string | null>(null)

  useEffect(() => {
    if (!showDesktopMore) return
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopMoreRef.current && !desktopMoreRef.current.contains(e.target as Node)) {
        setShowDesktopMore(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDesktopMore])

  const isInDesktopSecondary = DESKTOP_SECONDARY_ITEMS.some(item => item.id === currentPage)

  const openBillingPortal = async () => {
    setOpeningPortal(true)
    setBillingError(null)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await response.json()
      if (response.ok && data.url) {
        window.location.href = data.url
        return
      }
      setBillingError(data.error || 'Unable to open billing portal.')
    } catch (error) {
      console.error('Billing portal error:', error)
      setBillingError('Unable to open billing portal. Please try again.')
    } finally {
      setOpeningPortal(false)
    }
  }

  return (
    <>
      {/* ── Desktop Top Navigation ── */}
      <nav className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-40" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex items-center gap-1" role="navigation">
              {DESKTOP_PRIMARY_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => { handleNavigation(item.id); setShowDesktopMore(false) }}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
              {/* Desktop "More" dropdown */}
              <div className="relative" ref={desktopMoreRef}>
                <button
                  onClick={() => setShowDesktopMore(!showDesktopMore)}
                  aria-expanded={showDesktopMore}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isInDesktopSecondary || showDesktopMore
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </button>
                {showDesktopMore && (
                  <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border py-2 z-50" role="menu" aria-label="More pages">
                    {DESKTOP_SECONDARY_ITEMS.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => { handleNavigation(item.id); setShowDesktopMore(false) }}
                          role="menuitem"
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            currentPage === item.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {session?.user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                    aria-label={`Account menu for ${session.user.name || session.user.email}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {session.user.image ? (
                      <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center" aria-hidden="true">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <span className="font-medium max-w-[120px] truncate">{session.user.name || session.user.email}</span>
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50" role="menu" aria-label="Account options">
                      <div className="px-4 py-2 text-xs text-gray-600 border-b truncate" role="none">
                        {session.user.email}
                      </div>
                      {billingError && (
                        <div className="px-4 py-2 text-xs text-red-700 bg-red-50 border-b">
                          {billingError}
                        </div>
                      )}
                      <button
                        onClick={openBillingPortal}
                        disabled={openingPortal}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                      >
                        <CreditCard className="w-4 h-4" aria-hidden="true" />
                        {openingPortal ? 'Opening billing...' : 'Manage billing'}
                      </button>
                      <button
                        onClick={() => signOut({ callbackUrl: '/signin' })}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/signin"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2"
                >
                  Sign in
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200" aria-label="Tab navigation" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-[var(--bottom-nav-height)]" role="tablist">
          {PRIMARY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === 'more'
              ? (isInMoreSection || showMoreSheet)
              : currentPage === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigation(tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.id === 'more' ? 'More navigation options' : `${tab.name} tab`}
                aria-expanded={tab.id === 'more' ? showMoreSheet : undefined}
                className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-colors relative ${
                  isActive ? 'text-blue-700' : 'text-gray-700'
                }`}
              >
                {isActive && tab.id !== 'more' && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" aria-hidden="true" />
                )}
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} aria-hidden="true" />
                <span className={`text-xs mt-0.5 font-semibold leading-tight ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {tab.name}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Mobile "More" Bottom Sheet ── */}
      {showMoreSheet && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-[55] animate-fade-in"
            onClick={() => setShowMoreSheet(false)}
            aria-hidden="true"
          />
          <div
            ref={moreSheetRef}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-2xl animate-slide-up"
            style={{ paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))' }}
            role="dialog"
            aria-label="More navigation options"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
            </div>
            <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="navigation" aria-label="Additional pages">
                {MORE_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      aria-current={currentPage === item.id ? 'page' : undefined}
                      aria-label={`${item.name}: ${item.description}`}
                      className={`flex flex-col items-center justify-center min-h-[88px] p-4 rounded-2xl transition-all active:scale-95 ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-50 text-gray-700 active:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-7 h-7 mb-2" aria-hidden="true" />
                      <span className="text-xs font-semibold text-center leading-tight">{item.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* User section in more sheet */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {session?.user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {session.user.image ? (
                        <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name || 'Account'}</p>
                        <p className="text-xs text-gray-600 truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/signin' })}
                      aria-label="Sign out"
                      className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <a
                    href="/signin"
                    className="block text-center text-sm font-semibold text-blue-600 py-3"
                  >
                    Sign in
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
