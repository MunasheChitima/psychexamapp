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

export const interventionsQuestions: PracticeQuestion[] = [
  {
    id: 'iq-001', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'A client with OCD presents with fears of contamination. He spends several hours a day washing his hands to the point of skin irritation.',
    question: 'What is the most appropriate first-line behavioral intervention for this client?',
    options: ['Cognitive restructuring of beliefs about germs', 'Exposure and Response Prevention (ERP)', 'Relaxation training to manage anxiety', 'Thought stopping when the urge to wash arises', 'Social skills training'],
    correctAnswer: 1,
    distractorRationale: ['Cognitive work is useful but secondary to ERP in OCD.', 'Correct — ERP is the gold standard.', 'Relaxation doesn\'t address the core mechanism.', 'Thought stopping is ineffective.', 'Social skills are not the primary issue.'],
    explanation: 'ERP is the gold standard for OCD. It involves exposing the client to the feared stimulus (germs) while preventing the ritual (washing).',
    references: ['APS Evidence-Based Interventions', 'NICE Guidelines'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-002', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'A client with depression reports that she has stopped seeing friends because she feels she is "no fun to be around."',
    question: 'Which CBT technique would be most appropriate to address this withdrawal?',
    options: ['Dream analysis', 'Behavioral Activation (BA)', 'Systematic desensitization', 'Flooding', 'Aversion therapy'],
    correctAnswer: 1,
    distractorRationale: ['Dream analysis is not CBT.', 'Correct — BA addresses the cycle of inactivity and low mood.', 'Systematic desensitization is for phobias.', 'Flooding is too intense and not for depression.', 'Aversion therapy is for behavior reduction.'],
    explanation: 'Behavioral Activation is a core CBT intervention for depression, focusing on increasing engagement in pleasurable and mastery-oriented activities.',
    references: ['Martell et al. (2010)', 'CBT for Depression Protocols'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-003', domain: 'interventions', category: 'Motivational Interviewing', difficulty: 'hard',
    caseStudy: 'A client being treated for alcohol dependence says: "I know I drink too much, but it\'s the only thing that helps me relax after a long day."',
    question: 'Which of the following responses is an example of "Reflecting Ambivalence" in MI?',
    options: ['"You really should find a healthier way to relax."', '"On the one hand, you recognize the negative impact of your drinking, but on the other hand, it feels like an essential way to cope with stress."', '"Why do you think drinking is the only way to relax?"', '"Your liver is going to fail if you don\'t stop."', '"Let\'s talk about your childhood stressors instead."'],
    correctAnswer: 1,
    distractorRationale: ['This is advice-giving, which MI avoids.', 'Correct — This is a classic "double-sided reflection" that highlights ambivalence.', 'This "why" question can be confrontational.', 'This is a scare tactic.', 'This is avoiding the here-and-now behavior.'],
    explanation: 'Reflecting ambivalence using double-sided reflections helps the client see both sides of their conflict without the therapist taking a side.',
    references: ['Miller & Rollnick (2012)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-004', domain: 'interventions', category: 'DBT', difficulty: 'hard',
    caseStudy: 'Dialectical Behavior Therapy (DBT) is used for complex cases.',
    question: 'In DBT, the "Dialectic" refers to the balance between:',
    options: ['Past and Future', 'Thoughts and Feelings', 'Acceptance and Change', 'Psychology and Biology', 'Individual and Society'],
    correctAnswer: 2,
    distractorRationale: ['Irrelevant to the core DBT dialectic.', 'This is general CBT.', 'Correct — DBT fundamentally balances validation (acceptance) with behavioral change.', 'Internal vs External, not the core dialectic.', 'Sociological vs Psychological, not the focus.'],
    explanation: 'DBT is based on the dialectic of accepting the client as they are while simultaneously helping them change their behaviors.',
    references: ['Linehan (1993)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-005', domain: 'interventions', category: 'ACT', difficulty: 'medium',
    caseStudy: 'ACT focus on psychological flexibility.',
    question: 'What is the primary goal of "Cognitive Defusion" in Acceptance and Commitment Therapy (ACT)?',
    options: ['To eliminate negative thoughts entirely', 'To replace negative thoughts with positive ones', 'To see thoughts as mere language/events rather than literal truths', 'To analyze the childhood origins of thoughts', 'To ignore thoughts during meditation'],
    correctAnswer: 2,
    distractorRationale: ['ACT doesn\'t aim to eliminate thoughts.', 'This is traditional cognitive restructuring, not ACT.', 'Correct — Defusion is about changing the relationship to thoughts.', 'ACT is not psychoanalytic.', 'ACT involves mindful awareness, not ignoring.'],
    explanation: 'Cognitive defusion involves techniques to reduce the "literal" quality of thoughts, helping clients detach from their content.',
    references: ['Hayes et al. (2011)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-006', domain: 'interventions', category: 'Ethics', difficulty: 'hard',
    caseStudy: 'A psychologist is providing therapy to a client when they realize they have a mutual close friend. This was not known at the start of therapy.',
    question: 'What is the most appropriate step for the psychologist to take?',
    options: ['Immediately terminate and refer without explanation', 'Discuss the potential conflict with the client and consider the impact on the therapeutic relationship', 'Tell the mutual friend about the client in the hope of improving therapy', 'Continue as if nothing happened to avoid awkwardness', 'Ask the mutual friend for advice on the client'],
    correctAnswer: 1,
    distractorRationale: ['Termination should be managed, not abrupt.', 'Correct — Transparancy and ethical reflection on dual relationships/conflicts of interest are required.', 'This breaches confidentiality.', 'This ignores a potential boundary issue.', 'This breaches confidentiality.'],
    explanation: 'When a potential conflict of interest or dual relationship arises, it must be addressed openly with the client, and supervision should be sought.',
    references: ['APS Code of Ethics', 'Ethical Guidelines on Boundaries'],
    questionType: 'complex-vignette'
  },
  {
    id: 'iq-007', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'During a CBT session, a client identifies the thought "I am incompetent" after receiving some constructive criticism at work.',
    question: 'Which technique would be most appropriate for evaluating this automatic thought?',
    options: ['Socratic questioning/Evidence for/against', 'Aversion therapy', 'Free association', 'Hypnosis', 'Flooding'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Socratic questioning is the standard way to evaluate automatic thoughts.', 'Aversion is for behavior reduction.', 'Free association is psychodynamic.', 'Hypnosis is not a core CBT technique.', 'Flooding is for exposure.'],
    explanation: 'Examining the evidence for and against a thought is a classic cognitive restructuring technique in CBT.',
    references: ['Beck (2011)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-008', domain: 'interventions', category: 'Family Therapy', difficulty: 'medium',
    caseStudy: 'Family therapy looks at systems.',
    question: 'In systems theory, "Homeostasis" refers to:',
    options: ['The tendency of a family system to resist change and maintain its current state', 'The ability of a family to change quickly', 'The process of individual development within a family', 'The impact of genetics on family behavior', 'The physical health of family members'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Homeostasis is the self-regulating mechanism that keeps the system stable.', 'Change is the opposite of homeostasis.', 'This is individual, not systemic.', 'Biological, not systemic theory.', 'Physical, not psychological system.'],
    explanation: 'Family systems often develop patterns that resist change, even when those patterns are maladaptive.',
    references: ['Family Systems Theory'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-009', domain: 'interventions', category: 'Psychopharmacology', difficulty: 'hard',
    caseStudy: 'MAOIs are older antidepressants.',
    question: 'A client taking an MAOI antidepressant must avoid foods high in tyramine (like aged cheese) to prevent:',
    options: ['Serotonin syndrome', 'A hypertensive crisis', 'Weight gain', 'Insomnia', 'Hair loss'],
    correctAnswer: 1,
    distractorRationale: ['Related to SSRIs/MAOI combinations, but tyramine specifically causes hypertension.', 'Correct — Tyramine and MAOIs interact to cause dangerous spikes in blood pressure.', 'Not the primary acute risk.', 'Possible but not the critical risk.', 'Not an established side effect of this interaction.'],
    explanation: 'The "cheese effect" is a well-known risk for older MAOIs, potentially leading to stroke or death due to high blood pressure.',
    references: ['Psychopharmacology Basics'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-010', domain: 'interventions', category: 'Psychopharmacology', difficulty: 'medium',
    caseStudy: 'Mood stabilization is key in Bipolar disorder.',
    question: 'Which medication is commonly used as a "mood stabilizer" in the treatment of Bipolar Disorder?',
    options: ['Diazepam', 'Lithium', 'Fluoxetine', 'Methylphenidate', 'Chlorpromazine'],
    correctAnswer: 1,
    distractorRationale: ['Anxiolytic (Benzodiazepine).', 'Correct — Lithium is the classic mood stabilizer.', 'Antidepressant (SSRI).', 'Stimulant.', 'Antipsychotic.'],
    explanation: 'Lithium has been used for decades as a first-line treatment for Bipolar Disorder and has strong evidence for reducing suicide risk.',
    references: ['Psychopharmacology for Bipolar Disorder'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-011', domain: 'interventions', category: 'Narrative Therapy', difficulty: 'medium',
    caseStudy: 'Externalization is a narrative technique.',
    question: 'In Narrative Therapy, "Externalizing the Problem" involves:',
    options: ['Blaming external factors for all problems', 'Speaking about the problem as a separate entity rather than an internal trait', 'Expressing feelings loudly', 'Involving external family members', 'Finding external hobbies'],
    correctAnswer: 1,
    distractorRationale: ['Not about blame, but about perspective.', 'Correct — e.g., "The Worry" instead of "I am an anxious person."', 'Not what it means.', 'May happen but not the definition.', 'Not the definition.'],
    explanation: 'Externalizing helps clients gain agency by realizing they are not their problem.',
    references: ['White & Epston (1990)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-012', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'A 38-year-old man has completed 12 sessions of CBT for depression and achieved significant improvement. He is about to complete therapy.',
    question: 'Which component is MOST essential to include in relapse prevention planning?',
    options: ['Reviewing all therapy session notes in detail', 'Identifying early warning signs and developing a written action plan', 'Scheduling indefinite monthly maintenance sessions', 'Providing emergency contact numbers only', 'Summarising all cognitive distortions'],
    correctAnswer: 1,
    distractorRationale: ['Too passive.', 'Correct — Identifying triggers and signs is the core of relapse prevention.', 'Promotes dependency.', 'Insufficient on its own.', 'Useful but not a "plan".'],
    explanation: 'Relapse prevention should be prospective and actionable, giving the client a clear path if symptoms return.',
    references: ['Beck (2011)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-013', domain: 'interventions', category: 'Supervision', difficulty: 'hard',
    caseStudy: 'A supervisee discloses feeling strong personal attraction to a client. They are distressed and have not acted on it.',
    question: 'What is the MOST appropriate supervisory response?',
    options: ['Immediately transfer the client', 'Normalise, explore the dynamics, and develop a management plan', 'Report the supervisee to the Board', 'Ignore it as a personal matter', 'End the supervision relationship'],
    correctAnswer: 1,
    distractorRationale: ['May be premature and punitive.', 'Correct — Supervision is for processing countertransference SAFELY.', 'Not a reportable offense if no ethics breach.', 'Dangerous to ignore.', 'Punishes honesty.'],
    explanation: 'A safe supervisory relationship allows for the processing of difficult countertransference, protecting the client and the supervisee.',
    references: ['Ethical Guidelines on Supervision'],
    questionType: 'complex-vignette'
  },
  {
    id: 'iq-014', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'A student with test anxiety reports catastrophic predictions: "I\'ll fail and ruin my life."',
    question: 'In CBT, which technique would be MOST effective for addressing her catastrophic predictions?',
    options: ['Muscle relaxation only', 'Cognitive restructuring (Downward Arrow)', 'Flooding', 'Dream analysis', 'Positive affirmations'],
    correctAnswer: 1,
    distractorRationale: ['Only treats physical symptoms.', 'Correct — Systematically unpacks the "so what if..." chain.', 'Too intense for this case.', 'Not CBT.', 'Ineffective for deep anxiety.'],
    explanation: 'The downward arrow helps uncover core fears and identify the leap from "failed test" to "ruined life".',
    references: ['Burns (1980)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-015', domain: 'interventions', category: 'Psychopharmacology', difficulty: 'medium',
    caseStudy: 'A client taking clonazepam for 8 months reporting needing higher doses for the same effect.',
    question: 'Which pharmacological concept does this scenario illustrate?',
    options: ['Alliance', 'Pharmacological tolerance', 'Placebo', 'Serotonin syndrome', 'Metabolism'],
    correctAnswer: 1,
    distractorRationale: ['Psychological, not pharmacological.', 'Correct — Tolerance is common with benzodiazepines.', 'Not relevant.', 'Incorrect med class.', 'Not the best fit.'],
    explanation: 'Benzodiazepines have a high risk of tolerance and dependence, making them unsuitable for long-term use for most people.',
    references: ['Stahl (2013)'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-016', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'A client with OCD reports intrusive thoughts about fire and checks the stove 10 times.',
    question: 'What is the most appropriate CBT intervention?',
    options: ['Exposure and Response Prevention (ERP)', 'Thought stopping', 'Cognitive restructuring only', 'Mindfulness only', 'Relaxation'],
    correctAnswer: 0,
    distractorRationale: ['Correct — ERP is the gold standard.', 'Ineffective.', 'Insufficient for compulsions.', 'Adjunctive but not primary.', 'Treats stress but not the OCD loop.'],
    explanation: 'ERP is the gold standard for OCD treatment.',
    references: ['NICE Guidelines'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-017', domain: 'interventions', category: 'Motivational Interviewing', difficulty: 'hard',
    caseStudy: 'Client: "I know drinking is bad for my liver, but it helps me relax."',
    question: 'Which MI technique is most appropriate to elicit change talk?',
    options: ['Developing discrepancy using decisional balance', 'Direct warning', 'Advice-giving', 'Asking why they haven\'t quit', 'Reflecting only the relaxation'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Highlighting the gap between behavior and health goals.', 'Triggers reactance.', 'Ineffective for ambivalence.', 'Confrontational.', 'Reinforces drinking.'],
    explanation: 'Developing discrepancy highlights conflicts between behavior and goals.',
    references: ['Miller & Rollnick'],
    questionType: 'evidence-based'
  },
  {
    id: 'iq-018', domain: 'interventions', category: 'DBT', difficulty: 'hard',
    caseStudy: 'Crisis management in DBT.',
    question: 'Which DBT skill is top priority for an immediate self-harm crisis?',
    options: ['TIPP skills', 'Interpersonal skills', 'Chain Analysis', 'Mindfulness', 'Wise Mind'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Immediate physiological regulation.', 'Not for crisis.', 'Retrospective.', 'Hard to use in peak arousal.', 'Long-term goal state.'],
    explanation: 'TIPP skills address physiological arousal immediately.',
    references: ['Linehan'],
    questionType: 'priority'
  },
  {
    id: 'iq-019', domain: 'interventions', category: 'Psychopharmacology', difficulty: 'medium',
    caseStudy: 'Client on lithium reports tremor and thirst.',
    question: 'What is the most important advice?',
    options: ['Maintain consistent salt/fluid intake and see GP', 'Stop immediately', 'Double the dose', 'Ignore it', 'Avoid salt'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Salt/water levels affect lithium toxicity.', 'Dangerous without supervision.', 'Extremely dangerous.', 'Could miss toxicity signs.', 'Will raise lithium levels dangerously.'],
    explanation: 'Lithium blood levels are highly sensitive to sodium and water balance.',
    references: ['Stahl'],
    questionType: 'priority'
  },
  {
    id: 'iq-020', domain: 'interventions', category: 'CBT', difficulty: 'medium',
    caseStudy: 'Cognitive distortions impact mood.',
    question: 'Missing one gym session and thinking "I am a total failure" is:',
    options: ['All-or-nothing thinking', 'Catastrophizing', 'Personalization', 'Emotional reasoning', 'Mental filter'],
    correctAnswer: 0,
    distractorRationale: ['Correct — Viewing things in black-and-white categories.', 'Expecting the worst possible outcome.', 'Taking blame for external events.', 'Assuming feelings are facts.', 'Focusing only on negatives.'],
    explanation: 'Black-and-white thinking ignores the middle ground.',
    references: ['Beck'],
    questionType: 'evidence-based'
  }
];

const interventionsFlashcardsRaw: FlashcardInput[] = [
  {
    id: 'if-001', domain: 'interventions',
    question: 'What is the gold standard CBT treatment for OCD?',
    answer: 'Exposure and Response Prevention (ERP).',
    category: 'CBT', difficulty: 'medium',
    explanation: 'ERP involves exposure to obsessive stimuli while strictly preventing the ritualized behavioral response.',
    references: ['NICE Guidelines']
  },
  {
    id: 'if-002', domain: 'interventions',
    question: 'What are the four modules of DBT?',
    answer: 'Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness.',
    category: 'DBT', difficulty: 'medium',
    explanation: 'These four pillars provide a toolkit for emotional dysregulation.',
    references: ['Linehan, M.']
  },
  {
    id: 'if-003', domain: 'interventions',
    question: 'In MI, what does "OARS" stand for?',
    answer: 'Open-ended questions, Affirmations, Reflections, and Summaries.',
    category: 'Motivational Interviewing', difficulty: 'easy',
    explanation: 'Fundamental micro-skills for building rapport and change talk.',
    references: ['Miller & Rollnick']
  },
  {
    id: 'if-004', domain: 'interventions',
    question: 'How do SSRIs work?',
    answer: 'They block the reabsorption of serotonin, making more available in the synapse.',
    category: 'Psychopharmacology', difficulty: 'medium'
  },
  {
    id: 'if-005', domain: 'interventions',
    question: 'What is the primary goal of Acceptance and Commitment Therapy (ACT)?',
    answer: 'To increase psychological flexibility.',
    category: 'ACT', difficulty: 'medium'
  },
  {
    id: 'if-006', domain: 'interventions',
    question: 'What are the three pillars of EBP?',
    answer: 'Best available research, clinical expertise, and client characteristics/preferences/culture.',
    category: 'EBP', difficulty: 'easy'
  },
  {
    id: 'if-007', domain: 'interventions',
    question: 'What is the "therapeutic window" for lithium?',
    answer: 'Narrow (approx. 0.6 to 1.2 mmol/L). Levels above 1.5 are toxic.',
    category: 'Psychopharmacology', difficulty: 'hard'
  },
  {
    id: 'if-008', domain: 'interventions',
    question: 'What is the difference between flooding and systematic desensitization?',
    answer: 'Flooding involves immediate exposure to high-intensity stimuli; systematic desensitization uses a slow hierarchy with relaxation.',
    category: 'Behavioral Therapy', difficulty: 'medium'
  }
];

export const interventionsFlashcards: Flashcard[] = interventionsFlashcardsRaw.map(c => ({
  ...c,
  lastReviewed: null,
  nextReview: null,
  reviewCount: 0,
  masteryLevel: 0,
  domain: c.domain as any
}))
