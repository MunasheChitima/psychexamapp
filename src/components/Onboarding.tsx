'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Target, 
  BookOpen, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [examDate, setExamDate] = useState('')
  const [studyGoal, setStudyGoal] = useState('moderate')
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['ethics', 'assessment'])

  const domains = [
    { id: 'ethics', name: 'Ethics', description: 'Professional standards and ethical practice' },
    { id: 'assessment', name: 'Assessment', description: 'Psychological testing and evaluation' },
    { id: 'interventions', name: 'Interventions', description: 'Treatment approaches and techniques' },
    { id: 'communication', name: 'Communication', description: 'Professional communication skills' }
  ]

  const studyGoals = [
    { id: 'intensive', name: 'Intensive', description: '2+ hours daily, exam in 1-2 months' },
    { id: 'moderate', name: 'Moderate', description: '1 hour daily, exam in 3-4 months' },
    { id: 'casual', name: 'Casual', description: '30 minutes daily, exam in 6+ months' }
  ]

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Psychology Exam Prep',
      description: 'Let\'s set up your personalized study plan',
      icon: <BookOpen className="w-8 h-8" />,
      component: (
        <div className="text-center space-y-6">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Your Psychology Exam Prep
            </h2>
            <p className="text-gray-600">
              This app will help you prepare for the National Psychology Examination with personalized study plans, practice questions, and progress tracking.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Personalized study recommendations</li>
              <li>• Practice questions with explanations</li>
              <li>• Spaced repetition flashcards</li>
              <li>• Progress tracking and analytics</li>
              <li>• Comprehensive study materials</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'exam-date',
      title: 'When is your exam?',
      description: 'This helps us create a personalized study timeline',
      icon: <Calendar className="w-8 h-8" />,
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Set Your Exam Date
            </h3>
            <p className="text-gray-600">
              We'll use this to create a personalized study schedule and track your progress.
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Exam Date</span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </label>
            
            {examDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Study Timeline:</strong> You have{' '}
                  {Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to prepare.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'study-goal',
      title: 'What\'s your study intensity?',
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
              This helps us recommend the right amount of daily study time for you.
            </p>
          </div>
          
          <div className="space-y-3">
            {studyGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setStudyGoal(goal.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  studyGoal === goal.id
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
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  selectedDomains.includes(domain.id)
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
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> You can always adjust your focus areas later in the settings.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Let\'s start your study journey',
      icon: <CheckCircle className="w-8 h-8" />,
      component: (
        <div className="text-center space-y-6">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h2>
            <p className="text-gray-600">
              Your personalized study plan is ready. Let's start your psychology exam preparation journey.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Your Study Plan:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• <strong>Exam Date:</strong> {examDate ? new Date(examDate).toLocaleDateString() : 'Not set'}</p>
              <p>• <strong>Study Intensity:</strong> {studyGoals.find(g => g.id === studyGoal)?.name}</p>
              <p>• <strong>Focus Areas:</strong> {selectedDomains.length} domains selected</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Next:</strong> Start with the Dashboard to see your personalized recommendations.
            </p>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save onboarding data
      localStorage.setItem('examDate', examDate)
      localStorage.setItem('studyGoal', studyGoal)
      localStorage.setItem('selectedDomains', JSON.stringify(selectedDomains))
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true // Welcome
      case 1: return examDate !== '' // Exam date
      case 2: return studyGoal !== '' // Study goal
      case 3: return selectedDomains.length > 0 // Domains
      case 4: return true // Complete
      default: return false
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div 
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 rounded-full p-2">
              {currentStepData.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStepData.component}
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 