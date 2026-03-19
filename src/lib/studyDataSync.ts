import type { Prisma } from '@/generated/prisma/client'

export const STUDY_DATA_JSON_FIELDS = new Set([
  'selectedDomains',
  'studyStats',
  'studySessions',
  'flashcardProgress',
  'practiceResults',
  'materialBookmarks',
  'materialCompleted',
  'engagementData',
])

const STUDY_GOALS = new Set(['intensive', 'moderate', 'casual'])

export type StudyDataPatch = {
  examDate?: string
  examSittingId?: string
  studyGoal?: string
  selectedDomains?: unknown
  studyStats?: unknown
  studySessions?: unknown
  flashcardProgress?: unknown
  practiceResults?: unknown
  materialBookmarks?: unknown
  materialCompleted?: unknown
  engagementData?: unknown
  hasCompletedOnboarding?: boolean
  lastSyncedAt?: Date
  expiresAt?: Date
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return JSON.parse(value)
  }
  return value
}

function isValidFieldValue(key: string, value: unknown): boolean {
  if (key === 'examDate' || key === 'examSittingId') {
    return typeof value === 'string'
  }

  if (key === 'studyGoal') {
    return typeof value === 'string' && STUDY_GOALS.has(value)
  }

  if (key === 'hasCompletedOnboarding') {
    return typeof value === 'boolean'
  }

  if (key === 'selectedDomains') {
    return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  }

  if (key === 'studySessions' || key === 'practiceResults') {
    return Array.isArray(value)
  }

  if (key === 'studyStats' || key === 'flashcardProgress' || key === 'materialBookmarks' || key === 'materialCompleted' || key === 'engagementData') {
    return isRecord(value)
  }

  return false
}

export function sanitizeStudyDataPatch(
  updates: unknown
): { ok: true; data: StudyDataPatch } | { ok: false; field?: string; reason: string } {
  if (!isRecord(updates)) {
    return { ok: false, reason: 'Invalid request body' }
  }

  const sanitized: StudyDataPatch = {}
  for (const [key, rawValue] of Object.entries(updates)) {
    if (!(key in {
      examDate: true,
      examSittingId: true,
      studyGoal: true,
      selectedDomains: true,
      studyStats: true,
      studySessions: true,
      flashcardProgress: true,
      practiceResults: true,
      materialBookmarks: true,
      materialCompleted: true,
      engagementData: true,
      hasCompletedOnboarding: true,
    })) {
      continue
    }

    let parsedValue = rawValue
    if (STUDY_DATA_JSON_FIELDS.has(key)) {
      try {
        parsedValue = parseJsonValue(rawValue)
      } catch {
        return { ok: false, field: key, reason: 'Invalid JSON value' }
      }
    }

    if (!isValidFieldValue(key, parsedValue)) {
      return { ok: false, field: key, reason: 'Invalid value type' }
    }

    sanitized[key as keyof StudyDataPatch] = parsedValue as never
  }

  return { ok: true, data: sanitized }
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  return []
}

function asRecord(value: unknown): Record<string, unknown> {
  if (isRecord(value)) return value
  return {}
}

function mergeByIdOrValue(first: unknown, second: unknown): unknown[] {
  const entries = [...asArray(first), ...asArray(second)]
  const byId = new Map<string, unknown>()
  const valueSet = new Set<string>()

  for (const entry of entries) {
    if (isRecord(entry) && typeof entry.id === 'string' && entry.id) {
      byId.set(entry.id, entry)
      continue
    }
    valueSet.add(JSON.stringify(entry))
  }

  const merged = [...byId.values()]
  for (const value of valueSet) {
    merged.push(JSON.parse(value))
  }
  return merged
}

function mergeRecordValues(preferred: unknown, fallback: unknown): Record<string, unknown> {
  return {
    ...asRecord(fallback),
    ...asRecord(preferred),
  }
}

function pickLatestValue<T>(preferred: T | undefined, fallback: T | undefined): T | undefined {
  if (preferred !== null && preferred !== undefined && preferred !== '') return preferred
  return fallback
}

type MergeableStudyData = StudyDataPatch & { updatedAt?: Date | string | null; examDate?: string | null; examSittingId?: string | null }

