import { PracticeQuestion } from '../../../types'

export const communicationQuestions: PracticeQuestion[] = [
  {
    id: 'cqs-001',
    domain: 'communication',
    category: 'Feedback Delivery',
    difficulty: 'medium',
    caseStudy: 'A client becomes visibly upset when hearing that their assessment profile suggests significant executive functioning difficulties that may affect work performance.',
    question: 'Which response best supports therapeutic communication during feedback?',
    options: [
      'Read the report verbatim and continue quickly',
      'Acknowledge the emotional response, pause, and collaborate on what the findings mean for daily functioning',
      'Avoid discussing difficult findings',
      'Tell the client they are overreacting',
      'Focus only on strengths and omit limitations'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'This can feel impersonal and reduce engagement.',
      'Correct — Validation and collaborative meaning-making improve understanding and alliance.',
      'Omitting key findings undermines informed care.',
      'Invalidating language can damage rapport.',
      'Incomplete feedback is clinically unhelpful.'
    ],
    explanation: 'High-quality feedback combines clarity, empathy, and collaborative interpretation to support uptake of recommendations.',
    references: ['Therapeutic Assessment Principles', 'APS Communication Guidelines'],
    questionType: 'complex-vignette'
  },
  {
    id: 'cqs-002',
    domain: 'communication',
    category: 'Report Writing',
    difficulty: 'medium',
    caseStudy: 'You are writing a report for a school team after assessing a student with learning and attention concerns.',
    question: 'How should recommendations be framed for non-psychologist readers?',
    options: [
      'Use test jargon to preserve technical rigor',
      'Provide clear, actionable recommendations linked to functional classroom needs',
      'Include only score tables and no interpretation',
      'Avoid recommendations to stay neutral',
      'Use broad advice without any concrete examples'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Overly technical language reduces practical utility.',
      'Correct — Recommendations should be specific, understandable, and implementable.',
      'Raw scores alone are rarely sufficient for decision-making.',
      'Interpretive guidance is expected in professional reports.',
      'Vague advice is hard to apply in real settings.'
    ],
    explanation: 'Effective reports translate assessment data into practical next steps for the intended audience.',
    references: ['APS Report Writing Guidelines'],
    questionType: 'evidence-based'
  },
  {
    id: 'cqs-003',
    domain: 'communication',
    category: 'Interprofessional Communication',
    difficulty: 'hard',
    caseStudy: 'A GP requests urgent input about whether a shared client is fit to return to work after panic episodes. You have limited recent session data.',
    question: 'What is the most appropriate response?',
    options: [
      'Provide a definitive return-to-work clearance immediately',
      'Communicate current findings, clarify limits of available data, and recommend a brief targeted reassessment',
      'Decline all communication with the GP on confidentiality grounds',
      'Send full psychotherapy notes without discussion',
      'Advise the employer directly without client consent'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'This exceeds available evidence and increases risk.',
      'Correct — Clear scope, transparency, and proportionate follow-up are best practice.',
      'With consent, interprofessional communication is often necessary.',
      'This can breach minimum-necessary disclosure principles.',
      'Direct employer communication typically requires explicit consent.'
    ],
    explanation: 'Professional communication should be accurate about evidentiary limits while still supporting coordinated care.',
    references: ['APS Code of Ethics', 'Privacy Act 1988'],
    questionType: 'priority'
  }
]
