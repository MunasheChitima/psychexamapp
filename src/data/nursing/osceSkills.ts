import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-osce-001',
    domain: 'osce-skills' as const,
    category: 'Medication Administration Station',
    caseStudy: 'In an OSCE station, you must administer a scheduled oral medication to an adult patient with allergy history and language barriers.',
    question: 'What sequence best demonstrates safe station performance?',
    options: [
      'Give medication first, then check chart',
      'Check chart, verify identifiers/allergies, explain via interpreter support as needed, administer, document',
      'Skip explanation to save time',
      'Ask assessor for the dose decision',
      'Document before administering',
    ],
    correctAnswer: 1,
    explanation: 'OSCE scoring prioritizes safety sequence: rights, identifiers/allergies, communication, administration, and documentation.',
    references: ['OSCE preparation guidance', 'NMBA RN Standards'],
    flashcardQ: 'Core OSCE medication station sequence?',
    flashcardA: 'Verify order and safety checks, communicate clearly, administer safely, then document.',
  },
  {
    id: 'n-osce-002',
    domain: 'osce-skills' as const,
    category: 'Clinical Handover Station',
    caseStudy: 'You must hand over a deteriorating patient to the incoming team within 90 seconds in an OSCE scenario.',
    question: 'Which structure should you use for concise high-quality handover?',
    options: ['Narrative storytelling', 'ISBAR', 'Free-form notes', 'Only observations', 'Only recommendation'],
    correctAnswer: 1,
    explanation: 'ISBAR supports concise and complete handover under time pressure and is commonly expected in Australian assessments.',
    references: ['ACSQHC handover resources'],
    flashcardQ: 'Best OSCE handover format in Australia?',
    flashcardA: 'ISBAR for concise, structured, safety-focused communication.',
  },
]

export const { practiceQuestions: osceSkillsQuestions, flashcards: osceSkillsFlashcards } = buildNursingContent(seed)
