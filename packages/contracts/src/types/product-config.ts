import type { Domain, ProductLine } from './domain'

export type DomainConfig = {
  id: Domain
  name: string
  shortName: string
  color: string
  examWeight: number
}

export type ProductConfig = {
  id: ProductLine
  title: string
  examName: string
  domains: DomainConfig[]
  pages: string[]
}
