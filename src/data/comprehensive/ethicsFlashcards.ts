import { Flashcard } from '@/types'

type FlashcardInput = Omit<Flashcard, 'lastReviewed' | 'nextReview' | 'reviewCount' | 'masteryLevel'>

const rawEthicsFlashcards: FlashcardInput[] = [
  // Mandatory Reporting Dilemmas (15 cards)
  {
    id: 'ethics-001',
    domain: 'ethics',
    question: 'A 35-year-old client discloses during therapy that they were sexually abused by their uncle when they were 12. The uncle is now deceased, but the client has never told anyone. What is the psychologist\'s obligation?',
    answer: 'No mandatory reporting obligation exists as the perpetrator is deceased and the client is an adult. However, the psychologist should explore the client\'s current functioning and provide appropriate therapeutic support.',
    options: [
      'Must report to police immediately as this is a serious crime',
      'No mandatory reporting obligation exists as the perpetrator is deceased and the client is an adult',
      'Must report to child protection as the client was a minor at the time',
      'Must report to the client\'s family to ensure they know about the abuse',
      'Must report to the APS ethics committee for guidance'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'Mandatory reporting typically applies to current or ongoing abuse of minors or vulnerable adults. Historical abuse where the perpetrator is deceased and the victim is now an adult generally does not require mandatory reporting.',
    references: ['APS Code of Ethics A.5.2', 'State/Territory mandatory reporting legislation'],
    clinicalPearls: 'Focus on current impact and therapeutic needs rather than legal obligations in historical cases.'
  },
  {
    id: 'ethics-002',
    domain: 'ethics',
    question: 'A client mentions in passing that their neighbour "probably hits their kids" based on hearing yelling and crying. The client has no direct evidence. What should the psychologist do?',
    answer: 'Document the disclosure but no mandatory reporting is required without reasonable suspicion. The psychologist should explore the client\'s concerns and discuss what constitutes reasonable suspicion.',
    options: [
      'Immediately report to child protection based on the client\'s suspicion',
      'Document the disclosure but no mandatory reporting is required without reasonable suspicion',
      'Ask the client to gather more evidence before reporting',
      'Report to police as this constitutes reasonable suspicion',
      'Ignore the disclosure as it\'s hearsay'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'Mandatory reporting requires reasonable suspicion, not mere speculation. The psychologist should document the disclosure and discuss with the client what would constitute reasonable suspicion.',
    references: ['APS Code of Ethics A.5.2', 'State/Territory mandatory reporting legislation'],
    clinicalPearls: 'Distinguish between speculation and reasonable suspicion based on observable evidence.'
  },
  {
    id: 'ethics-003',
    domain: 'ethics',
    question: 'A client discloses that their partner is also a client of the same psychologist. The partner has not disclosed this relationship. What should the psychologist do?',
    answer: 'Discuss the conflict of interest with both clients, explain the implications, and either refer one client or obtain informed consent from both to continue with appropriate boundaries.',
    options: [
      'Continue seeing both clients as they are separate individuals',
      'Discuss the conflict of interest with both clients, explain the implications, and either refer one client or obtain informed consent from both',
      'Immediately terminate both therapeutic relationships',
      'Keep the information confidential and continue as normal',
      'Report the situation to the APS ethics committee'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'expert',
    explanation: 'This creates a dual relationship and potential conflict of interest. The psychologist must address this transparently with both clients and either resolve the conflict or refer appropriately.',
    references: ['APS Code of Ethics B.1.1', 'Professional boundaries guidelines'],
    clinicalPearls: 'Dual relationships require explicit informed consent and careful boundary management.'
  },
  {
    id: 'ethics-004',
    domain: 'ethics',
    question: 'A client from NSW discloses abuse that occurred in Queensland. The client now lives in Victoria. Which jurisdiction\'s mandatory reporting laws apply?',
    answer: 'The psychologist should report to the jurisdiction where the abuse occurred (Queensland) and the jurisdiction where the client currently resides (Victoria), following the most stringent requirements.',
    options: [
      'Only report to Victoria as that\'s where the client currently lives',
      'Only report to Queensland as that\'s where the abuse occurred',
      'Report to Queensland where the abuse occurred and Victoria where the client currently resides',
      'Report to NSW as that\'s where the psychologist is located',
      'No reporting is required as it\'s cross-jurisdictional'
    ],
    correctOption: 2,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'expert',
    explanation: 'Cross-jurisdictional cases require reporting to both the jurisdiction where the abuse occurred and where the client currently resides, following the most protective legislation.',
    references: ['State/Territory mandatory reporting legislation', 'Cross-jurisdictional practice guidelines'],
    clinicalPearls: 'Always follow the most protective legislation when dealing with cross-jurisdictional cases.'
  },
  {
    id: 'ethics-005',
    domain: 'ethics',
    question: 'A client discloses that their elderly mother is being financially exploited by a home care worker. The mother has mild dementia but refuses to report it. What should the psychologist do?',
    answer: 'Report to adult protective services as this constitutes elder abuse. The mother\'s refusal does not override the mandatory reporting obligation for elder abuse.',
    options: [
      'Respect the mother\'s wishes and not report',
      'Report to adult protective services as this constitutes elder abuse',
      'Only report if the mother gives consent',
      'Ask the client to handle the situation themselves',
      'Report to police as this is a criminal matter'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'Elder abuse, including financial exploitation, is a mandatory reporting requirement in most jurisdictions, regardless of the victim\'s consent.',
    references: ['Elder abuse legislation', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Elder abuse reporting requirements often override client confidentiality and consent.'
  },
  {
    id: 'ethics-006',
    domain: 'ethics',
    question: 'A client discloses that they are being cyberbullied by anonymous individuals online. The bullying includes threats of violence. What should the psychologist do?',
    answer: 'Assess the level of threat and risk. If there is a clear and imminent risk of harm, report to police. Document the disclosure and provide safety planning.',
    options: [
      'Ignore as it\'s online and not real',
      'Assess the level of threat and risk. If there is a clear and imminent risk of harm, report to police',
      'Report to social media platforms only',
      'Ask the client to handle it themselves',
      'Report to cybercrime units immediately'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'Online threats can constitute real risk. The psychologist should assess the level of threat and take appropriate action based on risk assessment.',
    references: ['APS Code of Ethics A.5.2', 'Cyberbullying legislation'],
    clinicalPearls: 'Online threats require the same risk assessment as in-person threats.'
  },
  {
    id: 'ethics-007',
    domain: 'ethics',
    question: 'A client discloses that they work in aged care and have witnessed colleagues neglecting residents. The client fears losing their job if they report it. What should the psychologist do?',
    answer: 'Support the client in making a protected disclosure to the appropriate authority. Explain whistleblower protections and mandatory reporting obligations.',
    options: [
      'Keep the information confidential to protect the client\'s job',
      'Support the client in making a protected disclosure to the appropriate authority',
      'Report directly to the aged care facility',
      'Ask the client to gather more evidence first',
      'Report to the client\'s supervisor only'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'The psychologist should support the client in making a protected disclosure while explaining whistleblower protections and mandatory reporting obligations.',
    references: ['Whistleblower protection legislation', 'Aged care quality standards'],
    clinicalPearls: 'Whistleblower protections exist to encourage reporting of institutional abuse.'
  },
  {
    id: 'ethics-008',
    domain: 'ethics',
    question: 'A client discloses that their child\'s teacher has been making inappropriate comments to students. The client wants to report it but fears retaliation against their child. What should the psychologist do?',
    answer: 'Support the client in making an anonymous report to the school principal or education department. Explain the protections available for whistleblowers.',
    options: [
      'Discourage reporting to protect the child',
      'Support the client in making an anonymous report to the school principal or education department',
      'Report directly to the teacher',
      'Ask the client to confront the teacher first',
      'Report to child protection immediately'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'The psychologist should support the client in making an anonymous report while explaining the protections available for whistleblowers.',
    references: ['Education department reporting procedures', 'Whistleblower protection legislation'],
    clinicalPearls: 'Anonymous reporting can protect whistleblowers while ensuring concerns are addressed.'
  },
  {
    id: 'ethics-009',
    domain: 'ethics',
    question: 'A client discloses that they witnessed their colleague stealing from their workplace. The client is not directly involved but fears workplace consequences. What should the psychologist do?',
    answer: 'Discuss the client\'s options including anonymous reporting, protected disclosure, or reporting to appropriate authorities. Support the client\'s decision-making process.',
    options: [
      'Report the theft to police immediately',
      'Discuss the client\'s options including anonymous reporting, protected disclosure, or reporting to appropriate authorities',
      'Advise the client to ignore the situation',
      'Report to the client\'s employer directly',
      'Ask the client to confront their colleague'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'The psychologist should support the client in making an informed decision about reporting while explaining their options and protections.',
    references: ['Workplace whistleblower protections', 'APS Code of Ethics A.5.2'],
    clinicalPearls: 'Support client autonomy in reporting decisions while providing information about protections.'
  },
  {
    id: 'ethics-010',
    domain: 'ethics',
    question: 'A client discloses that their partner is accessing their bank accounts without permission. The client has given their partner their PIN in the past. What should the psychologist do?',
    answer: 'Assess whether this constitutes financial abuse. If the client has not given current consent, this may constitute financial abuse requiring mandatory reporting.',
    options: [
      'Ignore as the client gave their PIN previously',
      'Assess whether this constitutes financial abuse. If the client has not given current consent, this may constitute financial abuse',
      'Report to police immediately',
      'Ask the client to change their PIN',
      'Report to the bank directly'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'Financial abuse can occur even if the victim previously gave access. The key is whether current access is consensual.',
    references: ['Financial abuse legislation', 'Domestic violence laws'],
    clinicalPearls: 'Previous consent does not override current non-consensual access to financial resources.'
  },
  {
    id: 'ethics-011',
    domain: 'ethics',
    question: 'A client discloses that their elderly parent is being pressured by a family member to change their will. The parent has capacity but is feeling pressured. What should the psychologist do?',
    answer: 'Assess whether this constitutes undue influence or financial abuse. If the parent has capacity, support them in making independent decisions. Document concerns.',
    options: [
      'Report to adult protective services immediately',
      'Assess whether this constitutes undue influence or financial abuse. If the parent has capacity, support them in making independent decisions',
      'Contact the family member to discuss the situation',
      'Advise the parent to change their will to avoid conflict',
      'Report to the solicitor handling the will'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'The psychologist should assess whether undue influence is occurring while respecting the parent\'s capacity to make decisions.',
    references: ['Elder abuse legislation', 'Capacity assessment guidelines'],
    clinicalPearls: 'Capacity and undue influence are separate but related concepts in elder abuse assessment.'
  },
  {
    id: 'ethics-012',
    domain: 'ethics',
    question: 'A client discloses that their child is being bullied at school and the school has not responded adequately. The bullying includes physical violence. What should the psychologist do?',
    answer: 'Support the client in escalating the complaint to the education department if the school has not responded adequately. Document the disclosure and provide safety planning.',
    options: [
      'Report to child protection immediately',
      'Support the client in escalating the complaint to the education department if the school has not responded adequately',
      'Contact the school principal directly',
      'Advise the client to homeschool their child',
      'Report to police as this is assault'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'The psychologist should support the client in following proper escalation procedures while ensuring the child\'s safety.',
    references: ['Education department bullying policies', 'School complaint procedures'],
    clinicalPearls: 'Follow proper escalation procedures when schools fail to address bullying adequately.'
  },
  {
    id: 'ethics-013',
    domain: 'ethics',
    question: 'A client discloses that they work in healthcare and have witnessed colleagues falsifying patient records. The client fears professional consequences. What should the psychologist do?',
    answer: 'Support the client in making a protected disclosure to the appropriate healthcare authority. Explain whistleblower protections and professional obligations.',
    options: [
      'Keep the information confidential to protect the client\'s career',
      'Support the client in making a protected disclosure to the appropriate healthcare authority',
      'Report directly to the healthcare facility',
      'Advise the client to ignore the situation',
      'Report to the client\'s professional registration board'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'hard',
    explanation: 'Healthcare professionals have obligations to report misconduct. The psychologist should support the client in making a protected disclosure.',
    references: ['Healthcare whistleblower protections', 'Professional misconduct reporting obligations'],
    clinicalPearls: 'Healthcare professionals have additional reporting obligations for patient safety.'
  },
  {
    id: 'ethics-014',
    domain: 'ethics',
    question: 'A client discloses that their partner is monitoring their phone and social media accounts without permission. The client feels controlled but is not sure if this is abuse. What should the psychologist do?',
    answer: 'Assess whether this constitutes coercive control or digital abuse. Provide education about healthy relationships and support the client in setting boundaries.',
    options: [
      'Ignore as this is not physical abuse',
      'Assess whether this constitutes coercive control or digital abuse. Provide education about healthy relationships',
      'Report to police immediately',
      'Advise the client to change their passwords',
      'Report to domestic violence services'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'Digital monitoring without consent can constitute coercive control. The psychologist should assess the broader context of the relationship.',
    references: ['Coercive control legislation', 'Digital abuse guidelines'],
    clinicalPearls: 'Digital monitoring can be a form of coercive control and should be assessed in the context of the broader relationship.'
  },
  {
    id: 'ethics-015',
    domain: 'ethics',
    question: 'A client discloses that their neighbour has been leaving threatening notes in their mailbox. The client is afraid but the notes are not signed. What should the psychologist do?',
    answer: 'Support the client in reporting to police and documenting the threats. Provide safety planning and assess the level of risk.',
    options: [
      'Ignore as the notes are not signed',
      'Support the client in reporting to police and documenting the threats. Provide safety planning',
      'Contact the neighbour directly',
      'Advise the client to move house',
      'Report to the client\'s landlord'
    ],
    correctOption: 1,
    category: 'Mandatory Reporting Dilemmas',
    difficulty: 'medium',
    explanation: 'Threatening notes can constitute harassment or stalking. The psychologist should support the client in taking appropriate action.',
    references: ['Stalking and harassment legislation', 'Safety planning guidelines'],
    clinicalPearls: 'Documentation and reporting are essential for addressing ongoing harassment.'
  }
]

export const ethicsFlashcards: Flashcard[] = rawEthicsFlashcards.map(card => ({
  ...card,
  lastReviewed: null,
  nextReview: null,
  reviewCount: 0,
  masteryLevel: 0
}))