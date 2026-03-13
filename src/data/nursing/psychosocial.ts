import { buildNursingContent } from './base'

const seed = [
  {
    id: 'n-psy-001',
    domain: 'psychosocial' as const,
    category: 'Therapeutic Communication',
    caseStudy: 'A patient admitted after self-harm says, "There is no point talking to anyone." They avoid eye contact and appear distressed.',
    question: 'What is the best initial nurse response?',
    options: [
      'Challenge the statement quickly to build resilience',
      'Provide false reassurance that everything will be fine',
      'Use calm, non-judgmental engagement and open-ended questions to assess risk',
      'Avoid discussing self-harm to reduce distress',
      'Tell family details without consent',
    ],
    correctAnswer: 2,
    explanation: 'Therapeutic communication prioritizes safety, rapport, and structured risk assessment without judgement.',
    references: ['NMBA RN Standards', 'State mental health service guidance'],
    flashcardQ: 'First communication goal in psychosocial crisis?',
    flashcardA: 'Establish safety and rapport, then assess risk using open, non-judgmental questions.',
  },
  {
    id: 'n-psy-002',
    domain: 'psychosocial' as const,
    category: 'Risk and Legislation',
    caseStudy: 'A patient with escalating agitation threatens staff and attempts to leave despite high immediate risk of harm.',
    question: 'What should guide action in this scenario?',
    options: [
      'Informal ward custom',
      'Only family preference',
      'Relevant state or territory Mental Health Act and local escalation policy',
      'Wait until next business day',
      'Social media advice from peers',
    ],
    correctAnswer: 2,
    explanation: 'Mental health interventions and restrictive responses must align with jurisdictional legislation and facility procedures.',
    references: ['State/Territory Mental Health Act', 'Hospital escalation protocols'],
    flashcardQ: 'Which law governs involuntary mental health actions?',
    flashcardA: 'The relevant state or territory Mental Health Act.',
  },
]

export const { practiceQuestions: psychosocialQuestions, flashcards: psychosocialFlashcards } = buildNursingContent(seed)
