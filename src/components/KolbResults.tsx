'use client'

import { useState } from 'react'
import {
    Brain,
    BookOpen,
    Target,
    Star,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    TrendingUp,
    RotateCcw,
    Shield,
    Zap,
    Eye,
    Calendar,
    GraduationCap
} from 'lucide-react'
import {
    getKolbStyleById,
    kolbLearningStyles,
    type KolbStyleId
} from '@/data/kolbLearningStyles'
interface KolbResultsProps {
    styleId: KolbStyleId
    scores: { CE: number; RO: number; AC: number; AE: number }
    onRetake: () => void
}

export default function KolbResults({ styleId, scores, onRetake }: KolbResultsProps) {
    const style = getKolbStyleById(styleId)
    const [activeTab, setActiveTab] = useState<'overview' | 'strategies' | 'exam' | 'improve'>('overview')

    const scoreDimensions = [
        { label: 'Concrete Experience (CE)', value: scores.CE, desc: 'Learning through feelings and experiences', color: 'bg-pink-500' },
        { label: 'Reflective Observation (RO)', value: scores.RO, desc: 'Learning through watching and listening', color: 'bg-blue-500' },
        { label: 'Abstract Conceptualisation (AC)', value: scores.AC, desc: 'Learning through thinking and analysing', color: 'bg-indigo-500' },
        { label: 'Active Experimentation (AE)', value: scores.AE, desc: 'Learning through doing and practising', color: 'bg-green-500' },
    ]

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: <Eye className="w-4 h-4" /> },
        { id: 'strategies' as const, label: 'Study Strategies', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'exam' as const, label: 'Exam Tips', icon: <Target className="w-4 h-4" /> },
        { id: 'improve' as const, label: 'Improve', icon: <TrendingUp className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Hero result card */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
                    <div className={`bg-gradient-to-r ${style.gradient} p-8 text-white`}>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0">
                                <span className="text-5xl">{style.iconEmoji}</span>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <p className="text-sm font-medium opacity-80 uppercase tracking-wide mb-1">Your Learning Style</p>
                                <h1 className="text-4xl font-bold mb-2">{style.name}</h1>
                                <p className="text-xl opacity-90 mb-3">{style.shortDesc}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                                        {style.experientialModes.primary}
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                                        {style.experientialModes.secondary}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">{style.description}</p>

                        {/* Score breakdown */}
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Brain className="w-5 h-5 text-indigo-600" />
                                <span>Your Score Breakdown</span>
                            </h3>
                            <div className="space-y-4">
                                {scoreDimensions.map((dim) => (
                                    <div key={dim.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{dim.label}</span>
                                            <span className="text-gray-500">{dim.value}/{kolbLearningStyles.length > 0 ? '12' : '12'}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`${dim.color} h-3 rounded-full transition-all duration-700 ease-out`}
                                                style={{ width: `${(dim.value / 12) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{dim.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="flex overflow-x-auto mb-8 bg-white rounded-xl shadow-sm border p-1.5 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.id
                                    ? `bg-gradient-to-r ${style.gradient} text-white shadow-md`
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Characteristics */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center`}>
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <span>Key Characteristics</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {style.characteristics.map((char, i) => (
                                    <div key={i} className={`flex items-start space-x-3 ${style.bgLight} ${style.borderColor} border rounded-xl p-4`}>
                                        <CheckCircle className={`w-5 h-5 ${style.textColor} mt-0.5 flex-shrink-0`} />
                                        <span className="text-gray-700">{char}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span>Your Strengths</span>
                                </h3>
                                <div className="space-y-2">
                                    {style.strengths.map((strength, i) => (
                                        <div key={i} className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-xl p-3">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-green-800 font-medium text-sm">{strength}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    <span>Areas for Growth</span>
                                </h3>
                                <div className="space-y-2">
                                    {style.weaknesses.map((weakness, i) => (
                                        <div key={i} className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                            <span className="text-amber-800 text-sm">{weakness}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Feedback style */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <span>How You Receive Feedback Best</span>
                            </h3>
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                                <p className="text-gray-700 leading-relaxed text-lg">{style.feedbackStyle}</p>
                            </div>
                        </div>

                        {/* Optimal Environment */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-indigo-500" />
                                <span>Optimal Learning Environment</span>
                            </h3>
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                                <p className="text-gray-700 leading-relaxed text-lg">{style.optimalEnvironment}</p>
                            </div>

                            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Preferred Learning Methods:</h4>
                            <div className="flex flex-wrap gap-2">
                                {style.learningMethods.map((method, i) => (
                                    <span key={i} className={`${style.bgLight} ${style.borderColor} border ${style.textColor} px-4 py-2 rounded-xl text-sm font-medium`}>
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'strategies' && (
                    <div className="space-y-6">
                        {/* General study strategies */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center`}>
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span>Study Strategies for {style.name} Learners</span>
                            </h2>
                            <p className="text-gray-600 mb-6">
                                These strategies are specifically designed for your learning style. They align with how you naturally
                                perceive and process information, making your study sessions more effective.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {style.studyStrategies.map((strategy, i) => (
                                    <div key={i} className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-sm">{i + 1}</span>
                                        </div>
                                        <span className="text-gray-700 leading-snug">{strategy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Psychology exam specific strategies */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center`}>
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span>Psychology Exam Strategies</span>
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Tailored strategies for each exam domain, designed specifically for {style.name} learners preparing
                                for the National Psychology Examination.
                            </p>
                            <div className="space-y-4">
                                {style.psychExamStrategies.map((strategy, i) => (
                                    <div key={i} className={`flex items-start space-x-3 ${style.bgLight} ${style.borderColor} border rounded-xl p-4`}>
                                        <Zap className={`w-5 h-5 ${style.textColor} mt-0.5 flex-shrink-0`} />
                                        <span className="text-gray-700 leading-relaxed">{strategy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'exam' && (
                    <div className="space-y-6">
                        {/* Exam day tips */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center`}>
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <span>Exam Day Tips</span>
                            </h2>
                            <p className="text-gray-600 mb-6">
                                On the day of your National Psychology Examination, keep these tips in mind
                                based on your {style.name} learning style.
                            </p>
                            <div className="space-y-4">
                                {style.examDayTips.map((tip, i) => (
                                    <div key={i} className="flex items-start space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 text-lg leading-relaxed">{tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Domain-specific quick reference */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Target className="w-5 h-5 text-indigo-600" />
                                <span>Quick Reference: Study Approach by Domain</span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                    <h4 className="font-bold text-blue-800 mb-2 flex items-center space-x-2">
                                        <span className="text-lg">⚖️</span>
                                        <span>Ethics (30%)</span>
                                    </h4>
                                    <p className="text-blue-700 text-sm leading-relaxed">
                                        {styleId === 'diverging' && 'Explore dilemmas from multiple perspectives. Use role-play and group discussion to understand stakeholder viewpoints.'}
                                        {styleId === 'assimilating' && 'Build a systematic framework of ethical principles. Create decision trees for common dilemmas.'}
                                        {styleId === 'converging' && 'Practice applying the APS Code directly to specific scenarios. Focus on the practical resolution steps.'}
                                        {styleId === 'accommodating' && 'Walk through scenarios as if you are the clinician. Use active discussion with study partners.'}
                                    </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                    <h4 className="font-bold text-green-800 mb-2 flex items-center space-x-2">
                                        <span className="text-lg">📊</span>
                                        <span>Assessment (30%)</span>
                                    </h4>
                                    <p className="text-green-700 text-sm leading-relaxed">
                                        {styleId === 'diverging' && 'Create visual comparison charts of assessment tools. Connect each tool to the human experience it measures.'}
                                        {styleId === 'assimilating' && 'Study the psychometric properties systematically. Build comparison tables of validity and reliability data.'}
                                        {styleId === 'converging' && 'Practice with case scenarios requiring assessment selection. Focus on when and why to use each tool.'}
                                        {styleId === 'accommodating' && 'Practice administering assessments in study groups. Learn by doing rather than just reading about tools.'}
                                    </p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                                    <h4 className="font-bold text-purple-800 mb-2 flex items-center space-x-2">
                                        <span className="text-lg">🧠</span>
                                        <span>Interventions (30%)</span>
                                    </h4>
                                    <p className="text-purple-700 text-sm leading-relaxed">
                                        {styleId === 'diverging' && 'Connect intervention techniques to patient stories and outcomes. Use case studies with emotional depth.'}
                                        {styleId === 'assimilating' && 'Build theoretical models linking interventions to their evidence base. Study the research underlying each approach.'}
                                        {styleId === 'converging' && 'Create step-by-step protocols for each intervention. Practice with structured scenarios.'}
                                        {styleId === 'accommodating' && 'Role-play intervention sessions. Practice being the therapist with a study partner as the client.'}
                                    </p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                                    <h4 className="font-bold text-orange-800 mb-2 flex items-center space-x-2">
                                        <span className="text-lg">💬</span>
                                        <span>Communication (10%)</span>
                                    </h4>
                                    <p className="text-orange-700 text-sm leading-relaxed">
                                        {styleId === 'diverging' && 'Focus on the relational aspects of professional communication. Practice empathic reflection and active listening.'}
                                        {styleId === 'assimilating' && 'Create a framework for different communication contexts. Develop structured templates for professional correspondence.'}
                                        {styleId === 'converging' && 'Practice with specific communication scripts and templates. Focus on practical outcomes of each interaction.'}
                                        {styleId === 'accommodating' && 'Practice real conversations with study partners. Focus on doing rather than reading about communication skills.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'improve' && (
                    <div className="space-y-6">
                        {/* Improvement tips */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${style.gradient} rounded-xl flex items-center justify-center`}>
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <span>How to Improve Your Study Outcomes</span>
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Every learning style has areas for growth. Here&apos;s how to develop as a {style.name} learner
                                and improve your exam performance:
                            </p>
                            <div className="space-y-4">
                                {style.improvementTips.map((tip, i) => (
                                    <div key={i} className="flex items-start space-x-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Lightbulb className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cross-referencing with other styles */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Brain className="w-5 h-5 text-indigo-600" />
                                <span>Learn From Other Styles</span>
                            </h3>
                            <p className="text-gray-600 mb-6">
                                While your primary style is {style.name}, you can strengthen your learning by borrowing techniques
                                from complementary styles:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {kolbLearningStyles
                                    .filter(s => s.id !== styleId)
                                    .map((otherStyle) => (
                                        <div key={otherStyle.id} className={`${otherStyle.bgLight} ${otherStyle.borderColor} border rounded-xl p-5`}>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="text-2xl">{otherStyle.iconEmoji}</span>
                                                <h4 className={`font-bold ${otherStyle.textColor}`}>{otherStyle.name}</h4>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{otherStyle.shortDesc}</p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Try:</strong> {otherStyle.studyStrategies[0]}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Recommended study schedule */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <span>Recommended Weekly Study Pattern</span>
                            </h3>
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                                {styleId === 'diverging' && (
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Monday/Wednesday:</strong> Group study sessions — discuss case studies and ethical dilemmas</p>
                                        <p><strong>Tuesday/Thursday:</strong> Creative review — mind maps, visual summaries, and storytelling</p>
                                        <p><strong>Friday:</strong> Practice questions with reflection on answers</p>
                                        <p><strong>Weekend:</strong> Light review with personal reflection journal</p>
                                    </div>
                                )}
                                {styleId === 'assimilating' && (
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Monday/Wednesday:</strong> Deep reading and note-taking sessions</p>
                                        <p><strong>Tuesday/Thursday:</strong> Framework building — create outlines and comparison tables</p>
                                        <p><strong>Friday:</strong> Practice questions with detailed review of rationales</p>
                                        <p><strong>Weekend:</strong> Systematic review and gap analysis</p>
                                    </div>
                                )}
                                {styleId === 'converging' && (
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Monday/Wednesday:</strong> Practice questions and mock exams</p>
                                        <p><strong>Tuesday/Thursday:</strong> Apply theory to clinical scenarios</p>
                                        <p><strong>Friday:</strong> Timed practice test under exam conditions</p>
                                        <p><strong>Weekend:</strong> Review weak areas with targeted study</p>
                                    </div>
                                )}
                                {styleId === 'accommodating' && (
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Monday/Wednesday:</strong> Active practice — flashcards, quizzes, and role-play</p>
                                        <p><strong>Tuesday/Thursday:</strong> Study group sessions with hands-on activities</p>
                                        <p><strong>Friday:</strong> Teach a topic to someone else (best retention method for your style)</p>
                                        <p><strong>Weekend:</strong> Interactive review using varied methods</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onRetake}
                        className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Retake Assessment</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
