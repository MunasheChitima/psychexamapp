'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, ClipboardList } from 'lucide-react'

type Station = {
  id: string
  title: string
  focus: string
  scenario: string
  checklist: string[]
}

const STATIONS: Station[] = [
  {
    id: 'osce-1',
    title: 'Medication Administration',
    focus: 'Identifiers, allergy checks, safe administration sequence',
    scenario: 'Administer a scheduled high-risk medication while maintaining patient safety and communication.',
    checklist: ['Confirm patient identifiers', 'Check allergies and order', 'Explain procedure clearly', 'Administer safely', 'Document accurately'],
  },
  {
    id: 'osce-2',
    title: 'Clinical Handover (ISBAR)',
    focus: 'Structured communication under time pressure',
    scenario: 'Provide handover for a deteriorating patient to the incoming team in under 90 seconds.',
    checklist: ['State clear situation', 'Provide relevant background', 'Summarize assessment', 'Give explicit recommendation'],
  },
  {
    id: 'osce-3',
    title: 'Aseptic Technique',
    focus: 'Infection prevention and procedural safety',
    scenario: 'Prepare and perform a sterile dressing change with ANTT principles.',
    checklist: ['Hand hygiene at key moments', 'Maintain sterile field', 'Avoid contamination', 'Escalate abnormalities'],
  },
]

export default function OSCESimulation() {
  const [index, setIndex] = useState(0)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const station = STATIONS[index]

  useEffect(() => {
    if (startedAt === null) {
      setElapsedSeconds(0)
      return
    }
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  const completedCount = station.checklist.filter((item) => checked[item]).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl border p-5">
        <h1 className="text-2xl font-bold text-gray-900">OSCE Simulation</h1>
        <p className="text-sm text-gray-600 mt-1">Practice station-based nursing scenarios in an Australian context.</p>
      </div>

      <div className="bg-white rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Station {index + 1} of {STATIONS.length}</p>
            <h2 className="text-xl font-bold text-gray-900">{station.title}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Checklist</p>
            <p className="text-lg font-bold text-emerald-600">{completedCount}/{station.checklist.length}</p>
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Focus</p>
          <p className="text-sm text-blue-900">{station.focus}</p>
        </div>

        <div className="rounded-xl bg-gray-50 border p-4 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-1">Scenario</p>
          <p className="text-sm text-gray-700">{station.scenario}</p>
        </div>

        <div className="space-y-2 mb-4">
          {station.checklist.map((item) => (
            <label key={item} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
              <input
                type="checkbox"
                checked={Boolean(checked[item])}
                onChange={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
              />
              <span className="text-sm text-gray-800">{item}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStartedAt(Date.now())} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
            Start Timed Station (8 min)
          </button>
          <button onClick={() => setChecked({})} className="px-4 py-2 rounded-lg border text-sm font-semibold">
            Reset Checklist
          </button>
          <button onClick={() => setIndex((prev) => Math.max(0, prev - 1))} disabled={index === 0} className="px-4 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50">
            Previous
          </button>
          <button onClick={() => { setIndex((prev) => Math.min(STATIONS.length - 1, prev + 1)); setChecked({}); setStartedAt(null) }} disabled={index === STATIONS.length - 1} className="px-4 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-4 flex items-center gap-4 text-sm text-gray-700">
        <Clock className="w-4 h-4 text-blue-600" />
        <span>Elapsed: {elapsedSeconds}s</span>
        <ClipboardList className="w-4 h-4 text-purple-600" />
        <span>Use this as a self-assessment station drill.</span>
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Align responses with NMBA standards and local policy.</span>
      </div>
    </div>
  )
}
