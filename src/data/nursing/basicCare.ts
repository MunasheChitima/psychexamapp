import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-bc-001',
    domain: 'basic-care' as const,
    category: 'Nutrition and Swallow',
    caseStudy: 'An older stroke patient coughs during thin fluids and has reduced oral intake.',
    question: 'What is the safest immediate nursing action?',
    options: [
      'Encourage unrestricted oral fluids',
      'Continue same diet to maintain autonomy',
      'Escalate for swallow review and apply current IDDSI recommendations',
      'Stop all nutrition permanently',
      'Use only sweet drinks because they are easier to swallow',
    ],
    correctAnswer: 2,
    explanation: 'Potential dysphagia requires timely assessment and texture modification aligned to IDDSI and local speech pathology guidance.',
    references: ['IDDSI Framework', 'Local dysphagia policy'],
    flashcardQ: 'What framework guides texture-modified diets?',
    flashcardA: 'IDDSI framework.',
  },
  {
    id: 'n-bc-002',
    domain: 'basic-care' as const,
    category: 'Pressure Injury Prevention',
    caseStudy: 'A bedbound patient with poor mobility has sacral redness and moisture-associated skin risk.',
    question: 'Which prevention bundle is most appropriate?',
    options: [
      'Reposition every shift only',
      'Ignore redness unless skin is broken',
      'Regular repositioning, skin checks, pressure-relieving surfaces, and moisture management',
      'Use donut cushion as primary strategy',
      'Keep patient fully supine at all times',
    ],
    correctAnswer: 2,
    explanation: 'Pressure injury prevention requires a multi-factor strategy including repositioning schedules and skin integrity care.',
    references: ['NSQHS Comprehensive Care Standard'],
    flashcardQ: 'Core principle of pressure injury prevention?',
    flashcardA: 'Use a prevention bundle: reposition, inspect skin, reduce pressure, manage moisture.',
  },
]

export const { practiceQuestions: basicCareQuestions, flashcards: basicCareFlashcards } = buildNursingContent(seed)
