import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-si-001',
    domain: 'safety-infection' as const,
    category: 'Hand Hygiene',
    caseStudy: 'You prepare to insert a peripheral IV cannula after helping a patient to the bathroom and adjusting their bed rails.',
    question: 'Which action best aligns with infection prevention standards?',
    options: [
      'Use gloves only and skip hand rub',
      'Perform hand hygiene before aseptic task and after glove removal',
      'Wash hands only at start of shift',
      'Use alcohol rub after procedure only',
      'Wear double gloves to replace hand hygiene',
    ],
    correctAnswer: 1,
    explanation: 'Australian infection prevention practice follows moments for hand hygiene before aseptic tasks and after glove removal/contact.',
    references: ['WHO 5 Moments', 'Australian Guidelines for Infection Prevention and Control'],
    flashcardQ: 'When is hand hygiene mandatory during cannulation?',
    flashcardA: 'Before the aseptic task and after glove removal/patient contact.',
  },
  {
    id: 'n-si-002',
    domain: 'safety-infection' as const,
    category: 'Medication Safety',
    caseStudy: 'A patient is prescribed IV potassium chloride on a general ward. A new graduate asks how to administer it.',
    question: 'What is the safest response?',
    options: [
      'Give as IV push if diluted',
      'Administer without pump to save time',
      'Treat as high-risk medication and infuse per protocol with pump checks',
      'Ask family to confirm dose before starting',
      'Delay indefinitely until pharmacist is present',
    ],
    correctAnswer: 2,
    explanation: 'Potassium is an APINCH high-risk medicine and requires strict protocol-based administration and monitoring.',
    references: ['APINCH medication safety guidance', 'NSQHS Medication Safety Standard'],
    flashcardQ: 'Why is IV potassium high risk?',
    flashcardA: 'It is an APINCH medicine and can cause fatal harm if concentration/rate are incorrect.',
  },
]

export const { practiceQuestions: safetyInfectionQuestions, flashcards: safetyInfectionFlashcards } = buildNursingContent(seed)
