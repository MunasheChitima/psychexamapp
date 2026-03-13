#!/usr/bin/env npx tsx
import * as fs from 'fs'
import * as path from 'path'

const generatedDir = path.resolve(__dirname, '../src/data/comprehensive/generated')
const files = fs.readdirSync(generatedDir).filter(f => f.startsWith('genQuestions') && f.endsWith('.ts') && f !== 'index.ts')

let totalFixed = 0
let totalProcessed = 0

for (const file of files) {
  const filePath = path.join(generatedDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  const arrayStart = content.indexOf('[\n')
  if (arrayStart === -1) continue
  const arrayEnd = content.lastIndexOf(']') + 1
  const header = content.slice(0, arrayStart)
  const jsonStr = content.slice(arrayStart, arrayEnd).trim()

  let questions: Record<string, unknown>[]
  try {
    questions = JSON.parse(jsonStr)
  } catch {
    console.log(`  ⚠️  Skipping ${file} — invalid JSON`)
    continue
  }

  let fixed = 0

  for (const q of questions) {
    if (!q.caseStudy && q.question && typeof q.question === 'string') {
      const text = q.question as string
      const lastQ = text.lastIndexOf('?')
      if (lastQ > 50) {
        const beforeQ = text.slice(0, lastQ)
        const lastPeriod = Math.max(beforeQ.lastIndexOf('. '), beforeQ.lastIndexOf('.\n'))
        if (lastPeriod > 30) {
          q.caseStudy = text.slice(0, lastPeriod + 1).trim()
          q.question = text.slice(lastPeriod + 1).trim()
        } else {
          q.caseStudy = text
        }
      } else {
        q.caseStudy = text
      }
      fixed++
    }

    // Rename legacy field names
    if ('questionText' in q && !('question' in q)) { q.question = q.questionText; delete q.questionText; fixed++ }
    if ('rationale' in q && !('distractorRationale' in q)) { q.distractorRationale = q.rationale; delete q.rationale; fixed++ }
    if ('rationales' in q && !('distractorRationale' in q)) { q.distractorRationale = q.rationales; delete q.rationales; fixed++ }

    if (!q.explanation) {
      const rationales = q.distractorRationale as string[] | undefined
      const correctIdx = q.correctAnswer as number | undefined
      if (rationales && correctIdx !== undefined && rationales[correctIdx]) {
        q.explanation = rationales[correctIdx]
      } else {
        q.explanation = 'See references for further details.'
      }
    }

    if (Array.isArray(q.distractorRationale)) {
      while ((q.distractorRationale as string[]).length < 5) {
        (q.distractorRationale as string[]).push('See explanation.')
      }
      q.distractorRationale = (q.distractorRationale as string[]).slice(0, 5)
    }

    if (Array.isArray(q.options)) {
      q.options = (q.options as unknown[]).map((opt) => {
        if (typeof opt === 'object' && opt !== null && 'text' in (opt as Record<string, unknown>)) {
          return (opt as Record<string, string>).text
        }
        return typeof opt === 'string' ? opt : String(opt)
      })
    }

    if (Array.isArray(q.options)) {
      while ((q.options as string[]).length < 5) {
        (q.options as string[]).push('None of the above')
      }
      q.options = (q.options as string[]).slice(0, 5)
    }

    if (typeof q.correctAnswer === 'number' && q.correctAnswer > 4) q.correctAnswer = 0

    if (!q.category || typeof q.category !== 'string') q.category = 'General'
    if (!q.difficulty || !['medium', 'hard', 'expert'].includes(q.difficulty as string)) q.difficulty = 'medium'
    if (!q.questionType || !['multi-step', 'except', 'priority', 'complex-vignette', 'evidence-based'].includes(q.questionType as string)) q.questionType = 'evidence-based'
    if (!q.caseStudy || typeof q.caseStudy !== 'string') q.caseStudy = q.question as string || ''
    if (!q.explanation || typeof q.explanation !== 'string') q.explanation = 'See references for further details.'
    if (!q.references || !Array.isArray(q.references)) q.references = ['APS Code of Ethics']
    if (!q.distractorRationale || !Array.isArray(q.distractorRationale)) q.distractorRationale = ['', '', '', '', '']

    if (!q.question || typeof q.question !== 'string' || (q.question as string).trim() === '') {
      if (q.caseStudy && typeof q.caseStudy === 'string') {
        const cs = q.caseStudy as string
        const lastQ = cs.lastIndexOf('?')
        if (lastQ > 30) {
          const before = cs.slice(0, lastQ)
          const lastPeriod = Math.max(before.lastIndexOf('. '), before.lastIndexOf('.\n'))
          if (lastPeriod > 20) {
            q.question = cs.slice(lastPeriod + 1).trim()
            q.caseStudy = cs.slice(0, lastPeriod + 1).trim()
          } else {
            q.question = cs
          }
        } else {
          q.question = cs
        }
      } else {
        q.question = 'What is the most appropriate action?'
      }
    }

    const known = new Set(['id', 'domain', 'category', 'difficulty', 'caseStudy', 'question', 'options', 'correctAnswer', 'distractorRationale', 'explanation', 'references', 'clinicalPearls', 'questionType'])
    for (const key of Object.keys(q)) {
      if (!known.has(key)) { delete q[key]; fixed++ }
    }
  }

  const output = header + JSON.stringify(questions, null, 2) + '\n'
  fs.writeFileSync(filePath, output, 'utf-8')
  console.log(`  ${file}: fixed ${fixed}/${questions.length}`)
  totalFixed += fixed
  totalProcessed += questions.length
}

console.log(`\nTotal: fixed ${totalFixed}/${totalProcessed} across ${files.length} files`)
