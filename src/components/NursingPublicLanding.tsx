import Link from 'next/link'
import { BookOpen, Stethoscope, Target, Users } from 'lucide-react'

export default function NursingPublicLanding() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">APRAcademy: Nursing</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/pricing" className="text-gray-700 hover:text-emerald-700 font-medium">
              Pricing
            </Link>
            <Link
              href="/signin?callbackUrl=/nursing/dashboard"
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <p className="text-sm font-semibold text-emerald-800 mb-3">AHPRA nursing exam prep</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          NCLEX-style questions, OSCE practice, and clinical drills
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          One app for Australian nursing registration prep: adaptive quizzes, flashcards across clinical domains,
          drug calculations, and timed simulations — aligned to your exam blueprint.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/signin?callbackUrl=/nursing/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Start studying
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 border-2 border-emerald-200 text-emerald-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
          >
            View pricing
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: Target, title: 'Exam-style questions', body: 'Domain-weighted practice with explanations and references.' },
            { icon: BookOpen, title: 'Flashcards & materials', body: 'Spaced repetition and deep-dive study notes.' },
            { icon: Users, title: 'Live quiz & buddies', body: 'Study with peers when you want company.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
              <Icon className="w-8 h-8 text-emerald-600 mb-3" />
              <h2 className="font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
