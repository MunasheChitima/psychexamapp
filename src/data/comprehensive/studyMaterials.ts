import { StudyMaterial } from '@/types'

export const studyMaterials: StudyMaterial[] = [
  {
    id: 'sm-001',
    title: 'Complete DSM-5 Diagnostic Decision Trees',
    domain: 'assessment',
    category: 'Diagnostic Assessment',
    content: `
# Complete DSM-5 Diagnostic Decision Trees

## Mood Disorders Decision Tree

### Step 1: Assess for Manic/Hypomanic Episodes
- **Manic Episode Criteria:**
  - Elevated, expansive, or irritable mood for ≥1 week
  - Plus 3+ symptoms (4+ if mood is irritable only):
    - Inflated self-esteem/grandiosity
    - Decreased need for sleep
    - More talkative than usual/pressure to keep talking
    - Flight of ideas/racing thoughts
    - Distractibility
    - Increase in goal-directed activity/psychomotor agitation
    - Excessive involvement in pleasurable activities with high potential for painful consequences
  - **Severity:** Marked impairment, hospitalization, or psychotic features

- **Hypomanic Episode Criteria:**
  - Same symptoms as manic but:
    - Duration: ≥4 days
    - **Severity:** Clear change in functioning but not marked impairment
    - No hospitalization or psychotic features

### Step 2: Assess for Major Depressive Episodes
- **Major Depressive Episode Criteria:**
  - 5+ symptoms during 2-week period, including:
    - Depressed mood OR loss of interest/pleasure (must have one)
    - Plus 4+ additional symptoms:
      - Significant weight loss/gain or appetite change
      - Insomnia or hypersomnia
      - Psychomotor agitation or retardation
      - Fatigue or loss of energy
      - Feelings of worthlessness or excessive guilt
      - Diminished ability to think/concentrate or indecisiveness
      - Recurrent thoughts of death, suicidal ideation, or suicide attempt
  - **Severity:** Clinically significant distress or impairment

### Step 3: Determine Diagnosis
1. **Bipolar I Disorder:**
   - At least one manic episode
   - May have hypomanic or major depressive episodes

2. **Bipolar II Disorder:**
   - At least one hypomanic episode AND one major depressive episode
   - No manic episodes

3. **Major Depressive Disorder:**
   - One or more major depressive episodes
   - No manic or hypomanic episodes

4. **Persistent Depressive Disorder (Dysthymia):**
   - Depressed mood for most of day, more days than not, for ≥2 years
   - Never without symptoms for >2 months
   - No manic/hypomanic episodes

## Anxiety Disorders Decision Tree

### Step 1: Assess for Panic Attacks
- **Panic Attack Criteria:**
  - Abrupt surge of intense fear/discomfort reaching peak within minutes
  - 4+ symptoms:
    - Palpitations, pounding heart, or accelerated heart rate
    - Sweating
    - Trembling or shaking
    - Sensations of shortness of breath or smothering
    - Feelings of choking
    - Chest pain or discomfort
    - Nausea or abdominal distress
    - Feeling dizzy, unsteady, light-headed, or faint
    - Chills or heat sensations
    - Paresthesias (numbness or tingling sensations)
    - Derealization or depersonalization
    - Fear of losing control or "going crazy"
    - Fear of dying

### Step 2: Assess for Specific Fears
- **Specific Phobia:**
  - Marked fear/anxiety about specific object/situation
  - Object/situation almost always provokes immediate fear/anxiety
  - Object/situation actively avoided or endured with intense fear/anxiety
  - Fear/anxiety out of proportion to actual danger

- **Social Anxiety Disorder:**
  - Marked fear/anxiety about social situations where individual is exposed to possible scrutiny
  - Fears acting in a way that will be negatively evaluated
  - Social situations almost always provoke fear/anxiety
  - Social situations avoided or endured with intense fear/anxiety

### Step 3: Assess for Generalized Anxiety
- **Generalized Anxiety Disorder:**
  - Excessive anxiety/worry occurring more days than not for ≥6 months
  - About a number of events/activities
  - Difficult to control worry
  - 3+ symptoms (only 1 required for children):
    - Restlessness or feeling keyed up or on edge
    - Being easily fatigued
    - Difficulty concentrating or mind going blank
    - Irritability
    - Muscle tension
    - Sleep disturbance

## Trauma and Stressor-Related Disorders Decision Tree

### Step 1: Assess for Trauma Exposure
- **Trauma Criteria:**
  - Exposure to actual/threatened death, serious injury, or sexual violence through:
    - Direct experience
    - Witnessing in person
    - Learning that it occurred to close family member/friend
    - Repeated/extreme exposure to aversive details

### Step 2: Assess for Intrusion Symptoms
- **Intrusion Symptoms:**
  - Recurrent, involuntary, and intrusive distressing memories
  - Recurrent distressing dreams
  - Dissociative reactions (flashbacks)
  - Intense/prolonged psychological distress at exposure to cues
  - Marked physiological reactions to cues

### Step 3: Assess for Avoidance and Alterations
- **Avoidance:**
  - Avoidance of distressing memories, thoughts, feelings
  - Avoidance of external reminders

- **Negative Alterations in Cognition and Mood:**
  - Inability to remember important aspects
  - Persistent negative beliefs/expectations
  - Persistent distorted cognitions about cause/consequences
  - Persistent negative emotional state
  - Markedly diminished interest/participation
  - Feelings of detachment/estrangement
  - Persistent inability to experience positive emotions

- **Arousal and Reactivity:**
  - Irritable behavior/angry outbursts
  - Reckless/self-destructive behavior
  - Hypervigilance
  - Exaggerated startle response
  - Problems with concentration
  - Sleep disturbance

### Step 4: Determine Diagnosis
1. **PTSD:**
   - Trauma exposure + intrusion + avoidance + negative alterations + arousal
   - Duration >1 month
   - Clinically significant distress/impairment

2. **Acute Stress Disorder:**
   - Same criteria as PTSD but duration 3 days to 1 month

3. **Adjustment Disorder:**
   - Emotional/behavioral symptoms in response to identifiable stressor
   - Symptoms develop within 3 months of stressor
   - Symptoms resolve within 6 months of stressor termination
   - Clinically significant distress/impairment

## Personality Disorders Decision Tree

### Step 1: Assess for Personality Disorder Criteria
- **General Criteria:**
  - Enduring pattern of inner experience/behavior that deviates markedly from cultural expectations
  - Pattern is inflexible and pervasive across situations
  - Pattern leads to clinically significant distress/impairment
  - Pattern is stable and of long duration
  - Pattern not better explained by another mental disorder
  - Pattern not attributable to substance use or medical condition

### Step 2: Assess for Specific Personality Disorders

**Cluster A (Odd/Eccentric):**
- **Paranoid Personality Disorder:**
  - Pervasive distrust/suspiciousness of others
  - Reluctant to confide in others
  - Bears grudges
  - Perceives attacks on character/reputation

- **Schizoid Personality Disorder:**
  - Detachment from social relationships
  - Restricted range of emotional expression
  - Neither desires nor enjoys close relationships
  - Takes pleasure in few activities

- **Schizotypal Personality Disorder:**
  - Social/interpersonal deficits
  - Cognitive/perceptual distortions
  - Eccentric behavior
  - Ideas of reference, odd beliefs, unusual perceptual experiences

**Cluster B (Dramatic/Emotional):**
- **Antisocial Personality Disorder:**
  - Disregard for/violation of rights of others
  - Failure to conform to social norms
  - Deceitfulness
  - Impulsivity/failure to plan ahead
  - Irritability/aggressiveness
  - Reckless disregard for safety
  - Consistent irresponsibility
  - Lack of remorse

- **Borderline Personality Disorder:**
  - Frantic efforts to avoid abandonment
  - Unstable interpersonal relationships
  - Identity disturbance
  - Impulsivity in potentially self-damaging areas
  - Recurrent suicidal behavior/self-mutilation
  - Affective instability
  - Chronic feelings of emptiness
  - Inappropriate anger
  - Transient stress-related paranoid ideation

- **Histrionic Personality Disorder:**
  - Excessive emotionality/attention seeking
  - Inappropriately seductive/provocative behavior
  - Rapidly shifting/shallow expression of emotions
  - Consistently uses physical appearance to draw attention
  - Style of speech excessively impressionistic/lacking detail
  - Self-dramatization/theatricality
  - Suggestibility
  - Considers relationships more intimate than they are

- **Narcissistic Personality Disorder:**
  - Grandiosity
  - Preoccupation with fantasies of unlimited success/power/brilliance
  - Belief in being special/unique
  - Requires excessive admiration
  - Sense of entitlement
  - Interpersonally exploitative
  - Lacks empathy
  - Envious of others/believes others envious of them
  - Arrogant/haughty behaviors/attitudes

**Cluster C (Anxious/Fearful):**
- **Avoidant Personality Disorder:**
  - Avoids occupational activities involving significant interpersonal contact
  - Unwilling to get involved with people unless certain of being liked
  - Shows restraint within intimate relationships
  - Preoccupied with being criticized/rejected
  - Inhibited in new interpersonal situations
  - Views self as socially inept/personally unappealing
  - Unusually reluctant to take personal risks

- **Dependent Personality Disorder:**
  - Difficulty making everyday decisions without excessive advice/reassurance
  - Needs others to assume responsibility for major areas of life
  - Difficulty expressing disagreement with others
  - Difficulty initiating projects/doing things independently
  - Goes to excessive lengths to obtain nurturance/support
  - Feels uncomfortable/helpless when alone
  - Urgently seeks another relationship when close relationship ends
  - Unrealistically preoccupied with fears of being left to care for self

- **Obsessive-Compulsive Personality Disorder:**
  - Preoccupation with details/rules/order/organization/schedules
  - Perfectionism interfering with task completion
  - Excessive devotion to work/productivity
  - Overconscientious/scrupulous/inflexible about matters of morality/ethics/values
  - Unable to discard worn-out/worthless objects
  - Reluctant to delegate tasks/work with others
  - Miserly spending style toward self/others
  - Rigidity/stubbornness

## Substance Use Disorders Decision Tree

### Step 1: Assess for Impaired Control
- **Impaired Control Criteria:**
  - Taking substance in larger amounts/over longer period than intended
  - Persistent desire/unsuccessful efforts to cut down/control use
  - Great deal of time spent obtaining/using/recovering from substance
  - Craving/strong desire to use substance

### Step 2: Assess for Social Impairment
- **Social Impairment Criteria:**
  - Recurrent use resulting in failure to fulfill major obligations
  - Continued use despite having social/interpersonal problems
  - Important activities given up/reduced because of use
  - Recurrent use in physically hazardous situations

### Step 3: Assess for Risky Use
- **Risky Use Criteria:**
  - Continued use despite knowledge of physical/psychological problems
  - Tolerance (need for increased amounts, diminished effect)
  - Withdrawal (characteristic syndrome, substance taken to relieve/avoid)

### Step 4: Determine Severity
- **Mild:** 2-3 criteria
- **Moderate:** 4-5 criteria
- **Severe:** 6+ criteria

## Neurocognitive Disorders Decision Tree

### Step 1: Assess for Cognitive Decline
- **Cognitive Decline Criteria:**
  - Evidence of significant cognitive decline from previous level
  - Cognitive deficits interfere with independence in everyday activities
  - Cognitive deficits do not occur exclusively in context of delirium
  - Cognitive deficits not better explained by another mental disorder

### Step 2: Assess for Specific Domains
- **Complex Attention:**
  - Sustained attention, divided attention, selective attention, processing speed

- **Executive Function:**
  - Planning, decision making, working memory, responding to feedback, overriding habits, mental flexibility

- **Learning and Memory:**
  - Immediate memory, recent memory, very long-term memory

- **Language:**
  - Expressive language, receptive language, word finding

- **Perceptual-Motor:**
  - Visual perception, visuoconstructional, perceptual-motor, praxis, gnosis

- **Social Cognition:**
  - Recognition of emotions, theory of mind

### Step 3: Determine Etiology
1. **Alzheimer's Disease:**
   - Insidious onset and gradual progression
   - Amnestic presentation or nonamnestic presentation
   - Probable vs. possible diagnosis based on evidence

2. **Frontotemporal Neurocognitive Disorder:**
   - Behavioral variant: disinhibition, apathy, loss of empathy, perseverative behaviors, hyperorality
   - Language variant: primary progressive aphasia

3. **Lewy Body Disease:**
   - Core features: fluctuating cognition, visual hallucinations, parkinsonism
   - Suggestive features: REM sleep behavior disorder, severe neuroleptic sensitivity

4. **Vascular Neurocognitive Disorder:**
   - Evidence of cerebrovascular disease
   - Temporal relationship between vascular event and cognitive decline

5. **Traumatic Brain Injury:**
   - History of head trauma with specific criteria
   - Cognitive decline following trauma

6. **Substance/Medication-Induced:**
   - Cognitive decline attributed to substance use
   - Persistence beyond typical duration of intoxication/withdrawal

7. **HIV Infection:**
   - HIV infection documented
   - Cognitive decline not attributable to other conditions

8. **Prion Disease:**
   - Rapid progression
   - Motor features (ataxia, myoclonus, parkinsonism)
   - Visual or cerebellar symptoms

9. **Parkinson's Disease:**
   - Parkinson's disease diagnosed
   - Cognitive decline following motor symptoms

10. **Huntington's Disease:**
    - Huntington's disease diagnosed or family history
    - Chorea and other motor symptoms

11. **Due to Another Medical Condition:**
    - Medical condition documented
    - Temporal relationship between medical condition and cognitive decline

## Key Assessment Points

### Cultural Considerations
- Cultural variations in symptom expression
- Cultural idioms of distress
- Cultural concepts of distress
- Cultural explanations of illness

### Developmental Considerations
- Age-appropriate symptom presentation
- Developmental milestones and delays
- Impact of developmental stage on diagnosis

### Gender Considerations
- Gender differences in prevalence
- Gender-specific symptom presentation
- Gender-related risk factors

### Comorbidity Assessment
- Rule out other mental disorders
- Assess for medical conditions
- Consider substance use
- Evaluate for personality disorders

### Risk Assessment
- Suicide risk
- Violence risk
- Self-harm risk
- Risk to others

### Functional Assessment
- Impact on daily functioning
- Work/school performance
- Social relationships
- Family functioning

### Treatment Planning
- Evidence-based interventions
- Medication considerations
- Psychotherapy options
- Support services
- Safety planning
`,
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2024-01-15',
    keyPoints: [
      'Always assess for safety first in any diagnostic evaluation',
      'Consider cultural and developmental factors in diagnosis',
      'Rule out medical conditions and substance use',
      'Assess functional impairment, not just symptoms',
      'Consider comorbidity and differential diagnosis',
      'Document rationale for diagnostic decisions',
      'Plan treatment based on evidence-based practices'
    ],
    commonMistakes: [
      'Focusing only on symptoms without considering context',
      'Ignoring cultural and developmental factors',
      'Making diagnoses without sufficient evidence',
      'Failing to assess for safety and risk',
      'Not considering medical differentials',
      'Overlooking comorbidity',
      'Making diagnoses based on single symptoms'
    ],
    examTips: [
      'Use decision trees systematically',
      'Always consider safety first',
      'Document your reasoning process',
      'Consider multiple differentials',
      'Assess functional impact',
      'Plan appropriate interventions',
      'Consider cultural factors'
    ],
    references: [
      'DSM-5-TR (American Psychiatric Association, 2022)',
      'APS Code of Ethics',
      'Cultural Formulation Interview',
      'Risk Assessment Guidelines',
      'Evidence-Based Practice Guidelines'
    ]
  },
  {
    id: 'sm-002',
    title: 'Medication Quick Reference Guide',
    domain: 'interventions',
    category: 'Psychopharmacology',
    content: `
# Medication Quick Reference Guide

## Antidepressants

### Selective Serotonin Reuptake Inhibitors (SSRIs)
**Mechanism:** Inhibit serotonin reuptake, increasing synaptic serotonin levels

**Common SSRIs:**
- **Fluoxetine (Prozac):**
  - Starting dose: 20mg daily
  - Target dose: 20-60mg daily
  - Half-life: 4-6 days (longest of SSRIs)
  - Common side effects: GI upset, sexual dysfunction, insomnia, anxiety
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C, consider risks vs benefits

- **Sertraline (Zoloft):**
  - Starting dose: 50mg daily
  - Target dose: 50-200mg daily
  - Half-life: 24-26 hours
  - Common side effects: GI upset, sexual dysfunction, headache, insomnia
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C, lower risk than some other SSRIs

- **Escitalopram (Lexapro):**
  - Starting dose: 10mg daily
  - Target dose: 10-20mg daily
  - Half-life: 27-32 hours
  - Common side effects: GI upset, sexual dysfunction, headache, insomnia
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C

- **Paroxetine (Paxil):**
  - Starting dose: 20mg daily
  - Target dose: 20-50mg daily
  - Half-life: 21 hours
  - Common side effects: GI upset, sexual dysfunction, sedation, weight gain
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category D, avoid in pregnancy

- **Citalopram (Celexa):**
  - Starting dose: 20mg daily
  - Target dose: 20-40mg daily
  - Half-life: 35 hours
  - Common side effects: GI upset, sexual dysfunction, headache, insomnia
  - Drug interactions: MAOIs, warfarin, NSAIDs, QT prolongation
  - Pregnancy: Category C

**SSRI Side Effects:**
- **Common:** Nausea, diarrhea, headache, insomnia, sexual dysfunction, anxiety
- **Serious:** Serotonin syndrome, bleeding risk, hyponatremia (SIADH)
- **Withdrawal:** Dizziness, nausea, headache, anxiety, insomnia

### Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs)
**Mechanism:** Inhibit both serotonin and norepinephrine reuptake

**Common SNRIs:**
- **Venlafaxine (Effexor):**
  - Starting dose: 37.5mg daily
  - Target dose: 75-225mg daily
  - Half-life: 5 hours (short)
  - Common side effects: GI upset, sexual dysfunction, hypertension, sweating
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C

- **Duloxetine (Cymbalta):**
  - Starting dose: 30mg daily
  - Target dose: 60-120mg daily
  - Half-life: 12 hours
  - Common side effects: GI upset, sexual dysfunction, headache, sweating
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C

- **Desvenlafaxine (Pristiq):**
  - Starting dose: 50mg daily
  - Target dose: 50-100mg daily
  - Half-life: 11 hours
  - Common side effects: GI upset, sexual dysfunction, headache, sweating
  - Drug interactions: MAOIs, warfarin, NSAIDs
  - Pregnancy: Category C

**SNRI Side Effects:**
- **Common:** Nausea, headache, sexual dysfunction, sweating, hypertension
- **Serious:** Serotonin syndrome, bleeding risk, liver toxicity (duloxetine)
- **Withdrawal:** Similar to SSRIs but may be more severe

### Atypical Antidepressants
- **Bupropion (Wellbutrin):**
  - Mechanism: Norepinephrine and dopamine reuptake inhibitor
  - Starting dose: 150mg daily
  - Target dose: 300-450mg daily
  - Common side effects: Insomnia, headache, dry mouth, anxiety
  - Contraindications: Seizure disorder, eating disorders
  - Pregnancy: Category C

- **Mirtazapine (Remeron):**
  - Mechanism: Alpha-2 adrenergic antagonist
  - Starting dose: 15mg daily
  - Target dose: 15-45mg daily
  - Common side effects: Sedation, weight gain, dry mouth
  - Pregnancy: Category C

- **Trazodone (Desyrel):**
  - Mechanism: Serotonin antagonist and reuptake inhibitor
  - Starting dose: 50mg daily
  - Target dose: 150-400mg daily
  - Common side effects: Sedation, priapism (rare but serious)
  - Pregnancy: Category C

### Tricyclic Antidepressants (TCAs)
**Mechanism:** Inhibit norepinephrine and serotonin reuptake

**Common TCAs:**
- **Amitriptyline (Elavil):**
  - Starting dose: 25mg daily
  - Target dose: 50-150mg daily
  - Common side effects: Sedation, anticholinergic effects, weight gain
  - Drug interactions: MAOIs, anticholinergics, CNS depressants
  - Pregnancy: Category D

- **Nortriptyline (Pamelor):**
  - Starting dose: 25mg daily
  - Target dose: 50-150mg daily
  - Common side effects: Less sedating than amitriptyline
  - Pregnancy: Category D

**TCA Side Effects:**
- **Common:** Sedation, anticholinergic effects, orthostatic hypotension, weight gain
- **Serious:** Cardiac arrhythmias, seizures, anticholinergic crisis
- **Withdrawal:** Cholinergic rebound

### Monoamine Oxidase Inhibitors (MAOIs)
**Mechanism:** Inhibit monoamine oxidase, increasing monoamine levels

**Common MAOIs:**
- **Phenelzine (Nardil):**
  - Starting dose: 15mg daily
  - Target dose: 45-90mg daily
  - Common side effects: Orthostatic hypotension, weight gain, sexual dysfunction
  - Drug interactions: Many - requires dietary restrictions
  - Pregnancy: Category C

- **Tranylcypromine (Parnate):**
  - Starting dose: 10mg daily
  - Target dose: 30-60mg daily
  - Common side effects: Similar to phenelzine
  - Pregnancy: Category C

**MAOI Side Effects:**
- **Common:** Orthostatic hypotension, weight gain, sexual dysfunction
- **Serious:** Hypertensive crisis, serotonin syndrome
- **Dietary Restrictions:** Tyramine-rich foods
- **Drug Interactions:** Many medications contraindicated

## Antianxiety Medications

### Benzodiazepines
**Mechanism:** Enhance GABA activity

**Common Benzodiazepines:**
- **Alprazolam (Xanax):**
  - Starting dose: 0.25-0.5mg TID
  - Target dose: 0.5-4mg daily
  - Half-life: 11-13 hours
  - Common side effects: Sedation, memory impairment, dependence
  - Pregnancy: Category D

- **Lorazepam (Ativan):**
  - Starting dose: 0.5-1mg TID
  - Target dose: 1-6mg daily
  - Half-life: 10-20 hours
  - Common side effects: Sedation, memory impairment, dependence
  - Pregnancy: Category D

- **Diazepam (Valium):**
  - Starting dose: 2-5mg TID
  - Target dose: 5-30mg daily
  - Half-life: 20-50 hours
  - Common side effects: Sedation, memory impairment, dependence
  - Pregnancy: Category D

**Benzodiazepine Side Effects:**
- **Common:** Sedation, memory impairment, ataxia, dependence
- **Serious:** Respiratory depression, paradoxical reactions
- **Withdrawal:** Anxiety, insomnia, seizures, delirium

### Non-Benzodiazepine Anxiolytics
- **Buspirone (Buspar):**
  - Mechanism: Partial serotonin agonist
  - Starting dose: 7.5mg BID
  - Target dose: 20-60mg daily
  - Common side effects: Dizziness, headache, nausea
  - Pregnancy: Category B

- **Hydroxyzine (Vistaril):**
  - Mechanism: Antihistamine
  - Starting dose: 25mg TID
  - Target dose: 50-100mg daily
  - Common side effects: Sedation, anticholinergic effects
  - Pregnancy: Category C

## Mood Stabilizers

### Lithium
**Mechanism:** Unknown, may affect second messenger systems

- **Starting dose:** 300mg BID
- **Target dose:** 600-1800mg daily (based on levels)
- **Therapeutic level:** 0.6-1.2 mEq/L
- **Common side effects:** Polyuria, polydipsia, tremor, weight gain
- **Serious side effects:** Lithium toxicity, renal damage, thyroid dysfunction
- **Drug interactions:** Diuretics, NSAIDs, ACE inhibitors
- **Pregnancy:** Category D

### Anticonvulsants
- **Valproate (Depakote):**
  - Starting dose: 250mg BID
  - Target dose: 500-2000mg daily
  - Therapeutic level: 50-100 mcg/mL
  - Common side effects: Weight gain, tremor, hair loss, GI upset
  - Serious side effects: Liver toxicity, pancreatitis, teratogenicity
  - Pregnancy: Category D (high risk of neural tube defects)

- **Carbamazepine (Tegretol):**
  - Starting dose: 200mg BID
  - Target dose: 400-1600mg daily
  - Therapeutic level: 4-12 mcg/mL
  - Common side effects: Dizziness, sedation, GI upset
  - Serious side effects: Aplastic anemia, agranulocytosis, Stevens-Johnson syndrome
  - Pregnancy: Category D

- **Lamotrigine (Lamictal):**
  - Starting dose: 25mg daily
  - Target dose: 100-400mg daily
  - Common side effects: Rash, headache, dizziness
  - Serious side effects: Stevens-Johnson syndrome, toxic epidermal necrolysis
  - Pregnancy: Category C

## Antipsychotics

### First-Generation (Typical) Antipsychotics
**Mechanism:** Dopamine D2 receptor antagonists

**Common Typical Antipsychotics:**
- **Haloperidol (Haldol):**
  - Starting dose: 0.5-2mg daily
  - Target dose: 2-20mg daily
  - Common side effects: Extrapyramidal symptoms, tardive dyskinesia
  - Pregnancy: Category C

- **Chlorpromazine (Thorazine):**
  - Starting dose: 25-50mg TID
  - Target dose: 100-800mg daily
  - Common side effects: Sedation, anticholinergic effects, extrapyramidal symptoms
  - Pregnancy: Category C

**Typical Antipsychotic Side Effects:**
- **Common:** Extrapyramidal symptoms, sedation, anticholinergic effects
- **Serious:** Tardive dyskinesia, neuroleptic malignant syndrome, agranulocytosis

### Second-Generation (Atypical) Antipsychotics
**Mechanism:** Dopamine and serotonin receptor antagonists

**Common Atypical Antipsychotics:**
- **Risperidone (Risperdal):**
  - Starting dose: 1mg BID
  - Target dose: 2-8mg daily
  - Common side effects: Weight gain, hyperprolactinemia, extrapyramidal symptoms
  - Pregnancy: Category C

- **Olanzapine (Zyprexa):**
  - Starting dose: 5-10mg daily
  - Target dose: 10-20mg daily
  - Common side effects: Weight gain, sedation, metabolic effects
  - Pregnancy: Category C

- **Quetiapine (Seroquel):**
  - Starting dose: 25mg BID
  - Target dose: 300-800mg daily
  - Common side effects: Sedation, weight gain, metabolic effects
  - Pregnancy: Category C

- **Aripiprazole (Abilify):**
  - Starting dose: 10-15mg daily
  - Target dose: 15-30mg daily
  - Common side effects: Akathisia, insomnia, weight gain
  - Pregnancy: Category C

- **Ziprasidone (Geodon):**
  - Starting dose: 20mg BID
  - Target dose: 40-160mg daily
  - Common side effects: Sedation, extrapyramidal symptoms, QT prolongation
  - Pregnancy: Category C

**Atypical Antipsychotic Side Effects:**
- **Common:** Weight gain, sedation, metabolic effects, hyperprolactinemia
- **Serious:** Metabolic syndrome, diabetes, tardive dyskinesia, neuroleptic malignant syndrome

## Stimulants

### Methylphenidate
- **Ritalin:** Starting dose 5mg BID, target 10-60mg daily
- **Concerta:** Starting dose 18mg daily, target 18-72mg daily
- **Common side effects:** Decreased appetite, insomnia, irritability
- **Pregnancy:** Category C

### Amphetamines
- **Adderall:** Starting dose 5mg daily, target 5-40mg daily
- **Vyvanse:** Starting dose 30mg daily, target 30-70mg daily
- **Common side effects:** Decreased appetite, insomnia, irritability
- **Pregnancy:** Category C

## Key Monitoring Parameters

### Laboratory Monitoring
- **Lithium:** Serum levels, renal function, thyroid function
- **Valproate:** Liver function, complete blood count, serum levels
- **Carbamazepine:** Complete blood count, liver function, serum levels
- **Clozapine:** Complete blood count (weekly initially)
- **Atypical antipsychotics:** Metabolic panel, lipid panel, prolactin

### Physical Monitoring
- **Weight:** All medications, especially antipsychotics and mood stabilizers
- **Blood pressure:** SNRIs, MAOIs, stimulants
- **Heart rate:** Stimulants, some antidepressants
- **Movement disorders:** All antipsychotics
- **Sexual function:** SSRIs, SNRIs, antipsychotics

### Pregnancy and Breastfeeding
- **Category A:** No risk (no medications in this category)
- **Category B:** No evidence of risk in humans
- **Category C:** Risk cannot be ruled out
- **Category D:** Positive evidence of risk
- **Category X:** Contraindicated in pregnancy

### Drug Interactions
- **MAOIs:** Many interactions, requires careful monitoring
- **Warfarin:** SSRIs, SNRIs may increase bleeding risk
- **NSAIDs:** May increase bleeding risk with antidepressants
- **Alcohol:** Avoid with benzodiazepines, sedating medications
- **Grapefruit juice:** May affect metabolism of some medications

### Withdrawal Syndromes
- **SSRIs/SNRIs:** Dizziness, nausea, headache, anxiety, insomnia
- **Benzodiazepines:** Anxiety, insomnia, seizures, delirium
- **Antipsychotics:** Rebound psychosis, movement disorders
- **Stimulants:** Fatigue, depression, increased appetite

## Clinical Pearls

### Medication Selection
- Consider side effect profile and patient preferences
- Start low, go slow
- Monitor for efficacy and side effects
- Consider drug interactions and comorbidities
- Plan for long-term treatment

### Patient Education
- Explain expected benefits and timeline
- Discuss common side effects
- Review warning signs requiring medical attention
- Emphasize importance of adherence
- Discuss withdrawal symptoms

### Monitoring and Follow-up
- Regular assessment of efficacy and side effects
- Laboratory monitoring as indicated
- Adjustment of dose based on response
- Consideration of alternative treatments if needed
- Long-term monitoring for chronic conditions

### Special Populations
- **Elderly:** Start with lower doses, monitor for side effects
- **Children:** Limited evidence for many medications
- **Pregnancy:** Consider risks vs benefits, avoid teratogenic medications
- **Liver disease:** May require dose adjustment
- **Renal disease:** May require dose adjustment
`,
    type: 'guide',
    difficulty: 'comprehensive',
    lastUpdated: '2024-01-15',
    keyPoints: [
      'Start low, go slow with medication dosing',
      'Monitor for efficacy and side effects regularly',
      'Consider drug interactions and comorbidities',
      'Educate patients about expected effects and timeline',
      'Monitor laboratory values as indicated',
      'Plan for long-term treatment and monitoring',
      'Consider risks vs benefits in special populations'
    ],
    commonMistakes: [
      'Starting with high doses',
      'Not monitoring for side effects',
      'Ignoring drug interactions',
      'Not educating patients adequately',
      'Failing to monitor laboratory values',
      'Not considering long-term treatment needs',
      'Ignoring special population considerations'
    ],
    examTips: [
      'Know common side effects for each medication class',
      'Understand drug interactions and contraindications',
      'Know monitoring requirements for different medications',
      'Consider patient factors in medication selection',
      'Plan for long-term treatment and monitoring',
      'Understand risks vs benefits in special populations',
      'Know withdrawal syndromes and management'
    ],
    references: [
      'Stahl\'s Essential Psychopharmacology',
      'Goodman & Gilman\'s The Pharmacological Basis of Therapeutics',
      'Australian Medicines Handbook',
      'Therapeutic Guidelines: Psychotropic',
      'FDA Pregnancy Categories',
      'Drug Interaction Databases'
    ]
  }
] 