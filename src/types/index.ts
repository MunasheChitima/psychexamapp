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

// Enhanced Flashcard interface for comprehensive content
export interface Flashcard {
  id: string
  domain: Domain
  question: string
  answer: string
  options?: string[] // For MCQ-style flashcards
  correctOption?: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  explanation?: string
  lastReviewed: Date | null
  nextReview: Date | null
  reviewCount: number
  masteryLevel: number // 0-5, where 5 is mastered
  isBookmarked?: boolean
  references?: string[]
  clinicalPearls?: string | null
}

// Enhanced Practice Question interface
export interface PracticeQuestion {
  id: string
  domain: Domain
  category: string
  difficulty: 'medium' | 'hard' | 'expert'
  caseStudy: string // Mandatory 100-200 word vignette
  question: string
  options: string[] // Always 5 options (harder than real exam)
  correctAnswer: number
  distractorRationale: string[] // Why each wrong answer is wrong
  explanation: string
  references: string[]
  clinicalPearls?: string // Advanced tips
  questionType: PsychologyQuestionType | NursingQuestionType
}

// Study Materials interface
export interface StudyMaterial {
  id: string
  title: string
  domain: Domain
  category: string
  content: string // Can be 1000-3000 words
  type: 'guide' | 'checklist' | 'flowchart' | 'table' | 'casestudy'
  difficulty: 'comprehensive'
  lastUpdated: string
  keyPoints: string[] // Bullet points for quick review
  commonMistakes: string[] // What to avoid
  examTips: string[] // Specific exam strategies
  references: string[]
}

// Case Study interface
export interface CaseStudy {
  id: string
  title: string
  domain: Domain
  category: string
  caseContent: string // 800-1200 words
  presentation: string
  assessmentPoints: string[]
  treatmentChallenges: string[]
  ethicalDilemmas: string[]
  unexpectedOutcomes: string[]
  discussionQuestions: string[]
  modelAnswers: string[]
  difficulty: 'medium' | 'hard' | 'expert'
  references: string[]
}

// Edge Case Scenario interface
export interface EdgeCaseScenario {
  id: string
  title: string
  domain: Domain
  category: string
  scenario: string // 50-100 words
  complexity: string
  ethicalConsiderations: string[]
  assessmentChallenges: string[]
  interventionComplications: string[]
  systemIssues: string[]
  recommendedActions: string[]
  references: string[]
}

// Mistake Bank interface
export interface MistakeBank {
  id: string
  category: string
  commonMistake: string
  whyItsWrong: string
  correctApproach: string
  examRelevance: 'high' | 'medium'
  exampleQuestion?: string
  references: string[]
}

// Rapid Review Material interface
export interface RapidReviewMaterial {
  id: string
  title: string
  type: 'speed-drill' | 'mnemonic' | 'must-know-list'
  domain: Domain
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number // in seconds
  references: string[]
}

// Simulation Component interface
export interface SimulationComponent {
  id: string
  title: string
  type: 'timed-exam' | 'adaptive-test' | 'clinical-decision-path'
  domain: Domain
  questions: PracticeQuestion[]
  timeLimit: number // in minutes
  passingScore: number
  adaptiveRules?: {
    difficultyAdjustment: string
    remediationPaths: string[]
  }
  decisionPoints?: {
    scenario: string
    options: string[]
    consequences: string[]
  }[]
}

// Legacy interfaces for backward compatibility
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

// Minimal question shape stored in results to support both legacy and enhanced questions
export type ResultQuestion = {
  id: string
  domain: Domain
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export interface PracticeResult {
  id: string
  date: string
  questions: ResultQuestion[]
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

// Engagement engine types

export interface QuestionAttempt {
  questionId: string
  domain: string
  difficulty: string
  answeredCorrectly: boolean
  timestamp: string
  responseTimeMs: number
}

export interface QuestionHistoryEntry {
  attempts: number
  correctCount: number
  lastAttempted: string
  lastCorrect: boolean
  nextDueDate: string | null
  consecutiveCorrect: number
  easeFactor: number
  domain: string
}

export interface QuestionHistory {
  [questionId: string]: QuestionHistoryEntry
}

export interface DailyMission {
  id: string
  type: 'answer_count' | 'correct_streak' | 'domain_focus' | 'hard_correct' | 'perfect_round' | 'review_flashcards' | 'speed_round'
  title: string
  description: string
  target: number
  current: number
  xpReward: number
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  targetDomain?: string
}

export interface EngagementData {
  xp: number
  level: number
  rank: string
  currentStreak: number
  bestStreak: number
  lastActiveDate: string | null
  loginBonusAwardedToday: boolean
  dailyMissions: DailyMission[]
  missionsLastGeneratedDate: string | null
  questionHistory: QuestionHistory
  todayStats: {
    questionsAnswered: number
    correctAnswers: number
    bestStreakToday: number
    currentStreakToday: number
    xpEarnedToday: number
    hardQuestionsCorrect: number
    perfectRounds: number
    flashcardsReviewed: number
    date: string
  }
  recentXpGains: Array<{ amount: number; reason: string; timestamp: string }>
  weeklyXp: number[]
  weekStartDate: string | null
}

export interface AppData {
  productLine: ProductLine
  examDate: string
  studyStats: StudyStats
  studySessions: StudySession[]
  flashcardProgress: FlashcardProgress
  practiceResults: PracticeResult[]
  hasCompletedOnboarding: boolean
  studyGoal: string
  selectedDomains: string[]
  materialBookmarks: Record<string, boolean>
  materialCompleted: Record<string, boolean>
  activeDomain: string
  engagementData: EngagementData
  // Enhanced data structures
  flashcards: Flashcard[]
  practiceQuestions: PracticeQuestion[]
  studyMaterials: StudyMaterial[]
  caseStudies: CaseStudy[]
  edgeCaseScenarios: EdgeCaseScenario[]
  mistakeBank: MistakeBank[]
  rapidReviewMaterials: RapidReviewMaterial[]
  simulationComponents: SimulationComponent[]
}

export type ProductLine = 'psychology' | 'nursing'

export type PsychologyDomain = 'ethics' | 'assessment' | 'interventions' | 'communication'

export type NursingDomain =
  | 'management-of-care'
  | 'safety-infection'
  | 'health-promotion'
  | 'psychosocial'
  | 'basic-care'
  | 'pharmacology'
  | 'risk-reduction'
  | 'physiological'
  | 'osce-skills'

export type Domain = PsychologyDomain | NursingDomain

export type PsychologyQuestionType = 'multi-step' | 'except' | 'priority' | 'complex-vignette' | 'evidence-based'

export type NursingQuestionType =
  | 'select-all'
  | 'ordered-response'
  | 'cloze-dropdown'
  | 'clinical-judgment'
  | 'drug-calculation'
  | 'priority'
  | 'delegation'
  | 'evidence-based'

export interface DashboardProps {
  appData: AppData
  updateAppData: (updates: Partial<AppData>) => void
  onPageChange: (page: string, domain?: string) => void
}

export interface ComponentProps {
  appData: AppData
  updateAppData: (updates: Partial<AppData>) => void
} 