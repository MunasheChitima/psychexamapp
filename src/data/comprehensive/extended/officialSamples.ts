import { PracticeQuestion, Flashcard } from '@/types'

type FlashcardInput = Omit<Flashcard, 'lastReviewed' | 'nextReview' | 'reviewCount' | 'masteryLevel'>

// Official Sample Questions from sample_questions.txt
export const officialSampleQuestions: PracticeQuestion[] = [
    {
        id: 'os-q-001',
        domain: 'ethics',
        category: 'Legal Obligations',
        difficulty: 'medium',
        caseStudy: 'A psychologist has been treating a client for a driving phobia following a traffic accident when she was driving a work car. During the course of therapy, the client discloses that she has recently submitted a worker’s compensation claim for bullying. The psychologist then receives a valid subpoena to provide all his client records from the workers compensation authority.',
        question: 'What is the most appropriate response to the subpoena?',
        options: [
            'The psychologist is not obliged to release any information as client records are subject to professional privilege',
            'The psychologist should only release information about the client that you judge to be in their best interests',
            'The psychologist should release a summary of the client records but retain a more detailed set of notes',
            'The psychologist must release all information that is requested as there is no professional privilege',
            'The psychologist must not release the client records as it constitutes a breach of confidentiality'
        ],
        correctAnswer: 3,
        distractorRationale: [
            'Psychologists are not protected by professional privilege in this case.',
            'There is no discretion in this matter; all records listed must be provided.',
            'All records, including electronic ones, must be provided; a summary is insufficient.',
            'Correct — Information gathered in the course of a psychological service is not subject to professional privilege.',
            'Legal obligations such as a valid subpoena override normal confidentiality requirements.'
        ],
        explanation: 'Information, documents, data and any other records gathered in the course of a psychological service are not subject to professional privilege. You are required to release all information specified in a valid subpoena.',
        references: ['Psychology Board of Australia Sample Question 1'],
        questionType: 'priority'
    },
    {
        id: 'os-q-002',
        domain: 'assessment',
        category: 'Screening Assessment',
        difficulty: 'medium',
        caseStudy: 'A 10-year-old boy is referred to a psychologist at the suggestion of the school because of the boy\'s behaviour difficulties. His teacher has completed the Strengths and Difficulties Questionnaire (SDQ). The Total Difficulties scale score on the SDQ is at the 91st percentile.',
        question: 'What would be the most appropriate next step?',
        options: [
            'Work with the school to develop positive behaviour plan',
            'Work with the parents to better understand this high score',
            'Work with the parents to build on the high strengths of this child',
            'Work with the school to better manage this conduct disordered child',
            'Work with the parents to develop a positive behaviour plan'
        ],
        correctAnswer: 1,
        distractorRationale: [
            'There is no evidence the child would benefit from a gifted program; 91st percentile indicates difficulties.',
            'Correct — SDQ is a broad screening test; further comprehensive assessment is required to inform treatment.',
            'There are no indicators the child is gifted; a comprehensive assessment is needed first.',
            'A comprehensive assessment is required before labeling or managing the child as "conduct disordered."',
            'A positive behavior plan requires an assessment-informed treatment plan first.'
        ],
        explanation: 'The SDQ is a broad screening test for emotional and behavioural strengths and difficulties. A score at the 91st percentile indicates difficulties which require a more comprehensive assessment to inform treatment options.',
        references: ['Psychology Board of Australia Sample Question 2'],
        questionType: 'evidence-based'
    },
    {
        id: 'os-q-003',
        domain: 'interventions',
        category: 'Therapeutic Alliance',
        difficulty: 'medium',
        caseStudy: 'An 18-year-old woman is referred for social anxiety and insomnia. After negotiating a plan for social anxiety, she states she is ambivalent about addressing it and wants to focus on insomnia instead.',
        question: 'What is the psychologist’s most appropriate response to the client’s ambivalence?',
        options: [
            'Utilise motivational interviewing to address the client\'s ambivalence',
            'Acknowledge the client’s ambivalence but continue with the social anxiety plan',
            'Refer the client to another psychologist because of her ambivalence',
            'Change the focus of treatment and work with the client on her insomnia problem',
            'Explore the reasons for the client\'s ambivalence in order to maintain a good therapeutic alliance'
        ],
        correctAnswer: 4,
        distractorRationale: [
            'Motivational interviewing is best for specific goals, but here the client is unsure about the focus.',
            'Ignoring the reasons for changing focus increases the risk of client disengagement.',
            'Referral may invalidate the client\'s reasons for wanting to change the focus.',
            'No indication that the reasons were assessed; this may facilitate avoidance.',
            'Correct — Exploring ambivalence helps assess specific issues and strengthens client engagement.'
        ],
        explanation: 'Exploring the ambivalence will help assess the specific issues. Maintaining a strong therapeutic alliance is critical to strengthening client engagement.',
        references: ['Psychology Board of Australia Sample Question 3'],
        questionType: 'complex-vignette'
    },
    {
        id: 'os-q-004',
        domain: 'communication',
        category: 'Electronic Communication',
        difficulty: 'medium',
        caseStudy: 'A psychologist is consulting with a manager who travels to remote areas. The manager suggests using email for sessions due to irregular travel schedules. The psychologist has concerns about communicating electronically.',
        question: 'How should the psychologist best address her concerns regarding electronic communication?',
        options: [
            'Ensure the latest encryption protocols are installed on the psychologist’s email',
            'Include a disclaimer in every electronic communication with the client',
            'Discuss the issue of confidentiality before engaging in email consulting',
            'Insist that the client obtain permission before forwarding any email',
            'Keep copies of all electronic communications with the client'
        ],
        correctAnswer: 2,
        distractorRationale: [
            'Encryption is important but insufficient; it doesn\'t address all foreseeable risks.',
            'Disclaimers are only one method and don\'t address all risks of breaches.',
            'Correct — The psychologist should proactively address all confidentiality issues and seek appropriate solutions.',
            'Client confidentiality is the primary concern, more so than the psychologist\'s email security.',
            'Record-keeping is necessary but doesn\'t address the risk of confidentiality breaches.'
        ],
        explanation: 'Client confidentiality must be protected. The psychologist should proactively address all issues if there are foreseeable risks of breaches of confidentiality.',
        references: ['Psychology Board of Australia Sample Question 4'],
        questionType: 'evidence-based'
    }
]

export const officialSampleFlashcards: Flashcard[] = officialSampleQuestions.map(q => ({
    id: q.id.replace('os-q', 'os-f'),
    domain: q.domain,
    question: q.question,
    answer: q.options[q.correctAnswer],
    options: q.options,
    correctOption: q.correctAnswer,
    category: q.category,
    difficulty: 'medium',
    explanation: q.explanation,
    references: q.references,
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    masteryLevel: 0
}))
