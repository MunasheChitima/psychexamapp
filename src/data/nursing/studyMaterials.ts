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
  {
    id: 'n-sm-003',
    title: 'NCLEX Clinical Judgment Model (NCSBN)',
    domain: 'management-of-care',
    category: 'Clinical Judgment',
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-20',
    keyPoints: [
      'Recognise cues from assessment data and context.',
      'Analyse cues and prioritise hypotheses.',
      'Prioritise hypotheses and generate solutions.',
      'Generate solutions and take action.',
      'Evaluate outcomes and escalate when needed.',
    ],
    commonMistakes: [
      'Choosing a “nice” intervention before addressing airway, breathing, circulation, or safety.',
      'Ignoring trends, vitals trajectory, and risk factors in the stem.',
    ],
    examTips: [
      'Select the option that addresses the highest-risk problem first.',
      'Favour evidence-based, least restrictive, and standards-aligned actions.',
    ],
    references: ['NCSBN Clinical Judgment Measurement Model'],
    content:
      'Use the clinical judgment layers to read stems: what is unsafe right now, what must be verified, and what can wait. Questions often test whether you notice deterioration, consent/scope, and interprofessional communication.',
  },
  {
    id: 'n-sm-004',
    title: 'Infection prevention & PPE (Australian acute care)',
    domain: 'safety-infection',
    category: 'Infection Control',
    type: 'checklist',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-20',
    keyPoints: [
      'Perform hand hygiene before and after patient contact and aseptic procedures.',
      'Select PPE based on mode of transmission (contact, droplet, airborne).',
      'Maintain aseptic technique for invasive devices and wound care.',
      'Isolate and escalate per local policy when novel or resistant organisms suspected.',
    ],
    commonMistakes: [
      'Removing PPE in an order that contaminates clothing or mucosa.',
      'Treating all infections the same without considering transmission route.',
    ],
    examTips: [
      'Pick answers that show full chain of protection: assess → protect → contain → communicate.',
    ],
    references: ['Australian Guidelines for the Prevention and Control of Infection in Healthcare'],
    content:
      'Sequence matters: hand hygiene, appropriate PPE, safe donning/doffing, environmental cleaning, and prompt notification. Exam items reward standard precautions plus transmission-based precautions when indicated.',
  },
  {
    id: 'n-sm-005',
    title: 'Fluid, electrolyte & acid–base essentials',
    domain: 'physiological',
    category: 'Physiology',
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-20',
    keyPoints: [
      'Know common causes and nursing actions for Na, K, Ca, Mg disturbances.',
      'Link acid–base status to compensation patterns and clinical context.',
      'Monitor I&O, weights, labs, and neuro/cardiac signs for trends.',
    ],
    commonMistakes: [
      'Treating a number without assessing symptoms and perfusion.',
      'Confusing respiratory vs metabolic acidosis patterns.',
    ],
    examTips: [
      'Prioritise unstable arrhythmias, seizures, altered LOC, and critical K+ extremes.',
    ],
    references: ['Therapeutic Guidelines', 'Local electrolyte replacement protocols'],
    content:
      'Questions often pair a lab trend with a symptom cluster. Choose reassessment, provider notification, and safety actions (cardiac monitoring, fall precautions, seizure precautions) when indicated.',
  },
  {
    id: 'n-sm-006',
    title: 'Therapeutic communication & mental health crises',
    domain: 'psychosocial',
    category: 'Communication',
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2026-03-20',
    keyPoints: [
      'Use calm, clear, non-judgmental language; validate feelings without false reassurance.',
      'Assess suicide/homicide risk and access to means; follow facility policy.',
      'Involve appropriate team members and document objective behaviours.',
    ],
    commonMistakes: [
      'Arguing with delusions or giving lengthy explanations during acute agitation.',
      'Promising outcomes you cannot guarantee.',
    ],
    examTips: [
      'Choose options that de-escalate, maintain safety, and preserve dignity.',
    ],
    references: ['Mental Health Act (state/territory)', 'NSQHS Partnering with Consumers'],
    content:
      'Prioritise safety, therapeutic presence, least restrictive interventions, and clear handover. Select answers that reflect trauma-informed care and cultural sensitivity.',
  },
]
