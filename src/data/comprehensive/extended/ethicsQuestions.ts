import { PracticeQuestion } from '../../../types'

export const extendedEthicsQuestions: PracticeQuestion[] = [
    {
        id: 'eth-001', domain: 'ethics', category: 'Confidentiality', difficulty: 'hard',
        caseStudy: 'A 15-year-old client discloses they are experimenting with illegal drugs. They ask you not to tell their parents.',
        question: 'What is the most appropriate course of action?',
        options: ['Immediately tell the parents to ensure safety', 'Maintain confidentiality unless there is a clear and imminent risk of serious harm', 'Refuse to see the client further', 'Report the client to the police', 'Tell the school counselor instead'],
        correctAnswer: 1,
        distractorRationale: ['Violates privacy and rapport without proof of imminent harm.', 'Correct — Ethics balance autonomy/confidentiality with risk.', 'Abandonment.', 'Breach of trust/confidentiality without legal mandate.', 'Unnecessary breach.'],
        explanation: 'For minors, confidentiality depends on their "mature minor" status and the level of risk. Experimentation does not always equal "imminent risk of serious harm".',
        references: ['APS Ethical Guidelines for Working with Young People'],
        questionType: 'complex-vignette'
    },
    {
        id: 'eth-002', domain: 'ethics', category: 'Boundaries', difficulty: 'hard',
        caseStudy: 'A client you have been seeing for two years sends you a friend request on a personal social media account.',
        question: 'How should you respond?',
        options: ['Accept it to build rapport', 'Decline the request and discuss professional boundaries in the next session', 'Ignore it and never mention it', 'Delete your social media account', 'Accept it but don\'t post anything'],
        correctAnswer: 1,
        distractorRationale: ['Accepting builds dual relationships.', 'Correct — Boundaries protect the therapeutic relationship.', 'Ignoring creates confusion.', 'Extreme and unnecessary.', 'Still a dual relationship.'],
        explanation: 'Psychologists should maintain clear boundaries on social media to protect the therapeutic relationship and privacy.',
        references: ['APS Ethical Guidelines on Social Media'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-003', domain: 'ethics', category: 'Competence', difficulty: 'medium',
        caseStudy: 'Competence is a core ethical principle.',
        question: 'A psychologist is asked to provide an expert opinion on a parenting matter despite having no training in family law or forensic assessment.',
        options: ['Accept the task to gain experience', 'Decline the task as it is outside their area of competence', 'Accept it but charge a lower fee', 'Ask a friend who is a lawyer for help', 'Rely on their own experience as a parent'],
        correctAnswer: 1,
        distractorRationale: ['Unsafe and unethical.', 'Correct — Psychologists must work within their competence.', 'Financial adjustment doesn\'t solve incompetence.', 'Legal advice is not psychological competence.', 'Personal experience is not professional competence.'],
        explanation: 'Psychologists must only provide services within the boundaries of their competence based on education, training, and experience.',
        references: ['APS Code of Ethics Principle B.1'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-004', domain: 'ethics', category: 'Informed Consent', difficulty: 'medium',
        caseStudy: 'Consent is an ongoing process.',
        question: 'When should informed consent be obtained?',
        options: ['Only at the first session', 'Only when a new treatment is started', 'At the start and regularly throughout the professional relationship', 'Only if the client asks for it', 'Only if therapy lasts longer than a month'],
        correctAnswer: 2,
        distractorRationale: ['Insufficient.', 'Necessary but not enough.', 'Correct — Consent is ongoing.', 'Practitioner\'s responsibility, not the client\'s.', 'Incorrect timeline.'],
        explanation: 'Informed consent is an ongoing process, not a one-time event.',
        references: ['APS Code of Ethics Principle A.3'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-005', domain: 'ethics', category: 'Mandatory Reporting', difficulty: 'hard',
        caseStudy: 'In a session, a father mentions he sometimes "smacks" his 4-year-old daughter when he is frustrated. He says it leaves red marks but no bruises.',
        question: 'What is the psychologist\'s primary obligation?',
        options: ['Wait until there are bruises before reporting', 'Assess the risk of harm and follow state-based mandatory reporting laws for child abuse', 'Ignore it as a parenting style difference', 'Tell the father he is a bad person', 'Give the father a book on parenting'],
        correctAnswer: 1,
        distractorRationale: ['Too late.', 'Correct — Risk assessment and legal compliance are key.', 'Negligent.', 'Unprofessional and judgmental.', 'Insufficient in a risk situation.'],
        explanation: 'Psychologists have a legal and ethical duty to report suspected child abuse or neglect according to relevant state legislation.',
        references: ['Children and Young Persons Acts (State-based)'],
        questionType: 'priority'
    },
    {
        id: 'eth-006', domain: 'ethics', category: 'Self-Care', difficulty: 'medium',
        caseStudy: 'Fitness to practice includes mental health.',
        question: 'According to the Code, psychologists who become aware of their own mental health problems that may impair their work should:',
        options: ['Keep working to avoid letting down clients', 'Seek professional help and consider limiting or stopping their practice', 'Ignore it until a client complains', 'Switch to working only with "easy" clients', 'Double their caffeine intake'],
        correctAnswer: 1,
        distractorRationale: ['Unethical and dangerous.', 'Correct — Responsibility to self and clients.', 'Negligent.', 'Doesn\'t address the core impairment.', 'Harmful.'],
        explanation: 'Psychologists have a responsibility to monitor their own fitness to practice.',
        references: ['APS Code of Ethics Principle B.1.2'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-007', domain: 'ethics', category: 'Multiple Relationships', difficulty: 'hard',
        caseStudy: 'Dual relationships can be exploitative.',
        question: 'After ending therapy, how long must a psychologist wait before entering into a sexual relationship with a former client?',
        options: ['6 months', '1 year', 'At least 2 years', '5 years', 'It is never permitted under any circumstances'],
        correctAnswer: 2,
        distractorRationale: ['Too short.', 'Too short.', 'Correct — APS Code minimum.', 'Exceeds minimum requirements.', 'Strict, but Code allows after 2 years if no exploitation.'],
        explanation: 'The APS Code specifies a minimum of two years, and even then, the psychologist must ensure there is no exploitation of the former client.',
        references: ['APS Code of Ethics Principle C.4.3'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-008', domain: 'ethics', category: 'Test Integrity', difficulty: 'medium',
        caseStudy: 'Psychological tests are protected materials.',
        question: 'A psychologist allows a client to take a standardized cognitive test home to "practice" before the real test. This violates:',
        options: ['Confidentiality', 'Informed Consent', 'Test Security and Integrity', 'Justice', 'Public Safety'],
        correctAnswer: 2,
        distractorRationale: ['Not a privacy issue.', 'Not a consent issue.', 'Correct — Compromises test validity.', 'Not primarily a justice issue.', 'Broader than the specific ethical breach.'],
        explanation: 'Protecting the security of test materials is essential to maintain the validity of the tests.',
        references: ['APS Ethical Guidelines on Psychological Assessment'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-009', domain: 'ethics', category: 'Advertising', difficulty: 'medium',
        caseStudy: 'Advertising is regulated by AHPRA.',
        question: 'Psychologists are prohibited from using which of the following in their advertising?',
        options: ['Their qualifications', 'Testimonials from current or former clients', 'Their office address', 'The types of therapy they offer', 'Their fees'],
        correctAnswer: 1,
        distractorRationale: ['Allowed.', 'Correct — Prohibited by National Law.', 'Allowed.', 'Allowed.', 'Allowed (if transparent).'],
        explanation: 'The National Law prohibits testimonials in advertising for regulated health services.',
        references: ['AHPRA Advertising Guidelines'],
        questionType: 'evidence-based'
    },
    {
        id: 'eth-010', domain: 'ethics', category: 'Justice', difficulty: 'medium',
        caseStudy: 'Equity and fairness are ethical pillars.',
        question: 'Which principle involves avoiding discrimination and ensuring fair access to services?',
        options: ['Respect', 'Propriety', 'Integrity', 'Justice', 'Beneficence'],
        correctAnswer: 3,
        distractorRationale: ['Wider focus on dignity.', 'Focus on competence.', 'Focus on honesty.', 'Correct — Fair distribution of services.', 'Focus on doing good.'],
        explanation: 'Justice refers to the fair and equitable distribution of services and avoiding discrimination.',
        references: ['APS Code of Ethics'],
        questionType: 'evidence-based'
    }
];

