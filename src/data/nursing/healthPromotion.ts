import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-hp-001',
    domain: 'health-promotion' as const,
    category: 'Immunisation',
    caseStudy: 'A parent asks whether their child can receive a vaccine today after missing the previous scheduled dose.',
    question: 'Which Australian resource should guide catch-up advice?',
    options: [
      'US CDC childhood schedule',
      'Product leaflet only',
      'Australian Immunisation Handbook and NIP schedule',
      'Social media parent groups',
      'Previous school newsletter',
    ],
    correctAnswer: 2,
    explanation: 'Australian practice should use the Australian Immunisation Handbook and National Immunisation Program schedule.',
    references: ['Australian Immunisation Handbook', 'National Immunisation Program'],
    flashcardQ: 'Primary source for Australian vaccine catch-up decisions?',
    flashcardA: 'Australian Immunisation Handbook plus current NIP schedule.',
  },
  {
    id: 'n-hp-002',
    domain: 'health-promotion' as const,
    category: 'Cultural Safety',
    caseStudy: 'An Aboriginal patient presents with poorly controlled diabetes and missed follow-up appointments.',
    question: 'What is the most culturally safe nursing response?',
    options: [
      'Focus only on blood glucose targets',
      'Assume non-adherence is patient choice',
      'Use culturally safe communication and involve Aboriginal health workers where available',
      'Delay care until specialist review',
      'Provide generic written instructions only',
    ],
    correctAnswer: 2,
    explanation: 'Culturally safe, person-centred care includes partnership, respect, and appropriate Aboriginal and Torres Strait Islander health supports.',
    references: ['NMBA Code of Conduct', 'National Aboriginal and Torres Strait Islander Health Plan'],
    flashcardQ: 'What is a key feature of culturally safe care?',
    flashcardA: 'Partnership-based care that respects identity, context, and lived experience.',
  },
]

export const { practiceQuestions: healthPromotionQuestions, flashcards: healthPromotionFlashcards } = buildNursingContent(seed)
