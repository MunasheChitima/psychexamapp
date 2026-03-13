'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, Send, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, Info } from 'lucide-react'
import { EXAM_SITTINGS_2026, FAIL_DISCOUNT_PERCENT, type ExamSitting } from '@/lib/examSchedule'

interface ExamResultRecord {
  id: string
  examSittingId: string
  candidateNumber: string
  resultDescription: string
  outcome: string
  status: string
  adminNotes: string | null
  createdAt: string
}

interface SubmitResultsProps {
  onDiscountUnlocked?: () => void
}

export default function SubmitResults({ onDiscountUnlocked }: SubmitResultsProps) {
  const [results, setResults] = useState<ExamResultRecord[]>([])
  const [hasApprovedFail, setHasApprovedFail] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedSitting, setSelectedSitting] = useState('')
  const [candidateNumber, setCandidateNumber] = useState('')
  const [resultDescription, setResultDescription] = useState('')

  const pastSittings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return EXAM_SITTINGS_2026.filter(s => s.examEnd < today)
  }, [])

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/exam-results')
      if (res.ok) {
        const data = await res.json()
        setResults(data.results)
        setHasApprovedFail(data.hasApprovedFail)
        if (data.hasApprovedFail && onDiscountUnlocked) {
          onDiscountUnlocked()
        }
      }
    } catch {
      console.error('Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }, [onDiscountUnlocked])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/exam-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examSittingId: selectedSitting,
          candidateNumber,
          resultDescription,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        return
      }

      setSuccess('Your result has been submitted for verification. We will review it and notify you once approved.')
      setSelectedSitting('')
      setCandidateNumber('')
      setResultDescription('')
      fetchResults()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getSittingLabel = (sittingId: string) => {
    const sitting = EXAM_SITTINGS_2026.find(s => s.id === sittingId)
    return sitting?.label || sittingId
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" /> Under review
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" /> Not verified
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Exam Results</h1>
        <p className="text-gray-600">
          If you did not pass a previous sitting, submit your results here to qualify for the {FAIL_DISCOUNT_PERCENT}% resubscription discount.
        </p>
      </div>

      {/* Approved discount banner */}
      {hasApprovedFail && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Resit discount unlocked</h3>
            <p className="text-sm text-green-800 mt-1">
              Your failed exam result has been verified. You qualify for {FAIL_DISCOUNT_PERCENT}% off your next subscription. Head to the <strong>Pricing</strong> page to subscribe at the discounted rate.
            </p>
          </div>
        </div>
      )}

      {/* Previous submissions */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Your submissions</h2>
          </div>
          <div className="divide-y">
            {results.map((result) => (
              <div key={result.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{getSittingLabel(result.examSittingId)}</div>
                    <div className="text-xs text-gray-500">
                      Candidate #{result.candidateNumber} &middot; Submitted {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {statusBadge(result.status)}
                </div>
                {result.adminNotes && (
                  <div className="mt-2 text-sm bg-gray-50 rounded-lg p-3 text-gray-700">
                    <strong>Reviewer note:</strong> {result.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission form - only show if no pending or approved fail exists */}
      {!results.some(r => r.status === 'pending' || (r.status === 'approved' && r.outcome === 'fail')) && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Submit a new result
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Provide your exam details so we can verify your result and apply the discount.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              You can only submit results for exam sittings that have already ended. Include as much detail as possible from your AHPRA result notification to speed up verification.
            </p>
          </div>

          {pastSittings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No past exam sittings to submit results for yet.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="sitting" className="block text-sm font-medium text-gray-700 mb-1">
                  Exam sitting
                </label>
                <select
                  id="sitting"
                  value={selectedSitting}
                  onChange={(e) => setSelectedSitting(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select the exam you sat</option>
                  {pastSittings.map((s: ExamSitting) => (
                    <option key={s.id} value={s.id}>{s.label} ({s.examStart} to {s.examEnd})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="candidateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  AHPRA candidate / registration number
                </label>
                <input
                  id="candidateNumber"
                  type="text"
                  value={candidateNumber}
                  onChange={(e) => setCandidateNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. PSY0001234567"
                  required
                />
              </div>

              <div>
                <label htmlFor="resultDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Result details
                </label>
                <textarea
                  id="resultDescription"
                  value={resultDescription}
                  onChange={(e) => setResultDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Copy and paste the relevant section from your AHPRA result notification email, or describe your result (e.g. &quot;Did not meet the passing standard. Overall score: 58%.&quot;)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The more detail you provide, the faster we can verify your result.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for verification
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
