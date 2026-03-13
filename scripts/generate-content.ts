#!/usr/bin/env npx tsx
/**
 * V3 Content Generator for APRAcademy: Psychology
 *
 * Generates practice questions and flashcards using Ollama (local or cloud).
 * Outputs TypeScript files that plug directly into the existing data structure.
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts --type questions --count 50
 *   npx tsx scripts/generate-content.ts --type flashcards --count 100
 *   npx tsx scripts/generate-content.ts --type both --count 50 --cloud
 *   npx tsx scripts/generate-content.ts --type questions --count 50 --domain ethics
 *   npx tsx scripts/generate-content.ts --type questions --count 200 --batch 20 --cloud
 *
 * Environment:
 *   OLLAMA_API_KEY  - Required for --cloud mode (get from https://ollama.com/settings/keys)
 *   OLLAMA_MODEL    - Override model (default: gpt-oss:120b for cloud, llama3.1:8b for local)
 */

import 'dotenv/config'
import { Ollama } from 'ollama'
import * as fs from 'fs'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Types (mirror src/types/index.ts so this script is self-contained)
// ---------------------------------------------------------------------------
type ProductLine = 'psychology' | 'nursing'
type PsychologyDomain = 'ethics' | 'assessment' | 'interventions' | 'communication'
type NursingDomain =
  | 'management-of-care'
  | 'safety-infection'
  | 'health-promotion'
  | 'psychosocial'
  | 'basic-care'
  | 'pharmacology'
  | 'risk-reduction'
  | 'physiological'
  | 'osce-skills'
type Domain = PsychologyDomain | NursingDomain
type Difficulty = 'medium' | 'hard' | 'expert'
type QuestionType =
  | 'multi-step'
  | 'except'
  | 'priority'
  | 'complex-vignette'
  | 'evidence-based'
  | 'clinical-judgment'
  | 'select-all'
  | 'ordered-response'
  | 'drug-calculation'
type FlashcardDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

interface PracticeQuestion {
  id: string
  domain: Domain
  category: string
  difficulty: Difficulty
  caseStudy: string
  question: string
  options: string[]
  correctAnswer: number
  distractorRationale: string[]
  explanation: string
  references: string[]
  clinicalPearls?: string
  questionType: QuestionType
}

