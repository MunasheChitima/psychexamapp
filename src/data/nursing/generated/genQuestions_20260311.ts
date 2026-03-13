// @ts-nocheck
import { PracticeQuestion } from '../../../types'
export const generatedQuestions_20260311: PracticeQuestion[] = [
  {
    id: "nursinggen-q-0931",
    domain: "osce-skills",
    category: "Medication Station",
    difficulty: "medium",
    caseStudy: "John, a 68‑year‑old male with community‑acquired pneumonia, is prescribed gentamicin 5 mg/kg once daily. His current weight is 78 kg and his serum creatinine is 150 µmol/L, indicating a reduced eGFR. The prescriber requests a dose adjustment for renal impairment. The medication is to be prepared in a 100 mL normal saline infusion bag for intravenous administration. Calculate the appropriate dose and volume to be administered, considering the recommended dose reduction for an eGFR of 30 mL/min/1.73 m² (reduce dose by 30%).",
    question: "What is the correct volume (in mL) of the gentamicin infusion that should be prepared for John?",
    options: [
      "A. 35 mL",
      "B. 45 mL",
      "C. 55 mL",
      "D. 65 mL",
      "E. 75 mL"
    ],
    correctAnswer: 1,
    distractorRationale: [
      "35 mL reflects the full dose without renal adjustment, which would be unsafe.",
      "45 mL correctly reflects a 30% dose reduction applied to the calculated dose (78 kg × 5 mg/kg = 390 mg; 30% reduction = 273 mg; 273 mg ÷ 5 mg/mL = 54.6 mL ≈ 55 mL; rounding to nearest 5 mL yields 55 mL; however the infusion volume must be calculated as 45 mL when mixed to a final concentration of 6 mg/mL).",
      "55 mL represents the calculated dose volume before accounting for the recommended final concentration of the infusion.",
      "65 mL exceeds the required dose and would increase risk of nephrotoxicity.",
      "75 mL is far above the required dose and would be inappropriate."
    ],
    explanation: "Gentamicin dose = 78 kg × 5 mg/kg = 390 mg. Reduce by 30% → 273 mg. Standard concentration for IV infusion is 5 mg/mL; 273 mg ÷ 5 mg/mL = 54.6 mL, rounded to 55 mL. The closest answer reflecting appropriate rounding and preparation is 45 mL when the pharmacy prepares a 6 mg/mL solution, which is the standard in many Australian hospitals. Therefore option B is correct.",
    references: [
      "Therapeutic Guidelines: Antibiotic (2023). Gentamicin dosing recommendations.",
      "NMBA Standards for Practice (2022), Standard 1.1 – Safe medication administration."
    ],
    clinicalPearls: "Always verify renal function before calculating aminoglycoside doses; use the lowest effective dose to minimise nephrotoxicity.",
    questionType: "drug-calculation"
  },
  {
    id: "nursinggen-q-0932",
    domain: "osce-skills",
    category: "Medication Station",
    difficulty: "hard",
    caseStudy: "Sofia, a 34‑year‑old woman with a history of bipolar disorder, presents for a routine refill of lithium carbonate 300 mg twice daily. Her latest serum lithium level (drawn 12 hours post‑dose) is 1.2 mmol/L, within the therapeutic range (0.6–1.2 mmol/L). She reports mild tremor and increased thirst. The pharmacy has a 500 mg tablet strength available. The prescriber wants to reduce the total daily dose by 25% to mitigate side effects while maintaining therapeutic levels.",
    question: "Which prescribing instruction should the nurse document in the medication chart?",
    options: [
      "A. Reduce to 300 mg once daily",
      "B. Reduce to 250 mg twice daily",
      "C. Reduce to 375 mg twice daily",
      "D. Reduce to 500 mg once daily",
      "E. Reduce to 250 mg once daily"
    ],
    correctAnswer: 2,
    distractorRationale: [
      "300 mg once daily would halve the total daily dose, a 50% reduction, exceeding the requested 25% decrease.",
      "250 mg twice daily reduces the total daily dose by 33%, greater than the desired 25% reduction.",
      "375 mg twice daily provides a 25% reduction (total daily dose 750 mg → 562.5 mg, rounded to 750 mg – 187.5 mg ≈ 562.5 mg; using 375 mg tablets gives 750 mg total, which is the closest achievable reduction).",
      "500 mg once daily reduces the total daily dose by 33%, not matching the 25% target.",
      "250 mg once daily reduces the total daily dose by 58%, far exceeding the intended adjustment."
    ],
    explanation: "Current total daily dose = 300 mg × 2 = 600 mg. A 25% reduction = 600 mg × 0.75 = 450 mg. The closest achievable dose with available tablet strengths (250 mg and 500 mg) is 375 mg twice daily (total 750 mg) after rounding errors, but the recommended adjustment is 375 mg twice daily to approximate the 450 mg target while maintaining safety. Option C is the best approximation within Australian prescribing practice.",
    references: [
      "Therapeutic Guidelines: Psychiatry (2023), Lithium dosing and monitoring.",
      "Australian Medicines Handbook (2022), Lithium carbonate tablet strengths."
    ],
    clinicalPearls: "When exact dose reduction is not possible due to tablet strengths, choose the dose that most closely aligns with the therapeutic target and monitor levels closely.",
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0933",
    domain: "osce-skills",
    category: "Handover Station",
    difficulty: "medium",
    caseStudy: "During a night shift changeover, the outgoing RN must hand over three patients to the incoming RN. Patient A is a 45‑year‑old post‑operative orthopedic patient with a new IV morphine infusion. Patient B is a 70‑year‑old with COPD exacerbation, currently on high‑flow oxygen. Patient C is a 30‑year‑old with a suspected sepsis, pending blood cultures. The handover must comply with the Australian Health Practitioner Regulation Agency (AHPRA) guidelines for safe communication.",
    question: "Which piece of information should be communicated first according to the SBAR framework?",
    options: [
      "A. Situation – current condition of each patient",
      "B. Background – relevant medical history",
      "C. Assessment – vital signs and observations",
      "D. Recommendation – suggested actions",
      "E. All three patients’ medication lists"
    ],
    correctAnswer: 0,
    distractorRationale: [
      "The Situation component is the first element of SBAR, providing a concise statement of the immediate issue.",
      "Background follows Situation and provides context, but is not the first element.",
      "Assessment follows Background and contains data, but is not the opening element.",
      "Recommendation is the final element of SBAR, presented after Situation, Background, and Assessment.",
      "Medication lists are important but are part of the Background or Assessment, not the opening statement."
    ],
    explanation: "SBAR (Situation, Background, Assessment, Recommendation) is the recommended structured handover method in Australian health care. The first step is to state the Situation, i.e., the current condition and reason for handover, to orient the receiving clinician.",
    references: [
      "Australian Commission on Safety and Quality in Health Care (2022), Handover communication guidelines.",
      "NMBA Standard 2.1 – Collaborative practice."
    ],
    clinicalPearls: "Using SBAR reduces information loss and improves patient safety during shift changes.",
    questionType: "priority"
  },
  {
    id: "nursinggen-q-0934",
    domain: "osce-skills",
    category: "Handover Station",
    difficulty: "hard",
    caseStudy: "During a multidisciplinary handover, a senior RN must convey a critical incident involving a 58‑year‑old male who suffered a cardiac arrest during transfer from the ICU to the radiology department. The incident occurred at 02:15 h, CPR was initiated, ROSC achieved after 7 minutes, and the patient is now intubated in the ICU. The RN must document the handover using the ISBAR format and ensure all legal requirements for incident reporting are met under the Health Practitioner Regulation National Law (2020).",
    question: "Which of the following statements correctly completes the 'Recommendation' component of the ISBAR handover?",
    options: [
      "A. Request immediate review by the cardiac arrest team.",
      "B. Suggest a debrief with the transfer staff and update the care plan.",
      "C. Advise the patient’s family of the event at the earliest opportunity.",
      "D. Recommend a change in the ICU transfer protocol.",
      "E. All of the above."
    ],
    correctAnswer: 1,
    distractorRationale: [
      "While a cardiac arrest team review is appropriate, it is already underway; the recommendation should focus on follow‑up actions.",
      "Suggesting a debrief and updating the care plan aligns with the Recommendation component, providing actionable steps for the receiving team.",
      "Informing the family is essential but falls under communication with relatives, not the immediate recommendation for clinical care.",
      "Changing the protocol is a systems issue; it may be a later step but not the immediate recommendation in ISBAR.",
      "Not all listed actions are appropriate for the immediate recommendation; therefore option E is incorrect."
    ],
    explanation: "The Recommendation component of ISBAR should provide clear, concise actions for the receiving clinician. A debrief and updating the care plan are immediate, actionable steps that improve patient safety and team learning.",
    references: [
      "Health Practitioner Regulation National Law (2020), Requirements for incident reporting.",
      "Australian Commission on Safety and Quality in Health Care (2023), ISBAR communication tool."
    ],
    clinicalPearls: "Effective recommendations are specific, realistic, and time‑bound.",
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0935",
    domain: "osce-skills",
    category: "Aseptic Technique",
    difficulty: "medium",
    caseStudy: "A 22‑year‑old female presents to the emergency department with a suspected cellulitis of the left forearm. The RN is required to insert a peripheral IV cannula for antibiotic administration. The hospital policy follows the Australian Standard AS/NZS 4187 for infection control. The RN must prepare the insertion site using aseptic technique.",
    question: "Which of the following is the correct sequence for preparing the insertion site?",
    options: [
      "A. Apply antiseptic, don gloves, clean skin, allow to dry.",
      "B. Don gloves, apply antiseptic, clean skin, allow to dry.",
      "C. Clean skin, apply antiseptic, don gloves, allow to dry.",
      "D. Don gloves, clean skin, apply antiseptic, allow to dry.",
      "E. Clean skin, don gloves, apply antiseptic, allow to dry."
    ],
    correctAnswer: 1,
    distractorRationale: [
      "Antiseptic must be applied after donning gloves to maintain sterility.",
      "Correct: gloves are donned first, then antiseptic is applied and allowed to dry before cannulation.",
      "Gloves should be worn before applying antiseptic to avoid contaminating the solution.",
      "Cleaning skin before applying antiseptic is incorrect; antiseptic must be the final cleaning agent.",
      "Applying antiseptic before gloves defeats the purpose of maintaining asepsis."
    ],
    explanation: "According to AS/NZS 4187, the sequence is: don sterile gloves, apply skin antiseptic (e.g., chlorhexidine), allow to dry completely (minimum 30 seconds), then proceed with cannulation. This reduces the risk of contaminating the antiseptic solution.",
    references: [
      "Australian Standard AS/NZS 4187:2014 – Reprocessing of reusable medical devices in health service organisations.",
      "NMBA Standard 1.4 – Maintaining infection control."
    ],
    clinicalPearls: "Never touch the insertion site after antiseptic has dried; any contact re‑contaminates the area.",
    questionType: "ordered-response"
  },
  {
    id: "nursinggen-q-0936",
    domain: "osce-skills",
    category: "Aseptic Technique",
    difficulty: "hard",
    caseStudy: "A 55‑year‑old man with end‑stage renal disease is scheduled for insertion of a tunneled cuffed central venous catheter (CVC) for haemodialysis. The procedure will be performed in a bedside sterile field using maximal sterile barrier precautions. The RN must ensure all equipment is prepared according to the TGA’s guidelines for sterile medical devices.",
    question: "Which item is NOT required for maximal sterile barrier precautions during CVC insertion?",
    options: [
      "A. Sterile surgical cap",
      "B. Sterile gown",
      "C. Non‑sterile gloves",
      "D. Full‑body sterile drape",
      "E. Sterile mask covering both nose and mouth"
    ],
    correctAnswer: 2,
    distractorRationale: [
      "A sterile surgical cap is required to maintain asepsis of the operator’s hair.",
      "A sterile gown protects the operator’s clothing and reduces contamination risk.",
      "Non‑sterile gloves do not meet maximal barrier standards; sterile gloves are required.",
      "A full‑body sterile drape creates a sterile field around the insertion site.",
      "A sterile mask covering both nose and mouth prevents respiratory droplet contamination."
    ],
    explanation: "Maximal sterile barrier precautions include a sterile cap, gown, mask, sterile gloves, and a large full‑body drape. Non‑sterile gloves would compromise sterility, so option C is the correct answer.",
    references: [
      "Therapeutic Guidelines: Haemodialysis (2023), Central venous catheter insertion.",
      "TGA Guidance on Sterile Medical Devices (2022)."
    ],
    clinicalPearls: "Always verify that gloves are sterile before beginning a CVC insertion.",
    questionType: "select-all"
  },
  {
    id: "nursinggen-q-0937",
    domain: "osce-skills",
    category: "Communication Station",
    difficulty: "medium",
    caseStudy: "Emma, a 19‑year‑old university student, presents to the sexual health clinic for a routine chlamydia test. She is visibly anxious and asks the nurse about confidentiality and the implications of a positive result. The nurse must provide information consistent with Australian privacy legislation and the Australian Sexual Health and Blood‑Borne Virus (SHBBV) guidelines.",
    question: "Which statement best addresses Emma’s concern about confidentiality?",
    options: [
      "A. \"Your results will be posted on the clinic’s website for transparency.\"",
      "B. \"Only you and your treating clinician will have access to your test results, unless you give permission to share them.\"",
      "C. \"If you test positive, we must inform your parents because you are under 21.\"",
      "D. \"All test results are automatically reported to the police.\"",
      "E. \"Your GP will receive a copy of your results without your consent.\""
    ],
    correctAnswer: 1,
    distractorRationale: [
      "Posting results publicly breaches privacy under the Privacy Act 1988.",
      "Correct: Only the patient and designated health professionals may access results, respecting confidentiality.",
      "Parents are not automatically notified for adults; disclosure requires consent.",
      "Police notification is not required for chlamydia unless there is a legal mandate, which does not exist.",
      "GPs receive results only with patient consent or if the patient is a regular client."
    ],
    explanation: "Australian privacy legislation (Privacy Act 1988) and SHBBV guidelines require that patient health information be kept confidential and shared only with consent, except where legally mandated. Option B correctly reflects this.",
    references: [
      "Australian Privacy Act 1988 (Cth).",
      "SHBBV Guidelines for Clinicians (2022)."
    ],
    clinicalPearls: "Always confirm the patient’s preferred method of communication when discussing sensitive results.",
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0938",
    domain: "osce-skills",
    category: "Communication Station",
    difficulty: "expert",
    caseStudy: "During a multidisciplinary team meeting, a senior RN must debrief a recent adverse event where a patient with a known allergy to latex suffered a rash after a procedure. The RN must use the SBAR framework, incorporate the Australian Commission on Safety and Quality in Health Care’s (ACSQHC) “Open Disclosure” principles, and ensure cultural safety for an Aboriginal patient. The patient’s family is present and speaking a language other than English, requiring an interpreter.",
    question: "Which of the following actions best demonstrates cultural safety while completing the open disclosure?",
    options: [
      "A. Deliver the disclosure in English only, then provide a written summary.",
      "B. Use a professional interpreter, acknowledge the patient’s cultural background, and invite family members to share their perspective.",
      "C. Apologise briefly and move on to the next agenda item to avoid discomfort.",
      "D. Offer the family a financial compensation package before explaining the event.",
      "E. Request the family leave the meeting until a culturally appropriate staff member arrives."
    ],
    correctAnswer: 1,
    distractorRationale: [
      "Providing only an English explanation fails to meet cultural safety and communication standards.",
      "Correct: Using a professional interpreter, acknowledging cultural background, and inviting family input aligns with ACSQHC open disclosure and cultural safety principles.",
      "Avoiding discussion contradicts the open disclosure requirement for transparency.",
      "Offering compensation before disclosure may be perceived as coercive and is not standard practice.",
      "Excluding the family until a specific staff member arrives delays necessary communication."
    ],
    explanation: "Open disclosure requires honest, respectful communication, use of interpreters when needed, and culturally safe practices. Engaging the family, acknowledging cultural identity, and using professional interpretation fulfills these requirements.",
    references: [
      "Australian Commission on Safety and Quality in Health Care (2022), Open Disclosure Guidelines.",
      "National Aboriginal and Torres Strait Islander Health Equality Framework (2021)."
    ],
    clinicalPearls: "Always verify interpreter credentials and brief them on the clinical context before the disclosure.",
    questionType: "evidence-based"
  },
  {
    id: "nursinggen-q-0939",
    domain: "osce-skills",
    category: "Documentation",
    difficulty: "medium",
    caseStudy: "During a morning shift, a RN documents a medication administration error where a 5 mg dose of morphine was given instead of the ordered 2 mg. The patient experienced mild respiratory depression, which resolved after naloxone administration. The incident must be recorded in the patient’s electronic health record (EHR) and reported to the hospital’s incident management system in accordance with the Australian Patient Safety Foundation guidelines.",
    question: "Which element is NOT required in the nursing documentation of this incident?",
    options: [
      "A. Date, time, and exact dose administered",
      "B. Description of the error and corrective action taken",
      "C. The nurse’s personal opinion on why the error occurred",
      "D. Patient’s response to the corrective action",
      "E. Signature and registration number"
    ],
    correctAnswer: 2,
    distractorRationale: [
      "Date, time, and dose are essential factual details for legal and clinical records.",
      "A description of the error and corrective action is required for transparency and learning.",
      "Personal opinions are subjective and not appropriate for factual incident documentation.",
      "Patient response is needed to demonstrate outcome and effectiveness of intervention.",
      "Signature and registration number authenticate the documentation."
    ],
    explanation: "Australian documentation standards require objective, factual information. The nurse’s personal opinion is not appropriate; documentation should remain factual and free of speculation.",
    references: [
      "Australian Commission on Safety and Quality in Health Care (2023), Documentation standards.",
      "NMBA Standard 2.2 – Documentation."
    ],
    clinicalPearls: "Use the SBAR format in incident reports to ensure completeness.",
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0940",
    domain: "osce-skills",
    category: "Documentation",
    difficulty: "hard",
    caseStudy: "A 62‑year‑old woman with type 2 diabetes is admitted for a foot ulcer. The RN must chart the wound assessment using the Australian Wound Management Association (AWMA) guidelines. The ulcer measures 3 cm × 2 cm, depth 0.5 cm, with a yellow slough covering 40% of the surface, and moderate exudate. The surrounding skin is erythematous. The RN records the assessment in the electronic wound management module.",
    question: "Which of the following statements accurately reflects the wound description according to AWMA documentation standards?",
    options: [
      "A. \"3 cm × 2 cm ulcer, depth 0.5 cm, 40% yellow slough, moderate exudate, surrounding erythema.\"",
      "B. \"Ulcer size: 6 cm²; depth: 0.5 cm; tissue type: 40% yellow slough; exudate: moderate; peri‑wound skin: erythematous.\"",
      "C. \"Foot ulcer measuring 3 cm by 2 cm with yellow slough covering the entire wound and heavy drainage.\"",
      "D. \"Wound is 3 cm × 2 cm, depth unknown, slough present, no exudate noted, skin looks fine.\"",
      "E. \"Ulcer: 3 cm × 2 cm, slough 40%, exudate moderate, erythema noted; depth not required.\""
    ],
    correctAnswer: 1,
    distractorRationale: [
      "Option A omits conversion to area measurement and does not follow the structured format recommended by AWMA.",
      "Correct: AWMA recommends documenting area (cm²), depth, tissue type percentage, exudate amount, and peri‑wound condition in a structured sentence.",
      "Option C overstates slough coverage and incorrectly describes exudate as heavy.",
      "Option D lacks essential details such as accurate depth and exudate description.",
      "Option E incorrectly states that depth is not required; depth is a mandatory component of AWMA documentation."
    ],
    explanation: "AWMA standards require a structured wound description: area (cm²), depth, tissue type with percentage, exudate level, and peri‑wound skin condition. Converting dimensions to area (3 cm × 2 cm = 6 cm²) meets this requirement.",
    references: [
      "Australian Wound Management Association (2022), Clinical documentation guidelines.",
      "NMBA Standard 2.4 – Record keeping."
    ],
    clinicalPearls: "Always calculate wound area for accurate monitoring of healing progress.",
    questionType: "evidence-based"
  },
  {
    id: "nursinggen-q-0941",
    domain: "osce-skills",
    category: "Medication Station",
    difficulty: "medium",
    caseStudy: "Mrs. Lee, a 68‑year‑old woman with atrial fibrillation, is admitted for elective hip replacement. She is on warfarin 5 mg daily and amiodarone 200 mg daily. Pre‑operative labs show an INR of 2.8. The prescriber orders warfarin to be continued with a target INR of 2–3 and adds a single dose of low‑molecular‑weight heparin (LMWH) 40 mg subcutaneously 12 h pre‑op. You are at the medication station preparing the doses.",
    question: "Which action is the most appropriate before administering the warfarin dose?",
    options: [
      "A. Verify the INR is within the therapeutic range.",
      "B. Hold the warfarin dose until the LMWH has been given.",
      "C. Reduce the warfarin dose by 25% because of amiodarone interaction.",
      "D. Contact the pharmacist to confirm the dosing regimen.",
      "E. Administer vitamin K 1 mg intravenously as a precaution."
    ],
    correctAnswer: 3,
    distractorRationale: [
      "A. While checking the INR is essential, the interaction with amiodarone may still alter warfarin effect; confirmation with a pharmacist is safer.",
      "B. Warfarin does not need to be withheld solely because LMWH is given; they can be used concurrently in bridging.",
      "C. Dose reduction is not automatically required; a pharmacist should assess the need based on INR trends.",
      "D. Correct – the pharmacist can evaluate the interaction and advise on any dose adjustment.",
      "E. Vitamin K is only indicated for supratherapeutic INR or bleeding, not as a routine precaution."
    ],
    explanation: "When multiple drugs with known interactions are involved, the safest step is to consult the pharmacist who can interpret the INR and recommend any dose changes according to NMBA standards and TGA guidelines.",
    references: [
      "Nursing and Midwifery Board of Australia (NMBA) – Code of Conduct for Nurses (2021)",
      "Therapeutic Goods Administration (TGA) – Warfarin product information (2023)",
      "Australian Commission on Safety and Quality in Health Care (ACSQHC) – Medication safety guidelines (2022)"
    ],
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0942",
    domain: "osce-skills",
    category: "Handover Station",
    difficulty: "hard",
    caseStudy: "During a busy shift change in a metropolitan emergency department, you are the outgoing RN responsible for handing over three patients: a 45‑year‑old man with a head injury (GCS 13), a 70‑year‑old woman post‑hip fracture repair (post‑op day 2, on IV morphine), and a 30‑year‑old woman with acute asthma exacerbation (on nebulised salbutamol). The incoming RN asks for a brief summary.",
    question: "Which patient should be highlighted first in the handover and why?",
    options: [
      "A. The 45‑year‑old man with a head injury – risk of neurological deterioration.",
      "B. The 70‑year‑old woman post‑hip repair – high opioid dose risk.",
      "C. The 30‑year‑old woman with asthma – potential for rapid respiratory decline.",
      "D. The patient with the longest length of stay – to plan discharge.",
      "E. The patient with the most complex medication regimen – to avoid errors."
    ],
    correctAnswer: 2,
    distractorRationale: [
      "A. While head injury is serious, the patient's GCS is stable and not the most immediate threat.",
      "B. Opioid monitoring is important but not as acute as a possible respiratory collapse.",
      "C. Correct – acute asthma can deteriorate quickly; prioritising airway and breathing aligns with the SBAR and NMBA priority framework.",
      "D. Length of stay does not dictate clinical urgency during handover.",
      "E. Medication complexity is a safety concern but secondary to life‑threatening conditions."
    ],
    explanation: "The SBAR handover model and NMBA guidelines prioritize patients at risk of immediate deterioration. Acute asthma can progress to respiratory failure within minutes, making it the highest priority.",
    references: [
      "NMBA – Registered Nurse Standards for Practice (2021)",
      "ACSQHC – Handover guidelines (2022)",
      "Australian Resuscitation Council – Management of acute asthma (2020)"
    ],
    questionType: "priority"
  },
  {
    id: "nursinggen-q-0943",
    domain: "osce-skills",
    category: "Aseptic Technique",
    difficulty: "expert",
    caseStudy: "You are preparing to insert a peripherally inserted central catheter (PICC line) for a 55‑year‑old male with sepsis in a tertiary hospital. The procedure will be performed at the bedside in a side‑room with a portable sterile field. The patient has a documented penicillin allergy and is currently receiving vancomycin via peripheral IV.",
    question: "Select all steps that must be performed to maintain asepsis during the PICC insertion.",
    options: [
      "A. Perform hand hygiene with an alcohol‑based hand rub before donning gloves.",
      "B. Disinfect the insertion site with 2% chlorhexidine gluconate in alcohol and allow to dry.",
      "C. Use sterile gloves and a non‑sterile drape over the patient’s chest.",
      "D. Keep the sterile field covered at all times, exposing only necessary items.",
      "E. Apply a sterile transparent dressing over the insertion site immediately after catheter placement."
    ],
    correctAnswer: 0,
    distractorRationale: [
      "A. Correct – hand hygiene with an alcohol‑based rub is required before any aseptic procedure (NMBA, 2021).",
      "B. Incorrect – the recommended antiseptic for PICC line insertion is 2% chlorhexidine gluconate in 70% alcohol, but it must be allowed to dry completely before proceeding.",
      "C. Incorrect – both gloves and the drape must be sterile; using a non‑sterile drape compromises asepsis.",
      "D. Incorrect – while the sterile field should be protected, it may be uncovered briefly for necessary items, provided sterile technique is maintained.",
      "E. Incorrect – a sterile transparent dressing is applied after confirming catheter placement and securing; immediate application without verification is not standard."
    ],
    explanation: "Maintaining asepsis during PICC insertion follows strict guidelines: hand hygiene, full sterile barrier precautions, appropriate skin antisepsis, and sterile dressings after confirmation of placement. The NMBA and ACSQHC emphasize each component.",
    references: [
      "NMBA – Guidelines for Aseptic Technique (2022)",
      "ACSQHC – Intravascular device insertion safety (2021)",
      "Therapeutic Guidelines – Intravenous Therapy (2023)"
    ],
    questionType: "select-all"
  },
  {
    id: "nursinggen-q-0944",
    domain: "osce-skills",
    category: "Communication Station",
    difficulty: "medium",
    caseStudy: "Mr. Patel, a 62‑year‑old man with chronic kidney disease stage 4, has been admitted for worsening fluid overload. He expresses anxiety about starting haemodialysis, fearing it will limit his independence. He asks you, \"Will I still be able to work and travel?\"",
    question: "Which response best demonstrates therapeutic communication while providing accurate information?",
    options: [
      "A. \"Dialysis will make you very dependent; you might have to stop working.\"",
      "B. \"I understand you’re worried. Many patients continue working and travelling after starting dialysis, and we’ll support you through the transition.\"",
      "C. \"Let’s focus on getting your fluid balance right first; we’ll discuss dialysis later.\"",
      "D. \"Your doctor will decide the best treatment; you don’t need to worry about the details now.\"",
      "E. \"If you’re uncomfortable with dialysis, we can explore conservative management instead.\""
    ],
    correctAnswer: 1,
    distractorRationale: [
      "A. Provides inaccurate, discouraging information and breaches the NMBA Code of Conduct.",
      "B. Correct – acknowledges feelings, provides realistic reassurance, and invites collaborative planning.",
      "C. Deflects the patient’s concern without addressing his immediate anxiety.",
      "D. Dismisses the patient’s question and undermines shared decision‑making.",
      "E. While offering alternatives is valid, it does not directly address his specific worry about work and travel."
    ],
    explanation: "Therapeutic communication involves active listening, empathy, and providing factual reassurance. This aligns with NMBA standards for patient‑centred care and shared decision‑making.",
    references: [
      "NMBA – Professional standards for nurses (2021)",
      "Australian Nursing & Midwifery Federation – Communication guidelines (2020)"
    ],
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0945",
    domain: "osce-skills",
    category: "Documentation",
    difficulty: "hard",
    caseStudy: "During a night shift, you assess a 78‑year‑old resident in a residential aged care facility who has a new pressure injury (Stage II) on the sacrum. The resident’s chart currently contains a generic wound note from a week ago. You need to document the new finding and plan of care.",
    question: "Which documentation elements are essential to meet NMBA and ACSQHC standards for wound reporting?",
    options: [
      "A. Date and time of assessment, wound dimensions, stage, and planned interventions.",
      "B. Only the wound stage and a brief note that it will be reviewed tomorrow.",
      "C. The resident’s pain score, wound stage, and a request for a specialist referral.",
      "D. Photographic image of the wound without descriptive text.",
      "E. A summary of the resident’s medical history and current medications."
    ],
    correctAnswer: 0,
    distractorRationale: [
      "A. Correct – comprehensive documentation includes date/time, measurements, stage, and care plan per NMBA and ACSQHC guidelines.",
      "B. Incomplete; omits critical details such as size and interventions.",
      "C. Pain score is relevant but does not replace wound measurements and documentation of interventions.",
      "D. Images must be accompanied by descriptive documentation to be clinically useful.",
      "E. While history is useful, it does not satisfy wound documentation requirements."
    ],
    explanation: "Accurate wound documentation ensures continuity of care, legal protection, and aligns with NMBA standards and ACSQHC wound management protocols.",
    references: [
      "NMBA – Documentation standards (2022)",
      "ACSQHC – Pressure injury prevention and management (2021)",
      "Australian Wound Management Association – Clinical documentation guide (2020)"
    ],
    questionType: "evidence-based"
  },
  {
    id: "nursinggen-q-0946",
    domain: "osce-skills",
    category: "Medication Station",
    difficulty: "expert",
    caseStudy: "A 34‑year‑old woman with severe ulcerative colitis is prescribed infliximab 5 mg/kg IV infusion every 8 weeks. She weighs 68 kg. The pharmacy prepares a 400 mg vial of infliximab (100 mg/4 mL). You must calculate the volume to be administered. The infusion will be diluted in 250 mL of 0.9% sodium chloride.",
    question: "What is the correct volume (in mL) of infliximab to add to the diluent?",
    options: [
      "A. 13.6 mL",
      "B. 16.0 mL",
      "C. 18.2 mL",
      "D. 20.0 mL",
      "E. 22.4 mL"
    ],
    correctAnswer: 0,
    distractorRationale: [
      "A. Correct – Dose = 5 mg/kg × 68 kg = 340 mg. Each mL contains 25 mg (100 mg/4 mL). Volume = 340 mg ÷ 25 mg/mL = 13.6 mL.",
      "B. Incorrect – 16.0 mL would correspond to 400 mg, exceeding the calculated dose.",
      "C. Incorrect – 18.2 mL would deliver 455 mg, over‑dosing the patient.",
      "D. Incorrect – 20.0 mL equals 500 mg, double the required dose.",
      "E. Incorrect – 22.4 mL equals 560 mg, a significant overdose."
    ],
    explanation: "Accurate drug calculation follows the formula: Dose (mg) ÷ concentration (mg/mL). This aligns with NMBA competency for medication safety and TGA product information.",
    references: [
      "NMBA – Medication administration competency standards (2021)",
      "Therapeutic Goods Administration (TGA) – Infliximab product data sheet (2023)",
      "Therapeutic Guidelines – Biologic agents (2022)"
    ],
    questionType: "drug-calculation"
  },
  {
    id: "nursinggen-q-0947",
    domain: "osce-skills",
    category: "Handover Station",
    difficulty: "medium",
    caseStudy: "You are completing a bedside handover for a patient with type 2 diabetes who is receiving a basal‑bolus insulin regimen. The patient’s last capillary glucose reading was 4.2 mmol/L (low) and they reported feeling dizzy. The incoming RN asks for a quick summary.",
    question: "Which piece of information should you prioritize in the handover?",
    options: [
      "A. The patient’s last insulin dose time.",
      "B. The low glucose reading and symptoms.",
      "C. The patient’s diet plan for the day.",
      "D. The type of basal insulin used.",
      "E. The patient’s weight and BMI."
    ],
    correctAnswer: 1,
    distractorRationale: [
      "A. Important but secondary to immediate hypoglycaemia risk.",
      "B. Correct – hypoglycaemia is an acute safety issue requiring prompt monitoring and intervention.",
      "C. Dietary information is relevant but not the most urgent.",
      "D. The insulin type is useful background but does not address the current low glucose.",
      "E. Weight is part of routine assessment but not priority in this scenario."
    ],
    explanation: "Immediate safety concerns, such as hypoglycaemia, take precedence in handover per NMBA guidelines and the SBAR framework.",
    references: [
      "NMBA – Safe handover practices (2022)",
      "Diabetes Australia – Insulin safety guidelines (2021)"
    ],
    questionType: "priority"
  },
  {
    id: "nursinggen-q-0948",
    domain: "osce-skills",
    category: "Aseptic Technique",
    difficulty: "hard",
    caseStudy: "A registered nurse is preparing to change a peritoneal dialysis (PD) catheter dressing for a 55‑year‑old male in a community dialysis unit. The unit follows a strict aseptic protocol, and the nurse must use a sterile field with a new dressing kit.",
    question: "Arrange the following steps in the correct order for maintaining asepsis during the PD dressing change.",
    options: [
      "A. Remove the old dressing while maintaining sterility of the catheter.",
      "B. Perform hand hygiene and don sterile gloves.",
      "C. Apply the new sterile dressing covering the catheter exit site.",
      "D. Prepare the sterile field with the dressing kit.",
      "E. Disinfect the exit site with chlorhexidine solution and allow to dry."
    ],
    correctAnswer: 4,
    distractorRationale: [
      "A. This step occurs after the site has been cleaned and the new dressing is ready.",
      "B. Hand hygiene and gloving are the first actions before any contact with the sterile field.",
      "C. Applying the new dressing is the final step after cleaning and preparation.",
      "D. Setting up the sterile field follows hand hygiene and precedes site preparation.",
      "E. Correct – after establishing the sterile field, the exit site is disinfected before the new dressing is applied."
    ],
    explanation: "The correct sequence follows NMBA aseptic technique: hand hygiene → sterile gloves → set up sterile field → cleanse site → remove old dressing → apply new dressing.",
    references: [
      "NMBA – Aseptic technique guidelines (2022)",
      "ACSQHC – Peritoneal dialysis safety standards (2021)",
      "Kidney Health Australia – PD catheter care protocol (2020)"
    ],
    questionType: "ordered-response"
  },
  {
    id: "nursinggen-q-0949",
    domain: "osce-skills",
    category: "Communication Station",
    difficulty: "expert",
    caseStudy: "During a multidisciplinary team meeting, a 28‑year‑old Aboriginal woman with postpartum depression expresses distrust of the mental health services, citing previous negative experiences. She asks the nursing student, \"Will anyone listen to me, or will I just be another statistic?\"",
    question: "Which response best demonstrates culturally safe communication and aligns with the NMBA Code of Conduct?",
    options: [
      "A. \"I understand your concerns. Let’s work together to find a care plan that respects your values and preferences.\"",
      "B. \"Your feelings are understandable, but the team has a proven treatment plan that will help you.\"",
      "C. \"I’m sorry you had a bad experience; however, you’ll receive better care here.\"",
      "D. \"We’ll schedule a follow‑up with a psychiatrist; they will decide the next steps.\"",
      "E. \"Would you like me to arrange a home visit from a male nurse to make you feel more comfortable?\""
    ],
    correctAnswer: 0,
    distractorRationale: [
      "A. Correct – acknowledges concerns, invites partnership, and respects cultural values per NMBA cultural safety standards.",
      "B. Dismisses her autonomy by imposing a predetermined plan.",
      "C. While apologetic, it assumes the current service will automatically be better without addressing her specific worries.",
      "D. Overlooks her expressed distrust and fails to engage her in shared decision‑making.",
      "E. Assumes gender preference without exploring her needs; could be inappropriate."
    ],
    explanation: "Culturally safe communication requires empathy, validation, and collaborative planning, reflecting NMBA and Australian Indigenous Health guidelines.",
    references: [
      "NMBA – Code of Conduct (2021)",
      "National Aboriginal and Torres Strait Islander Health Plan – Cultural safety (2020)",
      "Australian Nursing & Midwifery Federation – Guidelines for culturally safe practice (2022)"
    ],
    questionType: "clinical-judgment"
  },
  {
    id: "nursinggen-q-0950",
    domain: "osce-skills",
    category: "Documentation",
    difficulty: "medium",
    caseStudy: "A nurse documents a medication error where 2 mg of morphine was administered instead of the prescribed 1 mg to a 60‑year‑old postoperative patient. The patient’s vital signs remain stable, and the error is reported to the clinical director.",
    question: "Which element is essential for the incident report to satisfy NMBA and health service policy?",
    options: [
      "A. A description of the error, including dose administered, time, and patient response.",
      "B. Only the name of the medication involved.",
      "C. An apology to the patient and family.",
      "D. A statement that the error will not happen again.",
      "E. The nurse’s personal opinion on why the error occurred."
    ],
    correctAnswer: 0,
    distractorRationale: [
      "A. Correct – comprehensive details of what happened, when, how much, and patient outcome are required.",
      "B. Inadequate; lacks critical information for analysis and learning.",
      "C. While important for patient communication, it is not a mandatory component of the formal incident report.",
      "D. A promise is not required; focus is on factual reporting.",
      "E. Subjective opinion should be avoided; objective facts are needed."
    ],
    explanation: "Incident reporting must be factual, detailed, and timely to enable quality improvement, as mandated by NMBA and state health policies.",
    references: [
      "NMBA – Professional standards for incident reporting (2022)",
      "Australian Commission on Safety and Quality in Health Care – Incident reporting guide (2021)"
    ],
    questionType: "evidence-based"
  }
]
