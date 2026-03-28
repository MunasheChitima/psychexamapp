export type ProductLine = 'psychology' | 'nursing'

export type PsychologyDomain = 'ethics' | 'assessment' | 'interventions' | 'communication'

export type NursingDomain =
  | 'management-of-care'
  | 'safety-infection'
  | 'health-promotion'
  | 'psychosocial'
  | 'basic-care'
  | 'pharmacology'
  | 'risk-reduction'
  | 'physiological'
  | 'osce-skills'

export type VceSubject =
  | 'vce-english'
  | 'vce-maths-methods'
  | 'vce-specialist-maths'
  | 'vce-further-maths'
  | 'vce-chemistry'
  | 'vce-biology'
  | 'vce-physics'
  | 'vce-psychology'
  | 'vce-business-management'
  | 'vce-legal-studies'
  | 'vce-health-human-dev'
  | 'vce-physical-education'

export type Domain = PsychologyDomain | NursingDomain | VceSubject

export type PsychologyQuestionType = 'multi-step' | 'except' | 'priority' | 'complex-vignette' | 'evidence-based'

export type NursingQuestionType =
  | 'select-all'
  | 'ordered-response'
  | 'cloze-dropdown'
  | 'clinical-judgment'
  | 'drug-calculation'
  | 'priority'
  | 'delegation'
  | 'evidence-based'

export type VceQuestionType =
  | 'multiple-choice'
  | 'short-answer'
  | 'extended-response'
  | 'data-analysis'
  | 'case-study'
  | 'text-analysis'
  | 'problem-solving'
  | 'essay'
