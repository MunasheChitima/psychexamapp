#!/usr/bin/env npx tsx
/**
 * Exports question fingerprints for deduplication in generate-content.ts.
 * Run before generate to ensure new questions don't duplicate existing ones.
 *
 * Usage: npx tsx scripts/export-question-fingerprints.ts
 * Output: .question-fingerprints.json (gitignored)
 */

import * as fs from 'fs'
import * as path from 'path'
import { createHash } from 'crypto'

function fingerprint(q: { question?: string; caseStudy?: string }): string {
  const qn = (q.question ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
  const cs = (q.caseStudy ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
  return createHash('sha256').update(`${qn}|||${cs}`).digest('hex')
}

async function main() {
  const outputPath = path.resolve(__dirname, '../.question-fingerprints.json')

  try {
    const mod = await import('../src/data/comprehensive/index.ts')
    const all = mod.allPracticeQuestions ?? []
    const fp = all.map((q: { question?: string; caseStudy?: string }) => fingerprint(q))
    fs.writeFileSync(outputPath, JSON.stringify(fp), 'utf-8')
    console.log(`Exported ${fp.length} fingerprints to .question-fingerprints.json`)
  } catch (err) {
    console.error('Could not load questions:', err)
    process.exit(1)
  }
}

main()
