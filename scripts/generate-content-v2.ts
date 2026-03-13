#!/usr/bin/env npx tsx
/**
 * V3 Content Generator v2 — FAST MODE
 *
 * Uses Ollama's structured outputs (format schema) to guarantee valid JSON,
 * and high concurrency to saturate the API.
 *
 * Usage:
 *   npx tsx scripts/generate-content-v2.ts --type questions --count 800 --cloud
 *   npx tsx scripts/generate-content-v2.ts --type flashcards --count 750 --cloud
 *   npx tsx scripts/generate-content-v2.ts --type questions --count 200 --concurrency 12 --cloud
 */

import 'dotenv/config'
import { Ollama } from 'ollama'
import * as fs from 'fs'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Domain = 'ethics' | 'assessment' | 'interventions' | 'communication'
type Difficulty = 'medium' | 'hard' | 'expert'
type QuestionType = 'multi-step' | 'except' | 'priority' | 'complex-vignette' | 'evidence-based'
type FlashcardDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

interface PracticeQuestion {
  id: string; domain: Domain; category: string; difficulty: Difficulty
  caseStudy: string; question: string; options: string[]; correctAnswer: number
  distractorRationale: string[]; explanation: string; references: string[]
  clinicalPearls?: string; questionType: QuestionType
}

interface Flashcard {
  id: string; domain: Domain; question: string; answer: string
  category: string; difficulty: FlashcardDifficulty
  lastReviewed: null; nextReview: null; reviewCount: 0; masteryLevel: 0
  references?: string[]; clinicalPearls?: string
}

// ---------------------------------------------------------------------------
// JSON Schemas for structured outputs
// ---------------------------------------------------------------------------
const QUESTION_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['medium', 'hard', 'expert'] },
          caseStudy: { type: 'string' },
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 },
          correctAnswer: { type: 'integer', minimum: 0, maximum: 4 },
          distractorRationale: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5 },
          explanation: { type: 'string' },
          references: { type: 'array', items: { type: 'string' }, minItems: 1 },
          clinicalPearls: { type: 'string' },
          questionType: { type: 'string', enum: ['multi-step', 'except', 'priority', 'complex-vignette', 'evidence-based'] },
        },
        required: ['category', 'difficulty', 'caseStudy', 'question', 'options', 'correctAnswer', 'distractorRationale', 'explanation', 'references', 'questionType'],
      },
    },
  },
  required: ['questions'],
}

const FLASHCARD_SCHEMA = {
  type: 'object',
  properties: {
    flashcards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard', 'expert'] },
          question: { type: 'string' },
          answer: { type: 'string' },
          references: { type: 'array', items: { type: 'string' } },
          clinicalPearls: { type: 'string' },
        },
        required: ['category', 'difficulty', 'question', 'answer'],
      },
    },
  },
  required: ['flashcards'],
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
interface Config {
  type: 'questions' | 'flashcards'
  count: number
  batchSize: number
  concurrency: number
  cloud: boolean
  model: string
  domain: Domain | 'all'
  outputDir: string
  prefix: string
}

