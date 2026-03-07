import { Flashcard } from '@/types'

type FlashcardInput = Omit<Flashcard, 'lastReviewed' | 'nextReview' | 'reviewCount' | 'masteryLevel'>

const addFlashcardProperties = (flashcards: FlashcardInput[]): Flashcard[] => {
  return flashcards.map(card => ({
    ...card,
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    masteryLevel: 0
  }))
}

const rawConfidentialityExceptionsFlashcards: FlashcardInput[] = [
  // Confidentiality Exceptions (15 cards)
  {
    id: 'conf-001',
    domain: 'ethics',
    question: 'A client discloses that they are planning to bomb a government building next week. What is the psychologist\'s obligation?',
    answer: 'Immediate duty to warn and protect. Report to police and relevant authorities as this constitutes a clear and imminent threat of harm to others.',
    options: [
      'Maintain confidentiality as the client is seeking help',
      'Immediate duty to warn and protect. Report to police and relevant authorities',
      'Only report if the client gives permission',
      'Document the threat but take no action',
      'Report to the client\'s family only'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'This constitutes a clear and imminent threat of harm to others, triggering the duty to warn and protect (Tarasoff duty).',
    references: ['APS Code of Ethics A.5.2', 'Tarasoff v. Regents of the University of California'],
    clinicalPearls: 'Terrorism threats require immediate action and override confidentiality.'
  },
  {
    id: 'conf-002',
    domain: 'ethics',
    question: 'A client discloses that they are involved in a large-scale drug trafficking operation. What should the psychologist do?',
    answer: 'Assess whether there is a clear and imminent risk of harm to others. If yes, report to police. Document the disclosure and consider legal obligations.',
    options: [
      'Maintain confidentiality as this is personal information',
      'Assess whether there is a clear and imminent risk of harm to others. If yes, report to police',
      'Report to drug enforcement agencies immediately',
      'Ask the client to stop their involvement',
      'Report to the client\'s family'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Drug trafficking may constitute a risk to public safety, but the psychologist must assess the specific circumstances and level of risk.',
    references: ['APS Code of Ethics A.5.2', 'Drug trafficking legislation'],
    clinicalPearls: 'Assess the specific risk rather than automatically reporting all criminal activity.'
  },
  {
    id: 'conf-003',
    domain: 'ethics',
    question: 'A client discloses that they are part of an organized crime syndicate and have committed violent crimes. What should the psychologist do?',
    answer: 'Assess the level of risk and whether there is a clear and imminent threat. Consider reporting to police if there is ongoing risk to public safety.',
    options: [
      'Maintain confidentiality as the client is seeking help',
      'Assess the level of risk and whether there is a clear and imminent threat. Consider reporting to police',
      'Report to organized crime units immediately',
      'Ask the client to leave the syndicate',
      'Report to the client\'s family'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'expert',
    explanation: 'Organized crime involvement may pose ongoing risks to public safety, requiring careful assessment of the specific circumstances.',
    references: ['APS Code of Ethics A.5.2', 'Organized crime legislation'],
    clinicalPearls: 'Consider both the client\'s therapeutic needs and public safety obligations.'
  },
  {
    id: 'conf-004',
    domain: 'ethics',
    question: 'A client discloses that they have committed immigration fraud by providing false documents. What should the psychologist do?',
    answer: 'Generally maintain confidentiality unless there is a clear and imminent risk of harm to others. Immigration fraud alone may not trigger mandatory reporting.',
    options: [
      'Report to immigration authorities immediately',
      'Generally maintain confidentiality unless there is a clear and imminent risk of harm to others',
      'Ask the client to report themselves',
      'Report to the client\'s employer',
      'Report to the client\'s family'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Immigration fraud alone typically does not constitute a clear and imminent risk of harm to others, but each case must be assessed individually.',
    references: ['APS Code of Ethics A.5.2', 'Immigration fraud legislation'],
    clinicalPearls: 'Not all criminal activity triggers mandatory reporting - assess the specific risk.'
  },
  {
    id: 'conf-005',
    domain: 'ethics',
    question: 'A client discloses that they have been evading taxes for several years. What should the psychologist do?',
    answer: 'Maintain confidentiality as tax evasion alone does not constitute a clear and imminent risk of harm to others. Focus on therapeutic issues.',
    options: [
      'Report to the Australian Taxation Office immediately',
      'Maintain confidentiality as tax evasion alone does not constitute a clear and imminent risk of harm to others',
      'Ask the client to report themselves',
      'Report to the client\'s employer',
      'Report to the client\'s family'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'medium',
    explanation: 'Tax evasion, while illegal, does not typically constitute a clear and imminent risk of harm to others that would override confidentiality.',
    references: ['APS Code of Ethics A.5.2', 'Tax evasion legislation'],
    clinicalPearls: 'Focus on the therapeutic implications rather than legal obligations for non-violent crimes.'
  },
  {
    id: 'conf-006',
    domain: 'ethics',
    question: 'A client discloses that their colleague is practicing psychology without registration. What should the psychologist do?',
    answer: 'Report to the Psychology Board of Australia as this constitutes professional misconduct and poses a risk to public safety.',
    options: [
      'Maintain confidentiality as this is about someone else',
      'Report to the Psychology Board of Australia as this constitutes professional misconduct',
      'Confront the colleague directly',
      'Ask the client to report it themselves',
      'Report to the colleague\'s employer'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Practicing without registration constitutes professional misconduct and poses a risk to public safety, requiring mandatory reporting.',
    references: ['APS Code of Ethics B.3.1', 'Psychology Board of Australia reporting requirements'],
    clinicalPearls: 'Professional misconduct reporting protects the public and maintains professional standards.'
  },
  {
    id: 'conf-007',
    domain: 'ethics',
    question: 'A client discloses that they have a highly contagious infectious disease and are continuing to work in healthcare. What should the psychologist do?',
    answer: 'Report to public health authorities as this constitutes a public health emergency and poses a clear risk to others.',
    options: [
      'Maintain confidentiality as this is personal health information',
      'Report to public health authorities as this constitutes a public health emergency',
      'Ask the client to take sick leave',
      'Report to the client\'s employer',
      'Report to the client\'s family'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Highly contagious diseases in healthcare settings constitute a public health emergency requiring mandatory reporting.',
    references: ['Public health legislation', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Public health emergencies override individual confidentiality to protect public safety.'
  },
  {
    id: 'conf-008',
    domain: 'ethics',
    question: 'A client discloses that they are planning to harm themselves but have no specific plan or timeline. What should the psychologist do?',
    answer: 'Assess the level of risk and develop a safety plan. Generally maintain confidentiality unless there is a clear and imminent risk requiring hospitalization.',
    options: [
      'Report to police immediately',
      'Assess the level of risk and develop a safety plan. Generally maintain confidentiality unless there is a clear and imminent risk',
      'Contact the client\'s family immediately',
      'Hospitalize the client involuntarily',
      'Ignore the disclosure as it\'s not specific'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'medium',
    explanation: 'Suicidal ideation without a specific plan or timeline requires risk assessment and safety planning rather than immediate breach of confidentiality.',
    references: ['APS Code of Ethics A.5.2', 'Suicide risk assessment guidelines'],
    clinicalPearls: 'Assess the specificity and imminence of suicide risk before breaching confidentiality.'
  },
  {
    id: 'conf-009',
    domain: 'ethics',
    question: 'A client discloses that they are planning to harm a specific person but have no immediate plan. What should the psychologist do?',
    answer: 'Assess the level of risk and develop a safety plan. Consider duty to warn if there is a clear and imminent threat to the specific person.',
    options: [
      'Report to police immediately',
      'Assess the level of risk and develop a safety plan. Consider duty to warn if there is a clear and imminent threat',
      'Contact the intended victim immediately',
      'Hospitalize the client involuntarily',
      'Ignore the disclosure as there\'s no immediate plan'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Threats to specific individuals require careful risk assessment. The duty to warn applies when there is a clear and imminent threat.',
    references: ['APS Code of Ethics A.5.2', 'Tarasoff duty guidelines'],
    clinicalPearls: 'Assess the specificity and imminence of threats before implementing duty to warn.'
  },
  {
    id: 'conf-010',
    domain: 'ethics',
    question: 'A client discloses that they have committed a serious crime in the past but are not planning to commit any further crimes. What should the psychologist do?',
    answer: 'Generally maintain confidentiality as there is no clear and imminent risk of harm to others. Focus on therapeutic issues related to the disclosure.',
    options: [
      'Report to police immediately',
      'Generally maintain confidentiality as there is no clear and imminent risk of harm to others',
      'Ask the client to turn themselves in',
      'Report to the client\'s family',
      'Report to the client\'s employer'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'medium',
    explanation: 'Past crimes without ongoing risk typically do not override confidentiality. Focus on therapeutic processing of the disclosure.',
    references: ['APS Code of Ethics A.5.2', 'Historical crime reporting guidelines'],
    clinicalPearls: 'Past crimes without ongoing risk generally remain confidential to support therapeutic work.'
  },
  {
    id: 'conf-011',
    domain: 'ethics',
    question: 'A client discloses that they are experiencing command hallucinations telling them to harm others. What should the psychologist do?',
    answer: 'Assess the level of risk and consider involuntary hospitalization if there is a clear and imminent risk of harm to others.',
    options: [
      'Maintain confidentiality as this is a symptom of mental illness',
      'Assess the level of risk and consider involuntary hospitalization if there is a clear and imminent risk',
      'Contact the client\'s family immediately',
      'Report to police immediately',
      'Ignore the hallucinations as they\'re not real'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Command hallucinations require careful risk assessment. If there is a clear and imminent risk, involuntary hospitalization may be necessary.',
    references: ['Mental health legislation', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Command hallucinations require careful assessment of the client\'s response to the commands.'
  },
  {
    id: 'conf-012',
    domain: 'ethics',
    question: 'A client discloses that they are planning to commit insurance fraud. What should the psychologist do?',
    answer: 'Generally maintain confidentiality as insurance fraud alone does not constitute a clear and imminent risk of harm to others.',
    options: [
      'Report to the insurance company immediately',
      'Generally maintain confidentiality as insurance fraud alone does not constitute a clear and imminent risk',
      'Ask the client to reconsider their plan',
      'Report to the client\'s employer',
      'Report to police'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'medium',
    explanation: 'Insurance fraud, while illegal, does not typically constitute a clear and imminent risk of harm to others that would override confidentiality.',
    references: ['APS Code of Ethics A.5.2', 'Insurance fraud legislation'],
    clinicalPearls: 'Focus on the underlying issues driving the fraudulent behavior rather than legal reporting.'
  },
  {
    id: 'conf-013',
    domain: 'ethics',
    question: 'A client discloses that they are planning to harm themselves and have a specific plan and means. What should the psychologist do?',
    answer: 'Implement immediate safety measures including involuntary hospitalization if necessary. This constitutes a clear and imminent risk of harm to self.',
    options: [
      'Maintain confidentiality as the client is seeking help',
      'Implement immediate safety measures including involuntary hospitalization if necessary',
      'Ask the client to promise not to harm themselves',
      'Contact the client\'s family only',
      'Wait to see if the client changes their mind'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Specific suicide plans with means constitute a clear and imminent risk requiring immediate intervention, including involuntary hospitalization if necessary.',
    references: ['Mental health legislation', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Specific plans with means require immediate intervention regardless of client consent.'
  },
  {
    id: 'conf-014',
    domain: 'ethics',
    question: 'A client discloses that they are planning to harm a specific person and have access to weapons. What should the psychologist do?',
    answer: 'Implement immediate safety measures including duty to warn the intended victim and report to police. This constitutes a clear and imminent threat.',
    options: [
      'Maintain confidentiality as the client is seeking help',
      'Implement immediate safety measures including duty to warn the intended victim and report to police',
      'Ask the client to give up their weapons',
      'Contact the client\'s family only',
      'Wait to see if the client changes their mind'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Specific threats with access to weapons constitute a clear and imminent risk requiring immediate duty to warn and protect.',
    references: ['APS Code of Ethics A.5.2', 'Tarasoff duty guidelines'],
    clinicalPearls: 'Specific threats with means require immediate duty to warn regardless of client consent.'
  },
  {
    id: 'conf-015',
    domain: 'ethics',
    question: 'A client discloses that they are experiencing severe paranoia and believe their neighbors are trying to kill them. What should the psychologist do?',
    answer: 'Assess the level of risk and consider involuntary hospitalization if there is a clear and imminent risk of harm to self or others due to the paranoia.',
    options: [
      'Maintain confidentiality as this is a symptom of mental illness',
      'Assess the level of risk and consider involuntary hospitalization if there is a clear and imminent risk',
      'Contact the client\'s family immediately',
      'Report to police immediately',
      'Ignore the paranoia as it\'s not real'
    ],
    correctOption: 1,
    category: 'Confidentiality Exceptions',
    difficulty: 'hard',
    explanation: 'Severe paranoia can lead to dangerous behavior. Assess whether the client\'s beliefs pose a clear and imminent risk requiring intervention.',
    references: ['Mental health legislation', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Assess the behavioral consequences of paranoia rather than the reality of the beliefs.'
  }
]

export const confidentialityExceptionsFlashcards = addFlashcardProperties(rawConfidentialityExceptionsFlashcards) 