/**
 * Study data sync — delegates pure logic to @apracademy/core-domain.
 * Prisma-specific adapters stay here since they depend on the generated client.
 */
import type { Prisma } from '@/generated/prisma/client'
import type { StudyDataPatch } from '@apracademy/contracts'

export { STUDY_DATA_JSON_FIELDS, sanitizeStudyDataPatch, mergeGuestIntoUserStudyData } from '@apracademy/core-domain'
export type { StudyDataPatch } from '@apracademy/contracts'

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

export function toStudyDataUpdateInput(patch: StudyDataPatch): Prisma.StudyDataUpdateInput {
  return {
    ...toSharedDataFields(patch),
    ...(patch.lastSyncedAt !== undefined && { lastSyncedAt: patch.lastSyncedAt }),
    ...(patch.expiresAt !== undefined && { expiresAt: patch.expiresAt }),
  }
}

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