function parseArgs(): Config {
  const args = process.argv.slice(2)
  const get = (flag: string, fallback: string) => {
    const idx = args.indexOf(flag)
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
  }
  const has = (flag: string) => args.includes(flag)
  const cloud = has('--cloud')

  return {
    type: get('--type', 'questions') as Config['type'],
    count: parseInt(get('--count', '50'), 10),
    batchSize: parseInt(get('--batch', '20'), 10),
    concurrency: parseInt(get('--concurrency', '8'), 10),
    cloud,
    model: process.env.OLLAMA_MODEL || get('--model', cloud ? 'gpt-oss:120b' : 'llama3.1:8b'),
    domain: get('--domain', 'all') as Config['domain'],
    outputDir: path.resolve(__dirname, '../src/data/comprehensive/generated'),
    prefix: get('--prefix', 'v2'),
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
function createClient(cloud: boolean): Ollama {
  if (cloud) {
    const apiKey = process.env.OLLAMA_API_KEY
    if (!apiKey) { console.error('Set OLLAMA_API_KEY'); process.exit(1) }
    return new Ollama({
      host: 'https://ollama.com',
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  }
  return new Ollama()
}

// ---------------------------------------------------------------------------
// Domain categories & prompt
// ---------------------------------------------------------------------------
const CATEGORIES: Record<Domain, string[]> = {
  ethics: ['Confidentiality', 'Informed Consent', 'Mandatory Reporting', 'Dual Relationships', 'Boundaries', 'Competence', 'Record Keeping', 'Advertising', 'Supervision', 'Cultural Responsiveness', 'Self-Care', 'Colleagues', 'Propriety', 'Integrity', 'Privacy Act', 'AHPRA National Law', 'Termination'],
  assessment: ['WAIS-IV', 'WISC-V', 'WMS-IV', 'PAI', 'MMPI-2', 'K-10', 'DASS-42', 'SDQ', 'DSM-5 Diagnosis', 'Risk Assessment', 'Psychometrics', 'Reliability', 'Validity', 'Neuropsychological Assessment', 'Child Assessment', 'Cultural Considerations', 'Cognitive Assessment', 'Personality Assessment'],
  interventions: ['CBT', 'DBT', 'ACT', 'Motivational Interviewing', 'EMDR', 'Exposure Therapy', 'Behavioral Activation', 'Schema Therapy', 'Family Therapy', 'Group Therapy', 'Trauma-Informed Care', 'Psychopharmacology', 'Crisis Intervention', 'Mindfulness-Based Interventions', 'Solution-Focused', 'Behavioral Experiments', 'ERP', 'Play Therapy'],
  communication: ['Report Writing', 'Interprofessional Collaboration', 'Telehealth', 'Feedback', 'Cultural Responsiveness', 'Record Keeping', 'Referral', 'Consent Discussions', 'Conflict Resolution', 'Client Communication', 'Media Roles', 'Court Reports'],
}

function questionPrompt(domain: Domain, count: number): string {
  return `Generate ${count} practice exam questions for the Australian National Psychology Examination (NPE).
Domain: ${domain.toUpperCase()} | Categories: ${CATEGORIES[domain].join(', ')}

Rules:
- Each caseStudy must be a 50-200 word clinical vignette set in Australia
- Exactly 5 options per question, exactly 5 distractor rationales
- correctAnswer is 0-based (0-4)
- References must cite real Australian sources (APS Code of Ethics, AHPRA, DSM-5, Privacy Act 1988, state legislation)
- Mix difficulty: 40% medium, 40% hard, 20% expert
- Mix questionType: multi-step, except, priority, complex-vignette, evidence-based
- Test applied clinical reasoning, not textbook recall
- Include state-specific legislation differences where relevant`
}

function flashcardPrompt(domain: Domain, count: number): string {
  return `Generate ${count} study flashcards for the Australian National Psychology Examination (NPE).
Domain: ${domain.toUpperCase()} | Categories: ${CATEGORIES[domain].join(', ')}

Rules:
- question = front of card, answer = back of card (1-3 sentences)
- Mix difficulty: 20% easy, 40% medium, 30% hard, 10% expert
- Cover breadth of the domain, don't cluster on one topic
- Include Australian-specific content, references to real sources
- Add clinicalPearls for hard/expert cards`
}

// ---------------------------------------------------------------------------
// Work queue with concurrency control
// ---------------------------------------------------------------------------
interface WorkItem {
  domain: Domain
  batchSize: number
  idStart: number
}

async function runPool(
  items: WorkItem[],
  concurrency: number,
  worker: (item: WorkItem) => Promise<unknown[]>,
): Promise<unknown[]> {
  const results: unknown[] = []
  let idx = 0
  let active = 0
  let completed = 0
  const total = items.length

  return new Promise((resolve, reject) => {
    function next() {
      while (active < concurrency && idx < items.length) {
        const item = items[idx++]
        active++
        worker(item)
          .then((batch) => {
            results.push(...batch)
            active--
            completed++
            const pct = Math.round((completed / total) * 100)
            process.stdout.write(`\r  🚀 Progress: ${completed}/${total} batches (${pct}%) — ${results.length} items`)
            next()
          })
          .catch((err) => {
            active--
            completed++
            console.error(`\n  ❌ Batch failed: ${err instanceof Error ? err.message : err}`)
            next()
          })
      }
      if (active === 0 && idx >= items.length) {
        console.log('')
        resolve(results)
      }
    }
    next()
  })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const config = parseArgs()
  const client = createClient(config.cloud)
  const startTime = Date.now()

  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║  APRAcademy V3 Generator v2 - FAST MODE             ║')
  console.log('╚══════════════════════════════════════════════════════╝')
  console.log(`  Mode:        ${config.cloud ? 'Ollama Cloud' : 'Ollama Local'}`)
  console.log(`  Model:       ${config.model}`)
  console.log(`  Type:        ${config.type}`)
  console.log(`  Count:       ${config.count}`)
  console.log(`  Batch size:  ${config.batchSize}`)
  console.log(`  Concurrency: ${config.concurrency} parallel requests`)
  console.log(`  Domain:      ${config.domain}`)
  console.log('')

  fs.mkdirSync(config.outputDir, { recursive: true })

  // Find highest existing ID
  let globalId = 1
  const existingFiles = fs.readdirSync(config.outputDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')
  for (const f of existingFiles) {
    const content = fs.readFileSync(path.join(config.outputDir, f), 'utf-8')
    const idMatches = content.match(new RegExp(`${config.prefix}-(?:q|fc)-(\\d+)`, 'g'))
    if (idMatches) {
      for (const m of idMatches) {
        const num = parseInt(m.split('-').pop()!, 10)
        if (num >= globalId) globalId = num + 1
      }
    }
  }

  // Build distribution
  const DOMAINS: Domain[] = ['ethics', 'assessment', 'interventions', 'communication']
  const dist: Record<Domain, number> = { ethics: 0, assessment: 0, interventions: 0, communication: 0 }
  if (config.domain !== 'all') {
    dist[config.domain] = config.count
  } else {
    dist.ethics = Math.round(config.count * 0.30)
    dist.assessment = Math.round(config.count * 0.30)
    dist.interventions = Math.round(config.count * 0.30)
    dist.communication = config.count - dist.ethics - dist.assessment - dist.interventions
  }

  // Build work items
  const workItems: WorkItem[] = []
  let nextId = globalId
  for (const domain of DOMAINS) {
    let remaining = dist[domain]
    while (remaining > 0) {
      const batch = Math.min(remaining, config.batchSize)
      workItems.push({ domain, batchSize: batch, idStart: nextId })
      nextId += batch
      remaining -= batch
    }
  }

  console.log(`  📋 ${workItems.length} batches queued across ${DOMAINS.filter(d => dist[d] > 0).length} domains`)
  console.log(`  🆔 IDs starting from ${globalId}\n`)

  const idPrefix = config.type === 'questions' ? 'q' : 'fc'
  const itemKey = config.type === 'questions' ? 'questions' : 'flashcards'

  // Worker function
  async function worker(item: WorkItem): Promise<unknown[]> {
    const prompt = config.type === 'questions'
      ? questionPrompt(item.domain, item.batchSize)
      : flashcardPrompt(item.domain, item.batchSize)

    const jsonInstruction = config.type === 'questions'
      ? `\n\nReturn ONLY a JSON object with a "questions" array. No markdown, no explanation. Example: {"questions": [...]}`
      : `\n\nReturn ONLY a JSON object with a "flashcards" array. No markdown, no explanation. Example: {"flashcards": [...]}`

    const response = await client.chat({
      model: config.model,
      messages: [{ role: 'user', content: prompt + jsonInstruction }],
      stream: false,
      format: 'json',
      options: { temperature: 0.7, num_predict: 32768 },
    })

    const raw = response.message.content
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(raw)
    } catch {
      // Fallback: extract JSON from response
      const first = raw.indexOf('{')
      const last = raw.lastIndexOf('}')
      if (first === -1 || last === -1) return []
      parsed = JSON.parse(raw.slice(first, last + 1))
    }

    const items = (parsed[itemKey] || parsed['items'] || []) as Record<string, unknown>[]
    if (!Array.isArray(items)) return []

    return items.map((obj, i) => {
      obj.id = `${config.prefix}-${idPrefix}-${String(item.idStart + i).padStart(4, '0')}`
      obj.domain = item.domain
      if (config.type === 'flashcards') {
        obj.lastReviewed = null
        obj.nextReview = null
        obj.reviewCount = 0
        obj.masteryLevel = 0
      }
      return obj
    })
  }

  // Run the pool
  const allItems = await runPool(workItems, config.concurrency, worker)

  // Write output — use unique suffix to avoid overwriting previous runs
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const prefix = config.type === 'questions' ? 'genQuestions' : 'genFlashcards'
  let suffix = 1
  while (fs.existsSync(path.join(config.outputDir, `${prefix}_${dateStamp}_v2_${suffix}.ts`))) {
    suffix++
  }
  const timestamp = `${dateStamp}_v2_${suffix}`
  const varName = config.type === 'questions' ? `generatedQuestions_${timestamp}` : `generatedFlashcards_${timestamp}`
  const fileName = `${prefix}_${timestamp}.ts`
  const filePath = path.join(config.outputDir, fileName)

  if (allItems.length > 0) {
    const lines = config.type === 'questions'
      ? [`import { PracticeQuestion } from '../../../types'\n\nexport const ${varName}: PracticeQuestion[] = ${JSON.stringify(allItems, null, 2)}\n`]
      : [`import { Flashcard } from '../../../types'\n\nexport const ${varName}: Flashcard[] = ${JSON.stringify(allItems, null, 2)}\n`]

    fs.writeFileSync(filePath, lines[0], 'utf-8')
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const rate = (allItems.length / ((Date.now() - startTime) / 60000)).toFixed(1)

  console.log(`\n  ── Results ──`)
  console.log(`  ✅ Generated: ${allItems.length}/${config.count}`)
  console.log(`  📁 File: ${fileName}`)
  console.log(`  ⏱️  Time: ${elapsed}s`)
  console.log(`  🔥 Rate: ${rate} items/min`)
  console.log(`\n  Run: npx tsx scripts/wire-generated.ts`)
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })
