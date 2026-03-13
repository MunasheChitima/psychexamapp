import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-pharm-001',
    domain: 'pharmacology' as const,
    category: 'Drug Calculations',
    caseStudy: 'A child weighs 20 kg and is prescribed 10 mg/kg paracetamol orally. Stock concentration is 250 mg/5 mL.',
    question: 'What volume should be administered?',
    options: ['2 mL', '3 mL', '4 mL', '5 mL', '8 mL'],
    correctAnswer: 2,
    explanation: 'Dose = 200 mg. At 250 mg per 5 mL, concentration is 50 mg/mL. Required volume is 200/50 = 4 mL.',
    references: ['Medication calculation principles', 'Australian paediatric medication safety guidance'],
    flashcardQ: 'Dose 10 mg/kg for 20 kg equals what mg?',
    flashcardA: '200 mg total dose.',
  },
  {
    id: 'n-pharm-002',
    domain: 'pharmacology' as const,
    category: 'High-Risk Medicines',
    caseStudy: 'You are preparing to administer insulin in a busy evening shift with multiple interruptions.',
    question: 'Which safety step is most important?',
    options: [
      'Skip bedside identity checks to save time',
      'Rely on memory of usual dose',
      'Perform independent double-check and verify patient identifiers and BGL',
      'Administer before checking prescription chart',
      'Delegate administration to an untrained assistant',
    ],
    correctAnswer: 2,
    explanation: 'Insulin is high risk; independent checks, chart verification, identifiers, and current BGL are core safety controls.',
    references: ['APINCH framework', 'NSQHS Medication Safety Standard'],
    flashcardQ: 'Why are insulin checks strict?',
    flashcardA: 'Insulin is high risk and dosing errors can cause severe hypo/hyperglycaemia.',
  },
]

export const { practiceQuestions: pharmacologyQuestions, flashcards: pharmacologyFlashcards } = buildNursingContent(seed)
