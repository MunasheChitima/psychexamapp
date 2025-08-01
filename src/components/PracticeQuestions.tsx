'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Target,
  CheckCircle,
  XCircle,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { ComponentProps } from '@/types'

interface Question {
  id: string
  domain: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  caseStudy?: string
  references?: string[]
}

interface QuizSession {
  questions: Question[]
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

  // Enhanced questions with detailed explanations and references
  const [questions] = useState<Question[]>([
    // Ethics Questions
    {
      id: '1',
      domain: 'ethics',
      category: 'Confidentiality',
      difficulty: 'medium',
      question: 'A client discloses that they are planning to harm their ex-partner. What is the psychologist\'s primary ethical obligation?',
      options: [
        'Maintain confidentiality at all costs',
        'Immediately report the threat to law enforcement',
        'Discuss the situation with the client\'s family',
        'Document the disclosure but take no further action'
      ],
      correctAnswer: 1,
      explanation: 'When there is a clear and imminent risk of harm to others, psychologists have a duty to warn and protect. This is known as the Tarasoff duty and overrides confidentiality. The psychologist should take immediate action to protect the potential victim while following legal requirements.',
      references: ['APS Code of Ethics Principle A.2', 'Tarasoff v. Regents of the University of California']
    },
    {
      id: '2',
      domain: 'ethics',
      category: 'Professional Boundaries',
      difficulty: 'hard',
      caseStudy: 'Dr. Smith has been seeing a client for 6 months. The client invites Dr. Smith to attend their wedding ceremony.',
      question: 'What should Dr. Smith consider when responding to this invitation?',
      options: [
        'Accept the invitation as it shows good rapport',
        'Decline politely and explain professional boundaries',
        'Ask the client\'s family for permission',
        'Accept but only stay for a short time'
      ],
      correctAnswer: 1,
      explanation: 'Attending social events with clients can blur professional boundaries and create dual relationships. Psychologists should maintain clear professional boundaries to preserve the therapeutic relationship and avoid conflicts of interest.',
      references: ['APS Code of Ethics Principle B.1', 'Professional boundaries guidelines']
    },
    {
      id: '3',
      domain: 'ethics',
      category: 'Informed Consent',
      difficulty: 'medium',
      question: 'What must be included in informed consent for psychological assessment?',
      options: [
        'Only the purpose of the assessment',
        'Purpose, procedures, risks, benefits, and alternatives',
        'Just the cost and duration',
        'Only confidentiality limits'
      ],
      correctAnswer: 1,
      explanation: 'Informed consent must include the purpose, procedures, risks, benefits, alternatives, confidentiality limits, and the right to withdraw consent. This ensures clients can make informed decisions about their participation.',
      references: ['APS Code of Ethics Principle A.3', 'Informed consent requirements']
    },

    // Assessment Questions
    {
      id: '4',
      domain: 'assessment',
      category: 'Cognitive Assessment',
      difficulty: 'medium',
      caseStudy: 'A 35-year-old client presents with concerns about memory problems following a car accident.',
      question: 'Which assessment would be most appropriate for this client?',
      options: [
        'WAIS-IV (Wechsler Adult Intelligence Scale)',
        'WMS-IV (Wechsler Memory Scale)',
        'DASS-42 (Depression Anxiety Stress Scale)',
        'PAI (Personality Assessment Inventory)'
      ],
      correctAnswer: 1,
      explanation: 'The WMS-IV is specifically designed to assess memory functioning and would be most appropriate for evaluating memory problems following a traumatic brain injury. It provides detailed memory indices and can help identify specific memory deficits.',
      references: ['WMS-IV Manual', 'Neuropsychological assessment guidelines']
    },
    {
      id: '5',
      domain: 'assessment',
      category: 'Test Selection',
      difficulty: 'hard',
      question: 'When selecting an assessment tool, which factor is LEAST important?',
      options: [
        'Psychometric properties (reliability and validity)',
        'Cultural appropriateness for the client',
        'Cost of the assessment',
        'The psychologist\'s personal preference'
      ],
      correctAnswer: 3,
      explanation: 'Personal preference should not influence test selection. The choice should be based on psychometric properties, cultural appropriateness, and clinical utility. Test selection must be evidence-based and client-centered.',
      references: ['Test selection guidelines', 'Evidence-based assessment practices']
    },
    {
      id: '6',
      domain: 'assessment',
      category: 'DSM-5',
      difficulty: 'medium',
      question: 'What is the minimum duration required for a diagnosis of Major Depressive Disorder?',
      options: [
        '1 week',
        '2 weeks',
        '1 month',
        '3 months'
      ],
      correctAnswer: 1,
      explanation: 'According to DSM-5, symptoms must be present for at least 2 weeks for a diagnosis of Major Depressive Disorder. This duration criterion helps distinguish depression from normal mood fluctuations.',
      references: ['DSM-5 Criteria', 'Major Depressive Disorder diagnostic guidelines']
    },

    // Interventions Questions
    {
      id: '7',
      domain: 'interventions',
      category: 'CBT',
      difficulty: 'medium',
      caseStudy: 'A client with social anxiety avoids social situations and experiences negative automatic thoughts about being judged.',
      question: 'Which CBT technique would be most appropriate to address this?',
      options: [
        'Systematic desensitization',
        'Cognitive restructuring',
        'Mindfulness meditation',
        'Psychodynamic therapy'
      ],
      correctAnswer: 1,
      explanation: 'Cognitive restructuring helps clients identify and challenge negative automatic thoughts, which is central to treating social anxiety. This technique directly addresses the cognitive distortions that maintain social anxiety.',
      references: ['CBT for Social Anxiety', 'Cognitive restructuring techniques']
    },
    {
      id: '8',
      domain: 'interventions',
      category: 'Psychopharmacology',
      difficulty: 'hard',
      question: 'Which medication class is typically first-line for treating Generalized Anxiety Disorder?',
      options: [
        'Benzodiazepines',
        'SSRIs',
        'Antipsychotics',
        'Stimulants'
      ],
      correctAnswer: 1,
      explanation: 'SSRIs are typically first-line treatment for GAD due to their efficacy, safety profile, and lower risk of dependence compared to benzodiazepines. They are also effective for comorbid depression.',
      references: ['Treatment guidelines for GAD', 'SSRI safety and efficacy data']
    },
    {
      id: '9',
      domain: 'interventions',
      category: 'Motivational Interviewing',
      difficulty: 'medium',
      question: 'What is the primary goal of motivational interviewing?',
      options: [
        'To persuade clients to change',
        'To resolve ambivalence and increase motivation for change',
        'To provide education about health risks',
        'To establish treatment goals'
      ],
      correctAnswer: 1,
      explanation: 'Motivational interviewing aims to help clients resolve ambivalence and increase their intrinsic motivation for change through collaborative conversation. It is client-centered and non-confrontational.',
      references: ['Motivational Interviewing principles', 'MI effectiveness research']
    },

    // Communication Questions
    {
      id: '10',
      domain: 'communication',
      category: 'Report Writing',
      difficulty: 'medium',
      question: 'What should be included in the recommendations section of a psychological report?',
      options: [
        'Only treatment recommendations',
        'Specific, actionable recommendations based on assessment findings',
        'General advice for the client',
        'Only diagnostic impressions'
      ],
      correctAnswer: 1,
      explanation: 'Recommendations should be specific, actionable, and directly related to the assessment findings, including treatment, educational, and practical suggestions. They should be tailored to the client\'s specific needs.',
      references: ['Psychological report writing guidelines', 'Recommendations best practices']
    },
    {
      id: '11',
      domain: 'communication',
      category: 'Cultural Competence',
      difficulty: 'hard',
      caseStudy: 'A psychologist is working with a client from a collectivist culture who is reluctant to discuss individual concerns.',
      question: 'What approach would be most culturally responsive?',
      options: [
        'Insist on individual therapy sessions',
        'Incorporate family or community perspectives',
        'Use only Western therapeutic techniques',
        'Refer to a different therapist'
      ],
      correctAnswer: 1,
      explanation: 'Working with collectivist cultures often requires incorporating family and community perspectives, as individual concerns are viewed within a broader social context. This approach respects cultural values and improves engagement.',
      references: ['Cultural competence guidelines', 'Working with collectivist cultures']
    },
    {
      id: '12',
      domain: 'communication',
      category: 'Record Keeping',
      difficulty: 'easy',
      question: 'How long should psychological records be retained?',
      options: [
        'Until the client turns 18',
        'For 7 years after the last contact',
        'For 3 years after termination',
        'Indefinitely'
      ],
      correctAnswer: 1,
      explanation: 'Most jurisdictions require psychological records to be retained for 7 years after the last professional contact, though requirements may vary. This ensures records are available for legal and professional purposes.',
      references: ['Record retention requirements', 'Legal and ethical guidelines']
    }
  ])

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500' },
    { id: 'ethics', name: 'Ethics', color: 'bg-blue-500' },
    { id: 'assessment', name: 'Assessment', color: 'bg-green-500' },
    { id: 'interventions', name: 'Interventions', color: 'bg-purple-500' },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500' }
  ]

  const filteredQuestions = questions.filter(q => 
    selectedDomain === 'all' || q.domain === selectedDomain
  )

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
      id: Date.now().toString(),
      date: new Date().toISOString(),
      questions: currentSession.questions,
      score,
      domain: selectedDomain === 'all' ? 'mixed' : selectedDomain,
      duration: currentSession.questions.length * 2,
      isComplete: true,
      currentQuestionIndex: currentSession.currentQuestionIndex,
      answers: currentSession.answers,
      timeRemaining: currentSession.timeRemaining,
      startTime: currentSession.startTime,
      endTime: new Date(),
      showExplanation: false,
      reviewedQuestions: new Set<number>()
    }

    setCurrentSession(completedSession as QuizSession)
    setIsQuizActive(false)
    setShowResults(true)

    // Update app data with quiz results
    const newStudyStats = { ...appData.studyStats }
    newStudyStats.questionsAnswered += currentSession.questions.length
    newStudyStats.correctAnswers += correctAnswers
    newStudyStats.totalHours += 0.5

    const newPracticeResults = [...appData.practiceResults, completedSession]
    
    updateAppData({
      studyStats: newStudyStats,
      practiceResults: newPracticeResults
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
  }, [isQuizActive, currentSession, quizMode])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = currentSession?.questions[currentSession.currentQuestionIndex]
  const currentAnswer = currentSession?.answers[currentSession.currentQuestionIndex]
  const isCorrect = currentAnswer === currentQuestion?.correctAnswer

  if (showResults && currentSession) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                    answer !== currentSession.questions[index].correctAnswer
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

            {/* Review Mode */}
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
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
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
                              className={`p-3 rounded-lg border-2 ${
                                optionIndex === question.correctAnswer
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
          {/* Quiz Setup */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Setup</h2>
            
            {/* Domain Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Domain</h3>
              <div className="flex flex-wrap gap-3">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedDomain === domain.id
                        ? `${domain.color} text-white`
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {domain.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Mode */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizMode('practice')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quizMode === 'practice'
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
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    quizMode === 'timed'
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

            {/* Quiz Info */}
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      {/* Header with Timer */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Questions</h1>
              <p className="text-gray-600 mt-1">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
              </p>
            </div>
            {quizMode === 'timed' && (
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-red-600" />
                <span className="text-xl font-mono font-bold text-red-600">
                  {formatTime(currentSession.timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            {/* Question Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  currentQuestion.domain === 'ethics' ? 'bg-blue-500' :
                  currentQuestion.domain === 'assessment' ? 'bg-green-500' :
                  currentQuestion.domain === 'interventions' ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  {currentQuestion.domain.charAt(0).toUpperCase() + currentQuestion.domain.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {currentQuestion.category}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Case Study */}
            {currentQuestion.caseStudy && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Case Study:</h4>
                <p className="text-blue-800">{currentQuestion.caseStudy}</p>
              </div>
            )}

            {/* Question */}
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={currentAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    currentAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : index === currentQuestion.correctAnswer && currentSession.showExplanation
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer === index
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : index === currentQuestion.correctAnswer && currentSession.showExplanation
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                      {index === currentQuestion.correctAnswer && currentSession.showExplanation && currentAnswer !== index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {currentSession.showExplanation && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Explanation</h4>
                </div>
                <p className="text-gray-700 mb-3">{currentQuestion.explanation}</p>
                {currentQuestion.references && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">References:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {currentQuestion.references.map((ref, refIndex) => (
                        <li key={refIndex}>• {ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentSession.currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {currentSession.answers.filter(answer => answer !== null).length} of {currentSession.questions.length} answered
            </span>
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentAnswer === null}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>
              {currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? 'Finish' : 'Next'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  )
} 