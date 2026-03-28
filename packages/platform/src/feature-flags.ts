const truthyValues = new Set(['1', 'true', 'yes', 'on'])

export function asBooleanFlag(value: string | undefined): boolean {
  if (!value) return false
  return truthyValues.has(value.trim().toLowerCase())
}

export function isGuestCloudSaveEnabled(): boolean {
  return asBooleanFlag(process.env.NEXT_PUBLIC_ENABLE_GUEST_CLOUD_SAVE)
}
