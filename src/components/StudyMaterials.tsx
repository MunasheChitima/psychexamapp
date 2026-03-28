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
import { useSubscription } from '@/components/SubscriptionProvider'
import { studyMaterials as comprehensiveStudyMaterials } from '@/data/comprehensive'
import { getAllStudyMaterials, getProductConfig } from '@/lib/productConfig'
import type { StudyMaterial as ContractStudyMaterial } from '@apracademy/contracts'

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

function mapContractStudyMaterialToUi(sm: ContractStudyMaterial): StudyMaterial {
  const uiType: StudyMaterial['type'] =
    sm.type === 'checklist' ? 'list' : sm.type === 'table' ? 'table' : 'text'
  const checklistBody =
    sm.type === 'checklist' && sm.keyPoints.length > 0 ? sm.keyPoints.join('\n') : null
  const richBody = [sm.content]
  if (sm.type !== 'checklist' && sm.keyPoints.length > 0) {
    richBody.push('', 'Key points:', ...sm.keyPoints.map((k) => `• ${k}`))
  }
  return {
    id: sm.id,
    title: sm.title,
    domain: sm.domain,
    category: sm.category,
    content: checklistBody ?? richBody.join('\n'),
    type: uiType,
    difficulty: 'hard',
  }
}

export default function StudyMaterials({ appData, updateAppData }: ComponentProps) {
  const productConfig = getProductConfig(appData.productLine)
  const { isSubscribed, loading: subscriptionLoading } = useSubscription()
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [showCompletedOnly, setShowCompletedOnly] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null)

  const domains = [
    { id: 'all', name: 'All Domains', color: 'bg-gray-500', icon: <BookOpen className="w-6 h-6" /> },
    ...productConfig.domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      color: domain.color,
      icon: domain.id.includes('communication') ? <MessageSquare className="w-6 h-6" /> : domain.id.includes('assessment') ? <BarChart3 className="w-6 h-6" /> : domain.id.includes('intervention') ? <Brain className="w-6 h-6" /> : <Users className="w-6 h-6" />,
    })),
  ]

  const suiteMaterials: MaterialSection[] = appData.productLine === 'nursing'
    ? getAllStudyMaterials('nursing').map((sm) => ({
      id: `nursing-${sm.id}`,
      title: sm.title,
      domain: sm.domain,
      materials: [mapContractStudyMaterialToUi(sm)],
    }))
    : [
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
    },
    ...comprehensiveStudyMaterials.map((sm) => ({
      id: `comprehensive-${sm.id}`,
      title: sm.title,
      domain: sm.domain,
      materials: [mapContractStudyMaterialToUi(sm)],
    }))
  ]

  const isBookmarked = (id: string) => !!appData.materialBookmarks?.[id]
  const isCompleted = (id: string) => !!appData.materialCompleted?.[id]

  const filteredSections = suiteMaterials.filter(section => {
    const matchesDomain = selectedDomain === 'all' || section.domain === selectedDomain
    const hasMatchingMaterials = section.materials.some(material => {
      const matchesSearch = searchQuery === '' || 
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBookmark = !showBookmarkedOnly || isBookmarked(material.id)
      const matchesCompleted = !showCompletedOnly || isCompleted(material.id)
      
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
    const content = material.content.trim()
    if (!content) return null

    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-3">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const inlineFormat = (text: string): string => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    }

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) { flushList(); continue }

      if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(<h4 key={elements.length} className="text-md font-semibold text-gray-900 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(4)) }} />)
      } else if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(<h3 key={elements.length} className="text-lg font-bold text-gray-900 mt-5 mb-2" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(3)) }} />)
      } else if (trimmed.startsWith('# ')) {
        flushList()
        elements.push(<h2 key={elements.length} className="text-xl font-bold text-gray-900 mt-6 mb-3" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed.slice(2)) }} />)
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push(trimmed.slice(2))
      } else if (/^\d+\.\s/.test(trimmed)) {
        listItems.push(trimmed.replace(/^\d+\.\s/, ''))
      } else {
        flushList()
        elements.push(<p key={elements.length} className="text-gray-700 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />)
      }
    }
    flushList()

    return <div>{elements}</div>
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

  if (subscriptionLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading subscription access...</p>
      </div>
    )
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white border border-amber-300 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Materials are a premium feature</h2>
          <p className="text-gray-600 mb-4">
            Upgrade to unlock full guides, checklists, and domain-specific resources.
          </p>
          <button
            onClick={() => window.location.assign('/?upgrade=1')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade to Access Materials
          </button>
        </div>
      </div>
    )
  }

  const handleSaveMaterial = (material: StudyMaterial) => {
    const newStudySession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: 15,
      domain: material.domain,
      activity: 'reading',
      materialId: material.id,
      materialTitle: material.title
    }

    const newStudySessions = [...appData.studySessions, newStudySession]
    const newStudyStats = { ...appData.studyStats }
    newStudyStats.totalHours += 0.25

    updateAppData({
      studySessions: newStudySessions,
      studyStats: newStudyStats
    })

    markAsCompleted(material)
    setSavedFeedback(material.title)
    setTimeout(() => setSavedFeedback(null), 2000)
  }

  const toggleBookmark = (material: StudyMaterial) => {
    const newBookmarks = { ...appData.materialBookmarks, [material.id]: !appData.materialBookmarks?.[material.id] }
    updateAppData({ materialBookmarks: newBookmarks })
  }

  const markAsCompleted = (material: StudyMaterial) => {
    const newCompleted = { ...appData.materialCompleted, [material.id]: !appData.materialCompleted?.[material.id] }
    updateAppData({ materialCompleted: newCompleted })
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <main className="max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Study Materials</h1>
            <p className="text-sm text-gray-600 mt-0.5">Organised by domain</p>
          </div>
          <button
            onClick={handleExportNotes}
            aria-label="Export notes"
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors md:px-4 md:py-2 md:bg-blue-600 md:text-white md:hover:bg-blue-700 md:rounded-lg"
          >
            <Download className="w-5 h-5 md:hidden" />
            <span className="hidden md:flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Notes
            </span>
          </button>
        </div>

        {/* Search + Filters */}
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label="Filter by domain"
              className="flex-1 min-w-0 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>{domain.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              aria-label="Show bookmarked only"
              aria-pressed={showBookmarkedOnly}
              className={`p-2.5 rounded-xl border transition-all shrink-0 ${showBookmarkedOnly ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              <Bookmark className={`w-5 h-5 ${showBookmarkedOnly ? 'fill-amber-600' : ''}`} />
            </button>
            <button
              onClick={() => setShowCompletedOnly(!showCompletedOnly)}
              aria-label="Show completed only"
              aria-pressed={showCompletedOnly}
              className={`p-2.5 rounded-xl border transition-all shrink-0 ${showCompletedOnly ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              <Star className={`w-5 h-5 ${showCompletedOnly ? 'fill-green-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12 px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-700 mb-2">No materials match your filters</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filter settings.</p>
            <button
              onClick={() => { setSelectedDomain('all'); setSearchQuery(''); setShowBookmarkedOnly(false); setShowCompletedOnly(false) }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Material sections */}
        <div className="space-y-3">
          {filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl ${domains.find(d => d.id === section.domain)?.color} text-white shrink-0`}>
                      {domains.find(d => d.id === section.domain)?.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{section.title}</h3>
                      <p className="text-xs text-gray-600">{section.materials.length} materials</p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="border-t border-gray-100">
                  <div className="p-3 md:p-6 space-y-3 md:space-y-5">
                    {section.materials.map((material) => (
                      <div key={material.id} className="border border-gray-200 rounded-xl p-3 md:p-4">
                        <div className="mb-2">
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1.5 leading-snug">
                            {material.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                              {material.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                              material.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              material.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {material.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="prose prose-sm max-w-none text-sm leading-relaxed">
                          {renderContent(material)}
                        </div>

                        {/* Action row */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleBookmark(material)}
                              aria-label={isBookmarked(material.id) ? 'Remove bookmark' : 'Bookmark'}
                              className={`p-2.5 rounded-xl transition-colors active:scale-90 ${
                                isBookmarked(material.id) ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <Bookmark className="w-5 h-5" fill={isBookmarked(material.id) ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              onClick={() => markAsCompleted(material)}
                              aria-label={isCompleted(material.id) ? 'Mark incomplete' : 'Mark complete'}
                              className={`p-2.5 rounded-xl transition-colors active:scale-90 ${
                                isCompleted(material.id) ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <Star className="w-5 h-5" fill={isCompleted(material.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleSaveMaterial(material)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 active:scale-95 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Log as Studied</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Saved Feedback Toast */}
        {savedFeedback && (
          <div className="fixed md:bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in text-sm font-semibold whitespace-nowrap" style={{ bottom: 'var(--toast-bottom-offset)' }}>
            Saved: {savedFeedback}
          </div>
        )}

        {/* Resources Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-xl font-bold text-gray-900 mb-3">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Official Documents</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://psychology.org.au/for-members/resource-finder/resources/code-of-ethics/aps-code-of-ethics" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm py-1">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>APS Code of Ethics</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.psychologyboard.gov.au/standards-and-guidelines.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm py-1">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Psychology Board Guidelines</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
                <li>
                  <a href="https://www.psychologyboard.gov.au/Registration/National-psychology-exam.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm py-1">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>National Psychology Exam Guide</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Study Tips</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>• Focus on practical application</li>
                <li>• Practice with case studies</li>
                <li>• Review weak areas regularly</li>
                <li>• Take timed practice exams</li>
                <li>• Understand reasoning behind answers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom spacer for mobile nav */}
        <div className="h-4 md:h-0" />
      </main>
    </div>
  )
} 