'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  FileText, 
  Users, 
  BarChart3, 
  Brain, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Search,
  Bookmark,
  Star
} from 'lucide-react'
import { ComponentProps } from '@/types'

interface StudyMaterial {
  id: string
  title: string
  domain: string
  category: string
  content: string
  type: 'text' | 'list' | 'table'
  difficulty: 'easy' | 'medium' | 'hard'
  isBookmarked?: boolean
  isCompleted?: boolean
}

interface MaterialSection {
  id: string
  title: string
  domain: string
  materials: StudyMaterial[]
}

export default function StudyMaterials({ appData, updateAppData }: ComponentProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [showCompletedOnly, setShowCompletedOnly] = useState(false)

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'ethics', name: 'Ethics', color: 'bg-blue-500', icon: <Users className="w-6 h-6" /> },
    { id: 'assessment', name: 'Assessment', color: 'bg-green-500', icon: <BarChart3 className="w-6 h-6" /> },
    { id: 'interventions', name: 'Interventions', color: 'bg-purple-500', icon: <Brain className="w-6 h-6" /> },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500', icon: <MessageSquare className="w-6 h-6" /> }
  ]

  const studyMaterials: MaterialSection[] = [
    {
      id: 'ethics-legislation',
      title: 'Key Legislation & Ethics',
      domain: 'ethics',
      materials: [
        {
          id: '1',
          title: 'APS Code of Ethics',
          domain: 'ethics',
          category: 'Professional Standards',
          type: 'text',
          difficulty: 'medium',
          content: 'The APS Code of Ethics outlines the ethical principles and standards that psychologists must follow. Key principles include: respect for the rights and dignity of people and peoples, propriety, and integrity. Psychologists must maintain professional boundaries, obtain informed consent, maintain confidentiality (with exceptions), and practice within their competence. The code emphasizes cultural responsiveness and the importance of ongoing professional development.'
        },
        {
          id: '2',
          title: 'Mandatory Reporting Requirements',
          domain: 'ethics',
          category: 'Legal Obligations',
          type: 'list',
          difficulty: 'hard',
          content: 'Psychologists must report: suspected child abuse or neglect, elder abuse, threats of harm to self or others (Tarasoff duty), and certain criminal activities. The duty to warn and protect overrides confidentiality when there is a clear and imminent risk of harm. Understanding jurisdictional variations is crucial for legal compliance.'
        },
        {
          id: '3',
          title: 'Informed Consent Elements',
          domain: 'ethics',
          category: 'Client Rights',
          type: 'list',
          difficulty: 'medium',
          content: 'Must include: purpose of services, procedures to be used, risks and benefits, alternatives, confidentiality limits, fees, therapist qualifications, right to withdraw consent, and how to make complaints. Consent must be ongoing and can be withdrawn at any time.'
        }
      ]
    },
    {
      id: 'assessment-tools',
      title: 'Key Assessment Tools',
      domain: 'assessment',
      materials: [
        {
          id: '4',
          title: 'WAIS-IV (Wechsler Adult Intelligence Scale)',
          domain: 'assessment',
          category: 'Cognitive Assessment',
          type: 'text',
          difficulty: 'medium',
          content: 'Measures cognitive ability in adults aged 16-90. Provides Full Scale IQ, Verbal Comprehension, Perceptual Reasoning, Working Memory, and Processing Speed indices. Used for intellectual disability diagnosis, giftedness assessment, and cognitive decline evaluation. Requires specialized training and certification to administer.'
        },
        {
          id: '5',
          title: 'WISC-V (Wechsler Intelligence Scale for Children)',
          domain: 'assessment',
          category: 'Cognitive Assessment',
          type: 'text',
          difficulty: 'medium',
          content: 'Measures cognitive ability in children aged 6-16. Provides similar indices to WAIS-IV but normed for children. Used for learning disability assessment, giftedness identification, and cognitive development evaluation. Age-appropriate administration is critical.'
        },
        {
          id: '6',
          title: 'DASS-42 (Depression Anxiety Stress Scale)',
          domain: 'assessment',
          category: 'Mood Assessment',
          type: 'text',
          difficulty: 'easy',
          content: '42-item self-report measure assessing depression, anxiety, and stress symptoms. Provides separate scores for each domain. Used for screening, treatment planning, and outcome measurement. Free to use and widely validated across populations.'
        },
        {
          id: '7',
          title: 'PAI (Personality Assessment Inventory)',
          domain: 'assessment',
          category: 'Personality Assessment',
          type: 'text',
          difficulty: 'hard',
          content: '344-item self-report personality measure with 22 scales. Assesses clinical syndromes, treatment considerations, interpersonal style, and validity. Used for personality disorder assessment and treatment planning. Requires training for interpretation.'
        },
        {
          id: '8',
          title: 'K-10 (Kessler Psychological Distress Scale)',
          domain: 'assessment',
          category: 'Screening',
          type: 'text',
          difficulty: 'easy',
          content: '10-item screening measure for psychological distress. Used in primary care and research settings to identify individuals needing mental health services. Quick administration and scoring make it ideal for busy clinical settings.'
        },
        {
          id: '9',
          title: 'SDQ (Strengths and Difficulties Questionnaire)',
          domain: 'assessment',
          category: 'Child Assessment',
          type: 'text',
          difficulty: 'medium',
          content: '25-item behavioral screening questionnaire for children aged 3-16. Assesses emotional symptoms, conduct problems, hyperactivity, peer problems, and prosocial behavior. Available in parent, teacher, and self-report versions.'
        }
      ]
    },
    {
      id: 'dsm-diagnoses',
      title: 'DSM-5 Key Diagnoses',
      domain: 'assessment',
      materials: [
        {
          id: '10',
          title: 'Major Depressive Disorder',
          domain: 'assessment',
          category: 'Mood Disorders',
          type: 'list',
          difficulty: 'medium',
          content: 'Criteria: 5+ symptoms during 2-week period, including depressed mood or loss of interest/pleasure. Symptoms: weight/appetite changes, sleep disturbance, psychomotor changes, fatigue, worthlessness/guilt, concentration problems, suicidal thoughts. Must cause significant distress or impairment.'
        },
        {
          id: '11',
          title: 'Generalized Anxiety Disorder',
          domain: 'assessment',
          category: 'Anxiety Disorders',
          type: 'list',
          difficulty: 'medium',
          content: 'Criteria: excessive anxiety/worry about multiple events for 6+ months. Symptoms: restlessness, fatigue, concentration problems, irritability, muscle tension, sleep disturbance. Must cause significant distress/impairment and be difficult to control.'
        },
        {
          id: '12',
          title: 'Posttraumatic Stress Disorder',
          domain: 'assessment',
          category: 'Trauma Disorders',
          type: 'list',
          difficulty: 'hard',
          content: 'Criteria: exposure to actual/threatened death, serious injury, or sexual violence. Symptoms: intrusion symptoms, avoidance, negative alterations in cognition/mood, arousal/reactivity changes. Duration >1 month and not due to substances or medical condition.'
        },
        {
          id: '13',
          title: 'Borderline Personality Disorder',
          domain: 'assessment',
          category: 'Personality Disorders',
          type: 'list',
          difficulty: 'hard',
          content: 'Criteria: 5+ of 9 criteria including frantic efforts to avoid abandonment, unstable relationships, identity disturbance, impulsivity, suicidal behavior, affective instability, emptiness, anger, and dissociation. Pattern must be pervasive and stable.'
        }
      ]
    },
    {
      id: 'intervention-approaches',
      title: 'Evidence-Based Interventions',
      domain: 'interventions',
      materials: [
        {
          id: '14',
          title: 'Cognitive Behavioral Therapy (CBT)',
          domain: 'interventions',
          category: 'Psychotherapy',
          type: 'text',
          difficulty: 'medium',
          content: 'Evidence-based treatment focusing on the relationship between thoughts, emotions, and behaviors. Techniques include cognitive restructuring, behavioral activation, exposure therapy, and problem-solving. Effective for depression, anxiety, PTSD, and many other conditions. Structured, time-limited approach with homework assignments.'
        },
        {
          id: '15',
          title: 'Dialectical Behavior Therapy (DBT)',
          domain: 'interventions',
          category: 'Psychotherapy',
          type: 'text',
          difficulty: 'hard',
          content: 'Comprehensive treatment for borderline personality disorder and other conditions. Combines cognitive-behavioral techniques with mindfulness and acceptance strategies. Four modules: mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness. Requires extensive training and supervision.'
        },
        {
          id: '16',
          title: 'Motivational Interviewing',
          domain: 'interventions',
          category: 'Brief Intervention',
          type: 'text',
          difficulty: 'medium',
          content: 'Client-centered approach to resolve ambivalence and increase motivation for change. Uses OARS: Open questions, Affirmations, Reflections, Summaries. Effective for substance use, health behavior change, and treatment engagement. Collaborative, non-confrontational style.'
        },
        {
          id: '17',
          title: 'Psychopharmacology Basics',
          domain: 'interventions',
          category: 'Medication',
          type: 'list',
          difficulty: 'hard',
          content: 'SSRIs: first-line for depression/anxiety, side effects include GI upset, sexual dysfunction. SNRIs: similar to SSRIs but also affect norepinephrine. Benzodiazepines: short-term anxiety relief, risk of dependence. Antipsychotics: for psychosis, bipolar, severe depression. Always consider drug interactions and monitor side effects.'
        }
      ]
    },
    {
      id: 'communication-skills',
      title: 'Professional Communication',
      domain: 'communication',
      materials: [
        {
          id: '18',
          title: 'Psychological Report Writing',
          domain: 'communication',
          category: 'Documentation',
          type: 'list',
          difficulty: 'medium',
          content: 'Essential elements: identifying information, referral question, background, assessment methods, results, interpretation, recommendations, signature. Write clearly, avoid jargon, be objective, support conclusions with data, and provide actionable recommendations. Consider the audience and purpose of the report.'
        },
        {
          id: '19',
          title: 'Cultural Responsiveness',
          domain: 'communication',
          category: 'Cultural Competence',
          type: 'text',
          difficulty: 'medium',
          content: 'Understanding and respecting cultural differences in psychological practice. Includes awareness of one\'s own cultural biases, knowledge of diverse cultural practices, and adapting interventions to cultural contexts. Essential for effective assessment and treatment. Ongoing learning and self-reflection required.'
        },
        {
          id: '20',
          title: 'Record Keeping Standards',
          domain: 'communication',
          category: 'Documentation',
          type: 'list',
          difficulty: 'easy',
          content: 'Records must be: accurate, timely, complete, and secure. Include: client information, assessment data, treatment plans, progress notes, and termination summaries. Retain for 7 years minimum, longer for minors. Protect confidentiality and privacy. Use secure storage systems.'
        }
      ]
    }
  ]

  const filteredSections = studyMaterials.filter(section => {
    const matchesDomain = selectedDomain === 'all' || section.domain === selectedDomain
    const hasMatchingMaterials = section.materials.some(material => {
      const matchesSearch = searchQuery === '' || 
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBookmark = !showBookmarkedOnly || material.isBookmarked
      const matchesCompleted = !showCompletedOnly || material.isCompleted
      
      return matchesSearch && matchesBookmark && matchesCompleted
    })
    
    return matchesDomain && hasMatchingMaterials
  })

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const renderContent = (material: StudyMaterial) => {
    if (material.type === 'list') {
      const items = material.content.split('. ').filter(item => item.trim())
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    }
    
    return <p className="text-gray-700 leading-relaxed">{material.content}</p>
  }

  const handleExportNotes = () => {
    const notesData = {
      examDate: appData.examDate,
      studyStats: appData.studyStats,
      studySessions: appData.studySessions,
      flashcardProgress: appData.flashcardProgress,
      practiceResults: appData.practiceResults,
      exportDate: new Date().toISOString()
    }

    const dataStr = JSON.stringify(notesData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `psychology-exam-study-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSaveMaterial = (material: StudyMaterial) => {
    // Add to study sessions
    const newStudySession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: 15, // 15 minutes for reading material
      domain: material.domain,
      activity: 'reading',
      materialId: material.id,
      materialTitle: material.title
    }

    const newStudySessions = [...appData.studySessions, newStudySession]
    const newStudyStats = { ...appData.studyStats }
    newStudyStats.totalHours += 0.25 // Add 15 minutes

    updateAppData({
      studySessions: newStudySessions,
      studyStats: newStudyStats
    })

    // Show feedback
    alert(`Saved: ${material.title}`)
  }

  const toggleBookmark = (material: StudyMaterial) => {
    // In a real app, this would update the material's bookmark status
    console.log(`Toggled bookmark for: ${material.title}`)
  }

  const markAsCompleted = (material: StudyMaterial) => {
    // In a real app, this would update the material's completion status
    console.log(`Marked as completed: ${material.title}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
              <p className="text-gray-600 mt-1">Comprehensive resources organized by domain</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleExportNotes}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Notes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Domain Filter */}
            <div className="flex flex-wrap gap-3">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDomain === domain.id
                      ? `${domain.color} text-white`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {domain.icon}
                  <span>{domain.name}</span>
                </button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  showBookmarkedOnly
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmarked Only</span>
              </button>

              <button
                onClick={() => setShowCompletedOnly(!showCompletedOnly)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  showCompletedOnly
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Completed Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${domains.find(d => d.id === section.domain)?.color} text-white`}>
                      {domains.find(d => d.id === section.domain)?.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.materials.length} materials
                      </p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="border-t border-gray-200">
                  <div className="p-6 space-y-6">
                    {section.materials.map((material) => (
                      <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {material.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {material.category}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                material.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                material.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {material.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => toggleBookmark(material)}
                              className={`p-2 rounded-full transition-colors ${
                                material.isBookmarked
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" fill={material.isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                              onClick={() => markAsCompleted(material)}
                              className={`p-2 rounded-full transition-colors ${
                                material.isCompleted
                                  ? 'text-green-500 hover:text-green-600'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Star className="w-4 h-4" fill={material.isCompleted ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                              onClick={() => handleSaveMaterial(material)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {renderContent(material)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resources Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Official Documents</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>APS Code of Ethics</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>Psychology Board Guidelines</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>National Psychology Examination Guide</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Study Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Focus on practical application rather than rote memorization</li>
                <li>• Practice with case studies and scenarios</li>
                <li>• Review weak areas regularly</li>
                <li>• Take timed practice exams</li>
                <li>• Understand the reasoning behind correct answers</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 