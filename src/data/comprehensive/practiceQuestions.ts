import { PracticeQuestion } from '@/types'

export const practiceQuestions: PracticeQuestion[] = [
  // Multi-Step Clinical Reasoning Questions (30 questions)
  {
    id: 'pq-001',
    domain: 'ethics',
    category: 'Multi-Step Clinical Reasoning',
    difficulty: 'expert',
    caseStudy: 'Dr. Sarah Chen is a psychologist working in a rural community. She has been seeing a 16-year-old client, Emma, for depression and anxiety for 6 months. During a session, Emma discloses that her stepfather has been sexually abusing her for the past 2 years. Emma begs Dr. Chen not to tell anyone, saying her stepfather will kill her mother if anyone finds out. Emma\'s mother is financially dependent on the stepfather and has no family support in the area. Dr. Chen is the only mental health professional within 200km.',
    question: 'What should Dr. Chen do FIRST in this situation?',
    options: [
      'Immediately report to child protection services',
      'Assess Emma\'s immediate safety and develop a safety plan',
      'Contact Emma\'s mother to discuss the situation',
      'Seek supervision from a colleague in another town',
      'Document the disclosure and continue therapy as normal'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'While mandatory reporting is required, immediate safety assessment comes first',
      'Correct - safety assessment is the immediate priority',
      'Contacting the mother could put Emma at risk if the stepfather finds out',
      'Supervision is important but not the first step in a crisis',
      'Continuing therapy without addressing the abuse is inappropriate'
    ],
    explanation: 'In cases of child sexual abuse, the psychologist\'s first priority is to assess immediate safety and develop a safety plan. While mandatory reporting is required, ensuring the child\'s safety comes before any other action.',
    references: ['APS Code of Ethics A.5.2', 'Child protection legislation', 'Safety planning guidelines'],
    clinicalPearls: 'Always assess immediate safety before implementing mandatory reporting procedures.',
    questionType: 'multi-step'
  },
  {
    id: 'pq-002',
    domain: 'assessment',
    category: 'Multi-Step Clinical Reasoning',
    difficulty: 'expert',
    caseStudy: 'A 45-year-old man, James, is referred for psychological assessment following a workplace accident. He reports severe back pain, difficulty sleeping, irritability, and withdrawal from social activities. His GP suspects depression secondary to chronic pain. During the assessment, James discloses that he was sexually abused as a child and has never told anyone. He becomes tearful and says he doesn\'t want to discuss it further. The assessment is for workers compensation purposes.',
    question: 'What is the most appropriate next step in the assessment process?',
    options: [
      'Continue with the depression assessment as planned',
      'Explore the childhood trauma in detail',
      'Pause the assessment and discuss the disclosure with James',
      'Immediately report the historical abuse',
      'Refer James to a trauma specialist'
    ],
    correctAnswer: 2,
    distractorRationale: [
      'Ignoring the disclosure would be inappropriate and unethical',
      'Exploring trauma without consent would be inappropriate',
      'Correct - discussing the disclosure is the appropriate next step',
      'Historical abuse with no ongoing risk does not require mandatory reporting',
      'Referral should be discussed with James, not made unilaterally'
    ],
    explanation: 'When a client discloses sensitive information during assessment, the psychologist should pause and discuss the disclosure, its implications for the assessment, and how to proceed. This respects the client\'s autonomy and ensures informed consent.',
    references: ['APS Code of Ethics A.3.1', 'Assessment guidelines', 'Trauma-informed practice'],
    clinicalPearls: 'Always discuss unexpected disclosures before proceeding with assessment.',
    questionType: 'multi-step'
  },
  {
    id: 'pq-003',
    domain: 'interventions',
    category: 'Multi-Step Clinical Reasoning',
    difficulty: 'expert',
    caseStudy: 'Maria, a 28-year-old woman with borderline personality disorder, has been in DBT for 18 months. She has made significant progress but recently experienced a setback when her partner left her. She presents to session with fresh self-harm wounds and says she wants to quit therapy. She reports feeling like a failure and that therapy isn\'t working. She has no specific suicide plan but says she doesn\'t see the point of living.',
    question: 'What should the psychologist do FIRST in this situation?',
    options: [
      'Continue with the regular DBT session structure',
      'Conduct a comprehensive suicide risk assessment',
      'Address the therapeutic rupture and validate her feelings',
      'Refer Maria to a psychiatrist for medication review',
      'Terminate therapy as requested by the client'
    ],
    correctAnswer: 2,
    distractorRationale: [
      'Regular session structure should be adapted for crisis situations',
      'Correct - suicide risk assessment is the immediate priority',
      'Therapeutic rupture should be addressed after safety is ensured',
      'Medication review may be appropriate but not the first step',
      'Terminating therapy during a crisis would be inappropriate'
    ],
    explanation: 'When a client presents with self-harm and suicidal ideation, the psychologist\'s first priority is to conduct a comprehensive suicide risk assessment to determine the level of risk and appropriate intervention.',
    references: ['DBT treatment manual', 'Suicide risk assessment guidelines', 'Crisis intervention protocols'],
    clinicalPearls: 'Always assess suicide risk before addressing other therapeutic issues in crisis situations.',
    questionType: 'multi-step'
  },
  {
    id: 'pq-004',
    domain: 'communication',
    category: 'Multi-Step Clinical Reasoning',
    difficulty: 'expert',
    caseStudy: 'Dr. Thompson is writing a psychological report for a 12-year-old boy, Alex, who has been referred for assessment of learning difficulties. During the assessment, Alex disclosed that his teacher has been making inappropriate comments to him and other students. Alex is afraid to tell his parents because he thinks they won\'t believe him. The assessment reveals significant learning difficulties that require educational accommodations.',
    question: 'What should Dr. Thompson include in the psychological report?',
    options: [
      'Only include the learning assessment results and recommendations',
      'Include both the learning assessment and the disclosure about the teacher',
      'Include the learning assessment and report the teacher separately',
      'Delay the report until the teacher issue is resolved',
      'Include only the learning assessment but discuss the disclosure with the parents separately'
    ],
    correctAnswer: 4,
    distractorRationale: [
      'Ignoring the disclosure would be inappropriate and could put other children at risk',
      'Including the disclosure in the report could breach Alex\'s confidentiality',
      'Reporting the teacher separately could identify Alex as the source',
      'Delaying the report would deprive Alex of needed educational accommodations',
      'Correct - this approach protects Alex\'s confidentiality while addressing both issues'
    ],
    explanation: 'The psychologist should include the learning assessment results in the report to ensure Alex receives needed accommodations, while addressing the disclosure about the teacher separately to protect Alex\'s confidentiality and safety.',
    references: ['APS Code of Ethics A.5.1', 'Report writing guidelines', 'Child protection legislation'],
    clinicalPearls: 'Separate educational needs from safety concerns in reports to protect client confidentiality.',
    questionType: 'multi-step'
  },
  {
    id: 'pq-005',
    domain: 'ethics',
    category: 'Multi-Step Clinical Reasoning',
    difficulty: 'expert',
    caseStudy: 'Dr. Williams is a psychologist working in a small town. She has been seeing a client, Tom, for anxiety for 3 months. During a session, Tom discloses that he is attracted to Dr. Williams and has been having sexual fantasies about her. He says he finds it difficult to focus on therapy because of these feelings. Dr. Williams feels uncomfortable but wants to help Tom. She is the only psychologist in town.',
    question: 'What should Dr. Williams do FIRST in this situation?',
    options: [
      'Terminate therapy immediately due to the inappropriate disclosure',
      'Discuss the transference and explore its meaning in therapy',
      'Refer Tom to a male psychologist in the next town',
      'Ignore the disclosure and continue with anxiety treatment',
      'Report Tom\'s behavior to the Psychology Board'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Terminating immediately would be premature and could harm the client',
      'Correct - discussing transference is the appropriate therapeutic response',
      'Referral should be discussed with Tom, not made unilaterally',
      'Ignoring the disclosure would be inappropriate and could harm the therapeutic relationship',
      'Reporting is not necessary unless there is a clear boundary violation'
    ],
    explanation: 'When a client discloses attraction to their therapist, the appropriate response is to discuss the transference and explore its meaning in therapy. This can provide valuable insights into the client\'s patterns and can strengthen the therapeutic relationship.',
    references: ['APS Code of Ethics B.1.1', 'Professional boundaries guidelines', 'Transference in therapy'],
    clinicalPearls: 'Transference is a normal part of therapy and should be addressed therapeutically rather than punitively.',
    questionType: 'multi-step'
  },
  // Additional Hard/Expert Questions (expanded catalogue)
  {
    id: 'pq-006',
    domain: 'ethics',
    category: 'Confidentiality',
    difficulty: 'hard',
    caseStudy: 'A 22-year-old client discloses past illicit substance use and one instance of shoplifting when they were 17. They are currently applying for a position requiring a national police check and ask whether you will disclose this history if contacted by the employer.',
    question: 'Which of the following is NOT a permitted exception to confidentiality in typical Australian contexts?',
    options: [
      'Responding to a valid court subpoena',
      'Preventing or lessening a serious and imminent threat to life, health or safety',
      'Mandatory reporting of suspected child abuse',
      'Disclosing historic minor criminal behavior to a potential employer upon request',
      'Disclosing minimal necessary information to obtain an urgent medical/psychiatric referral'
    ],
    correctAnswer: 3,
    distractorRationale: [
      'Court orders/subpoenas can compel disclosure within legal limits.',
      'Duty to protect/warn can override confidentiality when risk is serious and imminent.',
      'Mandatory reporting of suspected child abuse is a legal exception to confidentiality.',
      'Correct — employment-related disclosures generally require client consent and are not an exception.',
      'Disclosing minimal information to facilitate urgent care can be ethically/legally justified.'
    ],
    explanation: 'Outside specific legal or safety exceptions, confidentiality cannot be breached. Disclosing past minor criminal behavior to a prospective employer is not a standard exception and would typically require explicit client consent.',
    references: ['APS Code of Ethics A.5 Confidentiality', 'Privacy Act and relevant State/Territory laws'],
    clinicalPearls: 'Clarify exceptions at informed consent and disclose only the minimum necessary information when exceptions apply.',
    questionType: 'except'
  },
  {
    id: 'pq-007',
    domain: 'assessment',
    category: 'Neuropsychology Triage',
    difficulty: 'expert',
    caseStudy: 'A 52-year-old presents post–mild traumatic brain injury with fluctuating attention, sleep disruption, and irritability. They are referred for comprehensive cognitive testing two weeks post-injury.',
    question: 'What is the most appropriate PRIORITY step before proceeding with a full cognitive battery?',
    options: [
      'Administer a full WAIS-IV immediately to establish baseline IQ',
      'Screen for delirium and unstable medical factors that could invalidate testing',
      'Schedule personality assessment to identify premorbid traits',
      'Begin cognitive remediation sessions this week',
      'Proceed with memory testing only to save time'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Global IQ testing may be unreliable in the acute phase and not the first priority.',
      'Correct — medical stability and delirium screening come first to ensure validity and safety.',
      'Personality assessment can be deferred; immediate concern is test validity and safety.',
      'Remediation is premature prior to accurate assessment and stabilization.',
      'Selective testing still risks invalid results if acute factors are unaddressed.'
    ],
    explanation: 'In acute/post-acute phases, screen for delirium, medication side effects, sleep deprivation, and pain before formal testing to protect validity.',
    references: ['Neuropsychological assessment guidelines', 'Gronwall & Wrightson post-concussion protocols'],
    clinicalPearls: 'Time cognitive testing to periods of relative stability; document confounders explicitly.',
    questionType: 'priority'
  },
  {
    id: 'pq-008',
    domain: 'interventions',
    category: 'PTSD Treatment',
    difficulty: 'hard',
    caseStudy: 'A 34-year-old with PTSD after a motor vehicle accident has frequent nightmares and avoidance of driving. There is no acute risk and no severe substance use.',
    question: 'Which is the most evidence-based FIRST-LINE psychological intervention?',
    options: [
      'Supportive therapy without trauma processing',
      'Trauma-focused CBT with graded exposure',
      'Long-term psychodynamic therapy',
      'Mindfulness-only intervention',
      'Hypnotherapy to reduce nightmares'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Supportive therapy alone is generally insufficient as first-line for PTSD.',
      'Correct — trauma-focused CBT with exposure has strong evidence for PTSD symptom reduction.',
      'Psychodynamic therapy may help some, but is not first-line per guidelines.',
      'Mindfulness can be adjunctive but not typically first-line monotherapy for PTSD.',
      'Hypnotherapy lacks strong evidence as a primary first-line approach.'
    ],
    explanation: 'Guidelines recommend trauma-focused CBT (including exposure) or EMDR as first-line psychological treatments for PTSD.',
    references: ['ISTSS Guidelines', 'NICE PTSD Guidelines'],
    clinicalPearls: 'Stabilize, build skills, then proceed to exposure with careful pacing.',
    questionType: 'evidence-based'
  },
  {
    id: 'pq-009',
    domain: 'communication',
    category: 'Forensic Reporting',
    difficulty: 'expert',
    caseStudy: 'You are asked to provide an opinion regarding fitness for work in a safety-critical role. Available records are limited and collateral is pending. The referrer pressures you for a definitive conclusion within 48 hours.',
    question: 'What is the MOST appropriate approach for the written report?',
    options: [
      'Provide a categorical opinion now to meet the deadline',
      'Decline to provide any report',
      'Document data sources, limitations, and provide a qualified, provisional opinion',
      'Omit limitations to avoid undermining your opinion',
      'Include test items to demonstrate rigor'
    ],
    correctAnswer: 2,
    distractorRationale: [
      'Premature categorical opinions risk inaccuracy and ethical concerns.',
      'Total refusal may be unnecessary if a qualified opinion can be justified.',
      'Correct — transparently state methods, limitations, and qualify conclusions accordingly.',
      'Omitting limitations is unethical and misleading.',
      'Do not include copyrighted/proprietary test content in reports.'
    ],
    explanation: 'Ethically sound forensic communication requires transparency about limitations and appropriately qualified conclusions.',
    references: ['Forensic report writing standards', 'APS Code of Ethics C.1 Communication'],
    clinicalPearls: 'Explicitly separate facts, inferences, and opinions; state confidence levels.',
    questionType: 'complex-vignette'
  },
  {
    id: 'pq-010',
    domain: 'ethics',
    category: 'Family Violence',
    difficulty: 'hard',
    caseStudy: 'An adult client discloses intimate partner violence but refuses police contact. Children are not in the home. The client fears retaliation.',
    question: 'What should the psychologist do FIRST?',
    options: [
      'Report to police without consent',
      'Conduct a structured risk assessment and develop a safety plan',
      'Terminate therapy due to safety risks',
      'Contact the alleged perpetrator for their perspective',
      'Refer immediately to inpatient care without assessment'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Mandatory reporting may not apply to adult IPV absent children; consider legal advice.',
      'Correct — prioritize risk assessment and safety planning; clarify confidentiality limits.',
      'Termination is not indicated; provide support and planning.',
      'Contacting the perpetrator risks harm and breaches boundaries.',
      'Inpatient care may be unnecessary without acute risk or psychiatric instability.'
    ],
    explanation: 'Ethically prioritize safety assessment and planning; legal reporting requirements vary if no children are at risk.',
    references: ['Domestic violence practice guidelines', 'APS Code of Ethics A.4'],
    clinicalPearls: 'Know local IPV services and safety planning tools; document discussions carefully.',
    questionType: 'priority'
  },
  {
    id: 'pq-011',
    domain: 'assessment',
    category: 'Test Knowledge',
    difficulty: 'hard',
    caseStudy: 'You are planning a comprehensive cognitive assessment for an adult client.',
    question: 'Which of the following is NOT a primary WAIS-IV Index?',
    options: [
      'Verbal Comprehension Index',
      'Perceptual Reasoning Index',
      'Working Memory Index',
      'Processing Speed Index',
      'Executive Control Index'
    ],
    correctAnswer: 4,
    distractorRationale: [
      'VCI is a core WAIS-IV index.',
      'PRI is a core WAIS-IV index.',
      'WMI is a core WAIS-IV index.',
      'PSI is a core WAIS-IV index.',
      'Correct — there is no Executive Control Index on the WAIS-IV.'
    ],
    explanation: 'WAIS-IV core indices are VCI, PRI, WMI, and PSI; there is no Executive Control Index.',
    references: ['WAIS-IV Technical and Interpretive Manual'],
    clinicalPearls: 'Interpret subtest scatter within index-level context.',
    questionType: 'except'
  },
  {
    id: 'pq-012',
    domain: 'interventions',
    category: 'Risk & Referral',
    difficulty: 'expert',
    caseStudy: 'A 25-year-old with suspected Bipolar I presents with decreased need for sleep, pressured speech, and grandiosity. They refuse medication and ask for therapy only. No immediate suicidal intent but risky spending is noted.',
    question: 'What is the MOST appropriate immediate course of action?',
    options: [
      'Begin schema therapy; revisit medication later',
      'Urgent psychiatric referral for medication evaluation and coordinated risk management',
      'Start mindfulness training only',
      'Schedule weekly supportive counseling without referral',
      'Recommend hospitalization for all mania cases'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Therapy alone is often insufficient in acute mania.',
      'Correct — coordinate urgent psychiatric assessment; integrate psychotherapy thereafter.',
      'Mindfulness alone is inadequate for mania management.',
      'Supportive counseling without medical evaluation misses standard of care.',
      'Hospitalization is not always required; base on risk/impairment criteria.'
    ],
    explanation: 'Acute mania typically requires prompt psychiatric evaluation for pharmacotherapy alongside psychosocial support.',
    references: ['CANMAT/ISBD Bipolar Disorder Guidelines'],
    clinicalPearls: 'Collaborative care improves outcomes; address insight and adherence early.',
    questionType: 'priority'
  },
  {
    id: 'pq-013',
    domain: 'communication',
    category: 'Test Security',
    difficulty: 'hard',
    caseStudy: 'A referrer requests you include test items and stimuli in your report to justify conclusions.',
    question: 'Which response best aligns with professional and ethical guidelines?',
    options: [
      'Include all test items to enhance transparency',
      'Summarize results and avoid reproducing secure test content',
      'Send raw protocols with the report',
      'Publish items in an appendix for peer review',
      'Decline to report any test results'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Reproducing items violates test security/copyright.',
      'Correct — summarize methods and findings without exposing secure content.',
      'Raw protocols should be released only under strict conditions/subpoena.',
      'Publishing items jeopardizes test validity and may breach copyright.',
      'Reports should still communicate findings; total omission is inappropriate.'
    ],
    explanation: 'Protect test security while communicating clinically useful results.',
    references: ['APA/APS test security guidance'],
    clinicalPearls: 'Describe constructs and performance patterns; retain item-level detail in secure records.',
    questionType: 'except'
  },
  {
    id: 'pq-014',
    domain: 'ethics',
    category: 'Boundaries',
    difficulty: 'expert',
    caseStudy: 'In a remote community, you are asked to attend a cultural ceremony where several current clients will be present. Declining may harm rapport and cultural engagement; attending risks a multiple relationship.',
    question: 'What is the MOST ethical approach?',
    options: [
      'Attend without any planning and hope for the best',
      'Conduct a structured risk–benefit analysis, consult, plan boundaries, and document',
      'Refuse any community involvement categorically',
      'Ask clients for individual permission then proceed',
      'Attend and discuss clinical issues informally if asked'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Unplanned attendance risks harm and confusion.',
      'Correct — a documented, consultative approach balances cultural needs and boundary risks.',
      'Rigid refusal may harm care and community trust.',
      'Client permission does not remove professional responsibility for boundaries.',
      'Discussing clinical issues in public settings breaches confidentiality.'
    ],
    explanation: 'Use structured decision tools, consultation, and documentation for unavoidable multiple relationships in rural/remote contexts.',
    references: ['APS Code of Ethics B.3 Multiple Relationships'],
    clinicalPearls: 'Set expectations in advance; create debrief plans post-event.',
    questionType: 'complex-vignette'
  },
  {
    id: 'pq-015',
    domain: 'assessment',
    category: 'Adult ADHD Differential',
    difficulty: 'hard',
    caseStudy: 'A 29-year-old reports inattention and restlessness since childhood, with current work stress and anxiety. Alcohol use is social. No head injuries.',
    question: 'What assessment approach BEST supports differentiating ADHD from anxiety?',
    options: [
      'Self-report checklist only',
      'Multi-informant, multi-method assessment with onset and impairment across settings',
      'Rely solely on a continuous performance test',
      'Diagnose based on current symptoms if clinically significant',
      'Use personality inventory as the primary diagnostic tool'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Single source is insufficient for differential diagnosis.',
      'Correct — corroborate childhood onset (<12), pervasiveness, and functional impairment.',
      'CPTs inform but are not diagnostic alone.',
      'Current symptoms without developmental history risk misdiagnosis.',
      'Personality tests are adjunctive, not primary for ADHD.'
    ],
    explanation: 'Best practice emphasizes multi-source data and developmental history to distinguish ADHD from anxiety-related inattention.',
    references: ['DSM-5-TR ADHD criteria', 'Adult ADHD assessment guidelines'],
    clinicalPearls: 'Obtain school reports or parent collateral when possible.',
    questionType: 'evidence-based'
  },
  {
    id: 'pq-016',
    domain: 'interventions',
    category: 'Depression',
    difficulty: 'hard',
    caseStudy: 'A 40-year-old with moderate MDD reports anergia, anhedonia, and sleep-onset insomnia. No acute risk.',
    question: 'Which psychological strategy has the STRONGEST evidence early in treatment?',
    options: [
      'Behavioral activation with activity scheduling',
      'Projective therapy',
      'Hypnosis for sleep',
      'Cathartic ventilation',
      'Psychoeducation only'
    ],
    correctAnswer: 0,
    distractorRationale: [
      'Correct — BA shows robust effects for MDD, especially for anergia/anhedonia.',
      'Projective methods lack evidence as first-line treatments.',
      'Hypnosis may help some, but is not first-line for MDD.',
      'Ventilation without skill-building has limited benefit.',
      'Psychoeducation is important but insufficient alone.'
    ],
    explanation: 'Behavioral activation is an effective, scalable, first-line CBT component targeting avoidance and low positive reinforcement.',
    references: ['Cuijpers et al., meta-analyses on BA', 'NICE Depression Guidelines'],
    clinicalPearls: 'Start low-effort, high-reward activities; monitor with daily logs.',
    questionType: 'evidence-based'
  },
  {
    id: 'pq-017',
    domain: 'communication',
    category: 'Delivering Results',
    difficulty: 'hard',
    caseStudy: 'You are providing feedback on a cognitive assessment suggesting early neurocognitive disorder. The family is anxious.',
    question: 'What is the best FIRST step when delivering this information?',
    options: [
      'Provide all results immediately without pause',
      'Elicit the client’s understanding and preferences for information',
      'Give the written report first to read in session',
      'Tell the family separately before the client',
      'Avoid discussing sensitive findings to reduce distress'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Dumping information can overwhelm and reduce comprehension.',
      'Correct — start with understanding, preferences, and readiness to tailor communication.',
      'Written reports support but should follow calibrated verbal delivery.',
      'Disclose with consent and respect client autonomy; avoid triangulation.',
      'Avoidance undermines informed decision-making.'
    ],
    explanation: 'Client-centered communication begins by assessing understanding, goals, and preferences.',
    references: ['SPIKES protocol adaptations', 'Ethical feedback practices'],
    clinicalPearls: 'Use plain language, chunk information, and check understanding.',
    questionType: 'priority'
  },
  {
    id: 'pq-018',
    domain: 'ethics',
    category: 'Third-Party Contact',
    difficulty: 'hard',
    caseStudy: 'You consider calling a client’s partner to clarify history. There is no imminent risk and no prior consent.',
    question: 'In the absence of imminent risk, contacting a third party generally requires:',
    options: [
      'Explicit client consent',
      'Only verbal assent by the psychologist',
      'No consent if it benefits the case formulation',
      'Consent from the third party only',
      'Approval from your supervisor alone'
    ],
    correctAnswer: 0,
    distractorRationale: [
      'Correct — consent from the client is required outside emergency exceptions.',
      'Psychologist assent is not a substitute for client consent.',
      'Benefit to formulation alone does not justify breach of confidentiality.',
      'Third-party consent does not replace client consent.',
      'Supervisor approval does not override confidentiality requirements.'
    ],
    explanation: 'Without emergency/safety exceptions, contacting third parties requires the client’s informed consent.',
    references: ['APS Code of Ethics A.3, A.5'],
    clinicalPearls: 'Document consent scope and revocation rights.',
    questionType: 'except'
  },
  {
    id: 'pq-019',
    domain: 'assessment',
    category: 'Risk Assessment',
    difficulty: 'hard',
    caseStudy: 'A client presents with passive death wishes but denies intent. There is a remote history of overdose at age 19.',
    question: 'Which factor is the single strongest predictor of future suicide attempts?',
    options: [
      'High neuroticism',
      'Current insomnia',
      'History of prior suicide attempts',
      'Lack of social support',
      'Recent job loss'
    ],
    correctAnswer: 2,
    distractorRationale: [
      'Personality traits may confer risk but are not the strongest predictor.',
      'Insomnia elevates risk but is not the strongest single predictor.',
      'Correct — past suicide attempts are the strongest predictor of future attempts.',
      'Support deficits increase risk but are less predictive than past attempts.',
      'Acute stressors matter, but historical attempts carry higher predictive value.'
    ],
    explanation: 'Prior suicide attempts consistently emerge as the strongest predictor in risk literature.',
    references: ['Suicide risk assessment guidelines', 'Hawton & van Heeringen reviews'],
    clinicalPearls: 'Assess intent, planning, capability, and protective factors every session when risk is present.',
    questionType: 'evidence-based'
  },
  {
    id: 'pq-020',
    domain: 'interventions',
    category: 'OCD',
    difficulty: 'expert',
    caseStudy: 'A 31-year-old with OCD engages in 2–3 hour nightly checking rituals. They are motivated for therapy and not on medication.',
    question: 'Which intervention is MOST appropriate as first-line?',
    options: [
      'Exposure and response prevention (ERP)',
      'Insight-oriented psychotherapy',
      'Supportive counseling only',
      'Hypnosis to reduce ritual urges',
      'Relaxation training only'
    ],
    correctAnswer: 0,
    distractorRationale: [
      'Correct — ERP is the gold-standard first-line treatment for OCD.',
      'Insight alone is insufficient for response prevention.',
      'Supportive therapy does not target compulsions effectively.',
      'Hypnosis lacks robust first-line evidence.',
      'Relaxation may be adjunctive but not sufficient.'
    ],
    explanation: 'ERP demonstrates strong efficacy for OCD and targets the core maintaining cycle of obsessions and compulsions.',
    references: ['NICE OCD Guidelines', 'Foa & Kozak exposure models'],
    clinicalPearls: 'Hierarchy building and response prevention contracts improve adherence.',
    questionType: 'evidence-based'
  },
  {
    id: 'pq-021',
    domain: 'communication',
    category: 'Inter-Provider Communication',
    difficulty: 'hard',
    caseStudy: 'You are writing a letter to the client’s GP summarizing therapy progress. The client shared sensitive third-party information during sessions.',
    question: 'What is the MOST appropriate way to handle the third-party information?',
    options: [
      'Include all details to ensure completeness',
      'Include only relevant, de-identified details with the client’s consent',
      'Omit all sensitive information even if clinically relevant',
      'Ask the GP to contact the client for details',
      'Send session notes verbatim'
    ],
    correctAnswer: 1,
    distractorRationale: [
      'Over-disclosure risks breaches and harms trust.',
      'Correct — minimal necessary, de-identified content with consent balances care and privacy.',
      'Total omission may compromise care if information is critical.',
      'Shifting disclosure to the GP is not a substitute for ethical communication.',
      'Verbatim notes can breach confidentiality and include irrelevant content.'
    ],
    explanation: 'Use the principle of minimum necessary disclosure with informed consent and de-identification where possible.',
    references: ['APS Code of Ethics A.5, C.1'],
    clinicalPearls: 'Confirm the client’s preferences and provide them a copy when appropriate.',
    questionType: 'multi-step'
  }
] 