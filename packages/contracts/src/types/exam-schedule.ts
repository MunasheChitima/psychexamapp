export interface ExamSitting {
  id: string
  label: string
  examStart: string
  examEnd: string
  registrationOpen: string
  registrationClose: string
}

export interface PricingTier {
  id: string
  label: string
  total: number
  minMonths: number
  savings: string
}

export interface PriceQuote {
  tierId: string
  tierLabel: string
  total: number
  months: number
}
