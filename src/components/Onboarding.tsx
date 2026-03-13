'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Calendar,
  Target,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock
} from 'lucide-react'
import { getUpcomingSittings, daysUntilExam, getPricingTier, type ExamSitting } from '@/lib/examSchedule'
import { getDefaultDomains, getProductConfig } from '@/lib/productConfig'
import type { ProductLine } from '@/types'

interface OnboardingData {
  productLine: ProductLine
  examDate: string
  examSittingId: string
  studyGoal: string
  selectedDomains: string[]
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void
  initialProductLine?: ProductLine
  lockedProductLine?: ProductLine
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function Onboarding({ onComplete, initialProductLine = 'psychology', lockedProductLine }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProductLine, setSelectedProductLine] = useState<ProductLine>(lockedProductLine ?? initialProductLine)
  const [selectedSitting, setSelectedSitting] = useState<ExamSitting | null>(null)
  const [studyGoal, setStudyGoal] = useState('moderate')
  const [selectedDomains, setSelectedDomains] = useState<string[]>(getDefaultDomains(initialProductLine).slice(0, 2))

  const upcomingSittings = useMemo(() => getUpcomingSittings(), [])
  const productConfig = useMemo(() => getProductConfig(selectedProductLine), [selectedProductLine])
  const domains = useMemo(
    () =>
      productConfig.domains.map((domain) => ({
        id: domain.id,
        name: domain.name,
        description: `${domain.shortName} focused preparation`,
      })),
    [productConfig.domains]
  )

  useEffect(() => {
    const defaults = getDefaultDomains(selectedProductLine)
    setSelectedDomains(defaults.slice(0, Math.min(3, defaults.length)))
  }, [selectedProductLine])

  const studyGoals = [
    { id: 'intensive', name: 'Intensive', description: '2+ hours daily, exam in 1-2 months' },
    { id: 'moderate', name: 'Moderate', description: '1 hour daily, exam in 3-4 months' },
    { id: 'casual', name: 'Casual', description: '30 minutes daily, exam in 6+ months' }
  ]

  const isProductLocked = Boolean(lockedProductLine)

  useEffect(() => {
    if (lockedProductLine) {
      setSelectedProductLine(lockedProductLine)
    }
  }, [lockedProductLine])

