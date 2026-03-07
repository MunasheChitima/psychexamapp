import { PracticeQuestion, Flashcard } from '@/types'

type FlashcardInput = Omit<Flashcard, 'lastReviewed' | 'nextReview' | 'reviewCount' | 'masteryLevel'>

// Questions extracted from PracticeQuestions.tsx
export const uiQuestions: PracticeQuestion[] = [
    {
        id: 'ui-q-001',
        domain: 'ethics',
        category: 'Confidentiality',
        difficulty: 'medium',
        caseStudy: 'A client discloses during a routine session that they are planning to harm their ex-partner. The client is visibly distressed and has a history of impulsive behavior.',
        question: 'A client discloses that they are planning to harm their ex-partner. What is the psychologist\'s primary ethical obligation?',
        options: [
            'Maintain confidentiality at all costs',
            'Immediately report the threat to law enforcement',
            'Discuss the situation with the client\'s family',
            'Document the disclosure but take no further action',
            'Encourage the client to seek legal advice'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Confidentiality is not absolute and must be breached when there is an imminent risk of harm to others.',
            'Correct — Psychologists have a duty to warn and protect when there is a clear and imminent threat.',
            'Discussing with family may not resolve the immediate threat and could violate confidentiality without legal protection.',
            'Documentation is necessary but insufficient when life is at risk.',
            'Legal advice does not address the immediate safety risk.'
        ],
        explanation: 'When there is a clear and imminent risk of harm to others, psychologists have a duty to warn and protect. This is known as the Tarasoff duty and overrides confidentiality.',
        references: ['APS Code of Ethics Principle A.2', 'Tarasoff v. Regents of the University of California'],
        questionType: 'priority'
    },
    {
        id: 'ui-q-002',
        domain: 'ethics',
        category: 'Professional Boundaries',
        difficulty: 'hard',
        caseStudy: 'Dr. Smith has been seeing a client for 6 months. The client invites Dr. Smith to attend their wedding ceremony, expressing that Dr. Smith has been a "pivotal part of their journey."',
        question: 'What should Dr. Smith consider when responding to this invitation?',
        options: [
            'Accept the invitation as it shows good rapport',
            'Decline politely and explain professional boundaries',
            'Ask the client\'s family for permission',
            'Accept but only stay for a short time',
            'Attend and use it as an opportunity for therapeutic observation'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Accepting social invitations can blur boundaries and create dual relationships.',
            'Correct — Maintaining clear boundaries prevents dual relationships and protects the therapeutic frame.',
            'Family permission does not validate a breach of professional boundaries.',
            'Partial attendance still crosses the professional-social boundary.',
            'Observation in a social setting is not a valid therapeutic justification for boundary crossing.'
        ],
        explanation: 'Attending social events with clients can blur professional boundaries and create dual relationships. Psychologists should maintain clear professional boundaries.',
        references: ['APS Code of Ethics Principle B.1', 'Professional boundaries guidelines'],
        questionType: 'complex-vignette'
    },
    {
        id: 'ui-q-003',
        domain: 'ethics',
        category: 'Informed Consent',
        difficulty: 'medium',
        caseStudy: 'A psychologist is about to begin an assessment with a new client. They have prepared a consent form but are unsure if they need to discuss alternatives to the assessment.',
        question: 'What must be included in informed consent for psychological assessment?',
        options: [
            'Only the purpose of the assessment',
            'Purpose, procedures, risks, benefits, and alternatives',
            'Just the cost and duration',
            'Only confidentiality limits',
            'The raw data retention policy'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Purpose is only one component of informed consent.',
            'Correct — Informed consent is a comprehensive process covering all these elements.',
            'Financial terms are necessary but not sufficient for clinical consent.',
            'Confidentiality is a key limit but doesn\'t cover the scope of the assessment itself.',
            'Data retention is part of record keeping policies, not the primary clinical consent.'
        ],
        explanation: 'Informed consent must include the purpose, procedures, risks, benefits, alternatives, confidentiality limits, and the right to withdraw consent.',
        references: ['APS Code of Ethics Principle A.3', 'Informed consent requirements'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-004',
        domain: 'assessment',
        category: 'Cognitive Assessment',
        difficulty: 'medium',
        caseStudy: 'A 35-year-old client presents with concerns about memory problems following a car accident. They report being unable to remember where they parked or recall conversations from that morning.',
        question: 'Which assessment would be most appropriate for this client?',
        options: [
            'WAIS-IV (Wechsler Adult Intelligence Scale)',
            'WMS-IV (Wechsler Memory Scale)',
            'DASS-42 (Depression Anxiety Stress Scale)',
            'PAI (Personality Assessment Inventory)',
            'SDQ (Strengths and Difficulties Questionnaire)'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'WAIS-IV measures general IQ, not specific memory functions.',
            'Correct — WMS-IV is the gold standard for dedicated memory assessment.',
            'DASS measures distress, not cognitive ability.',
            'PAI measures personality and psychopathology.',
            'SDQ is a child behavioral screening tool.'
        ],
        explanation: 'The WMS-IV is specifically designed to assess memory functioning and would be most appropriate for evaluating memory problems following a traumatic brain injury.',
        references: ['WMS-IV Manual', 'Neuropsychological assessment guidelines'],
        questionType: 'evidence-based'
    }
];

// Flashcards extracted from Flashcards.tsx
export const uiFlashcards: Flashcard[] = [
    {
        id: 'ui-f-001',
        domain: 'ethics',
        category: 'Legal Obligations',
        difficulty: 'medium',
        question: 'A psychologist receives a valid subpoena to provide all client records from a workers compensation authority. What is the most appropriate response?',
        answer: 'The psychologist must release all information that is requested as there is no professional privilege. Legal obligations such as a valid subpoena override normal confidentiality requirements.',
        options: [
            'The psychologist is not obliged to release any information as client records are subject to professional privilege',
            'The psychologist should only release information about the client that you judge to be in their best interests',
            'The psychologist should release a summary of the client records but retain a more detailed set of notes',
            'The psychologist must release all information that is requested as there is no professional privilege',
            'The psychologist must not release the client records as it constitutes a breach of confidentiality'
        ],
        correctOption: 3,
        explanation: 'Information gathered in the course of a psychological service is not subject to professional privilege. You are required to release all information specified in a valid subpoena.',
        references: ['APS Code of Ethics', 'Privacy Act 1988'],
        lastReviewed: null,
        nextReview: null,
        reviewCount: 0,
        masteryLevel: 0
    }
];

// ... (I will fill the rest of the 35 flashcards in the next step to keep chunks manageable)
