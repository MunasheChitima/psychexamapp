#!/usr/bin/env npx tsx
import * as fs from 'fs'
import * as path from 'path'
import { spawnSync } from 'child_process'

type Domain =
  | 'management-of-care'
  | 'safety-infection'
  | 'health-promotion'
  | 'psychosocial'
  | 'basic-care'
  | 'pharmacology'
  | 'risk-reduction'
  | 'physiological'
  | 'osce-skills'

const DOMAINS: Domain[] = [
  'management-of-care',
  'safety-infection',
  'health-promotion',
  'psychosocial',
  'basic-care',
  'pharmacology',
  'risk-reduction',
  'physiological',
  'osce-skills',
]

const QUESTION_TARGETS: Record<Domain, number> = {
  'management-of-care': 320,
  'safety-infection': 230,
  'health-promotion': 160,
  psychosocial: 160,
  'basic-care': 160,
  pharmacology: 290,
  'risk-reduction': 220,
  physiological: 230,
  'osce-skills': 30,
}

const FLASHCARD_TARGETS: Record<Domain, number> = {
  'management-of-care': 300,
  'safety-infection': 220,
  'health-promotion': 170,
  psychosocial: 170,
  'basic-care': 170,
  pharmacology: 290,
  'risk-reduction': 220,
  physiological: 170,
  'osce-skills': 90,
}

const PROJECT_ROOT = path.resolve(__dirname, '..')
const GENERATED_DIR = path.resolve(PROJECT_ROOT, 'src/data/nursing/generated')

function run(cmd: string, args: string[]) {
  const result = spawnSync(cmd, args, { cwd: PROJECT_ROOT, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
}

function readCounts(kind: 'questions' | 'flashcards'): Record<Domain, number> {
  const counts = Object.fromEntries(DOMAINS.map((d) => [d, 0])) as Record<Domain, number>
  const pattern = kind === 'questions' ? /domain:\s*"([^"]+)"/g : /domain:\s*"([^"]+)"/g
  const files = fs
    .readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && (kind === 'questions' ? f.startsWith('genQuestions_') : f.startsWith('genFlashcards_')))

  for (const file of files) {
    const text = fs.readFileSync(path.join(GENERATED_DIR, file), 'utf-8')
    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      const domain = match[1] as Domain
      if (domain in counts) counts[domain] += 1
    }
  }
  return counts
}

function printCounts(label: string, counts: Record<Domain, number>) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  console.log(`\n${label} total: ${total}`)
  for (const d of DOMAINS) console.log(`  ${d}: ${counts[d]}`)
}

function topUp(kind: 'questions' | 'flashcards', targets: Record<Domain, number>, maxPasses: number) {
  const batch = kind === 'questions' ? '12' : '16'
  const prefix = kind === 'questions' ? 'nursingq' : 'nursingfc'

  for (let pass = 1; pass <= maxPasses; pass++) {
    const counts = readCounts(kind)
    const deficits = DOMAINS.map((d) => ({ domain: d, deficit: Math.max(0, targets[d] - counts[d]) }))
    const remaining = deficits.reduce((sum, item) => sum + item.deficit, 0)

    printCounts(`${kind} (pass ${pass})`, counts)
    if (remaining === 0) {
      console.log(`\n${kind}: targets met.`)
      return
    }

    console.log(`\n${kind}: remaining deficit ${remaining}`)
    for (const { domain, deficit } of deficits) {
      if (deficit <= 0) continue
      const requestCount = Math.min(300, Math.max(15, Math.ceil(deficit * 1.25)))
      console.log(`\nTop-up ${kind} domain=${domain} deficit=${deficit} request=${requestCount}`)
      run('npx', [
        'tsx',
        'scripts/generate-content.ts',
        '--product',
        'nursing',
        '--type',
        kind,
        '--domain',
        domain,
        '--count',
        String(requestCount),
        '--batch',
        batch,
        '--cloud',
        '--prefix',
        prefix,
      ])
    }
  }
}

function main() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true })
  topUp('questions', QUESTION_TARGETS, 8)
  topUp('flashcards', FLASHCARD_TARGETS, 8)
  run('npx', ['tsx', 'scripts/wire-generated-nursing.ts'])
  const finalQ = readCounts('questions')
  const finalF = readCounts('flashcards')
  printCounts('FINAL questions', finalQ)
  printCounts('FINAL flashcards', finalF)
}

main()
