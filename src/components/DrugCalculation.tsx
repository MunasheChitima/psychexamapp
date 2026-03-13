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

  const isCorrect = useMemo(() => {
    if (!submitted) return false
    const parsed = Number(input)
    if (Number.isNaN(parsed)) return false
    return Math.abs(parsed - question.answer) < 0.11
  }, [submitted, input, question.answer])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl border p-5">
        <h1 className="text-2xl font-bold text-gray-900">Drug Calculation Trainer</h1>
        <p className="text-sm text-gray-600 mt-1">Practice nursing dosage calculations with step-by-step feedback.</p>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <p className="text-sm font-semibold text-gray-800 mb-2">Question</p>
        <p className="text-gray-700">{question.prompt}</p>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter answer"
            className="px-3 py-2 border rounded-lg w-40"
          />
          <span className="text-sm text-gray-600">{question.unit}</span>
          <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
            Check
          </button>
          <button onClick={() => { setQuestion(generateQuestion()); setInput(''); setSubmitted(false) }} className="px-4 py-2 rounded-lg border text-sm font-semibold">
            New Question
          </button>
        </div>
      </div>

      {submitted && (
        <div className={`rounded-2xl border p-5 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            <p className="font-semibold">{isCorrect ? 'Correct' : 'Not quite'}</p>
          </div>
          <p className="text-sm text-gray-700">Expected answer: <strong>{question.answer} {question.unit}</strong></p>
          <p className="text-sm text-gray-700 mt-2">{question.working}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border p-4 flex items-center gap-2 text-sm text-gray-700">
        <Calculator className="w-4 h-4 text-purple-600" />
        <span>Use this to build speed and accuracy for NCLEX-RN style pharmacology calculations.</span>
      </div>
    </div>
  )
}
