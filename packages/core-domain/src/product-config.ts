import type { Domain, ProductLine, DomainConfig, ProductConfig } from '@apracademy/contracts'

export const PSYCHOLOGY_DOMAINS: DomainConfig[] = [
  { id: 'ethics', name: 'Ethics', shortName: 'Ethics', color: 'bg-blue-500', examWeight: 30 },
  { id: 'assessment', name: 'Assessment', shortName: 'Assessment', color: 'bg-green-500', examWeight: 30 },
  { id: 'interventions', name: 'Interventions', shortName: 'Interventions', color: 'bg-purple-500', examWeight: 30 },
  { id: 'communication', name: 'Communication', shortName: 'Communication', color: 'bg-orange-500', examWeight: 10 },
]

export const NURSING_DOMAINS: DomainConfig[] = [
  { id: 'management-of-care', name: 'Management of Care', shortName: 'Management', color: 'bg-blue-600', examWeight: 18 },
  { id: 'safety-infection', name: 'Safety and Infection Prevention', shortName: 'Safety', color: 'bg-emerald-600', examWeight: 13 },
  { id: 'health-promotion', name: 'Health Promotion and Maintenance', shortName: 'Health Promo', color: 'bg-cyan-600', examWeight: 9 },
  { id: 'psychosocial', name: 'Psychosocial Integrity', shortName: 'Psychosocial', color: 'bg-violet-600', examWeight: 9 },
  { id: 'basic-care', name: 'Basic Care and Comfort', shortName: 'Basic Care', color: 'bg-fuchsia-600', examWeight: 9 },
  { id: 'pharmacology', name: 'Pharmacological Therapies', shortName: 'Pharm', color: 'bg-rose-600', examWeight: 16 },
  { id: 'risk-reduction', name: 'Reduction of Risk Potential', shortName: 'Risk', color: 'bg-amber-600', examWeight: 12 },
  { id: 'physiological', name: 'Physiological Adaptation', shortName: 'Physio', color: 'bg-teal-600', examWeight: 14 },
  { id: 'osce-skills', name: 'OSCE Clinical Skills', shortName: 'OSCE', color: 'bg-slate-600', examWeight: 0 },
]

export const PRODUCT_CONFIGS: Record<ProductLine, ProductConfig> = {
  psychology: {
    id: 'psychology',
    title: 'Psychology',
    examName: 'National Psychology Exam',
    domains: PSYCHOLOGY_DOMAINS,
    pages: ['dashboard', 'flashcards', 'practice', 'materials', 'progress', 'learning-style', 'exam-simulation', 'live-session', 'buddy', 'pricing', 'submit-results', 'daily-challenge', 'study-plan'],
  },
  nursing: {
    id: 'nursing',
    title: 'Nursing',
    examName: 'AHPRA Nursing (NCLEX-RN + OSCE)',
    domains: NURSING_DOMAINS,
    pages: ['dashboard', 'flashcards', 'practice', 'materials', 'progress', 'exam-simulation', 'osce-simulation', 'drug-calculations', 'live-session', 'buddy', 'pricing', 'submit-results', 'daily-challenge', 'study-plan'],
  },
}

export function getProductConfig(productLine: ProductLine): ProductConfig {
  return PRODUCT_CONFIGS[productLine] ?? PRODUCT_CONFIGS.psychology
}

export function getDefaultDomains(productLine: ProductLine): Domain[] {
  return getProductConfig(productLine).domains.map((domain) => domain.id)
}

export function getDomainName(productLine: ProductLine, domainId: string): string {
  const domain = getProductConfig(productLine).domains.find((item) => item.id === domainId)
  return domain?.name ?? domainId
}
