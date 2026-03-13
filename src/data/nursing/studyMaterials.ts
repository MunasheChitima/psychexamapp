import type { StudyMaterial } from '@/types'

export const nursingStudyMaterials: StudyMaterial[] = [
  {
    id: 'n-sm-001',
    title: 'NMBA RN Standards Quick Guide',
    domain: 'management-of-care',
    category: 'Professional Practice',
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-11',
    keyPoints: [
      'Seven RN standards underpin safe and accountable practice.',
      'Critical thinking and person-centred planning are core.',
      'Evaluation and reflection are required, not optional.',
    ],
    commonMistakes: [
      'Focusing on tasks rather than clinical judgement and outcomes.',
      'Delegating without clarifying scope and accountability.',
    ],
    examTips: [
      'Choose options that prioritize safety, standards, and escalation.',
      'Look for collaborative and evidence-based care actions.',
    ],
    references: ['NMBA Registered nurse standards for practice'],
    content: 'Use NMBA standards as your decision frame in both NCLEX-style and OSCE scenarios.',
  },
  {
    id: 'n-sm-002',
    title: 'Australian Medication Safety Essentials',
    domain: 'pharmacology',
    category: 'Medication Safety',
    type: 'checklist',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-11',
    keyPoints: [
      'Apply rights of medication administration with identifier checks.',
      'APINCH medicines need extra safeguards.',
      'Document and report adverse reactions promptly.',
    ],
    commonMistakes: [
      'Skipping independent checks for high-risk medicines.',
      'Failing to link observations and med administration timing.',
    ],
    examTips: [
      'Pick the answer with strongest safety checks and verification steps.',
      'Avoid shortcuts that bypass policy or monitoring.',
    ],
    references: ['NSQHS Medication Safety Standard', 'APINCH'],
    content: 'Medication questions favour safe process over speed: verify, administer, monitor, document.',
  },
]
