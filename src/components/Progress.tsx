'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  AlertCircle,
  BarChart3, 
  Brain, 
  Users, 
  MessageSquare,
  Calendar,
  Award,
  Trophy
} from 'lucide-react'
import { ComponentProps } from '@/types'

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

export default function Progress({ appData, updateAppData }: ComponentProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week')
  const [studySessions, setStudySessions] = useState<StudySession[]>([])

  const domains = [
    { id: 'ethics', name: 'Ethics', color: 'bg-blue-500', icon: <Users className="w-6 h-6" /> },
    { id: 'assessment', name: 'Assessment', color: 'bg-green-500', icon: <BarChart3 className="w-6 h-6" /> },
    { id: 'interventions', name: 'Interventions', color: 'bg-purple-500', icon: <Brain className="w-6 h-6" /> },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500', icon: <MessageSquare className="w-6 h-6" /> }
  ]

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

    // Calculate from practice results
    if (appData.practiceResults && Array.isArray(appData.practiceResults)) {
      appData.practiceResults.forEach(result => {
        if (result.questions && Array.isArray(result.questions)) {
          result.questions.forEach((question) => {
            if (domainStats[question.domain]) {
              domainStats[question.domain].questionsAnswered += 1
              // Note: We don't have individual question results, so we'll estimate
              // based on overall quiz performance
              const correctRate = result.score / 100
              if (Math.random() < correctRate) {
                domainStats[question.domain].correctAnswers += 1
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
              <p className="text-gray-600 mt-1">Monitor your study progress and performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(appData.studyStats.totalHours * 10) / 10}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appData.studyStats.questionsAnswered}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">{studyStreak} days</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Readiness Score</p>
                <p className="text-2xl font-bold text-gray-900">{readinessScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${achievement.color} text-white`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domain Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainProgress.map((domain) => {
              const domainInfo = domains.find(d => d.id === domain.domain)
              return (
                <div key={domain.domain} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${domainInfo?.color}`}>
                      <div className="text-white">
                        {domainInfo?.icon}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {domain.accuracy}% accuracy
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {domainInfo?.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Hours Studied</span>
                        <span>{Math.round(domain.hoursStudied * 10) / 10}h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(domain.hoursStudied / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Questions</span>
                        <span>{domain.questionsAnswered}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(domain.questionsAnswered / 20 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {domain.lastStudied && (
                    <p className="text-xs text-gray-500 mt-3">
                      Last studied: {new Date(domain.lastStudied).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Areas Needing Attention</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Focus on these areas to improve your readiness</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weakAreas.map((area) => {
                  const domainInfo = domains.find(d => d.id === area.domain)
                  return (
                    <div key={area.domain} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${domainInfo?.color} text-white`}>
                          {domainInfo?.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{domainInfo?.name}</h4>
                          <p className="text-sm text-gray-600">
                            {area.accuracy}% accuracy, {Math.round(area.hoursStudied * 10) / 10}h studied
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">Needs Review</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentActivity.map((session) => {
                  const domainInfo = domains.find(d => d.id === session.domain)
                  return (
                    <div key={session.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${domainInfo?.color} text-white`}>
                            {domainInfo?.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {session.activity.charAt(0).toUpperCase() + session.activity.slice(1)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {domainInfo?.name} • {session.duration} minutes
                            </p>
                            {session.materialTitle && (
                              <p className="text-sm text-gray-500">
                                {session.materialTitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No recent activity. Start studying to see your progress!</p>
              </div>
            )}
          </div>
        </div>

        {/* Readiness Assessment */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Readiness Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Overall Readiness</span>
                  <span className={`font-semibold ${
                    readinessScore >= 80 ? 'text-green-600' :
                    readinessScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {readinessScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      readinessScore >= 80 ? 'bg-green-600' :
                      readinessScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {readinessScore >= 80 ? 'Excellent! You\'re well-prepared for the exam.' :
                   readinessScore >= 60 ? 'Good progress, but continue studying weak areas.' :
                   'Focus on increasing study time and improving accuracy.'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {readinessScore < 80 && (
                  <li>• Increase study time in weak domains</li>
                )}
                {studyStreak < 3 && (
                  <li>• Maintain a consistent study schedule</li>
                )}
                {domainProgress.some(d => d.accuracy < 70) && (
                  <li>• Review incorrect practice questions</li>
                )}
                {domainProgress.some(d => d.hoursStudied < 5) && (
                  <li>• Spend more time on understudied domains</li>
                )}
                <li>• Take timed practice exams</li>
                <li>• Review flashcards regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 