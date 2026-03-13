import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-rr-001',
    domain: 'risk-reduction' as const,
    category: 'Deterioration Recognition',
    caseStudy: 'A post-op patient becomes tachycardic, hypotensive, and increasingly drowsy over 30 minutes.',
    question: 'What is the best immediate action?',
    options: [
      'Recheck in one hour',
      'Document and wait for rounds',
      'Escalate using local rapid response pathway and repeat full observations',
      'Give oral fluids only',
      'Transfer patient without notifying medical team',
    ],
    correctAnswer: 2,
    explanation: 'Clinical deterioration requires early escalation using local rapid response systems and structured reassessment.',
    references: ['Recognising and Responding to Acute Deterioration Standard', 'Local rapid response protocol'],
    flashcardQ: 'First priority in sudden deterioration?',
    flashcardA: 'Escalate promptly via rapid response pathway and reassess ABC/observations.',
  },
  {
    id: 'n-rr-002',
    domain: 'risk-reduction' as const,
    category: 'Fluid Balance',
    caseStudy: 'A patient with heart failure has reduced urine output, ankle oedema, and increasing weight over 48 hours.',
    question: 'Which nursing assessment is most useful for trend-based risk reduction?',
    options: [
      'Single random blood pressure only',
      'Daily weight, strict fluid balance charting, and symptom trend review',
      'Only ask if patient feels thirsty',
      'Ignore overnight fluid intake',
      'Record intake but not output',
    ],
    correctAnswer: 1,
    explanation: 'Trend monitoring of weight, intake/output, and symptoms is essential for early detection of fluid overload.',
    references: ['Heart failure nursing care principles'],
    flashcardQ: 'Best routine marker for fluid status trends?',
    flashcardA: 'Daily weight combined with accurate intake/output charting.',
  },
]

export const { practiceQuestions: riskReductionQuestions, flashcards: riskReductionFlashcards } = buildNursingContent(seed)
