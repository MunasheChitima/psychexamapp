import { PracticeQuestion, Flashcard } from '../../../types'

interface FlashcardInput {
  id: string
  domain: string
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  explanation?: string
  references?: string[]
}

export const assessmentQuestions: PracticeQuestion[] = [
  {
    id: 'aq-001', domain: 'assessment', category: 'Cognitive', difficulty: 'medium',
    caseStudy: 'A 72-year-old woman is referred for assessment due to increasing forgetfulness and difficulty managing her finances.',
    question: 'Which of the following would be the most appropriate cognitive screening tool to use initially?',
    options: ['WAIS-IV', 'MMSE or MoCA', 'TAT', 'Rorschach', 'PAI'],
    correctAnswer: 1,
    distractorRationale: ['Too comprehensive for initial screening.', 'Correct — These are standard, brief mental status screens for dementia.', 'Projective test, not for cognition.', 'Projective test, not for cognition.', 'Personality test.'],
    explanation: 'Screening tools like the MoCA (Montreal Cognitive Assessment) are designed to detect mild cognitive impairment and dementia in older adults.',
    references: ['Nasreddine et al. (2005)', 'Dementia screening protocols'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-002', domain: 'assessment', category: 'Psychometrics', difficulty: 'hard',
    caseStudy: 'Psychometric principles apply to all tests.',
    question: 'The "Standard Error of Measurement" (SEM) is most closely related to which psychometric concept?',
    options: ['Validity', 'Reliability', 'Normality', 'Variance', 'Skewness'],
    correctAnswer: 1,
    distractorRationale: ['Validity is what a test measures, not its precision.', 'Correct — SEM provides an estimate of the margin of error in an individual score, reflecting the test\'s reliability.', 'Normality relates to the distribution.', 'Variance is a general statistical spread.', 'Skewness is distribution shape.'],
    explanation: 'SEM helps clinicians understand the range within which a client\'s "true score" likely falls (Confidence Intervals).',
    references: ['Psychometric Theory Fundamentals'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-003', domain: 'assessment', category: 'Personality', difficulty: 'medium',
    caseStudy: 'Personality assessment often includes validity checks.',
    question: 'Which of the following is a "self-report" personality inventory with validity scales to detect inconsistent responding and over-reporting?',
    options: ['WAIS-IV', 'PAI (Personality Assessment Inventory)', 'MMSE', 'WMS-IV', 'DASS-21'],
    correctAnswer: 1,
    distractorRationale: ['Cognitive test.', 'Correct — The PAI including validity scales (NIM, PIM, INF, ICN) to monitor response style.', 'Cognitive screen.', 'Memory test.', 'Symptom scale, lacks complex validity indices.'],
    explanation: 'Structured personality tests like the PAI and MMPI-2 are essential when response bias or "malingering" needs to be assessed.',
    references: ['Morey, L. (2007)'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-004', domain: 'assessment', category: 'Child Assessment', difficulty: 'hard',
    caseStudy: 'A 7-year-old boy is referred for an assessment to rule out ADHD. The teacher reports significant hyperactivity, but the parents report very little at home.',
    question: 'What is the most appropriate next step in the assessment?',
    options: ['Diagnose ADHD immediately based on teacher reports', 'Rule out ADHD because it must be present in two or more settings', 'Assume the teacher is over-reacting', 'Assume the parents are hiding something', 'Only use objective brain scans'],
    correctAnswer: 1,
    distractorRationale: ['Violates DSM-5 criteria.', 'Correct — DSM-5 requires symptoms to be present in 2+ settings (e.g., home and school).', 'Unfair assumption.', 'Unfair assumption.', 'Brain scans are not diagnostic for ADHD.'],
    explanation: 'Situational variability is common, but diagnostic criteria require evidence across environments.',
    references: ['DSM-5-TR ADHD Criteria'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-005', domain: 'assessment', category: 'Ethics', difficulty: 'medium',
    caseStudy: 'Assessment ethics require up-to-date materials.',
    question: 'You are using a 10-year-old version of a test because the new edition is too expensive. This violates which ethical principle?',
    options: ['Competence', 'Confidentiality', 'Informed Consent', 'Justice', 'Respect'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Psychologists must use outdated tests only under specific justification; usually, the most current version is standard.', 'Not a privacy issue.', 'Not a consent issue.', 'Social equity, not primarily about test versions.', 'General principle, but "Competence" is the specific violation regarding current knowledge/tools.'],
    explanation: 'Using obsolete tests can lead to inaccurate findings (Flynn effect, outdated norms) and is a breach of professional competence.',
    references: ['APS Ethical Guidelines on Assessment'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-006', domain: 'assessment', category: 'Cognitive', difficulty: 'medium',
    caseStudy: 'Cognitive tests have specific subtests.',
    question: 'On the WAIS-IV, the "Digit Span" subtest primarily measures:',
    options: ['Verbal Comprehension', 'Perceptual Reasoning', 'Working Memory', 'Processing Speed', 'Vocabulary'],
    correctAnswer: 2,
    distractorRationale: ['Measures language and knowledge.', 'Measures non-verbal reasoning.', 'Correct —Digit span involves holding and manipulating information in mind.', 'Measures mental efficiency.', 'Measures verbal knowledge.'],
    explanation: 'Digit span involves holding and manipulating information in mind, which is the definition of working memory.',
    references: ['WAIS-IV Manual'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-007', domain: 'assessment', category: 'Psychometrics', difficulty: 'hard',
    caseStudy: 'Psychometrics informs test interpretation.',
    question: 'A test has a reliability coefficient of 0.90. What percentage of the variance in scores is accounted for by "error"?',
    options: ['90%', '10%', '100%', '0%', '81%'],
    correctAnswer: 1,
    distractorRationale: ['This is the true variance.', 'Correct — 1 - Reliability = Error variance.', 'Impossible for a reliable test.', 'Only true for a perfect test.', 'The square of reliability, not the error.'],
    explanation: 'Reliability (0.90) is the proportion of true score variance. Therefore, 1 - 0.90 = 0.10 (10%) is the error variance.',
    references: ['Classical Test Theory'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-008', domain: 'assessment', category: 'Mood', difficulty: 'medium',
    caseStudy: 'Symptom scales are used in clinical practice.',
    question: 'The DASS-21 measures which three states?',
    options: ['Mania, Psychosis, Personality', 'Depression, Anxiety, Stress', 'Intelligence, Memory, Focus', 'Grief, Trauma, Anger', 'Social, Emotional, Vocational'],
    correctAnswer: 1,
    distractorRationale: ['Not measured by K10/DASS.', 'Correct — DASS stands for Depression Anxiety Stress Scales.', 'Cognitive domains.', 'Specific emotional states but not the DASS focus.', 'Life domains.'],
    explanation: 'DASS stands for Depression Anxiety Stress Scales.',
    references: ['Lovibond & Lovibond (1995)'],
    questionType: 'evidence-based'
  },
  {
    id: 'aq-009', domain: 'assessment', category: 'Risk Assessment', difficulty: 'hard',
    caseStudy: 'Risk assessment involves static and dynamic factors.',
    question: 'When conducting a suicide risk assessment, which is the most significant "static" risk factor?',
    options: ['Current suicidal ideation', 'Prior suicide attempt', 'Unemployment', 'Social isolation', 'Feeling like a burden'],
    correctAnswer: 1,
    distractorRationale: ['This is a dynamic (changeable) factor.', 'Correct — History of prior attempts is the strongest static predictor of future death by suicide.', 'Dynamic.', 'Dynamic.', 'Dynamic.'],
    explanation: 'Static factors are historical/unchanging. Dynamic factors are current/changeable.',
    references: ['Risk Assessment Guidelines'],
    questionType: 'priority'
  },
  {
    id: 'aq-010', domain: 'assessment', category: 'Diagnosis', difficulty: 'medium',
    caseStudy: 'A client reports 1 month of intrusive memories, nightmares, and avoidance following a serious car accident.',
    question: 'What is the most likely diagnosis?',
    options: ['Posttraumatic Stress Disorder (PTSD)', 'Acute Stress Disorder', 'Generalized Anxiety Disorder', 'Major Depressive Disorder', 'Adjustment Disorder'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Symptoms lasting >1 month meet duration for PTSD.', 'Acute Stress Disorder is <1 month.', 'Doesn\'t fit trauma profile.', 'Possible comorbid but PTSD fits better.', 'Usually for less severe stressors or fewer symptoms.'],
    explanation: 'PTSD requires symptoms to persist for more than one month.',
    references: ['DSM-5-TR'],
    questionType: 'evidence-based'
  }
];

const assessmentFlashcardsRaw: FlashcardInput[] = [
  {
    id: 'af-001', domain: 'assessment',
    question: 'What is the "Flynn Effect"?',
    answer: 'The observed rise in average IQ scores over time across generations.',
    category: 'Cognitive', difficulty: 'medium'
  },
  {
    id: 'af-002', domain: 'assessment',
    question: 'Define "Internal Consistency".',
    answer: 'The degree to which different items on the same test measure the same construct.',
    category: 'Psychometrics', difficulty: 'medium'
  },
  {
    id: 'af-003', domain: 'assessment',
    question: 'What is a "Projective Test"?',
    answer: 'A test (e.g., Rorschach) where the client imposes their own meaning onto ambiguous stimuli.',
    category: 'Personality', difficulty: 'medium'
  },
  {
    id: 'af-004', domain: 'assessment',
    question: 'What does "Convergent Validity" mean?',
    answer: 'The extent to which a test correlates with other tests that measure the same or similar constructs.',
    category: 'Psychometrics', difficulty: 'medium'
  },
  {
    id: 'af-005', domain: 'assessment',
    question: 'What is the purpose of the M-FAST?',
    answer: 'To screen for the malingering (feigning) of psychiatric symptoms.',
    category: 'Validity', difficulty: 'hard'
  },
  {
    id: 'af-006', domain: 'assessment',
    question: 'What is a "Likert Scale"?',
    answer: 'A rating scale (e.g., 1-5) used to measure attitudes or frequencies.',
    category: 'Methodology', difficulty: 'medium'
  }
];

export const assessmentFlashcards: Flashcard[] = assessmentFlashcardsRaw.map(c => ({
  ...c,
  lastReviewed: null,
  nextReview: null,
  reviewCount: 0,
  masteryLevel: 0,
  domain: c.domain as 'ethics' | 'assessment' | 'interventions' | 'communication'
}))
