import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-phys-001',
    domain: 'physiological' as const,
    category: 'Sepsis',
    caseStudy: 'A patient has fever, tachycardia, hypotension, elevated lactate, and altered mental state in ED.',
    question: 'Which response best aligns with early sepsis management?',
    options: [
      'Delay treatment until cultures are fully processed',
      'Escalate immediately and commence sepsis pathway including timely cultures/antibiotics/fluids per protocol',
      'Provide oral antipyretic only',
      'Observe for another 6 hours',
      'Discharge if symptoms briefly improve',
    ],
    correctAnswer: 1,
    explanation: 'Sepsis requires urgent protocolized management and escalation to reduce morbidity and mortality.',
    references: ['Australian Sepsis Clinical Care Standard'],
    flashcardQ: 'Core sepsis nursing principle?',
    flashcardA: 'Recognize early, escalate fast, and initiate pathway-based care immediately.',
  },
  {
    id: 'n-phys-002',
    domain: 'physiological' as const,
    category: 'Resuscitation',
    caseStudy: 'An inpatient becomes unresponsive, not breathing normally, and has no palpable pulse.',
    question: 'Which guideline body should inform Australian BLS response?',
    options: ['AHA', 'European Resuscitation Council', 'Australian Resuscitation Council', 'Local sports club guidance', 'Any available internet source'],
    correctAnswer: 2,
    explanation: 'Australian resuscitation practice aligns with Australian Resuscitation Council guidance and local policy.',
    references: ['Australian Resuscitation Council Guidelines'],
    flashcardQ: 'Which body sets Australian BLS guidance?',
    flashcardA: 'Australian Resuscitation Council (ARC).',
  },
]

export const { practiceQuestions: physiologicalQuestions, flashcards: physiologicalFlashcards } = buildNursingContent(seed)
