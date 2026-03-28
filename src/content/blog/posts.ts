export interface BlogSection {
  heading: string
  body: string[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  readingTimeMinutes: number
  keywords: string[]
  sections: BlogSection[]
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'nppes-2026-study-plan-australia',
    title: 'NPPE 2026 Study Plan for Australian Candidates',
    description: 'A practical week-by-week NPPE study plan for Australian psychology candidates balancing placement, work, and exam prep.',
    excerpt: 'Build a realistic plan that covers all NPPE domains without burning out.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 9,
    keywords: ['NPPE study plan', 'Australian psychology exam', 'AHPRA exam prep'],
    sections: [
      {
        heading: 'Start with your exam window, not your motivation',
        body: [
          'Reverse-plan from your exam date and define monthly milestones first. When candidates start with daily targets before setting milestones, they usually overcommit in week one and lose consistency in week three.',
          'A strong NPPE plan starts with four monthly checkpoints: content coverage, timed practice readiness, weak-area remediation, and final revision.'
        ]
      },
      {
        heading: 'Use the 40-40-20 split',
        body: [
          'Spend 40% of your study time on timed questions, 40% on reviewing explanations, and 20% on flashcards and rapid recall. This keeps your prep exam-relevant while still improving long-term retention.',
          'If you are under 8 weeks out, shift to a 50-35-15 split to prioritise exam-style pacing and error correction.'
        ]
      },
      {
        heading: 'Track domain confidence weekly',
        body: [
          'Use one confidence score per NPPE domain each week. If any domain trends down for two consecutive weeks, pause new content in that domain and run a focused remediation block.',
          'The goal is steady confidence convergence, not perfect scores in one area and neglect in another.'
        ]
      }
    ]
  },
  {
    slug: 'ahpra-registration-exam-prep-checklist',
    title: 'AHPRA Registration Exam Prep Checklist (NPPE)',
    description: 'Use this pre-exam checklist to avoid common preparation and admin mistakes before the NPPE.',
    excerpt: 'A practical checklist to keep your NPPE prep and admin on track.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 7,
    keywords: ['AHPRA checklist', 'NPPE checklist', 'exam registration Australia'],
    sections: [
      {
        heading: 'Administrative checks that protect your study time',
        body: [
          'Confirm your registration details, exam window, and key deadlines early. Admin uncertainty creates hidden stress that drains your study consistency.',
          'Set calendar reminders for all cutoffs so your final month can focus on performance, not paperwork.'
        ]
      },
      {
        heading: 'Resource checks',
        body: [
          'Use one core question bank, one flashcard routine, and one performance tracking view. Too many tools create context switching that looks productive but slows true progress.',
          'Define your weekly minimums: number of questions, number of reviews, and number of simulation blocks.'
        ]
      },
      {
        heading: 'Performance checks',
        body: [
          'By your final four weeks, you should be completing timed sets with stable pacing and decreasing unforced errors.',
          'Your checklist is complete when you can explain why an answer is correct, not just recall that it is.'
        ]
      }
    ]
  },
  {
    slug: 'nppe-ethics-domain-how-to-study',
    title: 'How to Study the NPPE Ethics Domain Efficiently',
    description: 'A focused approach to preparing for NPPE ethics questions with scenario analysis and decision frameworks.',
    excerpt: 'Improve ethics accuracy by training decision process, not memorisation alone.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 8,
    keywords: ['NPPE ethics', 'APS code exam prep', 'psychology ethics questions'],
    sections: [
      {
        heading: 'Train reasoning patterns',
        body: [
          'Ethics questions are often solved by process: identify the duty, assess risk, then choose the most defensible action.',
          'Create a short decision prompt you repeat for each scenario so your reasoning is consistent under time pressure.'
        ]
      },
      {
        heading: 'Review by error type',
        body: [
          'Classify errors as misread, knowledge gap, or judgement error. Ethics improvement accelerates when you fix judgement patterns rather than only re-reading source text.',
          'If you miss a scenario due to assumptions, rewrite the scenario in your own words before checking the explanation.'
        ]
      },
      {
        heading: 'Add short scenario drills',
        body: [
          'Run 10-15 question ethics blocks several times per week. Short blocks improve decision quality without adding fatigue from long sessions.',
          'Keep one running notebook of recurring principles to reinforce transfer across new scenarios.'
        ]
      }
    ]
  },
  {
    slug: 'nppe-assessment-domain-mistakes',
    title: 'Top Mistakes in the NPPE Assessment Domain',
    description: 'The most common assessment-domain mistakes and how to eliminate them before exam day.',
    excerpt: 'Avoid predictable mistakes in psychometrics, diagnostics, and risk interpretation.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 8,
    keywords: ['NPPE assessment', 'psychometrics exam prep', 'diagnostic reasoning'],
    sections: [
      {
        heading: 'Confusing test facts with interpretation',
        body: [
          'Candidates often remember definitions but miss interpretation nuances. Prioritise practice that asks what a result means clinically, not only what the measure is.',
          'Every review session should include one sentence connecting score patterns to practical decision-making.'
        ]
      },
      {
        heading: 'Ignoring contextual constraints',
        body: [
          'Assessment decisions in exam scenarios usually include context constraints such as safety, culture, or service limits. Missing these details drives avoidable errors.',
          'Train yourself to identify constraints before selecting interventions or conclusions.'
        ]
      },
      {
        heading: 'Fixing speed before accuracy',
        body: [
          'Pacing matters, but early speed training can lock in bad reasoning. Build accuracy first, then increase speed with timed blocks.',
          'A good progression is untimed review -> moderate timing -> full simulation.'
        ]
      }
    ]
  },
  {
    slug: 'nppe-interventions-domain-strategy',
    title: 'Interventions Domain Strategy for the NPPE',
    description: 'A practical strategy for intervention-focused NPPE questions, including treatment planning and clinical priorities.',
    excerpt: 'Use structured treatment logic to answer interventions questions faster and more accurately.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 8,
    keywords: ['NPPE interventions', 'treatment planning exam', 'clinical priorities'],
    sections: [
      {
        heading: 'Prioritise safety and fit',
        body: [
          'Many intervention items can be solved by identifying the safest and most context-appropriate next step first.',
          'When multiple options seem plausible, choose the one with the strongest immediate risk-benefit profile.'
        ]
      },
      {
        heading: 'Separate initiation from escalation',
        body: [
          'High-performing candidates distinguish first-line actions from escalation pathways. This prevents over-treatment answers and improves consistency.',
          'During review, tag questions by intervention stage to sharpen your decision boundaries.'
        ]
      },
      {
        heading: 'Rehearse explanation language',
        body: [
          'If you can explain your choice in one concise sentence, you likely understand the item. If not, revisit the reasoning process rather than memorising the option.',
          'Clear explanation skill translates directly to better exam performance under pressure.'
        ]
      }
    ]
  },
  {
    slug: 'nppe-communication-domain-quick-wins',
    title: 'NPPE Communication Domain: Quick Wins Before Exam Day',
    description: 'Fast improvements for communication-domain performance including consent, documentation, and interprofessional communication.',
    excerpt: 'Use high-yield communication drills to lift marks in the final month.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 6,
    keywords: ['NPPE communication', 'clinical communication exam', 'consent and documentation'],
    sections: [
      {
        heading: 'Standardise your communication checklist',
        body: [
          'Use a simple checklist for consent, clarity, and professional boundaries when evaluating communication scenarios.',
          'A repeatable checklist reduces cognitive load and helps you avoid missing key qualifiers.'
        ]
      },
      {
        heading: 'Train documentation judgement',
        body: [
          'Communication items often involve what to document and how. Focus on relevance, clarity, and defensibility rather than verbosity.',
          'Practice deciding what is essential in records across varied scenarios.'
        ]
      },
      {
        heading: 'Use short daily review blocks',
        body: [
          'Daily 15-minute communication drills are enough to maintain momentum and improve recall of high-yield principles.',
          'Consistency is more effective than occasional long sessions for this domain.'
        ]
      }
    ]
  },
  {
    slug: 'how-many-practice-questions-before-nppe',
    title: 'How Many Practice Questions Should You Do Before the NPPE?',
    description: 'A realistic benchmark for NPPE practice question volume and how to balance quantity with review quality.',
    excerpt: 'Question volume matters less than review depth and error correction quality.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 7,
    keywords: ['NPPE practice questions', 'exam question volume', 'psychology exam prep'],
    sections: [
      {
        heading: 'Set a range, not a fixed number',
        body: [
          'Most candidates benefit from a target range rather than a hard quota. A range keeps progress measurable while allowing for deeper review when needed.',
          'If your accuracy drops while volume rises, reduce new questions and increase explanation review.'
        ]
      },
      {
        heading: 'Use quality thresholds',
        body: [
          'Your real benchmark is whether you can explain misses clearly and avoid repeating them. Quantity without retention has limited value.',
          'Track repeat-error rate weekly. Falling repeat errors usually predicts stronger exam readiness.'
        ]
      },
      {
        heading: 'Add simulation checkpoints',
        body: [
          'Every few weeks, run a timed simulation to test pacing and attention stability. Simulation performance should influence your next study block.',
          'Use these checkpoints to reallocate time across domains.'
        ]
      }
    ]
  },
  {
    slug: 'spaced-repetition-for-nppe-flashcards',
    title: 'Spaced Repetition for NPPE Flashcards: A Practical Guide',
    description: 'How to use spaced repetition effectively for NPPE prep and avoid common flashcard mistakes.',
    excerpt: 'Build recall that lasts by using consistent, low-friction spaced repetition sessions.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 7,
    keywords: ['NPPE flashcards', 'spaced repetition', 'memory retention exam prep'],
    sections: [
      {
        heading: 'Keep cards decision-focused',
        body: [
          'The best cards test judgement and application, not isolated trivia. Decision-focused prompts improve transfer to exam scenarios.',
          'When a card feels ambiguous, rewrite it to include one clear cue and one clear expected response.'
        ]
      },
      {
        heading: 'Short sessions, high frequency',
        body: [
          'Aim for frequent short sessions rather than occasional long marathons. This aligns with how spaced repetition improves retention.',
          'Five to ten focused minutes multiple times per day often outperforms one long block.'
        ]
      },
      {
        heading: 'Pair cards with weak-domain review',
        body: [
          'Use flashcards as reinforcement after question reviews in weak domains. This anchors memory to recent mistakes and closes gaps faster.',
          'If a concept appears in repeated mistakes, promote it into your daily flashcard queue.'
        ]
      }
    ]
  },
  {
    slug: 'nppe-final-30-days-revision',
    title: 'NPPE Final 30 Days Revision Strategy',
    description: 'A structured final-month revision approach to sharpen pacing, confidence, and domain consistency before the NPPE.',
    excerpt: 'Use the last 30 days to consolidate, not to start from scratch.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 8,
    keywords: ['NPPE final month', 'exam revision strategy', '30 day exam plan'],
    sections: [
      {
        heading: 'Shift from learning to execution',
        body: [
          'In the final month, your primary job is to execute reliably under time pressure. Prioritise timed sets, simulation rhythm, and rapid remediation.',
          'Avoid adding large new content streams unless a critical gap appears.'
        ]
      },
      {
        heading: 'Run weekly simulation cycles',
        body: [
          'Each week: simulation -> deep review -> targeted domain blocks -> checkpoint quiz. This cycle keeps your preparation anchored to exam performance.',
          'Use your review notes to build a concise final-week revision list.'
        ]
      },
      {
        heading: 'Protect cognitive freshness',
        body: [
          'Overtraining in the final week can reduce performance. Keep sessions focused, maintain sleep routines, and avoid last-minute overload.',
          'Consistency and clarity beat intensity at this stage.'
        ]
      }
    ]
  },
  {
    slug: 'what-to-do-if-you-failed-nppe',
    title: 'What to Do If You Failed the NPPE: Recovery Plan',
    description: 'A constructive post-result plan to rebuild confidence, diagnose gaps, and prepare for your next NPPE attempt.',
    excerpt: 'Turn a difficult result into a targeted recovery strategy for your next exam cycle.',
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readingTimeMinutes: 9,
    keywords: ['failed NPPE', 'NPPE resit plan', 'exam recovery strategy'],
    sections: [
      {
        heading: 'Decompress, then diagnose',
        body: [
          'Allow a short reset period, then run a structured post-mortem. Focus on process failures and domain patterns rather than self-judgement.',
          'A clear diagnosis is the foundation of an effective resit plan.'
        ]
      },
      {
        heading: 'Rebuild with targeted cycles',
        body: [
          'Design shorter, focused cycles around your weakest performance patterns. Include measurable checkpoints each cycle to verify progress.',
          'Where possible, use verification and feedback loops to keep your plan grounded in evidence.'
        ]
      },
      {
        heading: 'Use support and accountability',
        body: [
          'Studying with accountability, whether through peers or scheduled review blocks, improves adherence and confidence in resit preparation.',
          'A disciplined system often matters more than a perfect resource stack.'
        ]
      }
    ]
  }
]

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
