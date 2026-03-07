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

export const communicationQuestions: PracticeQuestion[] = [
  {
    id: 'cq-001', domain: 'communication', category: 'Report Writing', difficulty: 'medium',
    caseStudy: 'A psychologist is writing a report for a GP about a client with anxiety. The client disclosed some family history that is not directly relevant to the anxiety diagnosis.',
    question: 'How should the psychologist treat this irrelevant information in the report?',
    options: ['Include it all to be thorough', 'Exclude it to maintain client privacy and focus on relevance', 'Ask the GP if they want to know it', 'Include it but put it in a separate section', 'Tell the client\'s family about it instead'],
    correctAnswer: 1,
    distractorRationale: ['Violates principle of "minimum necessary" disclosure.', 'Correct — Reports should be focused and only include relevant clinical information.', 'Puts burden on another professional.', 'Still breaches privacy unnecessarily.', 'Grossly unethical.'],
    explanation: 'Information in reports should be relevant to the purpose of the report. This honors the client\'s privacy.',
    references: ['APS Ethical Guidelines on Record Keeping'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-002', domain: 'communication', category: 'Cultural Competence', difficulty: 'hard',
    caseStudy: 'A psychologist is working with an Aboriginal client and notices the client avoids eye contact and speaks in very short sentences.',
    question: 'How should the psychologist interpret this behavior?',
    options: ['As a sign of clinical depression', 'As a sign of resistance to therapy', 'As potentially culturally appropriate communication (e.g., showing respect)', 'As a sign of low intelligence', 'As a lack of engagement'],
    correctAnswer: 2,
    distractorRationale: ['May be wrong interpretation.', 'Misidentifies cultural norms as pathology.', 'Correct — Eye contact and speech patterns vary across cultures.', 'Racist and incorrect.', 'Misinterpretation of style.'],
    explanation: 'Cultural competence involves understanding that communication styles (e.g., "shame" and "avoidance of direct gaze") may have different meanings in different cultural contexts.',
    references: ['APS Ethical Guidelines for working with Aboriginal people'],
    questionType: 'complex-vignette'
  },
  {
    id: 'cq-003', domain: 'communication', category: 'Record Keeping', difficulty: 'medium',
    caseStudy: 'Client files have legal status.',
    question: 'A former client requests access to their complete psychological file. What is the most appropriate response?',
    options: ['Refuse access as files belong to the psychologist', 'Provide access unless it would pose a serious threat to the life or health of the client or another person', 'Charge a $500 fee before allowing access', 'Tell the client they can only see the file in the presence of a lawyer', 'Destroy the file so it can\'t be seen'],
    correctAnswer: 1,
    distractorRationale: ['Clients generally have a legal right to access.', 'Correct — This aligns with Australian privacy laws (e.g., Privacy Act 1988).', 'Fees must be reasonable and not a barrier.', 'Unnecessary obstruction.', 'Illegal (record retention requirements).'],
    explanation: 'Under Australian privacy laws, clients generally have a right to access their health information, with specific exceptions for safety.',
    references: ['Privacy Act 1988 (Cth)', 'APS Guidelines on Record Keeping'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-004', domain: 'communication', category: 'Professionalism', difficulty: 'medium',
    caseStudy: 'Digital communication requires boundaries.',
    question: 'When emailing a client, which of the following is most important for maintaining professionalism?',
    options: ['Using emojis to build rapport', 'Using clear subject lines and avoiding sensitive clinical details in the body of the email', 'Sharing personal details about the psychologist\'s weekend', 'BCCing the psychologist\'s own family', 'Using slang to seem more approachable'],
    correctAnswer: 1,
    distractorRationale: ['May be seen as unprofessional.', 'Correct — Privacy and professional boundaries are paramount in email communication.', 'Boundary violation.', 'Confidentiality breach.', 'Unprofessional.'],
    explanation: 'Email is a professional communication tool and should be used with caution regarding privacy and tone.',
    references: ['APS Guidelines on the use of technology'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-005', domain: 'communication', category: 'Public Statements', difficulty: 'hard',
    caseStudy: 'Public statements can impact professional reputation.',
    question: 'A psychologist is asked to comment on a high-profile criminal case in a local newspaper. What should they do?',
    options: ['Provide a definitive diagnosis of the accused based on news reports', 'Only comment in general terms about psychological principles and avoid commenting on a person they haven\'t assessed', 'Decline to comment because psychologists should never talk to the press', 'Charge the newspaper for a diagnosis', 'Refer the newspaper to the client\'s family'],
    correctAnswer: 1,
    distractorRationale: ['Unethical (Goldwater Rule principle).', 'Correct — Psychologists must clarify they haven\'t assessed the person and only speak on general knowledge.', 'They can comment, but only appropriately.', 'Unethical.', 'Confidentiality risk.'],
    explanation: 'Psychologists should not provide professional opinions about individuals they have not personally examined in a professional capacity.',
    references: ['APS Code of Ethics', 'Public Statements guidelines'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-006', domain: 'communication', category: 'Multidisciplinary Teams', difficulty: 'medium',
    caseStudy: 'Multidisciplinary collaboration is common.',
    question: 'In a multidisciplinary team meeting, a psychologist disagrees with a psychiatrist\'s diagnosis. What is the best way to handle this?',
    options: ['Remain silent to avoid conflict', 'Publicly mock the psychiatrist', 'Professional communication of the psychologist\'s observations and evidence for their alternative view', 'Complain to the hospital CEO immediately', 'Tell the client that the psychiatrist is wrong'],
    correctAnswer: 2,
    distractorRationale: ['Fails to advocate for the client.', 'Unprofessional.', 'Correct — Professional, evidence-based dialogue is the core of team-based care.', 'Escalation should only happen if first step fails.', 'Undercuts the treatment team and confuses the client.'],
    explanation: 'Professional collaboration requires respectful, evidence-based communication of divergent views.',
    references: ['APS Guidelines on Multidisciplinary Teams'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-007', domain: 'communication', category: 'Telehealth', difficulty: 'medium',
    caseStudy: 'Telehealth sessions require safety protocols.',
    question: 'When conducting a session via telehealth, what is the most important step at the start of the session?',
    options: ['Checking the client\'s internet speed', 'Confirming the client\'s current physical location and emergency contact details', 'Discussing the psychologist\'s background', 'Reviewing the psychologist\'s favorite movies', 'Asking about the weather'],
    correctAnswer: 1,
    distractorRationale: ['Useful but not the priority.', 'Correct — Essential for safety in case of a crisis during the session.', 'Not the priority.', 'Irrelevant.', 'Rapport building, but not the priority.'],
    explanation: 'In telehealth, you must know where the client is and how to reach emergency services for that specific location.',
    references: ['APS Guidelines on Telehealth'],
    questionType: 'priority'
  },
  {
    id: 'cq-008', domain: 'communication', category: 'Feedback', difficulty: 'medium',
    caseStudy: 'Providing feedback is part of the assessment process.',
    question: 'What is the primary purpose of providing feedback to a client after an assessment?',
    options: ['To show off the psychologist\'s knowledge', 'To help the client understand the findings and involve them in treatment planning', 'To justify the assessment fee', 'To fulfill a legal requirement only', 'To criticize the client\'s test scores'],
    correctAnswer: 1,
    distractorRationale: ['Arrogant.', 'Correct — Feedback should be therapeutic and collaborative.', 'Cynical.', 'Insufficient.', 'Harmful.'],
    explanation: 'Feedback is a collaborative process that empowers the client to use the assessment results for their own growth.',
    references: ['Therapeutic Assessment principles'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-009', domain: 'communication', category: 'Record Keeping', difficulty: 'medium',
    caseStudy: 'Record correction follows standard procedures.',
    question: 'When correcting a mistake in a handwritten psychological note, what is the best practice?',
    options: ['Use white-out to hide the mistake completely', 'Scribble it out until it is unreadable', 'Cross it out with a single line, initial it, date it, and write the correction', 'Tear out the page and start over', 'Ignore it and hope nobody notices'],
    correctAnswer: 2,
    distractorRationale: ['Obscures original entries.', 'Obscures original entries.', 'Correct — This maintains the integrity and audit trail of the records.', 'Destroys clinical records.', 'Unprofessional.'],
    explanation: 'Records should be permanent and any changes should be transparently documented.',
    references: ['APS Ethical Guidelines on Record Keeping'],
    questionType: 'evidence-based'
  },
  {
    id: 'cq-010', domain: 'communication', category: 'Cultural Competence', difficulty: 'hard',
    caseStudy: 'Translators are used for diversity.',
    question: 'A psychologist is using a translator for a session. Who should the psychologist look at while speaking?',
    options: ['The translator', 'The client', 'The floor', 'The clock', 'Out the window'],
    correctAnswer: 1,
    distractorRationale: ['Common mistake; alienates the client.', 'Correct — You are speaking TO the client, the translator is a conduit.', 'Disrespectful.', 'Rude.', 'Rude.'],
    explanation: 'When working with an interpreter, maintain the direct relationship with the client by looking at them while speaking.',
    references: ['Guidelines for working with Interpreters'],
    questionType: 'evidence-based'
  }
];

const communicationFlashcardsRaw: FlashcardInput[] = [
  {
    id: 'cf-001', domain: 'communication',
    question: 'How long must records for an adult client be kept?',
    answer: 'At least 7 years since the last client contact.',
    category: 'Record Keeping', difficulty: 'medium',
    explanation: 'If the client was a child, records must be kept until the client reaches age 25.',
    references: ['Psychology Board of Australia']
  },
  {
    id: 'cf-002', domain: 'communication',
    question: 'What is "Minimum Necessary Disclosure"?',
    answer: 'Releasing only the specific information required for the purpose of the request, rather than the whole file.',
    category: 'Privacy', difficulty: 'medium'
  },
  {
    id: 'cf-003', domain: 'communication',
    question: 'What is the "Goldwater Rule"?',
    answer: 'The ethical principle that psychologists should not provide professional opinions about public figures they have not personally examined.',
    category: 'Professionalism', difficulty: 'hard'
  },
  {
    id: 'cf-004', domain: 'communication',
    question: 'In report writing, what does "Plain Language" mean?',
    answer: 'Avoiding jargon and using terms that the target audience (e.g., GP, teacher, client) can understand.',
    category: 'Report Writing', difficulty: 'medium'
  },
  {
    id: 'cf-005', domain: 'communication',
    question: 'What should you do if a client requests their file and you believe it would be harmful to them?',
    answer: 'You may withhold access to portions if there is a serious threat to their life or health, but this is a high bar.',
    category: 'Record Keeping', difficulty: 'hard'
  },
  {
    id: 'cf-006', domain: 'communication',
    question: 'Can you use client testimonials in advertising?',
    answer: 'No. The National Law prohibits the use of testimonials in any advertising of a regulated health service.',
    category: 'Public Statements', difficulty: 'medium',
    explanation: 'This includes social media reviews if the practitioner has control over them.',
    references: ['Guidelines for advertising regulated health services']
  }
];

export const communicationFlashcards: Flashcard[] = communicationFlashcardsRaw.map(c => ({
  ...c,
  lastReviewed: null,
  nextReview: null,
  reviewCount: 0,
  masteryLevel: 0,
  domain: c.domain as any
}))
