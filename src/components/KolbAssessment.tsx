'use client'

import { useState } from 'react'
import {
    Brain,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    RotateCcw
} from 'lucide-react'
import {
    kolbAssessmentQuestions,
    calculateKolbScores,
    determineKolbStyle,
    getKolbStyleById,
    kolbLearningStyles,
    type KolbStyleId
} from '@/data/kolbLearningStyles'
import KolbResults from './KolbResults'
import { AppData } from '@/types'

interface KolbAssessmentProps {
    appData: AppData
    updateAppData: (updates: Partial<AppData>) => void
}

export default function KolbAssessment({ appData, updateAppData }: KolbAssessmentProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, 'a' | 'b' | 'c' | 'd'>>({})
    const [showResults, setShowResults] = useState(false)
    const [resultStyle, setResultStyle] = useState<KolbStyleId | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [showIntro, setShowIntro] = useState(true)

    // Check if we already have a saved learning style
    const savedStyle = (() => {
        try {
            const saved = typeof window !== 'undefined' ? localStorage.getItem('kolb-learning-style') : null
            return saved as KolbStyleId | null
        } catch {
            return null
        }
    })()

    const [hasSavedStyle, setHasSavedStyle] = useState(!!savedStyle)

    if (hasSavedStyle && savedStyle && showIntro) {
        const style = getKolbStyleById(savedStyle)
        return (
            <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Already assessed header */}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className={`bg-gradient-to-r ${style.gradient} p-8 text-white text-center`}>
                            <div className="text-5xl mb-4">{style.iconEmoji}</div>
                            <h2 className="text-xl md:text-3xl font-bold mb-2">Your Learning Style</h2>
                            <p className="text-xl opacity-90">{style.name} — {style.shortDesc}</p>
                        </div>

                        <div className="p-8">
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{style.description}</p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        setShowResults(true)
                                        setResultStyle(savedStyle)
                                        setShowIntro(false)
                                    }}
                                    className={`flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r ${style.gradient} text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all font-semibold`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>View Full Results & Study Tips</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setHasSavedStyle(false)
                                        setShowIntro(true)
                                    }}
                                    className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    <span>Retake Assessment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showResults && resultStyle) {
        return (
            <KolbResults
                styleId={resultStyle}
                scores={calculateKolbScores(answers)}
                appData={appData}
                updateAppData={updateAppData}
                onRetake={() => {
                    setShowResults(false)
                    setResultStyle(null)
                    setAnswers({})
                    setCurrentQuestion(0)
                    setShowIntro(true)
                    setHasSavedStyle(false)
                }}
            />
        )
    }

    // Show intro screen
    if (showIntro && !hasSavedStyle) {
        return (
            <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        {/* Gradient header */}
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold mb-3">Discover Your Learning Style</h1>
                            <p className="text-lg opacity-90 max-w-xl mx-auto">
                                Understanding how you learn best will help you study smarter for the National Psychology Examination
                            </p>
                        </div>

                        <div className="p-8">
                            {/* What is this */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span className="text-2xl">📚</span>
                                    <span>About Kolb&apos;s Learning Styles</span>
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    David Kolb&apos;s Experiential Learning Theory identifies four distinct learning styles based on how you
                                    perceive and process information. Each style has unique strengths and preferred study methods.
                                </p>

                                {/* Four styles preview */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {kolbLearningStyles.map((style) => (
                                        <div key={style.id} className={`${style.bgLight} ${style.borderColor} border rounded-xl p-4`}>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-xl">{style.iconEmoji}</span>
                                                <span className={`font-semibold ${style.textColor}`}>{style.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{style.shortDesc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-8">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    <span>What you&apos;ll get:</span>
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Your personalised learning style profile</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Study strategies tailored to how you learn best</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Exam-specific tips for each domain (Ethics, Assessment, Interventions, Communication)</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Personalised feedback to improve on your weakest areas</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>Exam day tips that match your natural learning preferences</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-4">12 questions • Takes about 3 minutes</p>
                                <button
                                    onClick={() => setShowIntro(false)}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <span>Start Assessment</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Quiz mode
    const question = kolbAssessmentQuestions[currentQuestion]
    const totalQuestions = kolbAssessmentQuestions.length
    const progress = (Object.keys(answers).length / totalQuestions) * 100
    const isLastQuestion = currentQuestion === totalQuestions - 1
    const allAnswered = Object.keys(answers).length === totalQuestions
    const currentAnswer = answers[question.id]

    const handleSelectAnswer = (optionId: 'a' | 'b' | 'c' | 'd') => {
        setAnswers(prev => ({ ...prev, [question.id]: optionId }))
    }

    const handleNext = () => {
        if (isLastQuestion && allAnswered) {
            // Calculate and show results
            const scores = calculateKolbScores(answers)
            const style = determineKolbStyle(scores)
            setResultStyle(style)

            // Save to localStorage
            try {
                localStorage.setItem('kolb-learning-style', style)
                localStorage.setItem('kolb-scores', JSON.stringify(scores))
            } catch {
                // ignore localStorage failures
            }

            setIsAnimating(true)
            setTimeout(() => {
                setShowResults(true)
                setIsAnimating(false)
            }, 800)
        } else if (currentAnswer) {
            setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions - 1))
        }
    }

    const handlePrevious = () => {
        setCurrentQuestion(prev => Math.max(prev - 1, 0))
    }

    return (
        <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Calculating animation */}
                {isAnimating && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Analysing Your Responses</h3>
                            <p className="text-gray-600">Determining your learning style...</p>
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question card */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                                {question.scenario}
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-3">
                            {question.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectAnswer(option.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${currentAnswer === option.id
                                        ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-colors ${currentAnswer === option.id
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {option.id.toUpperCase()}
                                        </div>
                                        <span className={`text-base leading-snug ${currentAnswer === option.id ? 'text-indigo-900 font-medium' : 'text-gray-700'
                                            }`}>
                                            {option.text}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={currentQuestion === 0 ? () => setShowIntro(true) : handlePrevious}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{currentQuestion === 0 ? 'Back' : 'Previous'}</span>
                        </button>

                        {/* Question dots */}
                        <div className="hidden md:flex items-center space-x-1.5">
                            {kolbAssessmentQuestions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentQuestion
                                        ? 'bg-indigo-500 scale-125'
                                        : answers[q.id]
                                            ? 'bg-indigo-300'
                                            : 'bg-gray-300'
                                        }`}
                                    title={`Question ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!currentAnswer}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-semibold transition-all ${currentAnswer
                                ? isLastQuestion && allAnswered
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span>{isLastQuestion && allAnswered ? 'See Results' : 'Next'}</span>
                            {isLastQuestion && allAnswered ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
