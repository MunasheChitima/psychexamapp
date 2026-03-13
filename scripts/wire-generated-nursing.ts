#!/usr/bin/env npx tsx
import * as fs from 'fs'
import * as path from 'path'

const GENERATED_DIR = path.resolve(__dirname, '../src/data/nursing/generated')

function main() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true })
  const files = fs.readdirSync(GENERATED_DIR).filter((file) => file.endsWith('.ts') && file !== 'index.ts')

  const questionFiles: { file: string; varName: string }[] = []
  const flashcardFiles: { file: string; varName: string }[] = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(GENERATED_DIR, file), 'utf-8')
    const qMatch = content.match(/export const (generatedQuestions_\w+)/)
    const fMatch = content.match(/export const (generatedFlashcards_\w+)/)
    if (qMatch) questionFiles.push({ file, varName: qMatch[1] })
    if (fMatch) flashcardFiles.push({ file, varName: fMatch[1] })
  }

  const lines: string[] = []
  lines.push(`import { PracticeQuestion, Flashcard, NursingDomain } from '../../../types'`)
  for (const [idx, q] of questionFiles.entries()) {
    lines.push(`import { ${q.varName} as q_${idx} } from './${q.file.replace('.ts', '')}'`)
  }
  for (const [idx, f] of flashcardFiles.entries()) {
    lines.push(`import { ${f.varName} as f_${idx} } from './${f.file.replace('.ts', '')}'`)
  }
  lines.push('')
  lines.push('const rawGeneratedNursingQuestions: PracticeQuestion[] = [')
  for (const idx of questionFiles.keys()) lines.push(`  ...q_${idx},`)
  lines.push(']')
  lines.push('')
  lines.push('const rawGeneratedNursingFlashcards: Flashcard[] = [')
  for (const idx of flashcardFiles.keys()) lines.push(`  ...f_${idx},`)
  lines.push(']')
  lines.push('')
  lines.push('const FLASHCARD_CAPS: Record<NursingDomain, number> = {')
  lines.push("  'management-of-care': 300,")
  lines.push("  'safety-infection': 220,")
  lines.push("  'health-promotion': 170,")
  lines.push("  psychosocial: 170,")
  lines.push("  'basic-care': 170,")
  lines.push("  pharmacology: 290,")
  lines.push("  'risk-reduction': 220,")
  lines.push("  physiological: 170,")
  lines.push("  'osce-skills': 90,")
  lines.push('}')
  lines.push('')
  lines.push("const normalize = (value: unknown) => String(value ?? '').toLowerCase().replace(/\\s+/g, ' ').trim()")
  lines.push('')
  lines.push('export const allGeneratedNursingQuestions: PracticeQuestion[] = rawGeneratedNursingQuestions')
  lines.push('')
  lines.push('export const allGeneratedNursingFlashcards: Flashcard[] = (() => {')
  lines.push('  const seen = new Set<string>()')
  lines.push("  const domainCounts: Record<NursingDomain, number> = {")
  lines.push("    'management-of-care': 0,")
  lines.push("    'safety-infection': 0,")
  lines.push("    'health-promotion': 0,")
  lines.push("    psychosocial: 0,")
  lines.push("    'basic-care': 0,")
  lines.push("    pharmacology: 0,")
  lines.push("    'risk-reduction': 0,")
  lines.push("    physiological: 0,")
  lines.push("    'osce-skills': 0,")
  lines.push('  }')
  lines.push('')
  lines.push('  return rawGeneratedNursingFlashcards.filter((card) => {')
  lines.push('    if (!(card.domain in FLASHCARD_CAPS)) return false')
  lines.push('    if (!card.question || !card.answer) return false')
  lines.push('    const domain = card.domain as NursingDomain')
  lines.push('    const key = `${domain}::${normalize(card.question)}::${normalize(card.answer)}`')
  lines.push('    if (seen.has(key)) return false')
  lines.push('    if (domainCounts[domain] >= FLASHCARD_CAPS[domain]) return false')
  lines.push('    seen.add(key)')
  lines.push('    domainCounts[domain] += 1')
  lines.push('    return true')
  lines.push('  })')
  lines.push('})()')
  lines.push('')

  fs.writeFileSync(path.join(GENERATED_DIR, 'index.ts'), lines.join('\n'), 'utf-8')
  console.log(`Wired nursing generated files: ${questionFiles.length} question files, ${flashcardFiles.length} flashcard files`)
}

main()
