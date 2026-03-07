'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Search,
  Filter,
  Bookmark,
  CheckCircle,
  Clock,
  Layout,
  RefreshCcw,
  BookMarked
} from 'lucide-react'
import { ComponentProps, Flashcard } from '@/types'
import { comprehensiveContent } from '@/data/comprehensive'

export default function Flashcards({ appData, updateAppData }: ComponentProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>(appData.activeDomain || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterByDifficulty, setFilterByDifficulty] = useState<string>('all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [showDueOnly, setShowDueOnly] = useState(false)

  // Aggregate all flashcards from central data
  const allFlashcards = useMemo(() => [
    ...comprehensiveContent.flashcards.ethics,
    ...comprehensiveContent.flashcards.assessment,
    ...comprehensiveContent.flashcards.interventions,
    ...comprehensiveContent.flashcards.communication
  ], [])

  const filteredFlashcards = useMemo(() => {
    return allFlashcards
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
  }, [allFlashcards, selectedDomain, filterByDifficulty, showBookmarkedOnly, showDueOnly, searchQuery])

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

    // Spaced repetition logic
    const intervals = [1, 2, 4, 7, 14, 30] // days
    const nextInterval = intervals[level] || 1
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)

    // In a real app, this would persist to a database
    // For now we simulate by updating local state (though it won't persist across full reloads without more work)
    console.log(`Updated card ${currentCard.id} to level ${level}`)

    // Move to next card after rating
    setTimeout(handleNext, 300)
  }

  const handleBookmarkToggle = () => {
    if (!currentCard) return
    // Logic to toggle bookmark in appData
  }

  const resetFilters = () => {
    setSelectedDomain('all')
    setFilterByDifficulty('all')
    setSearchQuery('')
    setShowBookmarkedOnly(false)
    setShowDueOnly(false)
    setCurrentCardIndex(0)
  }

  if (filteredFlashcards.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <RefreshCcw className="w-16 h-16 text-gray-300 mb-4" />
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search and Filters Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search flashcards, topics, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Domains</option>
              <option value="ethics">Ethics</option>
              <option value="assessment">Assessment</option>
              <option value="interventions">Intervention</option>
              <option value="communication">Communication</option>
            </select>
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`p-2 rounded-xl border transition-all ${showBookmarkedOnly ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
            >
              <Bookmark className={`w-5 h-5 ${showBookmarkedOnly ? 'fill-amber-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Study Session</h2>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-gray-900">{currentCardIndex + 1}</span>
            <span className="text-lg font-bold text-gray-400">/ {filteredFlashcards.length}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
            <BookMarked className="w-4 h-4" />
            <span>{currentCard?.category}</span>
          </div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div
        onClick={handleFlip}
        className="relative perspective-1000 cursor-pointer h-[450px] group mb-8"
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-[32px] border-2 border-gray-100 shadow-xl p-10 flex flex-col items-center justify-center text-center">
            <div className="absolute top-8 left-8">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white ${currentCard?.domain === 'ethics' ? 'bg-blue-500' :
                  currentCard?.domain === 'assessment' ? 'bg-emerald-500' :
                    currentCard?.domain === 'interventions' ? 'bg-violet-500' : 'bg-orange-500'
                }`}>
                {currentCard?.domain}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight font-serif italic italic">
              "{currentCard?.question}"
            </h3>
            <div className="absolute bottom-8 text-gray-300 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center space-x-2">
              <RefreshCcw className="w-3 h-3" />
              <span>Tap to reveal answer</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden bg-blue-600 rounded-[32px] text-white p-10 flex flex-col items-center justify-center text-center transform rotate-y-180 shadow-2xl overflow-y-auto">
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-4 opacity-70">Expert Explanation</h4>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {currentCard?.answer}
              </p>
            </div>
            {currentCard?.explanation && (
              <div className="mt-4 p-5 bg-white/10 rounded-2xl text-left border border-white/10">
                <p className="text-sm italic opacity-90 leading-relaxed font-serif">
                  {currentCard.explanation}
                </p>
              </div>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {currentCard?.references?.map((ref, idx) => (
                <span key={idx} className="text-[10px] bg-white/20 px-2 py-1 rounded border border-white/10">
                  {ref}
                </span>
              ))}
            </div>
            <div className="absolute bottom-8 flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Controls */}
      <div className={`transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col items-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">How well did you know this?</p>
          <div className="flex space-x-2 md:space-x-4">
            {[
              { label: 'Again', level: 0, color: 'hover:bg-red-500 text-red-500', bg: 'bg-red-50' },
              { label: 'Hard', level: 1, color: 'hover:bg-orange-500 text-orange-500', bg: 'bg-orange-50' },
              { label: 'Good', level: 2, color: 'hover:bg-green-500 text-green-500', bg: 'bg-green-50' },
              { label: 'Easy', level: 3, color: 'hover:bg-blue-500 text-blue-500', bg: 'bg-blue-50' }
            ].map((rating) => (
              <button
                key={rating.level}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMasteryUpdate(rating.level)
                }}
                className={`flex flex-col items-center px-6 py-3 rounded-2xl ${rating.bg} ${rating.color} hover:text-white transition-all font-bold group border border-transparent hover:border-white shadow-sm`}
              >
                <span className="text-sm">{rating.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {!isFlipped && (
        <div className="flex justify-center items-center space-x-8 mt-4">
          <button
            onClick={handlePrevious}
            className="p-4 rounded-full bg-white border border-gray-100 shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleFlip}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all"
          >
            Flip Card
          </button>
          <button
            onClick={handleNext}
            className="p-4 rounded-full bg-white border border-gray-100 shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}