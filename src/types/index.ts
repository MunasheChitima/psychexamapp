export interface StudyStats {
  totalHours: number
  questionsAnswered: number
  correctAnswers: number
  studyStreak: number
  estimatedReadiness: number
}

export interface StudySession {
  id: string
  date: string
  duration: number // in minutes
  domain: string
  activity: string
  materialId?: string
  materialTitle?: string
}

export interface FlashcardProgress {
  [key: string]: unknown
}

export interface Question {
  id: string
  domain: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  caseStudy?: string
}

export interface PracticeResult {
  id: string
  date: string
  questions: Question[]
  score: number
  domain: string
  duration: number
  isComplete: boolean
  currentQuestionIndex: number
  answers: (number | null)[]
  timeRemaining: number
  startTime: Date | null
  endTime: Date | null
}

export interface AppData {
  examDate: string
  studyStats: StudyStats
  studySessions: StudySession[]
  flashcardProgress: FlashcardProgress
  practiceResults: PracticeResult[]
  hasCompletedOnboarding: boolean
}

export interface DashboardProps {
  appData: AppData
  updateAppData: (updates: Partial<AppData>) => void
  onPageChange: (page: string) => void
}

export interface ComponentProps {
  appData: AppData
  updateAppData: (updates: Partial<AppData>) => void
} 