'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bookmark,
  Clock,
  RefreshCcw,
} from 'lucide-react'
import { ComponentProps } from '@/types'
import { useSubscription } from '@/components/SubscriptionProvider'
import { createDefaultEngagementData, ensureTodayMissions, updateMissionsForFlashcard } from '@/lib/engagementEngine'
import { getAllFlashcards, getProductConfig } from '@/lib/productConfig'

interface FlashcardProgressEntry {
  masteryLevel: number
  reviewCount: number
  lastReviewed: string | null
  nextReview: string | null
  isBookmarked: boolean
}

interface FlashcardSessionSnapshot {
  currentCardIndex: number
  selectedDomain: string
  filterByDifficulty: string
  searchQuery: string
  showBookmarkedOnly: boolean
  showDueOnly: boolean
  cardOrder: string[]
}

interface FlashcardStore {
  cards: Record<string, FlashcardProgressEntry>
  session: FlashcardSessionSnapshot | null
}

export default function Flashcards({ appData, updateAppData }: ComponentProps) {
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const { isSubscribed, loading: subscriptionLoading } = useSubscription()
  const lastSessionPersisted = useRef('')

  const storedFlashcardState = useMemo<FlashcardStore>(() => {
    const raw = (appData.flashcardProgress ?? {}) as Record<string, unknown>
    const cards = (raw.cards && typeof raw.cards === 'object'
      ? raw.cards
      : {}) as Record<string, FlashcardProgressEntry>
    const session = (raw.session && typeof raw.session === 'object'
      ? raw.session
      : null) as FlashcardSessionSnapshot | null
    return { cards, session }
  }, [appData.flashcardProgress])

  const [currentCardIndex, setCurrentCardIndex] = useState(storedFlashcardState.session?.currentCardIndex ?? 0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>(storedFlashcardState.session?.selectedDomain || appData.activeDomain || 'all')
  const [searchQuery, setSearchQuery] = useState(storedFlashcardState.session?.searchQuery || '')
  const [filterByDifficulty, setFilterByDifficulty] = useState<string>(storedFlashcardState.session?.filterByDifficulty || 'all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(storedFlashcardState.session?.showBookmarkedOnly || false)
  const [showDueOnly, setShowDueOnly] = useState(storedFlashcardState.session?.showDueOnly || false)

  // Aggregate all flashcards from central data
  const allFlashcards = useMemo(() => getAllFlashcards(appData.productLine), [appData.productLine])

  const previewFlashcards = useMemo(() => {
    const previewByDomain = productConfig.domains.flatMap((domain) =>
      allFlashcards.filter((card) => card.domain === domain.id).slice(0, 5)
    )
    return previewByDomain
  }, [allFlashcards, productConfig.domains])
  const domainColorMap = useMemo(
    () =>
      productConfig.domains.reduce<Record<string, string>>((acc, domain) => {
        acc[domain.id] = domain.color
        return acc
      }, {}),
    [productConfig.domains]
  )


  const availableFlashcards = useMemo(
    () => (isSubscribed ? allFlashcards : previewFlashcards),
    [isSubscribed, allFlashcards, previewFlashcards]
  )

  const mergedFlashcards = useMemo(() => {
    return availableFlashcards.map((card) => {
      const progress = storedFlashcardState.cards[card.id]
      return {
        ...card,
        masteryLevel: progress?.masteryLevel ?? card.masteryLevel,
        reviewCount: progress?.reviewCount ?? card.reviewCount,
        lastReviewed: progress?.lastReviewed ? new Date(progress.lastReviewed) : card.lastReviewed,
        nextReview: progress?.nextReview ? new Date(progress.nextReview) : card.nextReview,
        isBookmarked: progress?.isBookmarked ?? card.isBookmarked ?? false,
      }
    })
  }, [availableFlashcards, storedFlashcardState.cards])

  const filteredFlashcards = useMemo(() => {
    return mergedFlashcards
      .filter(card => selectedDomain === 'all' || card.domain === selectedDomain)
      .filter(card => filterByDifficulty === 'all' || card.difficulty === filterByDifficulty)
      .filter(card => !showBookmarkedOnly || card.isBookmarked)
      .filter(card => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query) ||
          card.category.toLowerCase().includes(query)
      })
      .filter(card => {
        if (!showDueOnly) return true
        if (!card.nextReview) return true
        return new Date(card.nextReview) <= new Date()
      })
  }, [mergedFlashcards, selectedDomain, filterByDifficulty, showBookmarkedOnly, showDueOnly, searchQuery])

  const filteredCardOrderKey = useMemo(
    () => filteredFlashcards.map((c) => c.id).join('|'),
    [filteredFlashcards]
  )

  const currentCard = filteredFlashcards[currentCardIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev + 1) % filteredFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMasteryUpdate = (level: number) => {
    if (!currentCard) return

    const intervals = [1, 2, 4, 7, 14, 30] // days
    const nextInterval = intervals[level] || 1
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)

    const currentProgress = storedFlashcardState.cards[currentCard.id]
    const updatedCards: Record<string, FlashcardProgressEntry> = {
      ...storedFlashcardState.cards,
      [currentCard.id]: {
        masteryLevel: level,
        reviewCount: (currentProgress?.reviewCount || 0) + 1,
        lastReviewed: new Date().toISOString(),
        nextReview: nextReviewDate.toISOString(),
        isBookmarked: currentProgress?.isBookmarked || false,
      },
    }

    const rawEngagement = appData.engagementData
    let engagement = (rawEngagement && typeof rawEngagement === 'object' && 'xp' in rawEngagement)
      ? rawEngagement
      : createDefaultEngagementData()
    engagement = ensureTodayMissions(engagement)

    const ts = { ...engagement.todayStats, flashcardsReviewed: engagement.todayStats.flashcardsReviewed + 1 }
    const { missions, xpFromMissions } = updateMissionsForFlashcard(engagement.dailyMissions, ts)

    const updatedEngagement = {
      ...engagement,
      todayStats: ts,
      dailyMissions: missions,
      xp: engagement.xp + xpFromMissions,
    }

    updateAppData({
      flashcardProgress: {
        cards: updatedCards,
        session: storedFlashcardState.session,
      },
      engagementData: updatedEngagement,
    })

    setTimeout(handleNext, 300)
  }

  const handleBookmarkToggle = () => {
    if (!currentCard) return
    const currentProgress = storedFlashcardState.cards[currentCard.id]
    const updatedCards: Record<string, FlashcardProgressEntry> = {
      ...storedFlashcardState.cards,
      [currentCard.id]: {
        masteryLevel: currentProgress?.masteryLevel ?? currentCard.masteryLevel,
        reviewCount: currentProgress?.reviewCount ?? currentCard.reviewCount,
        lastReviewed: currentProgress?.lastReviewed ?? null,
        nextReview: currentProgress?.nextReview ?? null,
        isBookmarked: !(currentProgress?.isBookmarked || false),
      },
    }

    updateAppData({
      flashcardProgress: {
        cards: updatedCards,
        session: storedFlashcardState.session,
      },
    })
  }

  const resetFilters = () => {
    setSelectedDomain('all')
    setFilterByDifficulty('all')
    setSearchQuery('')
    setShowBookmarkedOnly(false)
    setShowDueOnly(false)
    setCurrentCardIndex(0)
  }

  useEffect(() => {
    if (currentCardIndex <= filteredFlashcards.length - 1) return
    setCurrentCardIndex(0)
  }, [filteredFlashcards.length, currentCardIndex])

  useEffect(() => {
    if (subscriptionLoading || filteredFlashcards.length === 0) return

    const sessionSnapshot: FlashcardSessionSnapshot = {
      currentCardIndex,
      selectedDomain,
      filterByDifficulty,
      searchQuery,
      showBookmarkedOnly,
      showDueOnly,
      cardOrder: filteredFlashcards.map((card) => card.id),
    }
    const payload = JSON.stringify(sessionSnapshot)
    if (payload === lastSessionPersisted.current) return
    lastSessionPersisted.current = payload

    updateAppData({
      flashcardProgress: {
        cards: storedFlashcardState.cards,
        session: sessionSnapshot,
      },
    })
  }, [
    currentCardIndex,
    selectedDomain,
    filterByDifficulty,
    searchQuery,
    showBookmarkedOnly,
    showDueOnly,
    filteredCardOrderKey,
    subscriptionLoading,
    storedFlashcardState.cards,
    updateAppData,
  ])

  if (subscriptionLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading subscription access...</p>
      </div>
    )
  }

  if (filteredFlashcards.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <RefreshCcw className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No flashcards match your filters</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filters to see more cards.</p>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
      {!isSubscribed && (
        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-800 font-medium">Free preview — 5 cards/domain</p>
          <button
            onClick={() => window.location.assign('/?upgrade=1')}
            className="shrink-0 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors active:scale-95"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Compact filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            aria-label="Filter by domain"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Domains</option>
            {productConfig.domains.map((domain) => (
              <option key={domain.id} value={domain.id}>{domain.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowDueOnly(!showDueOnly)}
            aria-label="Show due cards only"
            aria-pressed={showDueOnly}
            className={`p-2.5 rounded-xl border transition-all ${showDueOnly ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            aria-label="Show bookmarked cards only"
            aria-pressed={showBookmarkedOnly}
            className={`p-2.5 rounded-xl border transition-all ${showBookmarkedOnly ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
          >
            <Bookmark className={`w-5 h-5 ${showBookmarkedOnly ? 'fill-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      {(() => {
        const dueCount = mergedFlashcards.filter(c => !c.nextReview || new Date(c.nextReview) <= new Date()).length
        const newCount = mergedFlashcards.filter(c => c.reviewCount === 0).length
        return (
          <div className="flex items-center gap-3 px-1 mb-3 text-xs">
            <span className="text-blue-700 font-semibold">{dueCount} due</span>
            <span className="text-gray-400">&middot;</span>
            <span className="text-gray-500">{newCount} new</span>
            <span className="text-gray-400">&middot;</span>
            <span className="text-gray-500">{filteredFlashcards.length} total</span>
          </div>
        )
      })()}

      {/* Card counter + bookmark */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-baseline gap-1.5" aria-label={`Card ${currentCardIndex + 1} of ${filteredFlashcards.length}`}>
          <span className="text-2xl font-black text-gray-900">{currentCardIndex + 1}</span>
          <span className="text-sm font-bold text-gray-500">/ {filteredFlashcards.length}</span>
        </div>
        <button
          onClick={handleBookmarkToggle}
          aria-label={currentCard?.isBookmarked ? 'Remove bookmark' : 'Bookmark this card'}
          aria-pressed={currentCard?.isBookmarked || false}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors active:scale-95 ${
            currentCard?.isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-gray-500 bg-gray-50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${currentCard?.isBookmarked ? 'fill-amber-600' : ''}`} aria-hidden="true" />
          {currentCard?.isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Screen reader accessible card content */}
      <div className="sr-only" aria-live="polite">
        <p>Domain: {currentCard?.domain}. Question: {currentCard?.question}</p>
        {isFlipped && <p>Answer: {currentCard?.answer}. {currentCard?.explanation}</p>}
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip() } }}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Flashcard showing answer. Press to flip back to question.' : 'Flashcard showing question. Press to reveal answer.'}
        className="relative perspective-1000 cursor-pointer h-[62vw] max-h-[420px] min-h-[250px] md:min-h-[280px] mb-6"
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-6 md:p-10 flex flex-col items-center justify-center text-center">
            <div className="absolute top-5 left-5">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight text-white ${
                domainColorMap[currentCard?.domain || ''] || 'bg-slate-500'
              }`}>
                {currentCard?.domain}
              </span>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-snug font-serif italic px-2">
              &quot;{currentCard?.question}&quot;
            </h3>
            <div className="absolute bottom-5 text-gray-500 font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-1.5" aria-hidden="true">
              <RefreshCcw className="w-3 h-3" />
              <span>Tap to reveal</span>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-blue-600 rounded-3xl text-white p-6 md:p-10 flex flex-col items-center justify-center text-center transform rotate-y-180 shadow-2xl overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-3 opacity-70">Answer</h4>
              <p className="text-base md:text-xl font-medium leading-relaxed">
                {currentCard?.answer}
              </p>
            </div>
            {currentCard?.explanation && (
              <div className="mt-3 p-4 bg-white/10 rounded-xl text-left border border-white/10">
                <p className="text-xs md:text-sm italic opacity-90 leading-relaxed">
                  {currentCard.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mastery Controls */}
      <div className={`transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col items-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">How well did you know this?</p>
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            {[
              { label: 'Again', level: 0, color: 'text-red-500 active:bg-red-500', bg: 'bg-red-50' },
              { label: 'Hard', level: 1, color: 'text-orange-500 active:bg-orange-500', bg: 'bg-orange-50' },
              { label: 'Good', level: 2, color: 'text-green-500 active:bg-green-500', bg: 'bg-green-50' },
              { label: 'Easy', level: 3, color: 'text-blue-500 active:bg-blue-500', bg: 'bg-blue-50' }
            ].map((rating) => (
              <button
                key={rating.level}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMasteryUpdate(rating.level)
                }}
                className={`flex flex-col items-center py-3 rounded-xl ${rating.bg} ${rating.color} active:text-white transition-all font-bold active:scale-95`}
              >
                <span className="text-sm">{rating.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {!isFlipped && (
        <div className="flex justify-center items-center gap-6 mt-4">
          <button
            onClick={handlePrevious}
            className="p-3.5 rounded-full bg-white border border-gray-100 shadow-md text-gray-500 active:scale-90 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleFlip}
            className="px-7 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            Flip Card
          </button>
          <button
            onClick={handleNext}
            className="p-3.5 rounded-full bg-white border border-gray-100 shadow-md text-gray-500 active:scale-90 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Bottom spacer for mobile nav */}
      <div className="h-6 md:h-0" />
    </div>
  )
}