// Kolb Learning Styles Data
// Adapted for National Psychology Examination preparation

export type KolbStyleId = 'diverging' | 'assimilating' | 'converging' | 'accommodating'

export interface KolbLearningStyle {
  id: KolbStyleId
  name: string
  shortDesc: string
  description: string
  experientialModes: {
    primary: string
    secondary: string
  }
  color: string
  gradient: string
  bgLight: string
  borderColor: string
  textColor: string
  iconEmoji: string
  characteristics: string[]
  strengths: string[]
  weaknesses: string[]
  studyStrategies: string[]
  psychExamStrategies: string[]
  optimalEnvironment: string
  learningMethods: string[]
  feedbackStyle: string
  improvementTips: string[]
  examDayTips: string[]
}

export interface KolbAssessmentQuestion {
  id: number
  scenario: string
  options: {
    id: 'a' | 'b' | 'c' | 'd'
    text: string
    mode: 'CE' | 'RO' | 'AC' | 'AE' // Concrete Experience, Reflective Observation, Abstract Conceptualization, Active Experimentation
  }[]
}

export const kolbLearningStyles: KolbLearningStyle[] = [
  {
    id: 'diverging',
    name: 'Diverging',
    shortDesc: 'Creative & Imaginative',
    description: 'You learn best through concrete experience and reflective observation. You are highly imaginative, emotionally aware, and excel at seeing situations from multiple perspectives.',
    experientialModes: {
      primary: 'Concrete Experience (CE)',
      secondary: 'Reflective Observation (RO)'
    },
    color: '#E91E63',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    iconEmoji: '💡',
    characteristics: [
      'Highly imaginative and creative',
      'Emotionally intelligent and empathetic',
      'Open to new experiences and perspectives',
      'Excellent at brainstorming and idea generation',
      'Comfortable with ambiguity and uncertainty',
      'Strong interpersonal skills'
    ],
    strengths: [
      'Creative problem-solving',
      'Seeing multiple perspectives',
      'Emotional intelligence',
      'Team collaboration',
      'Open-mindedness',
      'Communication skills'
    ],
    weaknesses: [
      'May struggle with highly structured tasks',
      'Can be indecisive when many options exist',
      'May avoid conflict situations',
      'Sometimes lacks focus on details',
      'Can be overly emotional in analysis',
      'May procrastinate on technical details'
    ],
    studyStrategies: [
      'Use mind maps and visual diagrams to connect concepts',
      'Engage in group discussions about clinical cases',
      'Connect theories to real-world clinical examples',
      'Create stories and narratives around patient scenarios',
      'Use role-playing to practice clinical situations',
      'Take breaks to reflect and process what you\'ve learned',
      'Work in collaborative study environments',
      'Use multimedia — videos, podcasts, and visual aids'
    ],
    psychExamStrategies: [
      'When studying Ethics, create scenarios from different stakeholder perspectives',
      'For Assessment questions, visualise real patient interactions and emotional contexts',
      'Use case study discussions with peers to explore Interventions',
      'Practice Communication scenarios through role-play with study partners',
      'Create mind maps linking ethical principles to clinical scenarios',
      'Use emotional engagement — connect with the "why" behind each ethical guideline'
    ],
    optimalEnvironment: 'Collaborative, creative, and supportive spaces with opportunities for discussion and reflection',
    learningMethods: ['Group discussions', 'Case studies', 'Role-playing', 'Visual presentations', 'Storytelling', 'Brainstorming'],
    feedbackStyle: 'You respond best to feedback that acknowledges your creative thinking and is delivered in a supportive, relational way. Constructive feedback framed as "growth opportunities" resonates more than direct criticism.',
    improvementTips: [
      'Set structured deadlines to combat procrastination on detail-oriented tasks',
      'Practice making quicker decisions — set a timer for practice question answers',
      'Balance creative exploration with systematic review of factual content',
      'Force yourself to engage with technical/statistical concepts even if they feel dry',
      'Use your strength in empathy to understand patient assessment from multiple angles',
      'Create a study schedule that alternates between creative exploration and structured review'
    ],
    examDayTips: [
      'Trust your intuition but verify with textbook knowledge',
      'Don\'t overthink — your first instinct on ethics questions is often correct',
      'Use your empathy skills for patient-centred scenario questions',
      'Take a few moments to breathe and ground yourself between question blocks'
    ]
  },
  {
    id: 'assimilating',
    name: 'Assimilating',
    shortDesc: 'Analytical & Theoretical',
    description: 'You learn best through abstract conceptualization and reflective observation. You excel at understanding wide-ranging information and organizing it into clear, logical models.',
    experientialModes: {
      primary: 'Abstract Conceptualization (AC)',
      secondary: 'Reflective Observation (RO)'
    },
    color: '#2196F3',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconEmoji: '🧠',
    characteristics: [
      'Highly analytical and logical',
      'Excellent at creating theories and models',
      'Strong attention to detail',
      'Comfortable with abstract concepts',
      'Systematic and organized approach',
      'Independent and self-directed learner'
    ],
    strengths: [
      'Analytical thinking',
      'Research and synthesis skills',
      'Systematic problem-solving',
      'Attention to detail',
      'Organized approach',
      'Independent learning'
    ],
    weaknesses: [
      'May struggle with practical application',
      'Can be overly theoretical',
      'May have difficulty with group work',
      'Sometimes inflexible in thinking',
      'Can be perfectionist',
      'May avoid hands-on clinical activities'
    ],
    studyStrategies: [
      'Create detailed outlines and theoretical frameworks',
      'Use diagrams and flowcharts to organize information',
      'Read extensively and take comprehensive, structured notes',
      'Develop theoretical models linking concepts together',
      'Practice with structured, systematic problem sets',
      'Use a systematic study schedule with clear milestones',
      'Focus on understanding underlying principles first',
      'Use analytical tools — spreadsheets, concept hierarchies, comparison tables'
    ],
    psychExamStrategies: [
      'Create comprehensive tables comparing ethical frameworks and their applications',
      'Build decision flowcharts for Assessment selection and interpretation',
      'Develop detailed notes on evidence-based Interventions with supporting research',
      'Create systematic frameworks for Communication — when, how, and why',
      'Map the APS Code of Ethics into a logical decision tree',
      'Use the curriculum structure as your study framework — work through it systematically'
    ],
    optimalEnvironment: 'Quiet, organized, and structured spaces with access to resources and minimal distractions',
    learningMethods: ['Lectures', 'Reading', 'Research', 'Analysis', 'Modeling', 'Systematic review'],
    feedbackStyle: 'You prefer detailed, evidence-based feedback with specific examples and logical reasoning. You appreciate feedback that references frameworks or established research.',
    improvementTips: [
      'Practice applying theory to real clinical scenarios — don\'t stay abstract',
      'Engage in study groups occasionally to gain different perspectives',
      'Set time limits for research/reading to avoid going down rabbit holes',
      'Force yourself to practice with timed exam conditions, not just read',
      'Balance deep analysis with broader coverage of the curriculum',
      'Make sure you can explain concepts in plain language, not just technical terms'
    ],
    examDayTips: [
      'Trust your systematic preparation — you\'ve likely covered the material thoroughly',
      'Watch for overthinking on questions — sometimes the straightforward answer is correct',
      'Use your analytical strength for multi-step reasoning questions',
      'Don\'t get stuck perfecting one answer — move on and come back'
    ]
  },
  {
    id: 'converging',
    name: 'Converging',
    shortDesc: 'Practical & Solution-Focused',
    description: 'You learn best through abstract conceptualization and active experimentation. You excel at finding practical uses for ideas and theories, and making decisions efficiently.',
    experientialModes: {
      primary: 'Abstract Conceptualization (AC)',
      secondary: 'Active Experimentation (AE)'
    },
    color: '#4CAF50',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconEmoji: '🎯',
    characteristics: [
      'Highly practical and results-oriented',
      'Excellent at problem-solving',
      'Decisive and action-oriented',
      'Strong technical skills',
      'Goal-focused and determined',
      'Comfortable with structured tasks'
    ],
    strengths: [
      'Practical problem-solving',
      'Technical expertise',
      'Decision-making',
      'Goal achievement',
      'Efficiency',
      'Results orientation'
    ],
    weaknesses: [
      'May lack creative exploration',
      'Can be inflexible in approach',
      'May dismiss theoretical concepts too quickly',
      'Sometimes impatient with open-ended discussion',
      'Can be overly focused on "getting the answer"',
      'May struggle with ambiguous scenarios'
    ],
    studyStrategies: [
      'Focus on practical applications of each concept',
      'Use hands-on practice questions and mock exams extensively',
      'Practice with real-world clinical problems and scenarios',
      'Set clear goals and deadlines for each study session',
      'Use step-by-step approaches — checklists and procedures',
      'Apply concepts immediately to practice problems',
      'Work on structured assignments with clear outcomes',
      'Use technology and tools to track progress efficiently'
    ],
    psychExamStrategies: [
      'For Ethics, practice applying the APS Code to specific clinical scenarios',
      'Use timed practice tests for Assessment to build speed and accuracy',
      'Create decision algorithms for selecting appropriate Interventions',
      'Practice Communication through structured role-play with clear objectives',
      'Focus on "what would you do" questions — turn theory into action plans',
      'Review past exam questions and practice answering them under time pressure'
    ],
    optimalEnvironment: 'Structured, goal-oriented spaces with access to tools and resources for practical application',
    learningMethods: ['Practice exams', 'Problem sets', 'Case studies', 'Simulations', 'Lab work', 'Decision exercises'],
    feedbackStyle: 'You prefer direct, actionable feedback focused on what to do differently. You value efficiency — get to the point with specific improvement steps.',
    improvementTips: [
      'Spend time understanding the "why" behind answers, not just the "what"',
      'Don\'t rush through theoretical foundations — they underpin practical application',
      'Practice with ambiguous scenarios that don\'t have one clear answer',
      'Develop comfort with exploring multiple perspectives before deciding',
      'Balance your focus on efficiency with depth of understanding',
      'Read the detailed rationales for practice question answers, even when you get them right'
    ],
    examDayTips: [
      'Use your decisiveness — make a choice and move on',
      'For ambiguous questions, identify the "best" answer rather than the "only" answer',
      'Apply your practical knowledge systematically to each scenario',
      'Your efficiency will serve you well in time management during the exam'
    ]
  },
  {
    id: 'accommodating',
    name: 'Accommodating',
    shortDesc: 'Hands-On & Adaptive',
    description: 'You learn best through concrete experience and active experimentation. You are highly adaptive, learn by doing, and thrive in dynamic environments where you can take action.',
    experientialModes: {
      primary: 'Concrete Experience (CE)',
      secondary: 'Active Experimentation (AE)'
    },
    color: '#FF9800',
    gradient: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    iconEmoji: '⚡',
    characteristics: [
      'Highly adaptive and flexible',
      'Excellent at learning by doing',
      'Comfortable with risk and uncertainty',
      'Strong interpersonal skills',
      'Action-oriented and energetic',
      'Open to new experiences'
    ],
    strengths: [
      'Adaptability',
      'Risk-taking',
      'Hands-on learning',
      'Teamwork',
      'Innovation',
      'Quick learning from experience'
    ],
    weaknesses: [
      'May neglect planning and preparation',
      'Can be impulsive in decision-making',
      'May skip theoretical foundations',
      'Sometimes disorganized',
      'Can be impatient with slow processes',
      'May struggle with routine study'
    ],
    studyStrategies: [
      'Learn through hands-on experience and active practice',
      'Use trial and error approaches with practice questions',
      'Engage in group activities and collaborative learning',
      'Take on challenging practice scenarios',
      'Use real-world clinical examples extensively',
      'Learn from others through observation and interaction',
      'Use interactive methods — quizzes, games, simulations',
      'Focus on practical skills and their clinical applications'
    ],
    psychExamStrategies: [
      'Practice Ethics scenarios by "walking through" each dilemma as if you were the clinician',
      'For Assessment, practice administering and interpreting tools in study groups',
      'Role-play Intervention scenarios — be the therapist in mock sessions',
      'Practice Communication skills through real conversations with study partners',
      'Use flashcards actively — quiz yourself and others rather than passive review',
      'Create a study group and take turns presenting topics to each other'
    ],
    optimalEnvironment: 'Dynamic, interactive spaces with opportunities for hands-on learning and collaboration',
    learningMethods: ['Experiential learning', 'Group work', 'Simulations', 'Role-play', 'Interactive quizzes', 'Teaching others'],
    feedbackStyle: 'You prefer immediate, practical feedback delivered in a dynamic way. You learn best from real examples and prefer "show me" over "tell me".',
    improvementTips: [
      'Create a structured study plan and commit to following it',
      'Set aside dedicated time for reading and absorbing theoretical content',
      'Don\'t skip the detailed explanations — slow down with case rationales',
      'Balance action-oriented study with reflective review of what you\'ve learned',
      'Use a planner or app to keep study sessions organized',
      'Practice the discipline of thorough preparation even when you feel ready to "just do it"'
    ],
    examDayTips: [
      'Channel your energy into careful reading of each question',
      'Resist the urge to rush — take your time with complex scenarios',
      'Your adaptability will help you handle unexpected question formats',
      'Use your practical experience to ground your answers in clinical reality'
    ]
  }
]

// Self-Assessment Questions — adapted for psychology exam studiers
export const kolbAssessmentQuestions: KolbAssessmentQuestion[] = [
  {
    id: 1,
    scenario: 'When learning a new psychological theory, I prefer to:',
    options: [
      { id: 'a', text: 'Explore how it feels to apply it in a clinical scenario', mode: 'CE' },
      { id: 'b', text: 'Observe and reflect on how others use it in practice', mode: 'RO' },
      { id: 'c', text: 'Read and analyse the theory\'s logical framework', mode: 'AC' },
      { id: 'd', text: 'Try it out immediately in a practice exercise', mode: 'AE' }
    ]
  },
  {
    id: 2,
    scenario: 'When I encounter a difficult ethics scenario in my studies, I tend to:',
    options: [
      { id: 'a', text: 'Think about how I personally feel about the situation', mode: 'CE' },
      { id: 'b', text: 'Consider it from multiple perspectives before deciding', mode: 'RO' },
      { id: 'c', text: 'Consult the APS Code of Ethics and apply the relevant principles systematically', mode: 'AC' },
      { id: 'd', text: 'Decide on the best course of action and move forward', mode: 'AE' }
    ]
  },
  {
    id: 3,
    scenario: 'In a study group, I am the one who:',
    options: [
      { id: 'a', text: 'Shares personal insights and connects content to lived experience', mode: 'CE' },
      { id: 'b', text: 'Listens carefully and asks thoughtful questions', mode: 'RO' },
      { id: 'c', text: 'Organises the discussion around key concepts and models', mode: 'AC' },
      { id: 'd', text: 'Leads the group through practice questions and activities', mode: 'AE' }
    ]
  },
  {
    id: 4,
    scenario: 'When preparing for a practice exam, I would rather:',
    options: [
      { id: 'a', text: 'Immerse myself in case studies and think about how clients might feel', mode: 'CE' },
      { id: 'b', text: 'Review my notes and reflect on what I understand well and where gaps are', mode: 'RO' },
      { id: 'c', text: 'Create a comprehensive study plan with structured timelines', mode: 'AC' },
      { id: 'd', text: 'Jump straight into doing practice questions and learn from the answers', mode: 'AE' }
    ]
  },
  {
    id: 5,
    scenario: 'When I get a practice question wrong, I prefer to:',
    options: [
      { id: 'a', text: 'Think about the emotional impact of the scenario and re-engage with it', mode: 'CE' },
      { id: 'b', text: 'Carefully analyse why I got it wrong and what I was thinking', mode: 'RO' },
      { id: 'c', text: 'Read the detailed explanation and understand the logical reasoning', mode: 'AC' },
      { id: 'd', text: 'Try similar questions immediately to get it right next time', mode: 'AE' }
    ]
  },
  {
    id: 6,
    scenario: 'When learning about psychological assessment tools, I prefer to:',
    options: [
      { id: 'a', text: 'Complete the assessment myself to understand the client experience', mode: 'CE' },
      { id: 'b', text: 'Watch demonstrations and observe how they are administered', mode: 'RO' },
      { id: 'c', text: 'Study the psychometric properties, validity, and reliability data', mode: 'AC' },
      { id: 'd', text: 'Practice administering the test in a simulated setting', mode: 'AE' }
    ]
  },
  {
    id: 7,
    scenario: 'My ideal study session involves:',
    options: [
      { id: 'a', text: 'Discussing clinical scenarios with peers and sharing personal reflections', mode: 'CE' },
      { id: 'b', text: 'Quiet time to read, reflect, and take detailed notes', mode: 'RO' },
      { id: 'c', text: 'Working through a structured study plan with clear objectives', mode: 'AC' },
      { id: 'd', text: 'Active practice — flashcards, quizzes, and mock scenarios', mode: 'AE' }
    ]
  },
  {
    id: 8,
    scenario: 'When learning about a new intervention technique, I find it most helpful to:',
    options: [
      { id: 'a', text: 'Experience the technique first-hand, even as the "client"', mode: 'CE' },
      { id: 'b', text: 'Observe a demonstration or watch a training video', mode: 'RO' },
      { id: 'c', text: 'Read the research evidence and theoretical underpinnings', mode: 'AC' },
      { id: 'd', text: 'Practice the technique immediately in a role-play scenario', mode: 'AE' }
    ]
  },
  {
    id: 9,
    scenario: 'When I feel uncertain about a topic, I typically:',
    options: [
      { id: 'a', text: 'Talk to someone about it to process my thoughts and feelings', mode: 'CE' },
      { id: 'b', text: 'Step back and think about it carefully on my own', mode: 'RO' },
      { id: 'c', text: 'Research the topic thoroughly until I have a comprehensive understanding', mode: 'AC' },
      { id: 'd', text: 'Dive into practice problems to build confidence through doing', mode: 'AE' }
    ]
  },
  {
    id: 10,
    scenario: 'I find it easiest to remember information when:',
    options: [
      { id: 'a', text: 'It\'s connected to an emotional experience or personal story', mode: 'CE' },
      { id: 'b', text: 'I\'ve had time to carefully review and think about it', mode: 'RO' },
      { id: 'c', text: 'It\'s presented in a logical, well-structured framework', mode: 'AC' },
      { id: 'd', text: 'I\'ve actively used it in practice or taught it to someone else', mode: 'AE' }
    ]
  },
  {
    id: 11,
    scenario: 'When receiving feedback on my study performance, I prefer:',
    options: [
      { id: 'a', text: 'A supportive conversation about my growth and potential', mode: 'CE' },
      { id: 'b', text: 'Time to process the feedback privately and reflect on it', mode: 'RO' },
      { id: 'c', text: 'Detailed, data-driven feedback with specific areas for improvement', mode: 'AC' },
      { id: 'd', text: 'Practical action items I can implement immediately', mode: 'AE' }
    ]
  },
  {
    id: 12,
    scenario: 'When studying the four exam domains (Ethics, Assessment, Interventions, Communication), I naturally gravitate toward:',
    options: [
      { id: 'a', text: 'Communication and the human connection aspects of practice', mode: 'CE' },
      { id: 'b', text: 'Ethics — understanding principles and reflecting on dilemmas', mode: 'RO' },
      { id: 'c', text: 'Assessment — the systematic, evidence-based measurement tools', mode: 'AC' },
      { id: 'd', text: 'Interventions — the practical techniques I can apply clinically', mode: 'AE' }
    ]
  }
]