  const allSteps: OnboardingStep[] = [
    {
      id: 'product-line',
      title: 'Choose your product',
      description: 'Pick your exam prep track',
      icon: <BookOpen className="w-8 h-8" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Which product line are you preparing for?</h3>
            <p className="text-gray-600">You can switch later from settings, but this tailors your content now.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedProductLine('psychology')}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                selectedProductLine === 'psychology' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <h4 className="font-semibold text-gray-900">Psychology</h4>
              <p className="text-sm text-gray-600">National Psychology Exam prep</p>
            </button>
            <button
              onClick={() => setSelectedProductLine('nursing')}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                selectedProductLine === 'nursing' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <h4 className="font-semibold text-gray-900">Nursing</h4>
              <p className="text-sm text-gray-600">AHPRA registration prep (NCLEX-RN + OSCE)</p>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'welcome',
      title: `Welcome to AHPRA Academy: ${productConfig.title}`,
      description: 'Set up your personalised study plan',
      icon: <BookOpen className="w-8 h-8" />,
      component: (
        <div className="text-center space-y-6">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedProductLine === 'psychology'
                ? 'Prepare for the National Psychology Exam'
                : 'Prepare for Australian Nursing Registration'}
            </h2>
            <p className="text-gray-600">
              {selectedProductLine === 'psychology'
                ? 'AHPRA Academy Psychology helps you study smarter with practice questions, spaced repetition flashcards, exam simulations, and personalised study plans.'
                : 'AHPRA Academy Nursing helps you prepare for NCLEX-RN and OSCE with Australian-context scenarios, flashcards, and exam simulations.'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What you&apos;ll get:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>&#8226; Product-specific practice questions across all core domains</li>
              <li>&#8226; Spaced repetition flashcards</li>
              <li>&#8226; Full timed exam simulations</li>
              <li>&#8226; Personalised weak-area study plans</li>
              <li>&#8226; Progress tracking and analytics</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'exam-sitting',
      title: 'Which exam are you sitting?',
      description: 'Select your AHPRA exam sitting',
      icon: <Calendar className="w-8 h-8" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Your Exam Sitting
            </h3>
            <p className="text-gray-600">
              Choose which 2026 AHPRA exam window you are preparing for.
            </p>
          </div>

          <div className="space-y-3">
            {upcomingSittings.map((sitting) => {
              const days = daysUntilExam(sitting.examStart)
              const tier = getPricingTier(sitting.examStart)
              const isSelected = selectedSitting?.id === sitting.id
              const isPast = days <= 0

              return (
                <button
                  key={sitting.id}
                  onClick={() => !isPast && setSelectedSitting(sitting)}
                  disabled={isPast}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${isPast
                    ? 'opacity-40 cursor-not-allowed border-gray-200'
                    : isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{sitting.label}</h4>
                      <p className="text-sm text-gray-600">{sitting.examStart} to {sitting.examEnd}</p>
                      {!isPast && (
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500">{days} days away</span>
                          <span className="text-xs font-medium text-green-600">${tier.monthlyRate}/mo</span>
                        </div>
                      )}
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedSitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>{daysUntilExam(selectedSitting.examStart)} days</strong> until your exam. Registration opens {selectedSitting.registrationOpen}.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'study-goal',
      title: 'Your study intensity',
      description: 'Choose your preferred study schedule',
      icon: <Target className="w-8 h-8" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Choose Your Study Intensity
            </h3>
            <p className="text-gray-600">
              This helps us recommend the right amount of daily study.
            </p>
          </div>

          <div className="space-y-3">
            {studyGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setStudyGoal(goal.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${studyGoal === goal.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'domains',
      title: 'Which areas need focus?',
      description: 'Select the domains you want to prioritize',
      icon: <BookOpen className="w-8 h-8" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-orange-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Focus Areas
            </h3>
            <p className="text-gray-600">
              Choose the domains you want to focus on. You can change this later.
            </p>
          </div>

          <div className="space-y-3">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  if (selectedDomains.includes(domain.id)) {
                    setSelectedDomains(selectedDomains.filter(d => d !== domain.id))
                  } else {
                    setSelectedDomains([...selectedDomains, domain.id])
                  }
                }}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${selectedDomains.includes(domain.id)
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{domain.name}</h4>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                  {selectedDomains.includes(domain.id) && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'All set!',
      description: 'Start your study journey',
      icon: <CheckCircle className="w-8 h-8" />,
      component: (
        <div className="text-center space-y-6">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;re All Set!
            </h2>
            <p className="text-gray-600">
              Your personalised study plan is ready.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Your Study Plan:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>&#8226; <strong>Exam:</strong> {selectedSitting ? `${selectedSitting.label} (${selectedSitting.examStart})` : 'Not set'}</p>
              <p>&#8226; <strong>Study Intensity:</strong> {studyGoals.find(g => g.id === studyGoal)?.name}</p>
              <p>&#8226; <strong>Focus Areas:</strong> {selectedDomains.length} domains selected</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Next:</strong> Head to the Dashboard to see your personalised recommendations, or visit Pricing to unlock full access.
            </p>
          </div>
        </div>
      )
    }
  ]

  const steps: OnboardingStep[] = isProductLocked
    ? allSteps.filter((step) => step.id !== 'product-line')
    : allSteps

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const data: OnboardingData = {
        productLine: selectedProductLine,
        examDate: selectedSitting?.examStart || '',
        examSittingId: selectedSitting?.id || '',
        studyGoal,
        selectedDomains,
      }
      onComplete(data)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    const stepId = steps[currentStep]?.id
    switch (stepId) {
      case 'product-line':
      case 'welcome':
      case 'complete':
        return true
      case 'exam-sitting':
        return selectedSitting !== null
      case 'study-goal':
        return studyGoal !== ''
      case 'domains':
        return selectedDomains.length > 0
      default:
        return false
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 safe-top">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Progress bar */}
        <div className="bg-gray-100 h-1.5 rounded-full mx-4 mt-4">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="px-5 pt-5 pb-3 md:px-8 md:pt-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 rounded-xl p-2 shrink-0">
              {currentStepData.icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{currentStepData.title}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{currentStepData.description}</p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
        </div>

        <div className="px-5 py-5 md:p-8 max-h-[55vh] overflow-y-auto">
          {currentStepData.component}
        </div>

        <div className="px-5 py-4 md:p-8 border-t border-gray-100 flex justify-between safe-bottom">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition-all active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
