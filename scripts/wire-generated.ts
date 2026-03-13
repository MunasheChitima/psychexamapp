#!/usr/bin/env npx tsx
/**
 * Auto-wires generated content files into the data barrel (index.ts).
 * Run after generate-content.ts to integrate new questions/flashcards.
 *
 * Usage: npx tsx scripts/wire-generated.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const GENERATED_DIR = path.resolve(__dirname, '../src/data/comprehensive/generated')
const INDEX_FILE = path.resolve(__dirname, '../src/data/comprehensive/index.ts')

function main() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.log('No generated directory found. Run generate-content.ts first.')
    return
  }

  const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')
  if (files.length === 0) {
    console.log('No generated files found.')
    return
  }

  const questionFiles: { file: string; varName: string }[] = []
  const flashcardFiles: { file: string; varName: string }[] = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(GENERATED_DIR, file), 'utf-8')
    const qMatch = content.match(/export const (generatedQuestions_\w+)/)
    const fMatch = content.match(/export const (generatedFlashcards_\w+)/)

    if (qMatch) questionFiles.push({ file, varName: qMatch[1] })
    if (fMatch) flashcardFiles.push({ file, varName: fMatch[1] })
  }

  console.log(`Found ${questionFiles.length} question file(s), ${flashcardFiles.length} flashcard file(s)`)

  // Generate a barrel file for the generated directory
  const barrelLines: string[] = []

  for (const q of questionFiles) {
    barrelLines.push(`export { ${q.varName} } from './${q.file.replace('.ts', '')}'`)
  }
  for (const f of flashcardFiles) {
    barrelLines.push(`export { ${f.varName} } from './${f.file.replace('.ts', '')}'`)
  }

  // All questions combined
  barrelLines.push('')
  barrelLines.push(`import { PracticeQuestion } from '../../../types'`)
  barrelLines.push(`import { Flashcard } from '../../../types'`)

  for (const q of questionFiles) {
    barrelLines.push(`import { ${q.varName} } from './${q.file.replace('.ts', '')}'`)
  }
  for (const f of flashcardFiles) {
    barrelLines.push(`import { ${f.varName} } from './${f.file.replace('.ts', '')}'`)
  }

  barrelLines.push('')
  barrelLines.push(`export const allGeneratedQuestions: PracticeQuestion[] = [`)
  for (const q of questionFiles) {
    barrelLines.push(`  ...${q.varName},`)
  }
  barrelLines.push(`]`)

  barrelLines.push('')
  barrelLines.push(`export const allGeneratedFlashcards: Flashcard[] = [`)
  for (const f of flashcardFiles) {
    barrelLines.push(`  ...${f.varName},`)
  }
  barrelLines.push(`]`)
  barrelLines.push('')

  fs.writeFileSync(path.join(GENERATED_DIR, 'index.ts'), barrelLines.join('\n'), 'utf-8')
  console.log(`✅ Wrote generated/index.ts (barrel file)`)

  // Now update the main index.ts to import from generated
  let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8')

  const generatedImport = `import { allGeneratedQuestions, allGeneratedFlashcards } from './generated'`

  if (!indexContent.includes('allGeneratedQuestions')) {
    // Add import at the top (after existing imports)
    const lastImportIdx = indexContent.lastIndexOf("import ")
    const nextNewline = indexContent.indexOf('\n', lastImportIdx)
    indexContent =
      indexContent.slice(0, nextNewline + 1) +
      generatedImport + '\n' +
      indexContent.slice(nextNewline + 1)

    // Wire into allPracticeQuestions
    if (!indexContent.includes('allGeneratedQuestions')) {
      // Ensure trailing comma on the last item before inserting
      indexContent = indexContent.replace(
        /(...extraQuestions5)(\s*\])/,
        '$1,\n  ...allGeneratedQuestions,$2'
      )
    }

    // Wire into allFlashcards
    if (!indexContent.includes('allGeneratedFlashcards')) {
      indexContent = indexContent.replace(
        /(...extraFlashcards)(\s*\])/,
        '$1,\n  ...allGeneratedFlashcards,$2'
      )
    }

    fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8')
    console.log(`✅ Updated index.ts with generated content imports`)
  } else {
    console.log(`ℹ️  index.ts already has generated content imports`)
  }

  // Print stats
  let totalQ = 0
  let totalFC = 0
  for (const q of questionFiles) {
    const content = fs.readFileSync(path.join(GENERATED_DIR, q.file), 'utf-8')
    const matches = content.match(/"id"/g) || content.match(/id:/g)
    totalQ += matches ? matches.length : 0
  }
  for (const f of flashcardFiles) {
    const content = fs.readFileSync(path.join(GENERATED_DIR, f.file), 'utf-8')
    const matches = content.match(/"id"/g) || content.match(/id:/g)
    totalFC += matches ? matches.length : 0
  }

  console.log(`\n📊 Generated content totals:`)
  console.log(`   Questions:  ${totalQ}`)
  console.log(`   Flashcards: ${totalFC}`)
  console.log(`\nRun 'npm run build' to verify everything compiles.`)
}

main()