interface Flashcard {
  id: string
  domain: Domain
  question: string
  answer: string
  category: string
  difficulty: FlashcardDifficulty
  lastReviewed: null
  nextReview: null
  reviewCount: 0
  masteryLevel: 0
  references?: string[]
  clinicalPearls?: string
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------
interface Config {
  product: ProductLine
  type: 'questions' | 'flashcards' | 'both'
  count: number
  batchSize: number
  cloud: boolean
  model: string
  domain: Domain | 'all'
  outputDir: string
  prefix: string
  dryRun: boolean
}

function parseArgs(): Config {
  const args = process.argv.slice(2)
  const get = (flag: string, fallback: string) => {
    const idx = args.indexOf(flag)
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
  }
  const has = (flag: string) => args.includes(flag)

  const cloud = has('--cloud')
  const defaultModel = cloud ? 'gpt-oss:120b' : 'llama3.1:8b'

  return {
    product: get('--product', 'psychology') as ProductLine,
    type: get('--type', 'questions') as Config['type'],
    count: parseInt(get('--count', '50'), 10),
    batchSize: parseInt(get('--batch', '10'), 10),
    cloud,
    model: process.env.OLLAMA_MODEL || get('--model', defaultModel),
    domain: get('--domain', 'all') as Config['domain'],
    outputDir: path.resolve(
      __dirname,
      get('--product', 'psychology') === 'nursing'
        ? '../src/data/nursing/generated'
        : '../src/data/comprehensive/generated'
    ),
    prefix: get('--prefix', 'gen'),
    dryRun: has('--dry-run'),
  }
}

// ---------------------------------------------------------------------------
// Ollama client
// ---------------------------------------------------------------------------
function createClient(cloud: boolean): Ollama {
  if (cloud) {
    const apiKey = process.env.OLLAMA_API_KEY
    if (!apiKey) {
      console.error('ERROR: Set OLLAMA_API_KEY for cloud mode (https://ollama.com/settings/keys)')
      process.exit(1)
    }
    return new Ollama({
      host: 'https://ollama.com',
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  }
  return new Ollama()
}

// ---------------------------------------------------------------------------
// Domain distribution matching the real NPE weighting
// ---------------------------------------------------------------------------
function getValidDomains(product: ProductLine): Domain[] {
  return product === 'nursing'
    ? [
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
    : ['ethics', 'assessment', 'interventions', 'communication']
}

function getDomainDistribution(total: number, domain: Domain | 'all', product: ProductLine): Record<string, number> {
  const domains = getValidDomains(product)
  const zeroed = domains.reduce<Record<string, number>>((acc, key) => {
    acc[key] = 0
    return acc
  }, {})

  if (domain !== 'all') {
    zeroed[domain] = total
    return zeroed
  }

  if (product === 'psychology') {
    const ethics = Math.round(total * 0.30)
    const assessment = Math.round(total * 0.30)
    const interventions = Math.round(total * 0.30)
    const communication = total - ethics - assessment - interventions
    return { ...zeroed, ethics, assessment, interventions, communication }
  }

  // NCLEX-style client needs weighting approximation for distribution
  const weights: Record<NursingDomain, number> = {
    'management-of-care': 0.18,
    'safety-infection': 0.13,
    'health-promotion': 0.09,
    psychosocial: 0.09,
    'basic-care': 0.09,
    pharmacology: 0.16,
    'risk-reduction': 0.12,
    physiological: 0.14,
    'osce-skills': 0,
  }
  let assigned = 0
  for (const key of domains) {
    if (key === 'osce-skills') continue
    const count = Math.round(total * (weights[key as NursingDomain] ?? 0))
    zeroed[key] = count
    assigned += count
  }
  const delta = total - assigned
  zeroed['management-of-care'] += delta
  return zeroed
}

// ---------------------------------------------------------------------------
// Prompt templates
// ---------------------------------------------------------------------------
const QUESTION_CATEGORIES: Record<Domain, string[]> = {
  ethics: [
    'Confidentiality', 'Informed Consent', 'Mandatory Reporting', 'Dual Relationships',
    'Boundaries', 'Competence', 'Record Keeping', 'Advertising', 'Supervision',
    'Cultural Responsiveness', 'Self-Care', 'Colleagues', 'Propriety', 'Integrity',
    'Privacy Act', 'AHPRA National Law', 'Public Statements', 'Termination',
  ],
  assessment: [
    'WAIS-IV', 'WISC-V', 'WMS-IV', 'PAI', 'MMPI-2', 'K-10', 'DASS-42', 'SDQ',
    'DSM-5 Diagnosis', 'Risk Assessment', 'Psychometrics', 'Reliability', 'Validity',
    'Neuropsychological Assessment', 'Child Assessment', 'Cultural Considerations',
    'Cognitive Assessment', 'Personality Assessment', 'Standardization', 'Norming',
  ],
  interventions: [
    'CBT', 'DBT', 'ACT', 'Motivational Interviewing', 'EMDR', 'Exposure Therapy',
    'Behavioral Activation', 'Schema Therapy', 'Psychodynamic', 'Family Therapy',
    'Group Therapy', 'Trauma-Informed Care', 'Psychopharmacology', 'Crisis Intervention',
    'Relaxation Techniques', 'Mindfulness-Based Interventions', 'Solution-Focused',
    'Behavioral Experiments', 'ERP', 'Play Therapy',
  ],
  communication: [
    'Report Writing', 'Interprofessional Collaboration', 'Telehealth', 'Feedback',
    'Cultural Responsiveness', 'Record Keeping', 'Referral', 'Consent Discussions',
    'Conflict Resolution', 'Client Communication', 'Media Roles', 'Court Reports',
  ],
  'management-of-care': [
    'Delegation and Scope', 'ISBAR Handover', 'Legal Responsibilities', 'Prioritisation', 'Care Coordination',
  ],
  'safety-infection': [
    'Hand Hygiene', 'ANTT', 'Medication Safety', 'Patient Identification', 'Incident Reporting',
  ],
  'health-promotion': [
    'Immunisation', 'Chronic Disease', 'Health Literacy', 'Cultural Safety', 'Screening Programs',
  ],
  psychosocial: [
    'Therapeutic Communication', 'Mental Health Risk', 'Crisis Intervention', 'Family Support', 'Trauma-Informed Care',
  ],
  'basic-care': [
    'Nutrition and Hydration', 'Pressure Injury Prevention', 'Mobility', 'Pain Management', 'Elimination',
  ],
  pharmacology: [
    'Drug Calculations', 'APINCH Medications', 'Insulin Safety', 'Anticoagulants', 'IV Therapy',
  ],
  'risk-reduction': [
    'Deterioration Recognition', 'Fluid Balance', 'Post-op Care', 'Vital Signs', 'Escalation Pathways',
  ],
  physiological: [
    'Sepsis', 'Respiratory Failure', 'Cardiac Emergencies', 'Shock', 'Neurological Emergencies',
  ],
  'osce-skills': [
    'Medication Station', 'Handover Station', 'Aseptic Technique', 'Communication Station', 'Documentation',
  ],
}

function buildQuestionPrompt(domain: Domain, count: number, startId: number, prefix: string, product: ProductLine): string {
  const categories = QUESTION_CATEGORIES[domain]
  if (product === 'nursing') {
    return `You are generating practice exam questions for Australian nursing registration preparation (AHPRA pathway, NCLEX-RN + OSCE context).

DOMAIN: ${domain.toUpperCase()}
GENERATE: ${count} questions
CATEGORIES: ${categories.join(', ')}

CRITICAL REQUIREMENTS:
1. Australian context only (NMBA standards, ACSQHC, ARC, PBS/TGA where relevant)
2. Exactly 5 options per question
3. Include caseStudy (50-180 words), explanation, references
4. correctAnswer must be 0-4
5. distractorRationale must have exactly 5 entries
6. Mix difficulty: medium/hard/expert
7. Use questionType values suitable for nursing: clinical-judgment, priority, select-all, ordered-response, drug-calculation, evidence-based

OUTPUT: Return ONLY valid JSON array.
Structure:
{
  "id": "${prefix}-q-${String(startId).padStart(4, '0')}",
  "domain": "${domain}",
  "category": "<category>",
  "difficulty": "<medium|hard|expert>",
  "caseStudy": "<clinical vignette>",
  "question": "<stem>",
  "options": ["A","B","C","D","E"],
  "correctAnswer": <0-4>,
  "distractorRationale": ["","","","",""],
  "explanation": "<why>",
  "references": ["<source 1>", "<source 2>"],
  "clinicalPearls": "<optional>",
  "questionType": "<clinical-judgment|priority|select-all|ordered-response|drug-calculation|evidence-based>"
}`
  }
  return `You are generating practice exam questions for the Australian National Psychology Examination (NPE).
These questions are for provisional psychologists studying to become generally registered with AHPRA.

DOMAIN: ${domain.toUpperCase()} (${domain === 'communication' ? '10%' : '30%'} of the real exam)
GENERATE: ${count} questions

CATEGORIES TO DRAW FROM: ${categories.join(', ')}

CRITICAL REQUIREMENTS:
1. Every question MUST have a "caseStudy" field: a realistic clinical vignette of 50-200 words set in an Australian context
2. Every question MUST have exactly 5 options (not 4, not 3 — always 5)
3. Every question MUST have a "distractorRationale" array with exactly 5 entries explaining why each option is correct/incorrect
4. "correctAnswer" is a 0-based index (0-4)
5. References must cite real Australian sources: APS Code of Ethics sections, AHPRA guidelines, DSM-5, specific assessment manuals, named researchers
6. Questions should test APPLIED clinical reasoning, not textbook recall
7. Mix difficulty: roughly 40% medium, 40% hard, 20% expert
8. Mix questionType: multi-step, except, priority, complex-vignette, evidence-based
9. Avoid trivial questions — these are for professionals, not undergraduates
10. Include Australian-specific content: state legislation differences, AHPRA registration requirements, Privacy Act 1988, Medicare rebates, mandatory reporting thresholds by state

QUESTION TYPES TO USE:
- "multi-step": Requires sequential clinical reasoning (what to do FIRST, NEXT, etc.)
- "except": "All of the following EXCEPT..." format
- "priority": Multiple options are partially correct, one is MOST appropriate
- "complex-vignette": Long scenario with competing considerations
- "evidence-based": Tests knowledge of specific evidence/research/guidelines

OUTPUT FORMAT: Return ONLY a valid JSON array of objects. No markdown, no code fences, no explanation.
Each object must match this exact structure:

{
  "id": "${prefix}-q-${String(startId).padStart(4, '0')}",
  "domain": "${domain}",
  "category": "<category from the list above>",
  "difficulty": "<medium|hard|expert>",
  "caseStudy": "<50-200 word clinical vignette>",
  "question": "<the question stem>",
  "options": ["<option A>", "<option B>", "<option C>", "<option D>", "<option E>"],
  "correctAnswer": <0-4>,
  "distractorRationale": ["<why A is right/wrong>", "<why B is right/wrong>", "<why C is right/wrong>", "<why D is right/wrong>", "<why E is right/wrong>"],
  "explanation": "<detailed explanation of the correct answer>",
  "references": ["<real reference 1>", "<real reference 2>"],
  "clinicalPearls": "<practical tip for clinical practice>",
  "questionType": "<multi-step|except|priority|complex-vignette|evidence-based>"
}

IDs must be sequential starting from ${prefix}-q-${String(startId).padStart(4, '0')}.
Return ONLY the JSON array. No other text.`
}

function buildFlashcardPrompt(domain: Domain, count: number, startId: number, prefix: string, product: ProductLine): string {
  const categories = QUESTION_CATEGORIES[domain]
  if (product === 'nursing') {
    return `You are generating flashcards for Australian nursing registration exam prep (AHPRA pathway context).

DOMAIN: ${domain.toUpperCase()}
GENERATE: ${count} flashcards
CATEGORIES: ${categories.join(', ')}

REQUIREMENTS:
1. Australian context only (NMBA, ACSQHC, ARC, PBS/TGA where relevant)
2. Keep card fronts concise and clinically useful
3. Mix difficulty: easy/medium/hard/expert
4. Include references where possible

OUTPUT FORMAT: Return ONLY valid JSON array.
{
  "id": "${prefix}-fc-${String(startId).padStart(4, '0')}",
  "domain": "${domain}",
  "question": "<front>",
  "answer": "<back>",
  "category": "<category>",
  "difficulty": "<easy|medium|hard|expert>",
  "lastReviewed": null,
  "nextReview": null,
  "reviewCount": 0,
  "masteryLevel": 0,
  "references": ["<source>"],
  "clinicalPearls": "<optional>"
}`
  }
  return `You are generating flashcards for the Australian National Psychology Examination (NPE).
These flashcards are for provisional psychologists studying to become generally registered with AHPRA.

DOMAIN: ${domain.toUpperCase()}
GENERATE: ${count} flashcards

CATEGORIES TO DRAW FROM: ${categories.join(', ')}

REQUIREMENTS:
1. Each flashcard has a "question" (front) and "answer" (back)
2. Questions should be clear and specific
3. Answers should be concise but complete (1-3 sentences)
4. Mix difficulty: 20% easy, 40% medium, 30% hard, 10% expert
5. Cover the breadth of the domain — don't cluster on one topic
6. Include Australian-specific content where relevant
7. Add clinicalPearls for hard/expert cards — practical tips beyond the textbook answer
8. References should cite real sources

OUTPUT FORMAT: Return ONLY a valid JSON array of objects. No markdown, no code fences.
Each object must match this exact structure:

{
  "id": "${prefix}-fc-${String(startId).padStart(4, '0')}",
  "domain": "${domain}",
  "question": "<front of card>",
  "answer": "<back of card>",
  "category": "<category>",
  "difficulty": "<easy|medium|hard|expert>",
  "lastReviewed": null,
  "nextReview": null,
  "reviewCount": 0,
  "masteryLevel": 0,
  "references": ["<real reference>"],
  "clinicalPearls": "<optional practical tip>"
}

IDs must be sequential starting from ${prefix}-fc-${String(startId).padStart(4, '0')}.
Return ONLY the JSON array. No other text.`
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
const VALID_DIFFICULTIES: Difficulty[] = ['medium', 'hard', 'expert']
const VALID_FC_DIFFICULTIES: FlashcardDifficulty[] = ['easy', 'medium', 'hard', 'expert']
const VALID_QUESTION_TYPES: QuestionType[] = ['multi-step', 'except', 'priority', 'complex-vignette', 'evidence-based', 'clinical-judgment', 'select-all', 'ordered-response', 'drug-calculation']

function validateQuestion(q: unknown, idx: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const obj = q as Record<string, unknown>

  if (!obj.id || typeof obj.id !== 'string') errors.push(`[${idx}] missing/invalid id`)
  if (!QUESTION_CATEGORIES[obj.domain as Domain]) errors.push(`[${idx}] invalid domain: ${obj.domain}`)
  if (!obj.category || typeof obj.category !== 'string') errors.push(`[${idx}] missing category`)
  if (!VALID_DIFFICULTIES.includes(obj.difficulty as Difficulty)) errors.push(`[${idx}] invalid difficulty: ${obj.difficulty}`)
  if (!obj.caseStudy || typeof obj.caseStudy !== 'string') errors.push(`[${idx}] missing caseStudy`)
  if (typeof obj.caseStudy === 'string' && obj.caseStudy.length < 30) errors.push(`[${idx}] caseStudy too short (${(obj.caseStudy as string).length} chars)`)
  if (!obj.question || typeof obj.question !== 'string') errors.push(`[${idx}] missing question`)
  if (!Array.isArray(obj.options) || obj.options.length !== 5) errors.push(`[${idx}] must have exactly 5 options, got ${Array.isArray(obj.options) ? obj.options.length : 'none'}`)
  if (typeof obj.correctAnswer !== 'number' || obj.correctAnswer < 0 || obj.correctAnswer > 4) errors.push(`[${idx}] correctAnswer must be 0-4`)
  if (!Array.isArray(obj.distractorRationale) || obj.distractorRationale.length !== 5) errors.push(`[${idx}] must have exactly 5 distractor rationales`)
  if (!obj.explanation || typeof obj.explanation !== 'string') errors.push(`[${idx}] missing explanation`)
  if (!Array.isArray(obj.references) || obj.references.length === 0) errors.push(`[${idx}] must have at least 1 reference`)
  if (!VALID_QUESTION_TYPES.includes(obj.questionType as QuestionType)) errors.push(`[${idx}] invalid questionType: ${obj.questionType}`)

  return { valid: errors.length === 0, errors }
}

function validateFlashcard(fc: unknown, idx: number): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const obj = fc as Record<string, unknown>

  if (!obj.id || typeof obj.id !== 'string') errors.push(`[${idx}] missing/invalid id`)
  if (!QUESTION_CATEGORIES[obj.domain as Domain]) errors.push(`[${idx}] invalid domain: ${obj.domain}`)
  if (!obj.question || typeof obj.question !== 'string') errors.push(`[${idx}] missing question`)
  if (!obj.answer || typeof obj.answer !== 'string') errors.push(`[${idx}] missing answer`)
  if (!obj.category || typeof obj.category !== 'string') errors.push(`[${idx}] missing category`)
  if (!VALID_FC_DIFFICULTIES.includes(obj.difficulty as FlashcardDifficulty)) errors.push(`[${idx}] invalid difficulty: ${obj.difficulty}`)

  return { valid: errors.length === 0, errors }
}

// ---------------------------------------------------------------------------
// JSON extraction (handles LLMs that wrap in markdown code fences)
// ---------------------------------------------------------------------------
function extractJSON(raw: string): unknown[] {
  let cleaned = raw.trim()

  // Strip markdown code fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  // Find the JSON array boundaries
  const firstBracket = cleaned.indexOf('[')
  const lastBracket = cleaned.lastIndexOf(']')
  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error('No JSON array found in response')
  }
  cleaned = cleaned.slice(firstBracket, lastBracket + 1)

  return JSON.parse(cleaned)
}

// ---------------------------------------------------------------------------
// TypeScript file generation
// ---------------------------------------------------------------------------
function questionsToTypeScript(questions: PracticeQuestion[], varName: string): string {
  const lines = [`import { PracticeQuestion } from '../../../types'\n`]
  lines.push(`export const ${varName}: PracticeQuestion[] = `)
  lines.push(JSON.stringify(questions, null, 2)
    .replace(/"id"/g, 'id')
    .replace(/"domain"/g, 'domain')
    .replace(/"category"/g, 'category')
    .replace(/"difficulty"/g, 'difficulty')
    .replace(/"caseStudy"/g, 'caseStudy')
    .replace(/"question"/g, 'question')
    .replace(/"options"/g, 'options')
    .replace(/"correctAnswer"/g, 'correctAnswer')
    .replace(/"distractorRationale"/g, 'distractorRationale')
    .replace(/"explanation"/g, 'explanation')
    .replace(/"references"/g, 'references')
    .replace(/"clinicalPearls"/g, 'clinicalPearls')
    .replace(/"questionType"/g, 'questionType')
  )
  lines.push('\n')
  return lines.join('')
}

function flashcardsToTypeScript(flashcards: Flashcard[], varName: string): string {
  const lines = [`import { Flashcard } from '../../../types'\n`]
  lines.push(`export const ${varName}: Flashcard[] = `)
  lines.push(JSON.stringify(flashcards, null, 2)
    .replace(/"id"/g, 'id')
    .replace(/"domain"/g, 'domain')
    .replace(/"question"/g, 'question')
    .replace(/"answer"/g, 'answer')
    .replace(/"category"/g, 'category')
    .replace(/"difficulty"/g, 'difficulty')
    .replace(/"lastReviewed"/g, 'lastReviewed')
    .replace(/"nextReview"/g, 'nextReview')
    .replace(/"reviewCount"/g, 'reviewCount')
    .replace(/"masteryLevel"/g, 'masteryLevel')
    .replace(/"references"/g, 'references')
    .replace(/"clinicalPearls"/g, 'clinicalPearls')
  )
  lines.push('\n')
  return lines.join('')
}

// ---------------------------------------------------------------------------
// Core generation logic
// ---------------------------------------------------------------------------
async function generateBatch(
  client: Ollama,
  model: string,
  prompt: string,
  type: 'questions' | 'flashcards',
  expectedCount: number,
): Promise<{ items: unknown[]; raw: string }> {
  console.log(`  ⏳ Requesting ${expectedCount} ${type} from ${model}...`)

  const response = await client.chat({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 16384,
    },
  })

  const raw = response.message.content
  const items = extractJSON(raw)

  if (!Array.isArray(items)) {
    throw new Error('Response is not an array')
  }

  return { items, raw }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const config = parseArgs()
  const client = createClient(config.cloud)

  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║  APRAcademy V3 Content Generator                    ║')
  console.log('╚══════════════════════════════════════════════════════╝')
  console.log(`  Mode:      ${config.cloud ? 'Ollama Cloud' : 'Ollama Local'}`)
  console.log(`  Model:     ${config.model}`)
  console.log(`  Type:      ${config.type}`)
  console.log(`  Count:     ${config.count}`)
  console.log(`  Batch:     ${config.batchSize}`)
  console.log(`  Domain:    ${config.domain}`)
  console.log(`  Output:    ${config.outputDir}`)
  console.log(`  Dry run:   ${config.dryRun}`)
  console.log('')

  fs.mkdirSync(config.outputDir, { recursive: true })

  // Find existing generated file count to set start IDs
  const existingFiles = fs.readdirSync(config.outputDir).filter(f => f.endsWith('.ts'))
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const runSuffix = `${Date.now().toString().slice(-6)}_${config.domain === 'all' ? 'all' : String(config.domain).replace(/[^a-z0-9]+/gi, '-')}`

  const types: ('questions' | 'flashcards')[] =
    config.type === 'both' ? ['questions', 'flashcards'] : [config.type]

  for (const contentType of types) {
    console.log(`\n━━━ Generating ${contentType} ━━━`)

    const distribution = getDomainDistribution(config.count, config.domain, config.product)
    const validDomains = getValidDomains(config.product)
    let globalId = 1

    // Check existing generated content to avoid ID collisions
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

    if (config.dryRun) {
      for (const domain of validDomains) {
        const domainCount = distribution[domain] ?? 0
        if (domainCount > 0) console.log(`  [DRY RUN] Would generate ${domainCount} ${contentType} for ${domain}`)
      }
      console.log(`\n  [DRY RUN] Would have generated ${config.count} ${contentType}`)
      continue
    }

    // Assign ID ranges per domain so they don't collide during parallel generation
    const domainIdStart: Record<string, number> = {}
    let nextId = globalId
    for (const domain of validDomains) {
      domainIdStart[domain] = nextId
      nextId += (distribution[domain] ?? 0) + 50 // gap for safety
    }

    // Generate domain function
    async function generateDomain(domain: Domain, count: number, startId: number): Promise<{ valid: unknown[]; errors: string[] }> {
      if (count === 0) return { valid: [], errors: [] }
      console.log(`\n  📚 Domain: ${domain} (${count} ${contentType})`)

      const valid: unknown[] = []
      const errors: string[] = []
      let currentId = startId
      let remaining = count
      let batchSize = config.batchSize

      while (remaining > 0) {
        const batchCount = Math.min(remaining, batchSize)
        const prompt = contentType === 'questions'
          ? buildQuestionPrompt(domain, batchCount, currentId, config.prefix, config.product)
          : buildFlashcardPrompt(domain, batchCount, currentId, config.prefix, config.product)

        try {
          const { items } = await generateBatch(client, config.model, prompt, contentType, batchCount)

          let validInBatch = 0
          for (let i = 0; i < items.length; i++) {
            const item = items[i] as Record<string, unknown>
            const idPrefix = contentType === 'questions' ? 'q' : 'fc'
            item.id = `${config.prefix}-${idPrefix}-${String(currentId).padStart(4, '0')}`
            item.domain = domain

            if (contentType === 'flashcards') {
              item.lastReviewed = null
              item.nextReview = null
              item.reviewCount = 0
              item.masteryLevel = 0
            }

            const validation = contentType === 'questions'
              ? validateQuestion(item, i)
              : validateFlashcard(item, i)

            if (validation.valid) {
              valid.push(item)
              validInBatch++
            } else {
              errors.push(...validation.errors.map(e => `${domain}: ${e}`))
            }
            currentId++
          }

          console.log(`  ✅ ${domain}: ${validInBatch}/${items.length} valid (${valid.length}/${count} total)`)
          remaining -= batchCount
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err)
          console.error(`  ❌ ${domain} batch failed: ${errMsg}`)
          if (batchCount > 5) {
            batchSize = Math.ceil(batchCount / 2)
            console.log(`  🔄 ${domain}: retrying with batch size ${batchSize}`)
          } else {
            console.error(`  ⛔ ${domain}: skipping remaining ${remaining}`)
            break
          }
        }
      }

      return { valid, errors }
    }

    // Run all domains in parallel
    console.log(`\n  🚀 Running all domains in parallel...`)
    const results = await Promise.all(
      validDomains.map(domain =>
        generateDomain(domain, distribution[domain] ?? 0, domainIdStart[domain])
      )
    )

    const allValid = results.flatMap(r => r.valid)
    const allErrors = results.flatMap(r => r.errors)

    // Write output
    if (allValid.length > 0) {
      const varName = contentType === 'questions'
        ? `generatedQuestions_${timestamp}`
        : `generatedFlashcards_${timestamp}`

      const fileName = contentType === 'questions'
        ? `genQuestions_${timestamp}_${runSuffix}.ts`
        : `genFlashcards_${timestamp}_${runSuffix}.ts`

      const filePath = path.join(config.outputDir, fileName)

      const tsContent = contentType === 'questions'
        ? questionsToTypeScript(allValid as PracticeQuestion[], varName)
        : flashcardsToTypeScript(allValid as Flashcard[], varName)

      fs.writeFileSync(filePath, tsContent, 'utf-8')
      console.log(`\n  📁 Wrote ${allValid.length} ${contentType} to ${fileName}`)
    }

    // Report
    console.log(`\n  ── Summary ──`)
    console.log(`  Generated: ${allValid.length}/${config.count}`)
    if (allErrors.length > 0) {
      console.log(`  Validation errors: ${allErrors.length}`)
      for (const e of allErrors.slice(0, 10)) console.log(`    ⚠️  ${e}`)
      if (allErrors.length > 10) console.log(`    ... and ${allErrors.length - 10} more`)
    }
  }

  // Print wiring instructions
  console.log('\n╔══════════════════════════════════════════════════════╗')
  console.log('║  Next steps                                          ║')
  console.log('╠══════════════════════════════════════════════════════╣')
  console.log('║  1. Review generated files in src/data/comprehensive/generated/')
  console.log('║  2. Run: npx tsx scripts/wire-generated.ts           ║')
  console.log('║     (auto-wires new files into index.ts)             ║')
  console.log('║  3. npm run build (verify everything compiles)       ║')
  console.log('╚══════════════════════════════════════════════════════╝')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
