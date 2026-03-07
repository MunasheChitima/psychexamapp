import { PracticeQuestion } from '@/types'

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
            'Correct — WMS-IV is dedicated to memory assessment.',
            'DASS-42 measures emotional symptoms, not memory.',
            'PAI is a personality inventory.',
            'SDQ is a child behavioral screening tool.'
        ],
        explanation: 'The WMS-IV is specifically designed to assess memory functioning and would be most appropriate for evaluating memory problems following a traumatic brain injury.',
        references: ['WMS-IV Manual', 'Neuropsychological assessment guidelines'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-005',
        domain: 'assessment',
        category: 'Test Selection',
        difficulty: 'hard',
        caseStudy: 'A psychologist is setting up a new practice and wants to select the most efficient tests. They are considering cost, preference, and psychometrics.',
        question: 'When selecting an assessment tool, which factor is LEAST important?',
        options: [
            'Psychometric properties (reliability and validity)',
            'Cultural appropriateness for the client',
            'Cost of the assessment',
            'The psychologist\'s personal preference',
            'The client\'s language proficiency'
        ],
        correctAnswer: 3,
        distractorRationale: [
            'Reliability and validity are essential for any scientific assessment.',
            'Cultural appropriateness ensures the test is valid for the specific individual.',
            'Cost is a business reality but secondary to clinical validity.',
            'Correct — Personal preference should not dictate test selection over evidence-based factors.',
            'Language proficiency is a key factor in ensuring the client can undergo the assessment validly.'
        ],
        explanation: 'Personal preference should not influence test selection. The choice should be based on psychometric properties, cultural appropriateness, and clinical utility.',
        references: ['Test selection guidelines', 'Evidence-based assessment practices'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-006',
        domain: 'assessment',
        category: 'DSM-5',
        difficulty: 'medium',
        caseStudy: 'A therapist is reviewing the chart of a new client who has been feeling low, lethargic, and hopeless for the past 12 days.',
        question: 'What is the minimum duration required for a diagnosis of Major Depressive Disorder?',
        options: [
            '1 week',
            '2 weeks',
            '1 month',
            '3 months',
            '6 months'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'One week is insufficient for MDD; it may represent a shorter depressive episode or other condition.',
            'Correct — Symptoms must persist for at least 2 weeks according to DSM-5.',
            'One month is used for other disorders like Schizophreniform or PTSD.',
            'Three months is not a standard duration for initial MDD diagnosis.',
            'Six months is used for chronic conditions like GAD.'
        ],
        explanation: 'According to DSM-5, symptoms must be present for at least 2 weeks for a diagnosis of Major Depressive Disorder.',
        references: ['DSM-5 Criteria', 'Major Depressive Disorder diagnostic guidelines'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-007',
        domain: 'interventions',
        category: 'CBT',
        difficulty: 'medium',
        caseStudy: 'A client with social anxiety avoids social situations and experiences negative automatic thoughts about being judged by others in social settings.',
        question: 'Which CBT technique would be most appropriate to address this?',
        options: [
            'Systematic desensitization',
            'Cognitive restructuring',
            'Mindfulness meditation',
            'Psychodynamic therapy',
            'Aversion therapy'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'De-sensitization is useful but doesn\'t directly target the cognitive drivers of social anxiety.',
            'Correct — Cognitive restructuring directly addresses the negative automatic thoughts and beliefs characteristic of social anxiety.',
            'Mindfulness is an adjunctive skill but restructuring is a core active component for anxiety.',
            'Psychodynamic therapy focuses on unconscious roots rather than the immediate cognitive patterns.',
            'Aversion therapy is not appropriate for anxiety disorders.'
        ],
        explanation: 'Cognitive restructuring helps clients identify and challenge negative automatic thoughts, which is central to treating social anxiety.',
        references: ['CBT for Social Anxiety', 'Cognitive restructuring techniques'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-008',
        domain: 'interventions',
        category: 'Psychopharmacology',
        difficulty: 'hard',
        caseStudy: 'A GP refers a client with Generalized Anxiety Disorder to a psychologist and asks for input on common medication preferences from a psychological perspective.',
        question: 'Which medication class is typically first-line for treating Generalized Anxiety Disorder?',
        options: [
            'Benzodiazepines',
            'SSRIs',
            'Antipsychotics',
            'Stimulants',
            'MAOIs'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Benzodiazepines are often used for acute relief but are not first-line due to dependence risks.',
            'Correct — SSRIs are first-line due to their efficacy and safety profile for long-term anxiety management.',
            'Antipsychotics are not standard first-line for GAD.',
            'Stimulants can exacerbate anxiety.',
            'MAOIs are typically reserved as a later-line treatment due to dietary restrictions.'
        ],
        explanation: 'SSRIs are typically first-line treatment for GAD due to their efficacy, safety profile, and lower risk of dependence compared to benzodiazepines.',
        references: ['Treatment guidelines for GAD', 'SSRI safety and efficacy data'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-009',
        domain: 'interventions',
        category: 'Motivational Interviewing',
        difficulty: 'medium',
        caseStudy: 'A psychologist is working with a client who is unsure whether they want to quit smoking. The client sees both benefits and drawbacks to quitting.',
        question: 'What is the primary goal of motivational interviewing?',
        options: [
            'To persuade clients to change',
            'To resolve ambivalence and increase motivation for change',
            'To provide education about health risks',
            'To establish treatment goals',
            'To identify childhood roots of resistance'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'MI is non-confrontational and does not "persuade"; it elicits change talk.',
            'Correct — Resolving ambivalence is the central aim of MI.',
            'Education is secondary to the motivational process.',
            'Goal-setting follows the resolution of ambivalence.',
            'MI is present-focused and doesn\'t search for childhood roots.'
        ],
        explanation: 'Motivational interviewing aims to help clients resolve ambivalence and increase their intrinsic motivation for change through collaborative conversation.',
        references: ['Motivational Interviewing principles', 'MI effectiveness research'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-010',
        domain: 'communication',
        category: 'Report Writing',
        difficulty: 'medium',
        caseStudy: 'A psychologist is finishing a report for a NDIS participant. They want the report to be useful for the planners and the participant.',
        question: 'What should be included in the recommendations section of a psychological report?',
        options: [
            'Only treatment recommendations',
            'Specific, actionable recommendations based on assessment findings',
            'General advice for the client',
            'Only diagnostic impressions',
            'A list of clinicians the client should avoid'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Treatment is one part, but recommendations should be broader.',
            'Correct — Recommendations must be specific and linked to findings to be actionable.',
            'General advice lacks the clinical weight needed for structural changes or support.',
            'Diagnostic impressions belong in the Formulation/Diagnosis section.',
            'Lists of clinicians to avoid is unprofessional and not part of standard report writing.'
        ],
        explanation: 'Recommendations should be specific, actionable, and directly related to the assessment findings, including treatment, educational, and practical suggestions.',
        references: ['Psychological report writing guidelines', 'Recommendations best practices'],
        questionType: 'evidence-based'
    },
    {
        id: 'ui-q-011',
        domain: 'communication',
        category: 'Cultural Competence',
        difficulty: 'hard',
        caseStudy: 'A psychologist is working with a client from a collectivist culture who is reluctant to discuss individual concerns, preferring to talk about how things affect their family.',
        question: 'What approach would be most culturally responsive?',
        options: [
            'Insist on individual therapy sessions',
            'Incorporate family or community perspectives',
            'Use only Western therapeutic techniques',
            'Refer to a different therapist',
            'Ask the client to "leave their family out of it"'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'Insisting on Western individualism may alienate the client.',
            'Correct — Integrating the client\'s cultural values (collectivism) into treatment improves engagement and efficacy.',
            'Strict adherence to only Western techniques ignores the client\'s worldview.',
            'Referral may be necessary if incompetent, but first should attempt cultural adaptation.',
            'Dismissing family values is culturally insensitive and harmful.'
        ],
        explanation: 'Working with collectivist cultures often requires incorporating family and community perspectives, as individual concerns are viewed within a broader social context.',
        references: ['Cultural competence guidelines', 'Working with collectivist cultures'],
        questionType: 'complex-vignette'
    },
    {
        id: 'ui-q-012',
        domain: 'communication',
        category: 'Record Keeping',
        difficulty: 'medium',
        caseStudy: 'A client has finished therapy and the psychologist is closing the file. They are reviewing their policy on how long to keep the data.',
        question: 'How long should psychological records be retained?',
        options: [
            'Until the client turns 18',
            'For 7 years after the last contact',
            'For 3 years after termination',
            'Indefinitely',
            'Only for 12 months'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'For minors, records must be kept until they are 25 (or 7 years after last contact, whichever is longer).',
            'Correct — The general standard for adults is 7 years after last professional contact.',
            'Three years is insufficient under most regulatory frameworks.',
            'Indefinite retention poses privacy risks and is not required.',
            'One year is far too short for psychological record retention.'
        ],
        explanation: 'Most jurisdictions require psychological records to be retained for 7 years after the last professional contact, though requirements may vary.',
        references: ['Record retention requirements', 'Legal and ethical guidelines'],
        questionType: 'evidence-based'
    }
]