export function mergeGuestIntoUserStudyData(userData: MergeableStudyData, guestData: MergeableStudyData): StudyDataPatch {
  const userUpdatedAt = userData.updatedAt ? new Date(userData.updatedAt).getTime() : 0
  const guestUpdatedAt = guestData.updatedAt ? new Date(guestData.updatedAt).getTime() : 0
  const guestIsLatest = guestUpdatedAt >= userUpdatedAt

  const preferred = guestIsLatest ? guestData : userData
  const fallback = guestIsLatest ? userData : guestData

  return {
    examDate: pickLatestValue(preferred.examDate, fallback.examDate) || '',
    examSittingId: pickLatestValue(preferred.examSittingId, fallback.examSittingId) || '',
    studyGoal: pickLatestValue(preferred.studyGoal, fallback.studyGoal) || 'moderate',
    selectedDomains: pickLatestValue(preferred.selectedDomains, fallback.selectedDomains) || [],
    studyStats: mergeRecordValues(preferred.studyStats, fallback.studyStats),
    studySessions: mergeByIdOrValue(preferred.studySessions, fallback.studySessions),
    flashcardProgress: mergeRecordValues(preferred.flashcardProgress, fallback.flashcardProgress),
    practiceResults: mergeByIdOrValue(preferred.practiceResults, fallback.practiceResults),
    materialBookmarks: mergeRecordValues(preferred.materialBookmarks, fallback.materialBookmarks),
    materialCompleted: mergeRecordValues(preferred.materialCompleted, fallback.materialCompleted),
    engagementData: mergeRecordValues(preferred.engagementData, fallback.engagementData),
    hasCompletedOnboarding: Boolean(userData.hasCompletedOnboarding || guestData.hasCompletedOnboarding),
  }
}

/** Shared data fields for StudyData/GuestStudyData (JSON fields cast to InputJsonValue). */
function toSharedDataFields(patch: StudyDataPatch) {
  return {
    ...(patch.examDate !== undefined && { examDate: patch.examDate }),
    ...(patch.examSittingId !== undefined && { examSittingId: patch.examSittingId }),
    ...(patch.studyGoal !== undefined && { studyGoal: patch.studyGoal }),
    ...(patch.selectedDomains !== undefined && { selectedDomains: patch.selectedDomains as Prisma.InputJsonValue }),
    ...(patch.studyStats !== undefined && { studyStats: patch.studyStats as Prisma.InputJsonValue }),
    ...(patch.studySessions !== undefined && { studySessions: patch.studySessions as Prisma.InputJsonValue }),
    ...(patch.flashcardProgress !== undefined && { flashcardProgress: patch.flashcardProgress as Prisma.InputJsonValue }),
    ...(patch.practiceResults !== undefined && { practiceResults: patch.practiceResults as Prisma.InputJsonValue }),
    ...(patch.materialBookmarks !== undefined && { materialBookmarks: patch.materialBookmarks as Prisma.InputJsonValue }),
    ...(patch.materialCompleted !== undefined && { materialCompleted: patch.materialCompleted as Prisma.InputJsonValue }),
    ...(patch.engagementData !== undefined && { engagementData: patch.engagementData as Prisma.InputJsonValue }),
    ...(patch.hasCompletedOnboarding !== undefined && { hasCompletedOnboarding: patch.hasCompletedOnboarding }),
  }
}

/** Converts StudyDataPatch to Prisma-compatible update input (JSON fields cast to InputJsonValue). */
export function toStudyDataUpdateInput(patch: StudyDataPatch): Prisma.StudyDataUpdateInput {
  return {
    ...toSharedDataFields(patch),
    ...(patch.lastSyncedAt !== undefined && { lastSyncedAt: patch.lastSyncedAt }),
    ...(patch.expiresAt !== undefined && { expiresAt: patch.expiresAt }),
  }
}

/** Converts StudyDataPatch to Prisma GuestStudyData update input. */
export function toGuestStudyDataUpdateInput(
  patch: StudyDataPatch,
  opts: { lastSyncedAt: Date; expiresAt: Date }
): Prisma.GuestStudyDataUpdateInput {
  return {
    ...toSharedDataFields(patch),
    lastSyncedAt: opts.lastSyncedAt,
    expiresAt: opts.expiresAt,
  }
}

/** Converts StudyDataPatch to Prisma GuestStudyData create input (plain values only). */
export function toGuestStudyDataCreateInput(
  patch: StudyDataPatch,
  opts: { lastSyncedAt: Date; expiresAt: Date; tokenHash: string }
): Prisma.GuestStudyDataCreateInput {
  return {
    ...toSharedDataFields(patch),
    lastSyncedAt: opts.lastSyncedAt,
    expiresAt: opts.expiresAt,
    tokenHash: opts.tokenHash,
  }
}

