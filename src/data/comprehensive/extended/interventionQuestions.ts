import { PracticeQuestion } from '../../../types'

export const interventionsQuestions: PracticeQuestion[] = [
  {
    id: 'iqs-001',
    domain: 'interventions',
    category: 'CBT',
    difficulty: 'medium',
    caseStudy: 'A client with panic symptoms avoids supermarkets because they fear embarrassment if symptoms escalate in public.',
    question: 'What is the most evidence-based next intervention step in CBT?',
    options: [
      'Advise lifelong avoidance of triggering settings',
      'Collaboratively design graded in-vivo exposure with coping plans',
      'Use reassurance only and postpone behavioral work',
      'Challenge panic symptoms with confrontation and criticism',
      'Switch immediately to an unrelated therapy model'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Avoidance maintains anxiety over time.',
      'Correct — Graded exposure targets fear learning and avoidance cycles.',
      'Reassurance alone rarely produces durable change.',
      'Confrontational style can reduce engagement and safety.',
      'Abrupt model switching is not indicated without rationale.'
    ],
    explanation: 'For panic and agoraphobic avoidance, structured exposure is a first-line intervention when planned collaboratively and safely.',
    references: ['CBT for Anxiety Guidelines', 'NICE Anxiety Guidance'],
    questionType: 'evidence-based'
  },
  {
    id: 'iqs-002',
    domain: 'interventions',
    category: 'Motivational Interviewing',
    difficulty: 'hard',
    caseStudy: 'A client with hazardous alcohol use says they are not ready to stop but are worried about the effect on their family.',
    question: 'Which therapist response best reflects MI-consistent practice?',
    options: [
      'Issue a warning and prescribe abstinence immediately',
      'Use a double-sided reflection to highlight ambivalence and invite change talk',
      'Argue that the client is in denial',
      'Shift topics to avoid resistance',
      'Focus only on legal consequences'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Directive warnings can increase defensiveness.',
      'Correct — Reflecting ambivalence supports autonomy and readiness.',
      'Confrontational framing weakens therapeutic alliance.',
      'Avoidance misses the central treatment target.',
      'Narrow fear appeals do not build intrinsic motivation.'
    ],
    explanation: 'MI prioritizes empathic exploration of ambivalence to elicit the client\'s own motivations for change.',
    references: ['Miller & Rollnick (2012)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iqs-003',
    domain: 'interventions',
    category: 'Risk Management',
    difficulty: 'hard',
    caseStudy: 'A client in trauma-focused treatment shows sudden deterioration, including escalating self-harm urges and reduced ability to use coping strategies between sessions.',
    question: 'What is the most appropriate immediate treatment priority?',
    options: [
      'Continue exposure intensity unchanged to maintain momentum',
      'Stabilize first with risk management, safety planning, and paced intervention before further trauma processing',
      'Discharge immediately for non-response',
      'Pause all care until symptoms resolve naturally',
      'Rely on text check-ins alone without a formal safety plan'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'This may increase risk when stability has worsened.',
      'Correct — Safety and stabilization take priority before intensive trauma work.',
      'Premature discharge may increase harm.',
      'Passive waiting is unsafe in escalating risk contexts.',
      'Informal contact is not a substitute for structured risk planning.'
    ],
    explanation: 'When risk escalates, intervention sequencing should prioritize safety, regulation capacity, and monitored stabilization.',
    references: ['APS Trauma Practice Guidance', 'Suicide Risk Management Standards'],
    questionType: 'priority'
  }
]

export const interventionQuestions = interventionsQuestions
