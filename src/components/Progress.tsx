'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  AlertCircle,
  BarChart3, 
  Brain, 
  Users, 
  MessageSquare,
  Trophy
} from 'lucide-react'
import { ComponentProps } from '@/types'
import { getAllPracticeQuestions, getProductConfig } from '@/lib/productConfig'

interface StudySession {
  id: string
  date: string
  duration: number // in minutes
  domain: string
  activity: string
  materialId?: string
  materialTitle?: string
}

interface DomainProgress {
  domain: string
  hoursStudied: number
  questionsAnswered: number
  correctAnswers: number
  accuracy: number
  lastStudied: string | null
}

export default function Progress({ appData }: ComponentProps) {
  const productConfig = useMemo(() => getProductConfig(appData.productLine), [appData.productLine])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week')
  const [studySessions, setStudySessions] = useState<StudySession[]>([])

  const allQuestionsMap = useMemo(() => {
    const all = getAllPracticeQuestions(appData.productLine)
    return new Map(all.map(q => [q.id, q]))
  }, [appData.productLine])

  const domains = productConfig.domains.map((domain) => ({
    id: domain.id,
    name: domain.name,
    color: domain.color,
    icon: domain.id.includes('communication') ? <MessageSquare className="w-6 h-6" /> : domain.id.includes('assessment') ? <BarChart3 className="w-6 h-6" /> : domain.id.includes('intervention') ? <Brain className="w-6 h-6" /> : <Users className="w-6 h-6" />,
  }))

  useEffect(() => {
    // Load study sessions from app data
    if (appData.studySessions && Array.isArray(appData.studySessions)) {
      setStudySessions(appData.studySessions)
    }
  }, [appData.studySessions])

  const getFilteredSessions = () => {
    const now = new Date()
    const filtered = studySessions.filter(session => {
      const sessionDate = new Date(session.date)
      switch (selectedTimeframe) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return sessionDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return sessionDate >= monthAgo
        default:
          return true
      }
    })
    return filtered
  }

  const calculateDomainProgress = (): DomainProgress[] => {
    const filteredSessions = getFilteredSessions()
    const domainStats: Record<string, DomainProgress> = {}

    // Initialize domain stats
    domains.forEach(domain => {
      domainStats[domain.id] = {
        domain: domain.id,
        hoursStudied: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        lastStudied: null
      }
    })

    // Calculate from study sessions
    filteredSessions.forEach(session => {
      if (domainStats[session.domain]) {
        domainStats[session.domain].hoursStudied += session.duration / 60
        domainStats[session.domain].lastStudied = session.date
      }
    })

    if (appData.practiceResults && Array.isArray(appData.practiceResults)) {
      appData.practiceResults.forEach(result => {
        if (result.questions && Array.isArray(result.questions) && result.answers) {
          result.questions.forEach((question, idx) => {
            if (domainStats[question.domain]) {
              domainStats[question.domain].questionsAnswered += 1
              const userAnswer = result.answers[idx]
              if (userAnswer !== null && userAnswer !== undefined) {
                const originalQuestion = allQuestionsMap.get(question.id)
                if (originalQuestion && userAnswer === originalQuestion.correctAnswer) {
                  domainStats[question.domain].correctAnswers += 1
                }
              }
            }
          })
        }
      })
    }

    // Calculate accuracy
    Object.values(domainStats).forEach(domain => {
      domain.accuracy = domain.questionsAnswered > 0 
        ? Math.round((domain.correctAnswers / domain.questionsAnswered) * 100)
        : 0
    })

    return Object.values(domainStats)
  }

  const calculateStudyStreak = () => {
    if (!studySessions.length) return 0

    const sortedSessions = [...studySessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let streak = 0
    const now = new Date()
    const currentDate = new Date(now)

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = currentDate.toISOString().split('T')[0]
      const hasSession = sortedSessions.some(session => 
        session.date.startsWith(dateStr)
      )

      if (hasSession) {
        streak++
      } else {
        break
      }

      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  const calculateReadinessScore = () => {
    const domainProgress = calculateDomainProgress()
    const totalHours = domainProgress.reduce((sum, domain) => sum + domain.hoursStudied, 0)
    const avgAccuracy = domainProgress.reduce((sum, domain) => sum + domain.accuracy, 0) / domainProgress.length
    const studyStreak = calculateStudyStreak()

    // Weighted calculation
    const hoursScore = Math.min(totalHours / 50, 1) * 30 // Max 30 points for 50+ hours
    const accuracyScore = (avgAccuracy / 100) * 40 // Max 40 points for 100% accuracy
    const streakScore = Math.min(studyStreak / 7, 1) * 30 // Max 30 points for 7+ day streak

    return Math.round(hoursScore + accuracyScore + streakScore)
  }

  const getWeakAreas = () => {
    const domainProgress = calculateDomainProgress()
    return domainProgress
      .filter(domain => domain.accuracy < 70 || domain.hoursStudied < 5)
      .sort((a, b) => (a.accuracy + a.hoursStudied) - (b.accuracy + b.hoursStudied))
  }

  const getRecentActivity = () => {
    return getFilteredSessions()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }

  const getAchievements = () => {
    const achievements = []
    const studyStreak = calculateStudyStreak()
    const readinessScore = calculateReadinessScore()
    const totalHours = appData.studyStats.totalHours

    if (studyStreak >= 7) {
      achievements.push({
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintained a 7-day study streak',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'bg-green-500'
      })
    }

    if (totalHours >= 10) {
      achievements.push({
        id: 'hours-10',
        title: 'Dedicated Learner',
        description: 'Studied for 10+ hours',
        icon: <Clock className="w-6 h-6" />,
        color: 'bg-blue-500'
      })
    }

    if (readinessScore >= 80) {
      achievements.push({
        id: 'readiness-80',
        title: 'Exam Ready',
        description: 'Achieved 80%+ readiness score',
        icon: <Trophy className="w-6 h-6" />,
        color: 'bg-yellow-500'
      })
    }

    return achievements
  }

  const domainProgress = calculateDomainProgress()
  const studyStreak = calculateStudyStreak()
  const readinessScore = calculateReadinessScore()
  const weakAreas = getWeakAreas()
  const recentActivity = getRecentActivity()
  const achievements = getAchievements()

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <main className="max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Progress</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track your study performance</p>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
            aria-label="Select timeframe"
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Overall Stats - 2x2 on mobile, 4-col on desktop */}
        <section className="mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <Clock className="w-4 h-4 text-blue-600" />, label: 'Hours', value: String(Math.round(appData.studyStats.totalHours * 10) / 10) },
              { icon: <Target className="w-4 h-4 text-green-600" />, label: 'Answered', value: String(appData.studyStats.questionsAnswered) },
              { icon: <TrendingUp className="w-4 h-4 text-purple-600" />, label: 'Streak', value: `${studyStreak}d` },
              { icon: <BarChart3 className="w-4 h-4 text-orange-600" />, label: 'Ready', value: `${readinessScore}%` },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  {stat.icon}
                  <span className="text-[11px] text-gray-500 font-medium">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Achievements</h2>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 min-w-[200px] md:min-w-0 shrink-0 md:shrink">
                  <div className={`p-2 rounded-xl ${achievement.color} text-white shrink-0`}>
                    {achievement.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{achievement.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Domain Progress - 2-col on mobile */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Domain Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {domainProgress.map((domain) => {
              const domainInfo = domains.find(d => d.id === domain.domain)
              return (
                <div key={domain.domain} className="bg-white p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${domainInfo?.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <span className="text-white">{domainInfo?.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{domainInfo?.name}</h3>
                      <p className="text-xs text-gray-500">{domain.accuracy}% accuracy</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Hours</span>
                        <span>{Math.round(domain.hoursStudied * 10) / 10}h</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(domain.hoursStudied / 10 * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Questions</span>
                        <span>{domain.questionsAnswered}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(domain.questionsAnswered / 20 * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {domain.lastStudied && (
                    <p className="text-[10px] text-gray-400 mt-2">
                      Last: {new Date(domain.lastStudied).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Needs Attention</h2>
            <div className="space-y-2">
              {weakAreas.map((area) => {
                const domainInfo = domains.find(d => d.id === area.domain)
                return (
                  <div key={area.domain} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className={`w-9 h-9 ${domainInfo?.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                      {domainInfo?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{domainInfo?.name}</p>
                      <p className="text-xs text-gray-600">
                        {area.accuracy}% accuracy &middot; {Math.round(area.hoursStudied * 10) / 10}h studied
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 uppercase shrink-0">Review</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Recent Activity */}
        <section className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentActivity.map((session) => {
                  const domainInfo = domains.find(d => d.id === session.domain)
                  return (
                    <div key={session.id} className="flex items-center gap-3 p-3 md:p-4">
                      <div className={`w-9 h-9 ${domainInfo?.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                        {domainInfo?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session.activity.charAt(0).toUpperCase() + session.activity.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {domainInfo?.name} &middot; {session.duration}m
                          {session.materialTitle && ` · ${session.materialTitle}`}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-400 shrink-0 text-right">
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">No recent activity. Start studying to track progress!</p>
              </div>
            )}
          </div>
        </section>

        {/* Readiness Assessment */}
        <section className="mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
            <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4">Readiness Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">Overall Readiness</span>
                  <span className={`text-sm font-bold ${
                    readinessScore >= 80 ? 'text-green-600' :
                    readinessScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {readinessScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      readinessScore >= 80 ? 'bg-green-600' :
                      readinessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {readinessScore >= 80 ? 'Well-prepared for the exam.' :
                   readinessScore >= 60 ? 'Good progress. Focus on weak areas.' :
                   'Increase study time and accuracy.'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {readinessScore < 80 && <li>• Study weak domains more</li>}
                  {studyStreak < 3 && <li>• Build a daily study habit</li>}
                  {domainProgress.some(d => d.accuracy < 70) && <li>• Review incorrect answers</li>}
                  {domainProgress.some(d => d.hoursStudied < 5) && <li>• Spend more time on understudied areas</li>}
                  <li>• Take timed practice exams</li>
                  <li>• Review flashcards daily</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacer for mobile nav */}
        <div className="h-4 md:h-0" />
      </main>
    </div>
  )
} 