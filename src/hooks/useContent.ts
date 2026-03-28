'use client'

import { useState, useEffect } from 'react'
import type { PracticeQuestion, Flashcard, StudyMaterial } from '@apracademy/contracts'
import type { ProductLine } from '@apracademy/contracts'

async function readFetchError(res: Response, fallback: string): Promise<string> {
  try {
    const text = await res.text()
    const trimmed = text.trim()
    if (trimmed) {
      try {
        const j = JSON.parse(trimmed) as { error?: unknown }
        if (typeof j.error === 'string' && j.error) return j.error
      } catch {
        return trimmed.length <= 300 ? trimmed : `${trimmed.slice(0, 280)}…`
      }
    }
  } catch {
    /* ignore */
  }
  return res.statusText || fallback
}

export function usePracticeQuestions(productLine: ProductLine | null) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productLine) {
      setQuestions([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/content/questions?productLine=${encodeURIComponent(productLine)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await readFetchError(res, 'Failed to load questions'))
        return res.json()
      })
      .then((data: PracticeQuestion[]) => {
        setQuestions(data)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load questions')
        setQuestions([])
      })
      .finally(() => setLoading(false))
  }, [productLine])

  return { questions, loading, error }
}

export function useFlashcards(productLine: ProductLine | null) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productLine) {
      setFlashcards([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/content/flashcards?productLine=${encodeURIComponent(productLine)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await readFetchError(res, 'Failed to load flashcards'))
        return res.json()
      })
      .then((data: Flashcard[]) => {
        setFlashcards(data)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load flashcards')
        setFlashcards([])
      })
      .finally(() => setLoading(false))
  }, [productLine])

  return { flashcards, loading, error }
}

/** API-backed study materials (same shape as static packs when DB is empty). */
export function useStudyMaterials(productLine: ProductLine | null) {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productLine) {
      setMaterials([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/content/study-materials?productLine=${encodeURIComponent(productLine)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await readFetchError(res, 'Failed to load study materials'))
        return res.json()
      })
      .then((data: StudyMaterial[]) => {
        setMaterials(data)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load study materials')
        setMaterials([])
      })
      .finally(() => setLoading(false))
  }, [productLine])

  return { materials, loading, error }
}