// Scoring helper
export function calculateKolbScores(answers: Record<number, 'a' | 'b' | 'c' | 'd'>): {
  CE: number
  RO: number
  AC: number
  AE: number
} {
  const scores = { CE: 0, RO: 0, AC: 0, AE: 0 }
  
  Object.entries(answers).forEach(([questionIdStr, selectedOption]) => {
    const questionId = parseInt(questionIdStr)
    const question = kolbAssessmentQuestions.find(q => q.id === questionId)
    if (question) {
      const option = question.options.find(o => o.id === selectedOption)
      if (option) {
        scores[option.mode] += 1
      }
    }
  })
  
  return scores
}

export function determineKolbStyle(scores: { CE: number; RO: number; AC: number; AE: number }): KolbStyleId {
  // Calculate the two dimensions
  const perceivingDimension = scores.AC - scores.CE  // Positive = Abstract, Negative = Concrete
  const processingDimension = scores.AE - scores.RO  // Positive = Active, Negative = Reflective

  if (perceivingDimension <= 0 && processingDimension <= 0) {
    return 'diverging'    // Concrete + Reflective
  } else if (perceivingDimension > 0 && processingDimension <= 0) {
    return 'assimilating'  // Abstract + Reflective
  } else if (perceivingDimension > 0 && processingDimension > 0) {
    return 'converging'    // Abstract + Active
  } else {
    return 'accommodating' // Concrete + Active
  }
}

