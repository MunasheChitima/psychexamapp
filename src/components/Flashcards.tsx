'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  BookOpen,
  Search,
  Filter,
  Bookmark,
  Star,
  CheckCircle
} from 'lucide-react'
import { ComponentProps } from '@/types'

interface Flashcard {
  id: string
  domain: string
  question: string
  answer: string
  options?: string[] // Multiple choice options
  correctOption?: number // Index of correct option (0-based)
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed: Date | null
  nextReview: Date | null
  reviewCount: number
  masteryLevel: number // 0-5, where 5 is mastered
  isBookmarked?: boolean
  explanation?: string // Detailed explanation for the answer
}

export default function Flashcards({ appData, updateAppData }: ComponentProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterByDifficulty, setFilterByDifficulty] = useState<string>('all')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)

  // Enhanced flashcards data with comprehensive content based on official curriculum
  const sampleFlashcards: Flashcard[] = [
    // ETHICS DOMAIN - Based on APS Code of Ethics and curriculum
    {
      id: '1',
      domain: 'ethics',
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
      category: 'Legal Obligations',
      difficulty: 'medium',
      explanation: 'Information, documents, data and any other records gathered in the course of a psychological service are not subject to professional privilege. You are required to release all information, documents and other types of records specified in a valid subpoena.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '2',
      domain: 'ethics',
      question: 'When can a psychologist break client confidentiality according to the APS Code of Ethics?',
      answer: 'When there is a clear and imminent risk of harm to the client or others, when required by law (mandatory reporting), when the client gives informed consent, or when ordered by a court.',
      options: [
        'Only when the client gives explicit written consent',
        'When there is a clear and imminent risk of harm to the client or others, when required by law, when the client gives informed consent, or when ordered by a court',
        'Only when ordered by a court',
        'When the psychologist believes it is in the client\'s best interest',
        'Never - confidentiality is absolute'
      ],
      correctOption: 1,
      category: 'Confidentiality',
      difficulty: 'medium',
      explanation: 'The Tarasoff duty requires warning potential victims when there is a clear and imminent risk of harm. This is one of the key exceptions to confidentiality in psychological practice.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '3',
      domain: 'ethics',
      question: 'What are the key components of informed consent according to the APS Code of Ethics?',
      answer: 'Clear explanation of services, fees, confidentiality limits, client rights, therapist qualifications, and the right to withdraw consent at any time. Must be in language the client can understand.',
      options: [
        'Only the purpose of the assessment and fees',
        'Purpose, procedures, risks, benefits, alternatives, confidentiality limits, and the right to withdraw consent',
        'Just the cost and duration of services',
        'Only confidentiality limits and therapist qualifications',
        'A simple verbal agreement is sufficient'
      ],
      correctOption: 1,
      category: 'Informed Consent',
      difficulty: 'medium',
      explanation: 'Informed consent must include the purpose, procedures, risks, benefits, alternatives, confidentiality limits, and the right to withdraw consent. This ensures clients can make informed decisions about their participation.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '4',
      domain: 'ethics',
      question: 'What is the psychologist\'s obligation regarding mandatory reporting of child abuse?',
      answer: 'Psychologists must report suspected cases of child abuse or neglect to appropriate authorities. This is a legal obligation that overrides confidentiality.',
      options: [
        'Only report if the client gives permission',
        'Report only if the abuse is confirmed beyond doubt',
        'Psychologists must report suspected cases of child abuse or neglect to appropriate authorities',
        'Only report if the child is currently in immediate danger',
        'Report only if the perpetrator is a family member'
      ],
      correctOption: 2,
      category: 'Mandatory Reporting',
      difficulty: 'medium',
      explanation: 'Mandatory reporting requirements are legal obligations that override normal confidentiality. Psychologists must report suspected cases of child abuse, elder abuse, and threats of harm to self or others.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '5',
      domain: 'ethics',
      question: 'What should a psychologist do if they discover they have a conflict of interest with a client?',
      answer: 'The psychologist should disclose the conflict to the client, discuss the implications, and either resolve the conflict or refer the client to another professional.',
      options: [
        'Continue with the professional relationship as normal',
        'Disclose the conflict to the client, discuss implications, and either resolve the conflict or refer the client',
        'Keep the conflict private to avoid upsetting the client',
        'Immediately terminate the professional relationship',
        'Only disclose if the client asks about it'
      ],
      correctOption: 1,
      category: 'Professional Boundaries',
      difficulty: 'hard',
      explanation: 'According to the APS Code of Ethics, psychologists must avoid conflicts of interest and disclose any that arise. The client has the right to make an informed decision about continuing the relationship.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // ASSESSMENT DOMAIN - Based on curriculum requirements
    {
      id: '6',
      domain: 'assessment',
      question: 'A 10-year-old boy has a Total Difficulties scale score on the SDQ at the 91st percentile. What is the most appropriate next step?',
      answer: 'Work with the parents to better understand this high score. The SDQ is a broad screening test and a more comprehensive assessment is required to inform treatment options.',
      options: [
        'Work with the school to develop positive behaviour plan',
        'Work with the parents to better understand this high score',
        'Work with the parents to build on the high strengths of this child',
        'Work with the school to better manage this conduct disordered child',
        'Immediately refer for psychiatric evaluation'
      ],
      correctOption: 1,
      category: 'Screening Assessment',
      difficulty: 'medium',
      explanation: 'The SDQ is a broad screening test for emotional and behavioural strengths and difficulties. A score at the 91st percentile indicates difficulties requiring comprehensive assessment before intervention planning.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '7',
      domain: 'assessment',
      question: 'What is the primary purpose of the WAIS-IV?',
      answer: 'To measure cognitive ability and intelligence in adults aged 16-90, providing a comprehensive assessment of intellectual functioning across multiple domains.',
      options: [
        'To diagnose learning disabilities',
        'To measure cognitive ability and intelligence in adults aged 16-90',
        'To assess personality traits',
        'To screen for mental health disorders',
        'To evaluate memory functioning'
      ],
      correctOption: 1,
      category: 'Cognitive Assessment',
      difficulty: 'easy',
      explanation: 'The WAIS-IV provides Full Scale IQ, Verbal Comprehension, Perceptual Reasoning, Working Memory, and Processing Speed indices for comprehensive intellectual assessment.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '8',
      domain: 'assessment',
      question: 'What does the DASS-42 measure?',
      answer: 'Depression, Anxiety, and Stress Scale - a 42-item self-report measure that assesses the severity of depression, anxiety, and stress symptoms.',
      options: [
        'Only depression symptoms',
        'Depression, Anxiety, and Stress Scale - a 42-item self-report measure',
        'Personality traits and characteristics',
        'Cognitive functioning and intelligence',
        'Social skills and relationships'
      ],
      correctOption: 1,
      category: 'Mood Assessment',
      difficulty: 'medium',
      explanation: 'The DASS-42 provides separate scores for depression, anxiety, and stress domains and is widely used in clinical and research settings for screening and outcome measurement.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '9',
      domain: 'assessment',
      question: 'What are the key considerations when selecting an assessment tool?',
      answer: 'Psychometric properties (reliability, validity), cultural appropriateness, client characteristics, purpose of assessment, and practical considerations (time, cost, training requirements).',
      options: [
        'Only the cost and availability of the test',
        'Psychometric properties, cultural appropriateness, client characteristics, purpose, and practical considerations',
        'Only the psychologist\'s familiarity with the test',
        'Only the time required to administer',
        'Only whether the test has Australian norms'
      ],
      correctOption: 1,
      category: 'Assessment Selection',
      difficulty: 'hard',
      explanation: 'Test selection must be evidence-based and client-centered, considering psychometric properties, cultural appropriateness, and practical factors to ensure valid and reliable assessment.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '10',
      domain: 'assessment',
      question: 'What is the minimum duration required for a diagnosis of Major Depressive Disorder according to DSM-5?',
      answer: 'According to DSM-5, symptoms must be present for at least 2 weeks for a diagnosis of Major Depressive Disorder.',
      options: [
        '1 week',
        '2 weeks',
        '1 month',
        '3 months',
        '6 months'
      ],
      correctOption: 1,
      category: 'DSM-5',
      difficulty: 'medium',
      explanation: 'The 2-week duration criterion helps distinguish depression from normal mood fluctuations and is essential for accurate diagnosis.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // INTERVENTIONS DOMAIN - Based on curriculum and sample questions
    {
      id: '11',
      domain: 'interventions',
      question: 'An 18-year-old woman is ambivalent about addressing her social anxiety and wants to focus on her insomnia instead. What is the psychologist\'s most appropriate response?',
      answer: 'Explore the reasons for the client\'s ambivalence in order to maintain a good therapeutic alliance. This helps assess specific issues and strengthens client engagement.',
      options: [
        'Utilise motivational interviewing to address the client\'s ambivalence',
        'Acknowledge the client\'s ambivalence but continue with the treatment plan for social anxiety',
        'Refer the client to another psychologist because of her ambivalence',
        'Change the focus of treatment and work with the client on her insomnia problem',
        'Explore the reasons for the client\'s ambivalence in order to maintain a good therapeutic alliance'
      ],
      correctOption: 4,
      category: 'Therapeutic Alliance',
      difficulty: 'medium',
      explanation: 'Exploring ambivalence helps assess specific issues and maintains therapeutic alliance, which is critical for client engagement and good outcomes.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '12',
      domain: 'interventions',
      question: 'What are the core principles of Cognitive Behavioral Therapy (CBT)?',
      answer: 'Thoughts influence emotions and behaviors, cognitive distortions can be identified and modified, and behavioral changes can improve mood and functioning.',
      options: [
        'Only focusing on past experiences and childhood trauma',
        'Thoughts influence emotions and behaviors, cognitive distortions can be identified and modified',
        'Only using medication in combination with therapy',
        'Only working with the unconscious mind',
        'Only focusing on behavioral changes without addressing thoughts'
      ],
      correctOption: 1,
      category: 'CBT',
      difficulty: 'medium',
      explanation: 'CBT focuses on the relationship between thoughts, emotions, and behaviors, with emphasis on identifying and modifying cognitive distortions and implementing behavioral changes.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '13',
      domain: 'interventions',
      question: 'What is the difference between SSRIs and SNRIs?',
      answer: 'SSRIs (Selective Serotonin Reuptake Inhibitors) primarily affect serotonin, while SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors) affect both serotonin and norepinephrine.',
      options: [
        'SSRIs are more effective than SNRIs for all conditions',
        'SSRIs primarily affect serotonin, while SNRIs affect both serotonin and norepinephrine',
        'SNRIs are only used for anxiety disorders',
        'SSRIs are only used for depression',
        'There is no difference between SSRIs and SNRIs'
      ],
      correctOption: 1,
      category: 'Psychopharmacology',
      difficulty: 'hard',
      explanation: 'SSRIs primarily affect serotonin reuptake, while SNRIs affect both serotonin and norepinephrine reuptake, which may make them more effective for certain conditions.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '14',
      domain: 'interventions',
      question: 'What are the stages of change in the Transtheoretical Model?',
      answer: 'Precontemplation, Contemplation, Preparation, Action, Maintenance, and Relapse (though relapse is not always inevitable).',
      options: [
        'Only Preparation, Action, and Maintenance',
        'Precontemplation, Contemplation, Preparation, Action, Maintenance, and Relapse',
        'Only Action and Maintenance',
        'Only Contemplation and Action',
        'Only Preparation and Action'
      ],
      correctOption: 1,
      category: 'Motivational Interviewing',
      difficulty: 'medium',
      explanation: 'Understanding these stages helps tailor interventions to client readiness and provides a framework for understanding the change process.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '15',
      domain: 'interventions',
      question: 'What is the primary goal of motivational interviewing?',
      answer: 'To resolve ambivalence and increase motivation for change through collaborative conversation. It is client-centered and non-confrontational.',
      options: [
        'To persuade clients to change',
        'To resolve ambivalence and increase motivation for change',
        'To provide education about health risks',
        'To establish treatment goals',
        'To confront client resistance'
      ],
      correctOption: 1,
      category: 'Motivational Interviewing',
      difficulty: 'medium',
      explanation: 'Motivational interviewing aims to help clients resolve ambivalence and increase their intrinsic motivation for change through collaborative, client-centered conversation.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // COMMUNICATION DOMAIN - Based on curriculum and sample questions
    {
      id: '16',
      domain: 'communication',
      question: 'A psychologist is providing consulting services to a manager who suggests using email for regular contact. How should the psychologist address concerns about electronic communication?',
      answer: 'Discuss the issue of confidentiality before engaging in email consulting. This proactively addresses foreseeable risks of breaches of confidentiality.',
      options: [
        'Ensure the latest encryption protocols are installed on the psychologist\'s email',
        'Include a disclaimer in every electronic communication with the client',
        'Discuss the issue of confidentiality before engaging in email consulting',
        'Insist that the client obtain permission before forwarding any email communication',
        'Keep copies of all electronic communications with the client'
      ],
      correctOption: 2,
      category: 'Electronic Communication',
      difficulty: 'medium',
      explanation: 'Client confidentiality must be protected. The psychologist should proactively address all issues if there are foreseeable risks of breaches of confidentiality and seek appropriate solutions.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '17',
      domain: 'communication',
      question: 'What should be included in the recommendations section of a psychological report?',
      answer: 'Specific, actionable recommendations based on assessment findings, including treatment, educational, and practical suggestions tailored to the client\'s specific needs.',
      options: [
        'Only treatment recommendations',
        'Specific, actionable recommendations based on assessment findings',
        'General advice for the client',
        'Only diagnostic impressions',
        'Only test scores and interpretations'
      ],
      correctOption: 1,
      category: 'Report Writing',
      difficulty: 'medium',
      explanation: 'Recommendations should be specific, actionable, and directly related to the assessment findings, including treatment, educational, and practical suggestions.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '18',
      domain: 'communication',
      question: 'What is cultural responsiveness in psychological practice?',
      answer: 'Understanding and respecting cultural differences, adapting interventions to cultural contexts, and being aware of one\'s own cultural biases and assumptions.',
      options: [
        'Only working with clients from the same cultural background',
        'Understanding and respecting cultural differences, adapting interventions to cultural contexts',
        'Only using Western therapeutic techniques',
        'Only referring clients to culturally-specific services',
        'Only working with interpreters when needed'
      ],
      correctOption: 1,
      category: 'Cultural Competence',
      difficulty: 'medium',
      explanation: 'Cultural responsiveness is essential for effective assessment and treatment, requiring ongoing learning and self-reflection about cultural biases and assumptions.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '19',
      domain: 'communication',
      question: 'What are the requirements for record keeping in psychology?',
      answer: 'Accurate, timely, and complete records that include client information, assessment data, treatment plans, progress notes, and termination summaries, maintained securely for required time periods.',
      options: [
        'Only basic client contact information',
        'Accurate, timely, and complete records including client information, assessment data, treatment plans, and progress notes',
        'Only session notes and treatment plans',
        'Only diagnostic information and test scores',
        'Only billing and payment records'
      ],
      correctOption: 1,
      category: 'Record Keeping',
      difficulty: 'easy',
      explanation: 'Records must be accurate, timely, complete, and secure, including comprehensive client information, assessment data, treatment plans, and progress notes.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '20',
      domain: 'communication',
      question: 'How long should psychological records be retained?',
      answer: 'Most jurisdictions require psychological records to be retained for 7 years after the last professional contact, though requirements may vary.',
      options: [
        'Until the client turns 18',
        'For 7 years after the last contact',
        'For 3 years after termination',
        'Indefinitely',
        'Only until the client requests destruction'
      ],
      correctOption: 1,
      category: 'Record Keeping',
      difficulty: 'easy',
      explanation: 'This ensures records are available for legal and professional purposes while balancing privacy concerns.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // Additional comprehensive questions based on curriculum
    // ETHICS - Additional Questions
    {
      id: '21',
      domain: 'ethics',
      question: 'What is the psychologist\'s responsibility regarding professional boundaries?',
      answer: 'Psychologists must maintain clear professional boundaries to preserve the therapeutic relationship and avoid conflicts of interest, including avoiding dual relationships.',
      options: [
        'Only avoid romantic relationships with clients',
        'Maintain clear professional boundaries to preserve the therapeutic relationship and avoid conflicts of interest',
        'Only avoid financial relationships with clients',
        'Only avoid social relationships with clients',
        'Professional boundaries are not important in psychology'
      ],
      correctOption: 1,
      category: 'Professional Boundaries',
      difficulty: 'medium',
      explanation: 'Professional boundaries are essential for maintaining the integrity of the therapeutic relationship and ensuring client welfare.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '22',
      domain: 'ethics',
      question: 'What should a psychologist do if they suspect a colleague is practicing unethically?',
      answer: 'The psychologist should first attempt to resolve the issue directly with the colleague, and if unsuccessful, report concerns to the appropriate regulatory body.',
      options: [
        'Ignore the situation to avoid conflict',
        'First attempt to resolve directly with the colleague, then report to regulatory body if unsuccessful',
        'Immediately report to the media',
        'Only discuss with other colleagues',
        'Confront the colleague publicly'
      ],
      correctOption: 1,
      category: 'Professional Responsibility',
      difficulty: 'hard',
      explanation: 'Psychologists have a responsibility to address unethical behavior while following proper procedures and protecting client welfare.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '23',
      domain: 'ethics',
      question: 'What is the psychologist\'s obligation regarding cultural competence?',
      answer: 'Psychologists must develop cultural responsiveness when working with diverse groups, including Aboriginal and Torres Strait Islander peoples.',
      options: [
        'Only work with clients from their own cultural background',
        'Develop cultural responsiveness when working with diverse groups',
        'Only use Western therapeutic approaches',
        'Refer all culturally diverse clients to specialists',
        'Cultural competence is not required'
      ],
      correctOption: 1,
      category: 'Cultural Competence',
      difficulty: 'medium',
      explanation: 'Cultural competence is essential for effective psychological practice and is a requirement of the APS Code of Ethics.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // ASSESSMENT - Additional Questions
    {
      id: '24',
      domain: 'assessment',
      question: 'What is the primary purpose of the WISC-V?',
      answer: 'To measure cognitive ability in children aged 6-16, providing similar indices to WAIS-IV but normed for children.',
      options: [
        'To assess personality in children',
        'To measure cognitive ability in children aged 6-16',
        'To diagnose learning disabilities only',
        'To assess emotional functioning',
        'To screen for behavioral problems'
      ],
      correctOption: 1,
      category: 'Cognitive Assessment',
      difficulty: 'medium',
      explanation: 'The WISC-V is specifically designed for children and provides age-appropriate cognitive assessment with child-specific norms.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '25',
      domain: 'assessment',
      question: 'What does the PAI (Personality Assessment Inventory) measure?',
      answer: 'A 344-item self-report personality measure with 22 scales assessing clinical syndromes, treatment considerations, interpersonal style, and validity.',
      options: [
        'Only depression and anxiety',
        'A 344-item self-report personality measure with 22 scales',
        'Only cognitive functioning',
        'Only behavioral problems',
        'Only social skills'
      ],
      correctOption: 1,
      category: 'Personality Assessment',
      difficulty: 'hard',
      explanation: 'The PAI provides comprehensive personality assessment with multiple clinical and validity scales for treatment planning.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '26',
      domain: 'assessment',
      question: 'What is the K-10 used for?',
      answer: 'A 10-item screening measure for psychological distress, used in primary care and research settings to identify individuals needing mental health services.',
      options: [
        'To diagnose mental disorders',
        'A 10-item screening measure for psychological distress',
        'To assess personality traits',
        'To measure intelligence',
        'To evaluate memory functioning'
      ],
      correctOption: 1,
      category: 'Screening',
      difficulty: 'easy',
      explanation: 'The K-10 is a quick screening tool ideal for busy clinical settings to identify individuals who may need further mental health assessment.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '27',
      domain: 'assessment',
      question: 'What are the key criteria for Major Depressive Disorder according to DSM-5?',
      answer: '5+ symptoms during 2-week period, including depressed mood or loss of interest/pleasure, causing significant distress or impairment.',
      options: [
        'Only depressed mood for 2 weeks',
        '5+ symptoms during 2-week period, including depressed mood or loss of interest/pleasure',
        'Only sleep problems and fatigue',
        'Only thoughts of death or suicide',
        'Only weight loss or gain'
      ],
      correctOption: 1,
      category: 'DSM-5',
      difficulty: 'medium',
      explanation: 'The DSM-5 requires specific symptom criteria and duration for accurate diagnosis of Major Depressive Disorder.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '28',
      domain: 'assessment',
      question: 'What is the primary purpose of risk assessment in psychological practice?',
      answer: 'To assess risk of suicide, self-harm, and harm to others (acute and chronic) to inform safety planning and intervention.',
      options: [
        'Only to assess suicide risk',
        'To assess risk of suicide, self-harm, and harm to others',
        'Only to assess violence risk',
        'Only to assess self-harm risk',
        'Risk assessment is not required'
      ],
      correctOption: 1,
      category: 'Risk Assessment',
      difficulty: 'medium',
      explanation: 'Comprehensive risk assessment is essential for client safety and appropriate intervention planning.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // INTERVENTIONS - Additional Questions
    {
      id: '29',
      domain: 'interventions',
      question: 'What is Dialectical Behavior Therapy (DBT) primarily used for?',
      answer: 'Comprehensive treatment for borderline personality disorder and other conditions, combining cognitive-behavioral techniques with mindfulness and acceptance strategies.',
      options: [
        'Only for depression',
        'Comprehensive treatment for borderline personality disorder and other conditions',
        'Only for anxiety disorders',
        'Only for substance use disorders',
        'Only for eating disorders'
      ],
      correctOption: 1,
      category: 'DBT',
      difficulty: 'hard',
      explanation: 'DBT combines cognitive-behavioral techniques with mindfulness and acceptance strategies in four modules: mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '30',
      domain: 'interventions',
      question: 'What are the key components of exposure therapy?',
      answer: 'Systematic exposure to feared stimuli or situations, either in vivo (real life) or imaginal, to reduce anxiety and avoidance behaviors.',
      options: [
        'Only talking about fears',
        'Systematic exposure to feared stimuli or situations, either in vivo or imaginal',
        'Only medication treatment',
        'Only relaxation techniques',
        'Only cognitive restructuring'
      ],
      correctOption: 1,
      category: 'Exposure Therapy',
      difficulty: 'medium',
      explanation: 'Exposure therapy is a key component of CBT for anxiety disorders, helping clients confront fears in a controlled, systematic manner.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '31',
      domain: 'interventions',
      question: 'What is the primary purpose of behavioral activation?',
      answer: 'To increase engagement in positive, rewarding activities to improve mood and reduce depressive symptoms.',
      options: [
        'Only to reduce anxiety',
        'To increase engagement in positive, rewarding activities to improve mood',
        'Only to improve sleep',
        'Only to reduce stress',
        'Only to improve relationships'
      ],
      correctOption: 1,
      category: 'Behavioral Activation',
      difficulty: 'medium',
      explanation: 'Behavioral activation is an evidence-based treatment for depression that focuses on increasing positive reinforcement through activity scheduling.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '32',
      domain: 'interventions',
      question: 'What are the common side effects of SSRIs?',
      answer: 'Common side effects include gastrointestinal upset, sexual dysfunction, sleep disturbances, and initial increase in anxiety.',
      options: [
        'Only weight gain',
        'Gastrointestinal upset, sexual dysfunction, sleep disturbances, and initial increase in anxiety',
        'Only drowsiness',
        'Only increased appetite',
        'Only dry mouth'
      ],
      correctOption: 1,
      category: 'Psychopharmacology',
      difficulty: 'medium',
      explanation: 'Understanding common side effects is essential for monitoring client response and managing expectations about medication treatment.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },

    // COMMUNICATION - Additional Questions
    {
      id: '33',
      domain: 'communication',
      question: 'What are the essential elements of a psychological report?',
      answer: 'Identifying information, referral question, background information, assessment methods, results, interpretation, recommendations, and signature with credentials.',
      options: [
        'Only test scores and interpretation',
        'Identifying information, referral question, background, assessment methods, results, interpretation, recommendations, and signature',
        'Only recommendations and signature',
        'Only background and results',
        'Only interpretation and recommendations'
      ],
      correctOption: 1,
      category: 'Report Writing',
      difficulty: 'medium',
      explanation: 'Comprehensive psychological reports must include all essential elements to provide complete and professional documentation.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '34',
      domain: 'communication',
      question: 'What is the psychologist\'s responsibility regarding referral procedures?',
      answer: 'To understand the roles of other professionals at all levels of care, and health care system procedures and structures for appropriate referrals.',
      options: [
        'Only refer to psychiatrists',
        'Understand roles of other professionals and health care system procedures for appropriate referrals',
        'Only refer to other psychologists',
        'Only refer to general practitioners',
        'Referral procedures are not important'
      ],
      correctOption: 1,
      category: 'Referral Procedures',
      difficulty: 'medium',
      explanation: 'Understanding the health care system and professional roles is essential for effective client care and appropriate referrals.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    },
    {
      id: '35',
      domain: 'communication',
      question: 'What should a psychologist consider when working with Aboriginal and Torres Strait Islander clients?',
      answer: 'Cultural responsiveness including understanding historical context, cultural practices, and adapting interventions to cultural contexts.',
      options: [
        'Only use Western therapeutic approaches',
        'Cultural responsiveness including understanding historical context and cultural practices',
        'Only refer to Indigenous health services',
        'Only work with interpreters',
        'Cultural considerations are not necessary'
      ],
      correctOption: 1,
      category: 'Cultural Competence',
      difficulty: 'hard',
      explanation: 'Cultural responsiveness is essential when working with Aboriginal and Torres Strait Islander clients, requiring understanding of historical and cultural contexts.',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    }
  ]

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500' },
    { id: 'ethics', name: 'Ethics', color: 'bg-blue-500' },
    { id: 'assessment', name: 'Assessment', color: 'bg-green-500' },
    { id: 'interventions', name: 'Interventions', color: 'bg-purple-500' },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500' }
  ]

  useEffect(() => {
    // Load saved flashcards from localStorage or use sample data
    const savedFlashcards = localStorage.getItem('flashcards')
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards))
    } else {
      setFlashcards(sampleFlashcards)
      localStorage.setItem('flashcards', JSON.stringify(sampleFlashcards))
    }
  }, [])

  const filteredCards = flashcards.filter(card => {
    const matchesDomain = selectedDomain === 'all' || card.domain === selectedDomain
    const matchesSearch = searchQuery === '' || 
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = filterByDifficulty === 'all' || card.difficulty === filterByDifficulty
    const matchesBookmark = !showBookmarkedOnly || card.isBookmarked

    return matchesDomain && matchesSearch && matchesDifficulty && matchesBookmark
  })

  const currentCard = filteredCards[currentCardIndex]

  const handleNext = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMasteryRating = (rating: number) => {
    if (!currentCard) return

    // Update mastery level and schedule next review based on spaced repetition
    const updatedCards = [...flashcards]
    const cardIndex = updatedCards.findIndex(card => card.id === currentCard.id)
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex].masteryLevel = rating
      updatedCards[cardIndex].reviewCount += 1
      updatedCards[cardIndex].lastReviewed = new Date()
      
      // Calculate next review date based on mastery level
      const daysUntilNextReview = rating <= 2 ? 1 : rating === 3 ? 3 : rating === 4 ? 7 : 14
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + daysUntilNextReview)
      updatedCards[cardIndex].nextReview = nextReview
      
      // Save to localStorage
      localStorage.setItem('flashcards', JSON.stringify(updatedCards))
      setFlashcards(updatedCards)
      
      // Update app data
      const newStudyStats = { ...appData.studyStats }
      newStudyStats.totalHours += 0.1 // Add 6 minutes of study time
      updateAppData({ 
        studyStats: newStudyStats,
        flashcardProgress: { flashcards: updatedCards }
      })
      
      // Move to next card
      handleNext()
    }
  }

  const toggleBookmark = () => {
    if (!currentCard) return

    const updatedCards = [...flashcards]
    const cardIndex = updatedCards.findIndex(card => card.id === currentCard.id)
    
    if (cardIndex !== -1) {
      updatedCards[cardIndex].isBookmarked = !updatedCards[cardIndex].isBookmarked
      localStorage.setItem('flashcards', JSON.stringify(updatedCards))
      setFlashcards(updatedCards)
    }
  }

  const resetProgress = () => {
    const resetCards = flashcards.map(card => ({
      ...card,
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      masteryLevel: 0
    }))
    localStorage.setItem('flashcards', JSON.stringify(resetCards))
    setFlashcards(resetCards)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  if (filteredCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Available</h2>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
              <p className="text-gray-600 mt-1">Spaced repetition learning system</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {currentCardIndex + 1} of {filteredCards.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Domain Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value)
                  setCurrentCardIndex(0)
                  setIsFlipped(false)
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>{domain.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={filterByDifficulty}
                onChange={(e) => {
                  setFilterByDifficulty(e.target.value)
                  setCurrentCardIndex(0)
                  setIsFlipped(false)
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Bookmarked Only */}
            <button
              onClick={() => {
                setShowBookmarkedOnly(!showBookmarkedOnly)
                setCurrentCardIndex(0)
                setIsFlipped(false)
              }}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                showBookmarkedOnly
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarked Only</span>
            </button>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    currentCard.domain === 'ethics' ? 'bg-blue-500' :
                    currentCard.domain === 'assessment' ? 'bg-green-500' :
                    currentCard.domain === 'interventions' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                    {currentCard.domain.charAt(0).toUpperCase() + currentCard.domain.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {currentCard.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                      currentCard.isBookmarked
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" fill={currentCard.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    currentCard.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="min-h-[300px] flex items-center justify-center">
                <div className="text-center max-w-2xl w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {isFlipped ? 'Answer' : 'Question'}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {currentCard.question}
                  </p>
                  
                  {/* Multiple Choice Options */}
                  {currentCard.options && (
                    <div className="space-y-3 text-left">
                      {currentCard.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            isFlipped && index === currentCard.correctOption
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isFlipped && index === currentCard.correctOption
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-gray-300'
                            }`}>
                              {isFlipped && index === currentCard.correctOption && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </div>
                            <span className="text-gray-900">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Answer Explanation */}
                  {isFlipped && currentCard.explanation && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                      <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800">{currentCard.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleFlip}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{isFlipped ? 'Show Question' : 'Show Answer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Rating */}
        {isFlipped && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              How well did you know this?
            </h3>
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleMasteryRating(rating)}
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-2xl">
                    {rating <= 2 ? '😞' : rating === 3 ? '😐' : rating === 4 ? '🙂' : '😄'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                </button>
              ))}
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              1 = Not at all, 5 = Completely mastered
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={resetProgress}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reset Progress
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentCardIndex === filteredCards.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stats */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {flashcards.filter(card => card.masteryLevel >= 4).length}
              </p>
              <p className="text-sm text-gray-500">Mastered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {flashcards.filter(card => card.masteryLevel >= 2 && card.masteryLevel < 4).length}
              </p>
              <p className="text-sm text-gray-500">Learning</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {flashcards.filter(card => card.masteryLevel < 2).length}
              </p>
              <p className="text-sm text-gray-500">Needs Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {flashcards.filter(card => card.isBookmarked).length}
              </p>
              <p className="text-sm text-gray-500">Bookmarked</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 