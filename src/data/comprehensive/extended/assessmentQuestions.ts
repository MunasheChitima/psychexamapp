import { PracticeQuestion } from '../../../types'

export const assessmentQuestions: PracticeQuestion[] = [
  {
    id: 'aqs-001',
    domain: 'assessment',
    category: 'Diagnostic Formulation',
    difficulty: 'medium',
    caseStudy: 'A client presents with concentration problems, poor sleep, and low motivation during exam periods. They wonder whether they have ADHD and request a diagnosis in one session.',
    question: 'What is the most appropriate assessment approach?',
    options: [
      'Confirm ADHD immediately based on symptom overlap',
      'Use a multi-method assessment, including history, collateral data, and validated measures before concluding',
      'Rely only on a self-report checklist',
      'Avoid discussing diagnosis to reduce anxiety',
      'Diagnose an anxiety disorder because exams are stressful'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Premature diagnosis without adequate evidence.',
      'Correct — Differential diagnosis requires a structured, evidence-based process.',
      'Single-source data are insufficient for complex presentations.',
      'Avoidance does not meet clinical assessment standards.',
      'This is an unsupported diagnostic jump.'
    ],
    explanation: 'A robust formulation requires multiple data sources and consideration of competing hypotheses (e.g., anxiety, sleep disruption, ADHD).',
    references: ['DSM-5-TR', 'APS Assessment Guidelines'],
    questionType: 'evidence-based'
  },
  {
    id: 'aqs-002',
    domain: 'assessment',
    category: 'Risk Assessment',
    difficulty: 'hard',
    caseStudy: 'During intake, a client reports passive thoughts that life is not worth living but denies intent or a current plan. They are socially isolated and recently unemployed.',
    question: 'What is the best immediate next step?',
    options: [
      'End the session because there is no active plan',
      'Complete a structured suicide risk assessment and collaboratively develop a safety plan',
      'Call emergency services for all passive ideation',
      'Avoid asking further risk questions to prevent distress',
      'Ask the client to promise they will stay safe'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Risk still needs formal assessment and follow-up.',
      'Correct — Structured risk assessment plus safety planning is indicated.',
      'This can be disproportionate when no imminent risk is identified.',
      'Avoidance can miss key escalation indicators.',
      'No-harm promises are not sufficient risk management.'
    ],
    explanation: 'Passive ideation still warrants systematic risk assessment and a documented safety response proportionate to current risk.',
    references: ['NSQHS Mental Health Standards', 'APS Suicide Prevention Guidance'],
    questionType: 'priority'
  },
  {
    id: 'aqs-003',
    domain: 'assessment',
    category: 'Psychometrics',
    difficulty: 'medium',
    caseStudy: 'A psychologist is selecting a new anxiety measure for repeated outcome monitoring across treatment.',
    question: 'Which psychometric property is most critical for tracking change over time?',
    options: [
      'Face validity only',
      'Sensitivity to change with adequate reliability',
      'Having the shortest possible questionnaire',
      'Norms from a different population',
      'Using a measure with no published validation data'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Face validity alone does not support outcome monitoring.',
      'Correct — Reliable scores and responsiveness are essential for detecting true change.',
      'Brevity is useful but not sufficient.',
      'Poor population fit limits interpretability.',
      'Lack of validation undermines clinical confidence.'
    ],
    explanation: 'Outcome tools should be both reliable and responsive so clinicians can distinguish meaningful improvement from measurement noise.',
    references: ['Psychometric Theory', 'Routine Outcome Monitoring Literature'],
    questionType: 'evidence-based'
  }
]