export function getKolbStyleById(id: KolbStyleId): KolbLearningStyle {
  return kolbLearningStyles.find(s => s.id === id)!
}

// Feedback improvement mapping based on practice question domain performance
export function getKolbFeedback(
  styleId: KolbStyleId,
  domainScores: { ethics: number; assessment: number; interventions: number; communication: number }
): string[] {
  const style = getKolbStyleById(styleId)
  const feedback: string[] = []

  // Find weakest domain
  const domainEntries = Object.entries(domainScores) as [string, number][]
  const weakest = domainEntries.reduce((min, curr) => curr[1] < min[1] ? curr : min)
  const strongest = domainEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max)

  feedback.push(`As a ${style.name} learner, you tend to ${style.description.toLowerCase()}`)

  // Style-specific feedback for weak domain
  switch (styleId) {
    case 'diverging':
      if (weakest[0] === 'assessment') {
        feedback.push('Assessment requires systematic analysis — try creating visual comparison charts of different tools to engage your creative strengths.')
      }
      if (weakest[0] === 'ethics') {
        feedback.push('Use your empathy skills to role-play ethical dilemmas from multiple perspectives.')
      }
      break
    case 'assimilating':
      if (weakest[0] === 'communication') {
        feedback.push('Communication may feel less structured — try creating a systematic framework for professional communication scenarios.')
      }
      if (weakest[0] === 'interventions') {
        feedback.push('Build theoretical models linking intervention techniques to their evidence base — this will help you apply them clinically.')
      }
      break
    case 'converging':
      if (weakest[0] === 'ethics') {
        feedback.push('Ethics questions are often ambiguous — practice with scenarios that don\'t have one clear answer to build your comfort with nuance.')
      }
      if (weakest[0] === 'communication') {
        feedback.push('Use your practical mindset to create step-by-step communication scripts for different professional scenarios.')
      }
      break
    case 'accommodating':
      if (weakest[0] === 'assessment') {
        feedback.push('Assessment requires careful attention to detail — slow down and study the psychometric properties of key tools systematically.')
      }
      if (weakest[0] === 'ethics') {
        feedback.push('For ethics, create active study exercises like scenario cards that you and your study partners can work through together.')
      }
      break
  }

  feedback.push(`Your strongest domain (${strongest[0]}) aligns well with your ${style.name} learning style. Continue using ${style.learningMethods[0].toLowerCase()} and ${style.learningMethods[1].toLowerCase()} for this area.`)
  feedback.push(`For your weakest domain (${weakest[0]}), try: ${style.improvementTips[0]}`)

  return feedback
}
