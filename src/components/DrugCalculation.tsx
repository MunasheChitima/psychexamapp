'use client'

import { useMemo, useState } from 'react'
import { Calculator, CheckCircle2, XCircle } from 'lucide-react'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

type CalcQuestion = {
  prompt: string
  answer: number
  unit: string
  working: string
}

type CalcAttempt = {
  question: CalcQuestion
  userInput: string
  isCorrect: boolean
}

function generateQuestion(): CalcQuestion {
  const weight = randomInt(40, 95)
  const mgPerKg = randomInt(2, 12)
  const concentration = randomInt(5, 25) // mg/mL
  const totalDose = weight * mgPerKg
  const volume = Number((totalDose / concentration).toFixed(1))

  return {
    prompt: `Patient weight is ${weight} kg. Prescribed dose is ${mgPerKg} mg/kg. Stock concentration is ${concentration} mg/mL. What volume should be administered?`,
    answer: volume,
    unit: 'mL',
    working: `Dose = ${weight} x ${mgPerKg} = ${totalDose} mg. Volume = ${totalDose} / ${concentration} = ${volume} mL.`,
  }
}

export default function DrugCalculation() {
  const [question, setQuestion] = useState<CalcQuestion>(() => generateQuestion())
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState<CalcAttempt[]>([])
  const [sessionEnded, setSessionEnded] = useState(false)

  const evaluateAnswer = useMemo(() => {
    const parsed = Number(input)
    if (Number.isNaN(parsed)) return false
    return Math.abs(parsed - question.answer) < 0.11
  }, [input, question.answer])

  const correctCount = useMemo(
    () => attempts.filter((attempt) => attempt.isCorrect).length,
    [attempts]
  )

  const submitAnswer = () => {
    if (submitted || sessionEnded) return
    setSubmitted(true)
    setAttempts((prev) => [
      ...prev,
      {
        question,
        userInput: input.trim(),
        isCorrect: evaluateAnswer,
      },
    ])
  }

  const nextQuestion = () => {
    setQuestion(generateQuestion())
    setInput('')
    setSubmitted(false)
  }

  const endSession = () => {
    if (attempts.length === 0) return
    setSessionEnded(true)
  }

  const startNewSession = () => {
    setAttempts([])
    setSessionEnded(false)
    setQuestion(generateQuestion())
    setInput('')
    setSubmitted(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl border p-5">
        <h1 className="text-2xl font-bold text-gray-900">Drug Calculation Trainer</h1>
        <p className="text-sm text-gray-600 mt-1">Practice nursing dosage calculations and review right/wrong answers at session end.</p>
      </div>

      {!sessionEnded && (
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-sm font-semibold text-gray-800 mb-2">Question</p>
          <p className="text-gray-700">{question.prompt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter answer"
              disabled={submitted}
              className="px-3 py-2 border rounded-lg w-40 disabled:bg-gray-100"
            />
            <span className="text-sm text-gray-600">{question.unit}</span>
            <button
              onClick={submitAnswer}
              disabled={submitted}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              Check
            </button>
            <button
              onClick={nextQuestion}
              className="px-4 py-2 rounded-lg border text-sm font-semibold"
            >
              New Question
            </button>
            <button
              onClick={endSession}
              disabled={attempts.length === 0}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold disabled:opacity-50"
            >
              End Session
            </button>
          </div>

          {submitted && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">Answer recorded. Continue with a new question or end session to review results.</p>
            </div>
          )}
        </div>
      )}

      {sessionEnded && (
        <div className="bg-white rounded-2xl border p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Session Review</h2>
              <p className="text-sm text-gray-600 mt-1">{correctCount} of {attempts.length} correct</p>
            </div>
            <button
              onClick={startNewSession}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              Start New Session
            </button>
          </div>

          <div className="space-y-3">
            {attempts.map((attempt, idx) => (
              <div
                key={`${attempt.question.prompt}-${idx}`}
                className={`rounded-xl border p-4 ${attempt.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-1">Question {idx + 1}</p>
                <p className="text-sm text-gray-800 mb-2">{attempt.question.prompt}</p>
                <div className="flex items-center gap-2 mb-2">
                  {attempt.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                  <p className={`text-sm font-semibold ${attempt.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {attempt.isCorrect ? 'Right' : 'Wrong'}
                  </p>
                </div>
                <p className="text-sm text-gray-700">Your answer: <strong>{attempt.userInput || 'No input'}</strong> {attempt.question.unit}</p>
                <p className="text-sm text-gray-700">Correct answer: <strong>{attempt.question.answer} {attempt.question.unit}</strong></p>
                <p className="text-sm text-gray-700 mt-2">{attempt.question.working}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border p-4 flex items-center gap-2 text-sm text-gray-700">
        <Calculator className="w-4 h-4 text-purple-600" />
        <span>Use this to build speed and accuracy for NCLEX-RN style pharmacology calculations.</span>
      </div>
    </div>
  )
}
