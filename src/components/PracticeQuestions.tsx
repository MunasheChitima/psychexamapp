'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { ComponentProps, PracticeQuestion } from '@/types'
import type { PracticeResult, ResultQuestion } from '@/types'
import { comprehensiveContent } from '@/data/comprehensive'

interface QuizSession {
  questions: PracticeQuestion[]
  currentQuestionIndex: number
  answers: (number | null)[]
  timeRemaining: number
  isComplete: boolean
  score: number
  startTime: Date | null
  endTime: Date | null
  showExplanation: boolean
  reviewedQuestions: Set<number>
}

export default function PracticeQuestions({ appData, updateAppData }: ComponentProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice')
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  const [timeLimit] = useState(210) // 3.5 hours in minutes
  const [showReviewMode, setShowReviewMode] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'medium' | 'hard' | 'expert' | 'easy'>('all')

  // Aggregate all available questions from comprehensive content
  const allAvailableQuestions = useMemo(() => [
    ...comprehensiveContent.practiceQuestions.ethics,
    ...comprehensiveContent.practiceQuestions.assessment,
    ...comprehensiveContent.practiceQuestions.interventions,
    ...comprehensiveContent.practiceQuestions.communication
  ], [])

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500' },
    { id: 'ethics', name: 'Ethics', color: 'bg-blue-500' },
    { id: 'assessment', name: 'Assessment', color: 'bg-green-500' },
    { id: 'interventions', name: 'Interventions', color: 'bg-purple-500' },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500' }
  ]

  const filteredQuestions = useMemo(() => {
    return allAvailableQuestions
      .filter(q => selectedDomain === 'all' || q.domain === selectedDomain)
      .filter(q => selectedDifficulty === 'all' || q.difficulty === selectedDifficulty)
  }, [allAvailableQuestions, selectedDomain, selectedDifficulty])

  const startQuiz = () => {
    const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5)
    const session: QuizSession = {
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      answers: new Array(shuffledQuestions.length).fill(null),
      timeRemaining: quizMode === 'timed' ? timeLimit * 60 : 0,
      isComplete: false,
      score: 0,
      startTime: new Date(),
      endTime: null,
      showExplanation: false,
      reviewedQuestions: new Set()
    }
    setCurrentSession(session)
    setIsQuizActive(true)
    setShowResults(false)
  }

  const handleAnswer = (answerIndex: number) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession }
    updatedSession.answers[currentSession.currentQuestionIndex] = answerIndex

    // Show explanation immediately in practice mode
    if (quizMode === 'practice') {
      updatedSession.showExplanation = true
      updatedSession.reviewedQuestions.add(currentSession.currentQuestionIndex)
    }

    setCurrentSession(updatedSession)
  }

  const nextQuestion = () => {
    if (!currentSession) return

    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1,
        showExplanation: false
      })
    } else {
      completeQuiz()
    }
  }

  const previousQuestion = () => {
    if (!currentSession || currentSession.currentQuestionIndex === 0) return

    setCurrentSession({
      ...currentSession,
      currentQuestionIndex: currentSession.currentQuestionIndex - 1,
      showExplanation: currentSession.reviewedQuestions.has(currentSession.currentQuestionIndex - 1)
    })
  }

  const completeQuiz = () => {
    if (!currentSession) return

    const correctAnswers = currentSession.answers.filter((answer, index) =>
      answer === currentSession.questions[index].correctAnswer
    ).length

    const score = Math.round((correctAnswers / currentSession.questions.length) * 100)

    const completedSession = {
      ...currentSession,
      score,
      isComplete: true,
      endTime: new Date(),
    }

    setCurrentSession(completedSession)
    setIsQuizActive(false)
    setShowResults(true)

    // Update app data with quiz results
    const newStudyStats = { ...appData.studyStats }
    newStudyStats.questionsAnswered += currentSession.questions.length
    newStudyStats.correctAnswers += correctAnswers
    newStudyStats.totalHours += 0.5

    // Persist result
    const compactQuestions: ResultQuestion[] = currentSession.questions.map((q) => ({
      id: q.id,
      domain: (q.domain as 'ethics' | 'assessment' | 'interventions' | 'communication'),
      category: q.category,
      difficulty: q.difficulty as ResultQuestion['difficulty']
    }))

    const savedResult: PracticeResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      questions: compactQuestions,
      score,
      domain: selectedDomain === 'all' ? 'mixed' : selectedDomain,
      duration: Math.round((new Date().getTime() - (currentSession.startTime?.getTime() || 0)) / 60000),
      isComplete: true,
      currentQuestionIndex: currentSession.currentQuestionIndex,
      answers: currentSession.answers,
      timeRemaining: currentSession.timeRemaining,
      startTime: currentSession.startTime || new Date(),
      endTime: new Date()
    }

    updateAppData({
      studyStats: newStudyStats,
      practiceResults: [...appData.practiceResults, savedResult]
    })
  }

  const resetQuiz = () => {
    setCurrentSession(null)
    setIsQuizActive(false)
    setShowResults(false)
  }

  const toggleReviewMode = () => {
    setShowReviewMode(!showReviewMode)
  }

  // Timer effect for timed mode
  useEffect(() => {
    if (!isQuizActive || !currentSession || quizMode !== 'timed') return

    const timer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev) return prev
        if (prev.timeRemaining <= 1) {
          completeQuiz()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isQuizActive, quizMode])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = currentSession?.questions[currentSession.currentQuestionIndex]
  const currentAnswer = currentSession?.answers[currentSession.currentQuestionIndex]

  if (showResults && currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 uppercase-headings">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
                <p className="text-gray-600 mt-1">Practice Questions Complete</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
              <div className="text-6xl font-bold mb-4">
                {currentSession.score >= 70 ? (
                  <span className="text-green-600">{currentSession.score}%</span>
                ) : (
                  <span className="text-red-600">{currentSession.score}%</span>
                )}
              </div>
              <p className="text-lg text-gray-600">
                {currentSession.score >= 70 ? 'Passing Score!' : 'Below passing threshold (70%)'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{currentSession.questions.length}</p>
                <p className="text-sm text-gray-500">Total Questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {currentSession.answers.filter((answer, index) =>
                    answer === currentSession.questions[index].correctAnswer
                  ).length}
                </p>
                <p className="text-sm text-gray-500">Correct Answers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {currentSession.answers.filter((answer, index) =>
                    answer !== null && answer !== currentSession.questions[index].correctAnswer
                  ).length}
                </p>
                <p className="text-sm text-gray-500">Incorrect Answers</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Take Another Quiz
              </button>
              <button
                onClick={toggleReviewMode}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {showReviewMode ? 'Hide Review' : 'Review Answers'}
              </button>
            </div>

            {showReviewMode && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Question Review</h3>
                <div className="space-y-6">
                  {currentSession.questions.map((question, index) => {
                    const userAnswer = currentSession.answers[index]
                    const isCorrectAnswer = userAnswer === question.correctAnswer

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${question.difficulty === 'hard' || question.difficulty === 'expert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                              {question.difficulty}
                            </span>
                            {isCorrectAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>

                        {question.caseStudy && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{question.caseStudy}</p>
                          </div>
                        )}

                        <h4 className="font-semibold text-gray-900 mb-4">{question.question}</h4>

                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border-2 ${optionIndex === question.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : optionIndex === userAnswer && !isCorrectAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                }`}
                            >
                              <div className="flex items-center space-x-2">
                                {optionIndex === question.correctAnswer && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {optionIndex === userAnswer && !isCorrectAnswer && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-900">{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">Explanation:</h5>
                          <p className="text-gray-700 mb-3">{question.explanation}</p>
                          {question.references && (
                            <div>
                              <h6 className="font-medium text-gray-900 mb-1">References:</h6>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {question.references.map((ref, refIndex) => (
                                  <li key={refIndex}>• {ref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  if (!isQuizActive) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Practice Questions</h1>
                <p className="text-gray-600 mt-1">Test your knowledge with realistic exam questions</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Setup</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Domain</h3>
              <div className="flex flex-wrap gap-3">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedDomain === domain.id
                      ? `${domain.color} text-white`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {domain.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Difficulty</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
                  { id: 'medium', name: 'Medium', color: 'bg-yellow-500' },
                  { id: 'hard', name: 'Hard', color: 'bg-red-500' },
                  { id: 'expert', name: 'Expert', color: 'bg-indigo-600' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedDifficulty(level.id as PracticeQuestion['difficulty'] | 'all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedDifficulty === level.id
                      ? `${level.color} text-white`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizMode('practice')}
                  className={`p-4 rounded-lg border-2 transition-colors ${quizMode === 'practice'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Practice Mode</h4>
                      <p className="text-sm text-gray-600">Immediate feedback and explanations</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setQuizMode('timed')}
                  className={`p-4 rounded-lg border-2 transition-colors ${quizMode === 'timed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Timed Mode</h4>
                      <p className="text-sm text-gray-600">3.5 hours, exam simulation</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quiz Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Questions:</span>
                  <span className="ml-2 text-gray-600">{filteredQuestions.length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Time Limit:</span>
                  <span className="ml-2 text-gray-600">
                    {quizMode === 'timed' ? '3.5 hours' : 'No limit'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Pass Grade:</span>
                  <span className="ml-2 text-gray-600">70%</span>
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={filteredQuestions.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
            >
              Start Quiz
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!currentQuestion || !currentSession) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Practice Quiz</h1>
              <p className="text-sm text-gray-600">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
              </p>
            </div>
            {quizMode === 'timed' && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-lg font-mono font-bold text-red-600">
                  {formatTime(currentSession.timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${currentQuestion.domain === 'ethics' ? 'bg-blue-500' :
                  currentQuestion.domain === 'assessment' ? 'bg-green-500' :
                    currentQuestion.domain === 'interventions' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                  {currentQuestion.domain}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {currentQuestion.category}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentQuestion.difficulty === 'hard' || currentQuestion.difficulty === 'expert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {currentQuestion.caseStudy && (
              <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                <h4 className="font-bold text-indigo-900 mb-2 uppercase text-xs tracking-wider">Clinical Vignette</h4>
                <p className="text-indigo-900 leading-relaxed font-serif italic text-lg">{currentQuestion.caseStudy}</p>
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={currentAnswer !== null}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${currentAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-red-500 bg-red-50 shadow-sm'
                    : index === currentQuestion.correctAnswer && currentSession.showExplanation
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    } disabled:cursor-default`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${currentAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : index === currentQuestion.correctAnswer && currentSession.showExplanation
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-400'
                      }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-900 text-lg font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {currentSession.showExplanation && (
              <div className="mt-10 p-6 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-bold text-emerald-900 uppercase tracking-wide">Clinical Reasoning</h4>
                </div>
                <p className="text-emerald-900 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{currentQuestion.explanation}</p>

                {currentQuestion.references && (
                  <div className="border-t border-emerald-200 pt-4">
                    <h5 className="font-bold text-emerald-900 text-sm uppercase mb-2">Evidence & References</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentQuestion.references.map((ref, refIndex) => (
                        <li key={refIndex} className="text-sm text-emerald-700 bg-white/50 p-2 rounded border border-emerald-100 italic">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pb-20">
          <button
            onClick={previousQuestion}
            disabled={currentSession.currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextQuestion}
            disabled={currentAnswer === null}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-30 transition-all"
          >
            <span>
              {currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? 'Finish Exam' : 'Next Question'}
            </span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  )
}